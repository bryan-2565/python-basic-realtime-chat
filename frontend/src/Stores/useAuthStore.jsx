import { create } from 'zustand';
import toast from "react-hot-toast";
import BasicErrorHandler from '../Util/BasicErrorHandler';
import { useChatStore } from './useChatStore';

// ====================== API CONFIGURATION ====================== //
const API_BASE_URL = "http://localhost:8000/auth";
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
    if (res.status == 204) return;

    return await res.json();
  } catch (err) {
    BasicErrorHandler(err);
    return null;
  }
};

// ====================== INITIAL STATE ====================== //
const initialState = {
    authUser: null,
    isCheckingAuth: true,
    isRegistering: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isUpdatingPfp: false,
    ws: null,
}

// ====================== STORE DEFINITION ====================== //
export const useAuthStore = create((set, get) => ({
    ...initialState, 

    // ******************** ACTIONS ******************** //
    // ▸ Check current authentication status
    checkAuth: async () => {
        set({isCheckingAuth: true})

        const user = await fetchData('/check', {
            method: "POST",
        });

        setTimeout(() =>{
            set({isCheckingAuth: false})
        }, 250)
        
        if (user) {
            set({authUser: user})

            if(get().ws == null) {
                set({ws: new WebSocket(`ws://localhost:8000/messages/ws/${user.id}`)})
            }

            toast.success("Welcome!")
        }
        else {
            set({authUser: null})
            set({ws: null})
        }
    },

    // ▸ Register new user account
    register: async (registerData) => {
        set({isRegistering: true})
        
        await fetchData('/register', {
            method: "POST",
            body: JSON.stringify(registerData)
        })

        set({isRegistering: false})
        get().checkAuth();
    },

    // ▸ Log in existing user
    login: async (loginData) => {
        set({isLoggingIn: true})

        await fetchData('/login', {
            method: "POST", 
            body: JSON.stringify(loginData)
        })

        set({isLoggingIn: false})
        get().checkAuth();
    },

    // ▸ Log out current user
    logout: async () => {
        set({isLoggingOut: true})

        const success = await fetchData('/logout', {
            method: "POST",
        })

        set({isLoggingOut: false})

        if (success) {
            get().checkAuth()
            useChatStore.setState({
                areUsersLoading: true,
                users: [],

                selectedUser: null,
                
                areMessagesLoading: false,
                messages: [],

                isSendingMessage: false,
            })
            set({
                authUser: null,
                isCheckingAuth: true,
                isRegistering: false,
                isLoggingIn: false,
                isLoggingOut: false,
                isUpdatingPfp: false,
                ws: null,
            })

            toast.success("Successfully logged out!")
        }   
    },

    // ▸ Update profile picture
    updatePfp: async(imgUrl) => {
        set({isUpdatingPfp: true})

        const success = await fetchData("/", {
            method: "POST",
            body: JSON.stringify({url: imgUrl})
        })

        if(success){
            toast.success("Successfully updated profile picture!")
        }

        set({isUpdatingPfp: false})
        
        // ~~~~ Retrieve updated user data ~~~~ //
        const user = await fetchData('/check', {
            method: "POST",
        });
        if (user){
            set({authUser: user})
        }
    }
}))