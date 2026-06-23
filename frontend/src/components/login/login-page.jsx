import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google"

export function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

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
    };
    

    return (
        <div>
            
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.log("Login Failed");
                }}
            />

        </div>
    );
}