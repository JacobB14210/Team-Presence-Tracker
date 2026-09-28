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
            <div className="requests">
                <h2>Pending Time Off Requests</h2>
                Populate With List of Requests
                <div className="requests-list">
                    {pendings.length === 0 ? (
                            <p>
                                No time off requests for this day
                            </p>
                        ) : (
                            pendings.map((pending) => (
                                <div className="pending-request" key={pending.id}>
                                    <p>Name: {pending.name}</p>
                                    <p>
                                        Dates: {new Date(pending.start_date).toISOString().split("T")[0]} to {new Date(pending.end_date).toISOString().split("T")[0]}
                                    </p>
                                    <p>Reason: {pending.reason}</p>
                                    <p>Leave Early: {pending.leave_early ? "Yes" : "No"}</p>
                                    <p>Return Late: {pending.return_late ? "Yes" : "No"}</p>
                                </div>
                            ))
                        )}
                </div>
            </div>
        </div>
    );
}