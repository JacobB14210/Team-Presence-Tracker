import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";

import "./login-page.css";
import logo from "../../assets/ETSBackground-CB-BW.png";

export function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch(
            "http://localhost:5000/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (data.success) {
            const user = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.emp_type
            };

            localStorage.setItem("currentUser", JSON.stringify(user));
            
            // Navigate to calendar path
            navigate('/Calendar');
        }
        else {
            setMessage("Invalid Email or Password");
        }
    };
    
    const handleGoogleSuccess = async (credentialResponse) => {
        const response = await fetch(
            "http://localhost:5000/google-login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: credentialResponse.credential
                })
            }
        );

        const data = await response.json();

        if (data.success) {
            const user = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.emp_type
            };

            localStorage.setItem("currentUser", JSON.stringify(user));

            // Navigate to calendar path
            navigate('/Calendar');
        }
        else {
            setMessage("Account does not exist for that email");
        }
    };


    return (
        <div className="login-container">
            <img src={logo} alt="company-logo" />

            <h1>Login</h1>

            <form onSubmit={handleLogin} className="login-form">

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)}/>

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)}/>

                <button type="submit" className="login-button">
                    Login
                </button>

            </form>

            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    setMessage("Login Failed")
                }}
                theme="filled_blue"
                size="large"
                shape="pill"
                width="300px"/>

            <button onClick={() => navigate("/Create")} className="create-button">
                Create Account
            </button>
            <p>{message}</p>
        </div>
    );
}