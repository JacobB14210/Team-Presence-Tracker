import { useState } from "react";
import { Dashboard } from "../component-index";

export function Time() {
    const [start_datetime, setStart] = useState("");
    const [end_datetime, setEnd] = useState("");
    const [reason, setReason] = useState("");

    const [leaveEarly, setLeaveEarly] = useState(false);
    const [returnLate, setReturnLate] = useState(false);
    const [leaveTime, setLeaveTime] = useState("");
    const [returnTime, setReturnTime] = useState("");

    const handleRequestOff = async (e) => {
        e.preventDefault();
        console.log(start_datetime);
        console.log(end_datetime);
        console.log(reason);
        console.log(leaveTime);
        console.log(returnTime);
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
                        setStart(e.target.value)}/>
                
                <br /><br />

                <label>End Date: </label>
                <input
                    type="date"
                    value={end_datetime}
                    onChange={(e) =>
                        setEnd(e.target.value)}/>

                <br /><br />

                <label>Select a reason: </label>
                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}>
                    <option value="" disabled>Select an option...</option>
                    <option value="sick">Sick</option>
                    <option value="vacation">Vacation</option>
                    <option value="personal">Personal</option>
                    <option value="non-work">Non-work</option>
                </select>
                
                <br /><br />

                <label>First day:</label>
                <input
                    type="checkbox"
                    checked={leaveEarly}
                    onChange={(e) => setLeaveEarly(e.target.checked)}/>
                <label>Leave early</label>
                {leaveEarly && (
                    <input
                        type="time"
                        value={leaveTime}
                        onChange={(e) => setLeaveTime(e.target.value)}/>
                )}

                <br /><br />

                <label>Last day:</label>
                <input
                    type="checkbox"
                    checked={returnLate}
                    onChange={(e) => setReturnLate(e.target.checked)}/>

                <label>Return late</label>
                {returnLate && (
                    <input
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}/>
                )}

                <br /><br />

                <button type="submit">
                    Submit Time Off Request
                </button>
            </form>
        </div>
    );
}