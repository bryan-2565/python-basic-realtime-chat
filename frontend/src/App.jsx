import { useEffect } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './Stores/useAuthStore.jsx';
import Register from './Pages/Register.jsx';
import Login from './Pages/Login.jsx';
import Home from './Pages/Home.jsx';

// ====================== GLOBALS ====================== //
let checkedAuth = false;

// ====================== COMPONENT ====================== //
export default function App() {
    // ******************** STORES ******************** //
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    // ******************** EFFECTS ******************** //
    // ██ Check authentication status on mount
    useEffect(() => {
        if (!checkedAuth) {
            checkAuth();
            checkedAuth = true;
        }
    }, []);

    // ******************** RENDER STATES ******************** //
    // ▸ Show loading screen while checking auth
    if (isCheckingAuth) {
        return (
            <div className='loadingScreen'>
                <div className="spinnerChunky"/>
            </div>
        );
    }  

    // ******************** MAIN RENDER ******************** //
    return (
        <>
            {/* ========== ROUTES ========== */}
            <Routes>
                {/* · Root Redirect · */}
                <Route 
                    path='/'
                    element={<Navigate to='/home'/>}
                />

                {/* · Home Route · */}
                <Route 
                    path='/home'
                    element={authUser 
                        ? <Home/>
                        : <Navigate to='/login'/>
                    }
                />

                {/* · Login Route · */}
                <Route 
                    path='/login'
                    element={!authUser 
                        ? <Login/>
                        : <Navigate to='/home'/>
                    }
                />

                {/* · Register Route · */}
                <Route 
                    path='/register'
                    element={!authUser 
                        ? <Register/>
                        : <Navigate to='/home'/>
                    }
                />
            </Routes>

            {/* ========== TOASTER ========== */}
            <Toaster/>
        </>
    );
}