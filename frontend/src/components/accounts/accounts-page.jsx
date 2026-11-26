import { useState, useEffect } from "react";
import { Dashboard } from "../component-index";

import "./accounts-page.css"

export function Accounts() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [users, setUsers] = useState([]); // List of all users in the databases
    const [message, setMessage] = useState([]);

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/all-users`, { // Get all users
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });

                const data = await response.json();

                if (response.status === 200) {
                    setUsers(data.users);
                }
                else {
                    setMessage(data.message);
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

    const handleHoursChange = (userId, reason, value) => { // Change the value of the hours locally on react
        setUsers(prevUsers => prevUsers.map(user => user.id === userId ?
                    { ...user, [reason]: value } : user));
    };

    const updateHours = async (user) => { // Change the value of the hours on the database
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/update-hours?userID=${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({
                    name: user.name,
                    sick: Number(user.sick),
                    vacation: Number(user.vacation),
                    personal: Number(user.personal),
                    non_work: Number(user.non_work)
                })
            });

            const data = await response.json();

            setMessage(data.message);
        }
        catch (error) {
            console.error("Error updating hours:", error);
            setMessage("Failed to update hours");
        }
    };
    // TODO: Finish decminal related formating
    return (
        <div className="accounts-container">
            <Dashboard />
            <h1>Accounts</h1>
            <div className="list-accounts-container">
                <h2>Employee Accounts</h2>
                <p>{message}</p>
                <div className="account-container">
                    {users.length === 0 ? (
                        <p>
                            No accounts
                        </p>
                    ) : (
                        users.map((user, index) => (
                            <div className="account" key={user.email}>
                                <strong>
                                    {index + 1}. {user.name}:
                                </strong>

                                <div>
                                    Sick:{" "}
                                    <input
                                        type="number"
                                        step="any"
                                        value={user.sick}
                                        onChange={e => handleHoursChange(user.id, "sick", e.target.value)}/>
                                </div>
                                <div>
                                    Vacation:{" "}
                                    <input
                                        type="number"
                                        step="any"
                                        value={user.vacation}
                                        onChange={e => handleHoursChange(user.id, "vacation", e.target.value)}/>
                                </div>
                                <div>
                                    Non-Work:{" "}
                                    <input
                                        type="number"
                                        step="any"
                                        value={user.non_work}
                                        onChange={e => handleHoursChange(user.id, "non_work", e.target.value)}/>
                                </div>
                                <div>
                                    Personal:{" "}
                                    <input
                                        type="number"
                                        step="any"
                                        value={user.personal}
                                        onChange={e => handleHoursChange(user.id, "personal", e.target.value)}/>
                                </div>

                                <button className="update-hours-button " onClick={() => updateHours(user)}>
                                    Update Hours
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}