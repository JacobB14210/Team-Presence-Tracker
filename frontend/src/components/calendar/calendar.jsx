import { Dashboard } from "../component-index";
import{ Calendar as AriaCalendar, CalendarGrid, CalendarCell, Heading, Button } from "react-aria-components";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useState, useEffect } from "react";

import "./calendar.css"

export function Calendar() {
    const [date, setDate] = useState(today(getLocalTimeZone()));
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (!date) return;

        const getRequest = async () => {
            try {
                const response = await fetch(`http://localhost:5000/time-off?date=${date}`);

                const data = await response.json();

                if (data.success) {
                    setRequests(data.requests);
                }
                else {
                    setRequests([]);
                }
            }
            catch (error) {
                console.error("Error getting time off requests: ", error);

                setRequests([]);
            }
        };

        getRequest();
    
    }, [date]);

    return (
        <div>
            <Dashboard />
            <h1>Calendar Page</h1>
            <div className="Calendar-Information">
                <AriaCalendar
                    aria-label="Time Off Calendar"
                    value={date}
                    onChange={setDate}
                >
                    <header>
                        <Button slot="previous">Previous</Button>
                        <Button slot="next">Next</Button>
                    </header>
                    <Heading />
                    <CalendarGrid>
                        {(date) => (
                            <CalendarCell date={date} />
                        )}
                    </CalendarGrid>
                </AriaCalendar>
                <div className="Time-Off-Requests">
                    <h2>Time Off Requests</h2>
                    <p>
                        Selected Date: {date.toString()}
                    </p>

                    {requests == 0 ? (
                        <p>
                            No time off requests for this day
                        </p>
                    ) : (
                        requests.map((request) => (
                            <div className="Request-Card" key={request.id}>
                                <p>
                                    <strong>
                                        {request.name}:
                                    </strong>{" "}
                                    {request.reason}

                                    {request.leave_early && 
                                        new Date(request.start_date).toISOString().split("T")[0] === date.toString() ? (
                                        <p>
                                            Leaves early: {" "}
                                            {request.leave_time}
                                        </p>
                                    ) : (
                                        <p></p>
                                    )}

                                    {request.return_late && 
                                        new Date(request.end_date).toISOString().split("T")[0] == date.toString() ? (
                                        <p>
                                            Returns late: {" "}
                                            {request.return_time}
                                        </p>
                                    ) : (
                                        <p></p>
                                    )}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}