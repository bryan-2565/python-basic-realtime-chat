import './Styles/Auth.css'

import { useState } from "react";
import { useAuthStore } from "../Stores/useAuthStore";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

// ====================== COMPONENT ====================== //
export default function Login() {
    // ******************** STATE ******************** //
    const [formValues, setFormValues] = useState({
        username: "",
        password: "",
    });

    // ******************** STORES ******************** //
    const { isLoggingIn, login } = useAuthStore();

    // ******************** HANDLERS ******************** //
    // ▸ Handle form input changes
    function handleFormChange(e) {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    
    // ▸ Submit login form
    function submitForm(e) {
        e.preventDefault();

        const hasEmptyField = Object.values(formValues).some(value => value.trim() === "");
        if (hasEmptyField) {
            return toast.error("Please fill the form")
        }
        
        login(formValues);
    }

    // ******************** RENDER ******************** //
    return (
        <>
        {/* ========== PAGE CONTAINER ========== */}
        <div className="pageContainer">
            {/* ========== CARD CONTAINER ========== */}
            <div className="cardContainer">
                {/* · Header · */}
                <h2 className="header">Login Now</h2>
                <p className="subText">We're NOT excited to see you again</p>

                {/* —— Form Container —— */}
                <form className="formContainer" onSubmit={submitForm}>
                    {/* › Username Input ‹ */}
                    <div className="inputElement">
                        <label>USERNAME</label>
                        <input 
                            name="username" 
                            type="text" 
                            value={formValues.username} 
                            onChange={handleFormChange}
                            />
                    </div>

                    {/* › Password Input ‹ */}
                    <div className="inputElement">
                        <label>PASSWORD</label>
                        <input 
                            name="password" 
                            type="password" 
                            value={formValues.password} 
                            onChange={handleFormChange}
                            />
                    </div>

                    {/* · Submit Button · */}
                    <div className="submitButtonContainer">
                        {isLoggingIn 
                            ? <label>Loading</label>
                            : <button className='primaryButton'>Log In</button>
                        }
                    </div>

                    {/* › Register Link ‹ */}
                    <div className="toggleAuth">
                        <label>
                            Don't have an account?
                        </label>

                        <button type="button">
                            <Link to="/register">Register</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}