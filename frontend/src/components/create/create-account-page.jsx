import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./create-account-page.css";

export function Create() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [emp_type, setEmp_Type] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateAccount = async (e) => {
        e.preventDefault();

        if (!email || !password || !name) {
            setMessage("Please fill out all fields.");
            return;
        }
        
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    name,
                    password,
                    emp_type
                })
            }
        );

        const data = await response.json();

        if (data.success) {
            setEmail("");
            setName("");
            setPassword("");
        }
        
        setMessage(data.message);
    };

    return (
        <div className="create-account-container">
            <h1>Create Account</h1>

            <form onSubmit={handleCreateAccount} className="create-account-form">
                <input
                    type="name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)}/>

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

                <div className="emp-type-container">
                    <label htmlfor="emp_type">Choose Employee Type: </label>
                    <select
                        name="emp_type"
                        id="emp_type"
                        onChange={(e) =>
                            setEmp_Type(e.target.value)}>
                        <option value="Intern">Intern</option>
                        <option value="Full"> Full Time</option>
                    </select>
                </div>
                
                <button type="submit" className="create-account-button">
                    Create Account
                </button>
            </form>

            <button onClick={() => navigate("/")} className="back-button">
                Back to Login
            </button>

            <p>{message}</p>
        </div>
    );
}