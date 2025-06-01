import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../Stores/useChatStore";
import { useAuthStore } from "../Stores/useAuthStore";
import { Message } from "./Components/Home/Message";
import UserContainer from "./Components/Home/UserContainer";
import "./Styles/Home.css";

let initialLoad = true;

// ====================== COMPONENT ====================== //
export default function Home() {
    // ******************** STATE ******************** //
    const [showSettings, setShowSettings] = useState(false);
    const [isChatBarFocused, setChatBarFocused] = useState(false);
    const [message, setMessage] = useState({ text: "", imgUrl: "" });

    // ******************** STORES ******************** //
    const { authUser, ws, logout } = useAuthStore();
    const {
        users,
        getUsers,
        areUsersLoading,
        messages,
        getMessages,
        areMessagesLoading,
        selectedUser,
        setSelectedUser,
        sendMessage
    } = useChatStore();

    // ******************** REFS ******************** //
    const bottomRef = useRef(null);

    // ******************** WEBSOCKET ******************** //
    // ██ Handle incoming WebSocket messages
    ws.onmessage = () => {
        if (selectedUser) {      /* vertical centering */
            getMessages(selectedUser.id);
        }
    };

    // ******************** EFFECTS ******************** //
    // ██ Fetch all users on initial render
    useEffect(() => {
        getUsers();
    }, []);

    // ██ Fetch messages when selected user changes
    useEffect(() => {
        if (selectedUser) {
            initialLoad = true;
            getMessages(selectedUser.id);
        }
    }, [selectedUser]);

    // ██ Auto-scroll to bottom of messages
    useEffect(() => {
        if (bottomRef.current) {
            if (initialLoad) {
                bottomRef.current.scrollIntoView();
            } else {
                bottomRef.current.scrollIntoView(); // Removed smooth behavior
            }
        }
    }, [messages]);

    // ******************** HANDLERS ******************** //
    // ▸ Handle message input changes
    function onMessageInput(e) {
        const { name, value } = e.target;
        setMessage((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    // ▸ Send message and reset input
    function handleSendMessage() {
        initialLoad = false;
        const trimmedText = message.text.trim();
        if (!trimmedText) return;

        sendMessage({ ...message, text: trimmedText }, ws);
        setMessage({ text: "", imgUrl: "" });
    }

    // ▸ Select user to chat with
    function selectUser(user) {
        setSelectedUser(user);
    }

    // ******************** RENDER ******************** //
    return (
        <div className="wrapper">
            {/* ========== TOP BAR ========== */}
            <div className="topBar">
                <div className="searchUserContainer">
                    <input type="text" placeholder="Find users" />
                </div>

                <div className="userStatus">
                    {selectedUser && (
                        <div className="userInfo">
                            <img src={selectedUser.imgUrl || "/defaultPfp.png"} alt="User" />
                            <label>{selectedUser.username}</label>
                        </div>
                    )}
                </div>
            </div>

            {/* ========== MAIN CONTENT ========== */}
            <div className="content">
                {/* —— LEFT SIDEBAR —— */}
                <div className="leftBar">
                    {/* · Users List · */}
                    <div className="usersContainer">
                        {areUsersLoading && <h3>Users are loading...</h3>}

                        {users.map((user) => (
                            <UserContainer
                                key={user.id}
                                pfp="/defaultPfp.png"
                                username={user.username}
                                isSelected={selectedUser && user.id === selectedUser.id}
                                onSelect={() => selectUser(user)}
                            />
                        ))}
                    </div>

                    {/* · Current User Account · */}
                    <div className="userAccount">
                        <img src={authUser.imgUrl || "/defaultPfp.png"} alt="Profile" />
                        <label>{authUser.username}</label>

                        <div className="userButtons">
                            <button onClick={() => setShowSettings(!showSettings)}>
                                <img src="/icons/settings.png" alt="Settings" />
                            </button>
                            <button onClick={() => logout()}>
                                <img src="/icons/signOut.png" alt="Sign Out" />
                            </button>
                        </div>

                        {/* › User Settings Dropdown ‹ */}
                        {showSettings && (
                            <div className="userSettings">
                                <div className="pfpButtonContainer">
                                    <img src="/icons/edit.png" alt="Edit" />
                                    <button>Set PFP</button>
                                </div>
                                <img src={authUser.pfpUrl || '/defaultPfp.png'} alt="Profile" />
                            </div>
                        )}
                    </div>
                </div>

                {/* —— CHAT AREA —— */}
                <div className="chat">
                    {/* · Messages Container · */}
                    <div className="messagesContainer">
                        {areMessagesLoading && <h1>Messages are loading...</h1>}

                        {messages.map((message) => (
                            <Message
                                key={message.id}
                                username={
                                    message.sender.id === authUser.id
                                        ? authUser.username
                                        : message.sender.username
                                }
                                time={message.createdAt}
                                text={message.text}
                            />
                        ))}

                        <div ref={bottomRef} />
                    </div>

                    {/* · Message Input · */}
                    <div className={`chatBar ${isChatBarFocused ? 'chatBarFocused' : ''}`}>
                        <input
                            type="text"
                            name="text"
                            placeholder={selectedUser && `Message @${selectedUser.username}`}
                            onFocus={() => setChatBarFocused(true)}
                            onBlur={() => setChatBarFocused(false)}
                            value={message.text}
                            onChange={onMessageInput}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                        />

                        <button className="chatBarSend" onClick={handleSendMessage}>
                            <img src="/icons/sendMessage.png" alt="Send" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}