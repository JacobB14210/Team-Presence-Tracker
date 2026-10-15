import { useState, useEffect } from "react";
import { Dashboard } from "../component-index";

import "./your-requests-page.css"

export function Requests() {
    return (
        <div className="your-requests-container">
            <Dashboard />
            <h1>Your Requests</h1>
            <div className="request-list-container">
                
            </div>
        </div>
    );
}