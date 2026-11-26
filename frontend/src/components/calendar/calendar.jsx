import { Dashboard } from "../component-index";
import{ Calendar as AriaCalendar, CalendarGrid, CalendarCell, Heading, Button } from "react-aria-components";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useState, useEffect } from "react";

import "./calendar.css"

export function Calendar() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [date, setDate] = useState(today(getLocalTimeZone()));
    const [requests, setRequests] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);

    useEffect(() => {
        const getAllRequests = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/all-approved`, { // Get all approved time off
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });

                const data = await response.json();

                if (response.status === 200) {
                    setApprovedRequests(data.requests);
                }
                else {
                    setApprovedRequests([]);
                }
            }
            catch (error) {
                console.error("Error getting all time off requests: ", error);

                setApprovedRequests([]);
            }
        };

        getAllRequests();
    }, []);

    useEffect(() => {
        if (!date) return;

        const getRequest = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/date-approved?date=${date}`, { // Get all requests for the selected day
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });

                const data = await response.json();

                if (response.status === 200) {
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

    const hasRequest = (calendarDate) => { // Checks list if date has request for calendar

        const dateString = calendarDate.toString();

        return approvedRequests.some((request) => {
            const startDate = new Date(request.start_date).toISOString().split("T")[0];

            const endDate = new Date(request.end_date).toISOString().split("T")[0];

            return dateString >= startDate && dateString <= endDate;
        });
    };

    return (
        <div>
            <Dashboard />
            <div className="calendar-container">
                <h1>Calendar</h1>

                <div className="calendar-information">
                    <AriaCalendar
                        aria-label="Time Off Calendar"
                        value={date}
                        onChange={setDate}>

                        <header>
                            <Button slot="previous">Previous</Button>
                            <Button slot="next">Next</Button>
                        </header>

                        <Heading />

                        <CalendarGrid>
                            {(date) => (
                                <CalendarCell
                                    date={date}
                                    className={hasRequest(date) ? "has-request" : null}/>
                            )}
                        </CalendarGrid>

                    </AriaCalendar>

                    <div className="time-off-requests">
                        <h2>Time Off Requests</h2>
                        <p>
                            {date.toString()}
                        </p>

                        {requests.length === 0 ? (
                            <p>
                                No time off requests for this day
                            </p>
                        ) : (
                            requests.map((request) => (
                                <div className="request-card" key={request.id}>
                                    <p>
                                        <strong>
                                            {request.name}:
                                        </strong>{" "}
                                        {request.reason == "Non_work" ? "Non-work" : request.reason}

                                        {request.leave_early && 
                                            new Date(request.start_date).toISOString().split("T")[0] === date.toString() ? (
                                            <span>
                                                {" "}-- Leaves early: {" "}
                                                {request.leave_time.slice(0, 5)}
                                            </span>
                                        ) : (
                                            <span>

                                            </span>
                                        )}

                                        {request.return_late && 
                                            new Date(request.end_date).toISOString().split("T")[0] == date.toString() ? (
                                            <span>
                                                {" "}-- Returns late: {" "}
                                                {request.return_time.slice(0, 5)}
                                            </span>
                                        ): (
                                            <span>

                                            </span>
                                        )}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            
        </div>
    );
}