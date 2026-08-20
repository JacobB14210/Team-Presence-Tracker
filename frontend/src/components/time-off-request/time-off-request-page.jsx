import { useState } from "react";
import { Dashboard } from "../component-index";

export function Time() {
    const [start_datetime, setStart] = useState("");
    const [end_datetime, setEnd] = useState("");

    const handleRequestOff = async (e) => {
        e.preventDefault();

    };
    return (
        <div>
            <Dashboard />
            <h1>Time Off Request Page</h1>

            <form onSubmit={handleRequestOff}>
                <label>Start Date: </label>
                <input
                    type="date"
                    value={start_datetime}
                    onChange={(e) =>
                        setStart(e.target.value)}
                />
                
                <br /><br />

                <label>End Date: </label>
                <input
                    type="date"
                    value={end_datetime}
                    onChange={(e) =>
                        setEnd(e.target.value)}
                />

                <br /><br />

                <label>Select a reason: </label>
                <select name="reason">
                    <option value="" disabled selected>Select an option...</option>
                    <option value="sick">sick</option>
                    <option value="vacation">vacation</option>
                    <option value="personal">personal</option>
                    <option value="non-work">non-work</option>
                </select>
            </form>
        </div>
    );
}