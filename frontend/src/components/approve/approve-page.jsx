import { useState, useEffect } from "react";
import { Dashboard } from "../component-index";

import "./approve-page.css"

export function Approve() {
    const [pendings, setPendings] =useState([]);

    useEffect(() => {
        const getAllPendingRequests = async () => {
            try {
                const response = await fetch("http://localhost:5000/pending");

                const data = await response.json();

                console.log(data);

                if (data.success) {
                    setPendings(data.requests);
                }
                else {
                    setPendings([]);
                }

                console.log(pendings);
            }
            catch (error) {
                console.error("Error getting all pending time off requests: ", error);

                setPendings([]);
            }
        };

        getAllPendingRequests();
    }, []);

    return (
        <div className="approve-container">
            <Dashboard />
            <h1>Time Off Approve</h1>
            <div className="pending-requests-container">
                <h2>Pending Time Off Requests</h2>
                <div className="requests-list">
                    {pendings.length === 0 ? (
                            <p>
                                No time off requests for this day
                            </p>
                        ) : (
                            pendings.map((pending, index) => (
                                <div className="pending-request" key={pending.id}>
                                    <div className="pending-request-info">
                                        <strong>
                                            {index + 1}. {pending.name}:
                                        </strong>{" "}
                                        {pending.reason}
                                        <ul>
                                            <li>
                                                {"From: "}{new Date(pending.start_date).toISOString().split("T")[0]}
                                                {pending.leave_early ? ` -- ${pending.leave_time}` : ""}
                                            </li>
                                            <li>
                                                {"To: "}{new Date(pending.end_date).toISOString().split("T")[0]}
                                                {pending.return_late ? ` -- ${pending.return_time}` : ""}
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="approval-buttons">
                                        <button className="approve-button">
                                            Approve
                                        </button>
                                        <button className="deny-button">
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