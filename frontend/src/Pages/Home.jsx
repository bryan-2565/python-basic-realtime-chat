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
    const [settingsVisible, setSettingsVisible] = useState(false)
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
                <div className="accountButtons">
                    <button onClick={() => setSettingsVisible(!settingsVisible)}>
                        <img className='settingsImage' src='/icons/settings.png'/>
                    </button>
                    
                    {settingsVisible &&
                        <div className="accountSettings">
                            <div className="lilBackground"/>
                            <div className="userContent">
                                <div className="pfpContainer">
                                    {isUpdatingPfp && <div className="pfpContainerPlaceholder spinner"/>}
                                    <img src={previewPfp || authUser.pfpUrl || '/defaultPfp.png'}/>
                                </div>
                                
                                <span>{authUser.username}</span>
                                
                                <div className="pfpButtonContainer">
                                    <label className='primaryButton' style={{cursor: "pointer"}}>
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
                    }
                    
                    <button onClick={() => logout()}>
                        <img className='logoutImage' src='/icons/signOut.png'/>
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