import Home from './Pages/Home.jsx'
import Register from './Pages/Register.jsx'
import Login from './Pages/Login.jsx'
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from './Stores/useAuthStore.jsx';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

let checkedAuth = false

export default function App(){
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() =>{

    if (!checkedAuth){
      checkAuth();
      checkedAuth = true;
    }
  }, [])

  if (isCheckingAuth){
    return <h1>Loading...</h1>
  }  

  return(
    <>
      <Routes>
        <Route 
          path='/'
          element= {<Navigate to='/home'/>}
        />
        <Route 
          path='/home'
          element= { authUser 
                    ? <Home/>
                    : <Navigate to='/login'/>
                   }
        />
        <Route 
          path='/login'
          element= { !authUser 
                    ? <Login/>
                    : <Navigate to='/home'/>
                   }
        />
        <Route 
          path='/register'
          element= { !authUser 
                    ? <Register/>
                    : <Navigate to='/home'/>
                   }
        />
      </Routes>

      <Toaster/>
    </>
  )
}