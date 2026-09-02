import { Dashboard } from "../component-index";
import{ Calendar as AriaCalendar, CalendarGrid, CalendarCell, Heading, Button } from "react-aria-components";
import { useDateFormatter } from "react-aria/useDateFormatter";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useState } from "react";

import "./calendar.css"

export function Calendar() {
    let [date, setDate] = useState(today(getLocalTimeZone()));

    return (
        <div>
            <Dashboard />
            <h1>Calendar Page</h1>

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
        </div>
    );
}