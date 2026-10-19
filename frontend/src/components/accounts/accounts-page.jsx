import { useState, useEffect } from "react";
import { Dashboard } from "../component-index";

import "./accounts-page.css"

export function Accounts() {
    const [users, setUsers] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/all-users`, { // Get all users
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });

                const data = await response.json();

                if (data.success) {
                    setUsers(data.users);
                }
                else {
                    setUsers([]);
                }
            }
            catch (error) {
                console.error("Error getting all users: ", error);

                setUsers([]);
            }
        };

        getAllUsers();
    }, [])

    return (
        <div className="accounts-container">
            <Dashboard />
            <h1>Accounts</h1>
            <div className="list-accounts-container">
                <h2>Employee Accounts</h2>
                <div className="account-container">
                    {users.length ===0 ? (
                        <p>
                            No current accounts
                        </p>
                    ) : (
                        users.map((user, index) => (
                            <div className="account" key={user.email}>
                                <strong>
                                    {index + 1}. {user.name}:
                                </strong>{" "}
                                <div>
                                    {"Sick: "}{user.sick}
                                </div>
                                <div>
                                    {"Vacation: "}{user.vacation}
                                </div>
                                <div>
                                    {"Personal: "}{user.personal}
                                </div>
                                <div>
                                    {"Non-Work: "}{user.non_work}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}