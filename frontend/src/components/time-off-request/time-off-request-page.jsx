import { useState } from "react";
import { Dashboard } from "../component-index";

export function Time() {
    const [startDate, setStart] = useState("");
    const [endDate, setEnd] = useState("");
    const [reason, setReason] = useState("");

    const [leaveEarly, setLeaveEarly] = useState(false);
    const [returnLate, setReturnLate] = useState(false);
    const [leaveTime, setLeaveTime] = useState("");
    const [returnTime, setReturnTime] = useState("");

    const handleRequestOff = async (e) => {
        e.preventDefault();
        console.log(startDate);
        console.log(endDate);
        console.log(reason);
        console.log(leaveTime);
        console.log(returnTime);

        const response = await fetch(
            "http://localhost:5000/request-off", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    reason,
                    leaveEarly,
                    returnLate,
                    leaveTime,
                    returnTime
                })
            }
        );

        const data = await response.json();

        if (data.success) {
            alert("Time off request submitted!");
        }
        else {
            alert(data.message);
        }
    };
    return (
        <div>
            <Dashboard />
            <h1>Time Off Request Page</h1>

            <form onSubmit={handleRequestOff}>
                <label>Start Date: </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                        setStart(e.target.value)}/>
                
                <br /><br />

                <label>End Date: </label>
                <input
                    type="date"
                    value={endDate}
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