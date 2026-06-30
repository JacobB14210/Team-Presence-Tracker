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
            setMessage("Login Successful");
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

        console.log(data);

        if (data.success) {
            setMessage("Login Successful");
            // Navigate to calendar path
            navigate('/Calendar');
        } else {
            setMessage("Invalid Email or Password");
        }
    };


    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>

                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
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