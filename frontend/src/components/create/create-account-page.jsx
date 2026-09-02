import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
            "http://localhost:5000/create",
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
            // Navigate back to login path
            navigate('/');
        }
        else {
            setMessage("Unable to create account");
        }
    };

    return (
        <div>
            <h1>Create Account</h1>

            <form onSubmit={handleCreateAccount}>
                <input
                    type="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <br /><br />

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
                        setPassword(e.target.value)
                    }
                />

                <br /><br />

                <label htmlfor="emp_type">Choose Employee Type: </label>
                <select
                    name="emp_type"
                    id="emp_type"
                    onChange={(e) =>
                        setEmp_Type(e.target.value)
                    }>
                    <option value="Intern">Intern</option>
                    <option value="Full"> Full Time</option>
                </select>

                <br /><br />

                <button type="submit">
                    Create Account
                </button>

            </form>

            <br />

            <button onClick={() => navigate("/")}>
                Back to Login
            </button>

            <p>{message}</p>
        </div>
    );
}