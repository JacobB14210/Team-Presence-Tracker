import { useState, useEffect } from "react";
import { Dashboard } from "../component-index";

import "./approve-page.css"

export function Approve() {
    const [pendings, setPendings] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const [message, setMessage] = useState("");

    // Run when browser runs
    useEffect(() => {
        const getAllPendingRequests = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/pending`, { // Get all pending time off requests
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });

                const data = await response.json();

                if (data.success) {
                    setPendings(data.requests);
                }
                else {
                    setPendings([]);
                }
            }
            catch (error) {
                console.error("Error getting all pending time off requests: ", error);

                setPendings([]);
            }
        };

        getAllPendingRequests();
    }, []);

    // Approve a time off request
    const approveRequest = async (requestId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/approve-request`, { // Approve time off request
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentUser.token}`
                    },
                    body: JSON.stringify({
                        id: requestId
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            if (data.success) {
                // Remove the approved request from the pending list
                setPendings((currentPendings) =>
                    currentPendings.filter(
                        (pending) => pending.id !== requestId
                    )
                );

                setMessage(data.message);
            }
            else {
                setMessage("Failed to approve request: " + data.message);
            }
        }
        catch (error) {
            setMessage("Error approving request: " + error);
        }
    };

    // Approve a time off request
    const denyRequest = async (requestId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/deny-request`, { // Deny time off request
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentUser.token}`
                    },
                    body: JSON.stringify({
                        id: requestId
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            if (data.success) {
                // Remove the approved request from the pending list
                setPendings((currentPendings) =>
                    currentPendings.filter(
                        (pending) => pending.id !== requestId
                    )
                );
            }
            else {
                console.error("Failed to deny request:", data.message);
            }
        }
        catch (error) {
            console.error("Error denying request:", error);
        }
    };

    return (
        <div className="approve-container">
            <Dashboard />
            <h1>Approve</h1>
            <div className="pending-requests-container">
                <h2>Pending Time Off Requests</h2>
                <p>{message}</p>
                <div className="requests-list">
                    {pendings.length === 0 ? (
                        <p>
                            No Pending Time Off Requests
                        </p>
                    ) : (
                        pendings.map((pending, index) => (
                            <div className="pending-request" key={pending.id}>
                                <div className="pending-request-info">
                                    <strong>
                                        {index + 1}. {pending.name}:
                                    </strong>{" "}
                                    {pending.reason === "Non_work" ? "Non-work" : pending.reason}
                                    <ul>
                                        <li>
                                            {"From: "}{new Date(pending.start_date).toISOString().split("T")[0]}
                                            {pending.leave_early ? ` at ${pending.leave_time.slice(0, 5)}` : ""}
                                        </li>
                                        <li>
                                            {"To: "}{new Date(pending.end_date).toISOString().split("T")[0]}
                                            {pending.return_late ? ` at ${pending.return_time.slice(0, 5)}` : ""}
                                        </li>
                                        <li>
                                            {`Total Hours: ${pending.total_hours}`}
                                        </li>
                                    </ul>
                                </div>
                                <div className="approval-buttons">
                                    <button className="approve-button" onClick={() => approveRequest(pending.id)}>
                                        Approve
                                    </button>
                                    <button className="deny-button" onClick={() => denyRequest(pending.id)}>
                                        Deny
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}