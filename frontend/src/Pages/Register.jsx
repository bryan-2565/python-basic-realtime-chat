import './Styles/Auth.css'

import { useState } from "react";
import { useAuthStore } from "../Stores/useAuthStore";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

// ====================== COMPONENT ====================== //
export default function Register() {
    // ******************** STATE ******************** //
    const [formValues, setFormValues] = useState({
        username: "",
        password: "",
    });

    // ******************** STORES ******************** //
    const { isRegistering, register } = useAuthStore();

    // ******************** HANDLERS ******************** //
    // ▸ Handle form input changes
    function handleFormChange(e) {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    
    // ▸ Submit register form
    function submitForm(e) {
        e.preventDefault();

        const hasEmptyField = Object.values(formValues).some(value => value.trim() === "");
        if (hasEmptyField) {
            return toast.error("Please fill the form")
        }
        
        register(formValues);
    }

    // ******************** RENDER ******************** //
    return (
        <>
        {/* ========== PAGE CONTAINER ========== */}
        <div className="pageContainer">
            {/* ========== CARD CONTAINER ========== */}
            <div className="cardContainer">
                {/* · Header · */}
                <h2 className="header">Register Now</h2>
                <p className="subText">Create your account to get started.</p>

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
                        {isRegistering 
                            ? <button className='primaryButton' style={{backgroundColor:'var(--button-primary-active)'}}><div className='spinner' style={{height:15, width:15}}/></button>
                            : <button className='primaryButton'>Register</button>
                        }
                    </div>

                    {/* › Login Link ‹ */}
                    <div className="toggleAuth">
                        <label>
                            Already have an account?
                        </label>

                        <button type="button">
                            <Link to="/login">Login</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}