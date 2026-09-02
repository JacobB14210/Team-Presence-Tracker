import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google"

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
                email: data.email
            };
            localStorage.setItem("currentUser", JSON.stringify(user));

            console.log(localStorage.getItem("currentUser"));
            
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
                email: data.email
            };
            localStorage.setItem("currentUser", JSON.stringify(user));

            console.log(localStorage.getItem("currentUser"));
            
            // Navigate to calendar path
            navigate('/Calendar');
        } else {
            setMessage("Account does not exist for that email");
        }
    };


    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)}
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

            </form>

            <br />

            <button onClick={() => navigate("/Create")}>
                Create Account
            </button>

            <br /><br />
            
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.log("Login Failed");
                }}
            />

            <p>{message}</p>

        </div>
    );
}