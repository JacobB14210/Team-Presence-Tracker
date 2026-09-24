import { useState } from "react";
import { Dashboard } from "../component-index";

import "./approve-page.css"

export function Approve() {


    return (
        <div className="approve-container">
            <Dashboard />
            <h1>Time Off Approve</h1>
            <div className="requests">
                <h2>Pending Time Off Requests</h2>
                Populate With List of Requests
            </div>
        </div>
    );
}