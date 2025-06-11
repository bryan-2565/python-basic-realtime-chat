import './Styles/Home.css'
import { useEffect, useRef, useState } from 'react';
import { Message, MessagePlaceholder } from './Components/Home/Message';
import { UserContainer, UserContainerPlaceholder } from './Components/Home/UserContainer';
import { useChatStore } from '../Stores/useChatStore';
import { useAuthStore } from '../Stores/useAuthStore';
import toast from 'react-hot-toast';

// ====================== COMPONENT ====================== //
export default function Grid() {

    // ******************** STATE ******************** //
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const [previewPfp, setPreviewPfp] = useState(null)
    const [message, setMessage] = useState({ text: "", imgUrl: "" });
    
    // ******************** STORES ******************** //
    const {
        authUser, 
        logout,
        isUpdatingPfp,
        updatePfp,
        ws, 
    } = useAuthStore();
    
    const {
        areUsersLoading,
        users,
        getUsers,
        selectedUser,
        setSelectedUser,
        areMessagesLoading,
        messages,
        getMessages,
        addMessage,
        sendMessage,
    } = useChatStore();

    // ******************** REFS ******************** //
    const settingsRef = useRef(null);
    const bottomRef = useRef(null);

    // ******************** EFFECTS ******************** //
    // ██ Fetch all users on initial render
    useEffect(() => {
        getUsers()
    }, [])

    // ██ Fetch messages when selected user changes
    useEffect(() => {
        const handleGetMessages = async() => {
            if (selectedUser){
                await getMessages(selectedUser.id);
                scrollToBottom();
            }
        }

        handleGetMessages();
    }, [selectedUser])

    // ██ Auto-scroll when messages update
    useEffect(() => {
        scrollToBottom(true)
    }, [messages])

    // ██ Close account settings popup when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setSettingsVisible(false);
            }
        }

        if (settingsVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [settingsVisible]);

    const toggleSettings = () => {
        if (settingsVisible) {
            setSettingsVisible(false); // triggers 'closing'
        } else {
            setIsAnimating(true);      // keep mounted
            setSettingsVisible(true);  // triggers 'open'
        }
    };


    // ██ Handle WebSocket messages
    ws.onmessage = (e) => {
        if (selectedUser){
            const newMessage = JSON.parse(e.data)
            if(!(newMessage.senderId == selectedUser.id)){
                return;
            }

            if (!(newMessage.senderId == authUser.id)){
                addMessage(newMessage)
            }
        }
    }

    // ******************** HANDLERS ******************** //
    // ▸ Send message to current chat
    function handleSendMessage(){
        const trimmedText = message.text.trim();
        if (!trimmedText) return;

        sendMessage({...message, trimmedText}, authUser.pfpUrl, ws)
        setMessage({imageUrl: "", text: ""})
    }

    // ▸ Scroll to bottom of chat
    function scrollToBottom(smooth = false){
        if (smooth){
            return bottomRef.current?.scrollIntoView({behavior: "smooth"})
        }
        bottomRef.current.scrollIntoView();
    }

    // ▸ Update user profile picture
    function handleUpdatePfp(file){
        if (!file || !file.type.startsWith("image/")){
            return toast.error("Invalid image...")
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async() => {
            const base64Img = reader.result;
            setPreviewPfp(base64Img)
            updatePfp(base64Img)
        }
    }
    
    // ******************** RENDER ******************** //
    return (
        <div className="container">
            
            {/* ========== HEADER SIDEBAR ========== */}
            <div className="headerSidebar">
                <input type="text" placeholder='Find an user!'/>
            </div>

            {/* ========== MAIN HEADER ========== */}
            <div className="header">
                {selectedUser &&
                    <div className="userInfo">
                        <img className='userImage' src={(selectedUser && selectedUser.pfpUrl) || 'defaultPfp.png'}/>
                        <span>{selectedUser && selectedUser.username}</span>
                    </div>
                }
            </div>

            {/* —— LEFT SIDEBAR —— */}
            <div className="sidebar">
                {/* · Users List · */}
                <div className="sidebarUserContainer">
                    {areUsersLoading && 
                        Array.from({length: 20}).map((_, index) =>(
                            <UserContainerPlaceholder key={index}/>
                        ))
                    }
                    {users.map((user) => {
                        if (user.id !== authUser.id) {
                            return (
                                <UserContainer
                                    key={user.id}
                                    pfp={user.pfpUrl || "/defaultPfp.png"}
                                    username={user.username}
                                    isSelected={selectedUser && selectedUser.id === user.id}
                                    onSelect={() => setSelectedUser(user)}
                                />
                            );
                        }
                    })}
                </div>
            </div>

            {/* —— ACCOUNT SIDEBAR —— */}
            <div className="accountSidebar">
                <div className="userInfo">
                    <img className='userImage' src={(authUser && authUser.pfpUrl) || 'defaultPfp.png'}/>
                    <span>{authUser.username}</span>
                </div>

                {/* · Account Controls · */}
                <div className="accountButtonContainer">
                    <button onClick={() => toggleSettings()}>
                        <svg className='settingsIcon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#c0bfbc" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
                    </button>
                    
                {(settingsVisible || isAnimating) && (
                    <div
                        ref={settingsRef}
                        className={`accountSettings ${settingsVisible ? 'open' : 'closing'}`}
                        onAnimationEnd={() => {
                            if (!settingsVisible) setIsAnimating(false);
                        }}
                    >
                        <div className="lilBackground"/>
                        <div className="userContent">
                            <div className="pfpContainer">
                                {isUpdatingPfp && <div className="pfpContainerPlaceholder spinner"/>}
                                <img src={previewPfp || authUser.pfpUrl || '/defaultPfp.png'} />
                            </div>

                            <span>{authUser.username}</span>

                            <div className="pfpButtonContainer">
                                <label className='primaryButton' style={{ cursor: "pointer" }}>
                                    Change PFP
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleUpdatePfp(e.target.files[0])}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                    
                    <button onClick={() => logout()}>
                        <svg className='logoutIcon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#c0bfbc" d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
                    </button>
                </div>
            </div>

            {/* ========== MAIN CONTENT ========== */}
            <div className="content">
                {/* · Messages · */}
                {areMessagesLoading &&
                    Array.from({length: 20}).map((_, index) =>(
                        <MessagePlaceholder key={index}/>
                    ))
                }

                {messages.map((message) =>(
                    <Message 
                        key={message.id}
                        pfp={message.sender && message.sender.pfpUrl}
                        username={
                            (message.sender && message.sender.username) ||
                            (authUser.username) 
                        } 
                        time={message.createdAt} 
                        text={message.text}
                    />
                ))}

                <div ref={bottomRef} />
            </div>

            {/* · Message Input · */}
            {(selectedUser != null) &&
                <div className="inputContent">
                    <div className="inputContainer">
                        <input
                            type="text" 
                            placeholder={`Message @${selectedUser.username}`}
                            value={message.text}
                            onChange={(e) => setMessage((prev) => ({...prev, text: e.target.value}))}
                            onKeyDown={(e) => {
                                if (e.key === "Enter"){
                                    handleSendMessage();
                                }
                            }}
                        />
                    </div>
                </div>
            }
        </div>
    )
}