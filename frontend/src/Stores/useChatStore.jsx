import { create } from 'zustand';
import BasicErrorHandler from "../Util/BasicErrorHandler";

// ====================== API CONFIGURATION ====================== //
const API_BASE_URL = "http://localhost:8000";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json"
};

// ******************** UTILITIES ******************** //
// ██ Common fetch wrapper with error handling
const fetchData = async (url, options = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: DEFAULT_HEADERS,
      credentials: 'include',
    });

    if (!res.ok) {
      BasicErrorHandler(res);
      return null;
    }

    return await res.json();
  } catch (err) {
    BasicErrorHandler(err);
    return null;
  }
};

// ====================== INITIAL STATE ====================== //
const initialState = {
    areUsersLoading: true,
    users: [],

    selectedUser: null,
    
    areMessagesLoading: false,
    messages: [],

    isSendingMessage: false,
}

// ====================== STORE DEFINITION ====================== //
export const useChatStore = create((set, get) => ({
    ...initialState,
    
    // ******************** ACTIONS ******************** //
    // ▸ Fetch all users from API
    getUsers: async() => {
        set({areUsersLoading: true});
        const users = await fetchData('/')
        
        set({areUsersLoading: false})

        if(!users){
            return set({users: null})
        }
        set({users: users})
    },

    // ▸ Fetch messages for specific user
    getMessages: async (userId) => {
        set({ areMessagesLoading: true });
        set({messages: []})
        
        const messages = await fetchData(`/messages/${userId}`)
        set({ areMessagesLoading: false });

        if(!messages){
            return set({messages: null})
        }
        set({ messages: messages });
    },

    // ▸ Set currently selected user
    setSelectedUser: (user) => {
        set({selectedUser: user})
    },

    // ▸ Send new message to selected user
    sendMessage: async (newMessage, wsConnection) => {
        set({isSendingMessage: true})

        const receiverId = get().selectedUser.id
        const sentMessage = await fetchData(
            `/messages/${receiverId}`, 
            {
                method: "POST", 
                body: JSON.stringify(newMessage)
            }
        )

        set({isSendingMessage: false})

        if(sentMessage){
            const wsMessage = {
              receiverId: receiverId,
              text: newMessage.text
            }

            wsConnection.send(JSON.stringify(wsMessage))
            const currentMessages = get().messages;
            set({ messages: [...currentMessages, sentMessage] });
        }
    },
}));