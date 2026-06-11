import { useNavigate } from "react-router-dom";

export function Dashboard() {

    const navigate = useNavigate();

    return (
        <div>
            <button
                type="button"
                onClick={() => navigate("/Home")}
            >
                Home
            </button>

            <button
                type="button"
                onClick={() => navigate("/Time-Off")}
            >
                Time Off
            </button>

            <button
                type="button"
                onClick={() => navigate("/Calendar")}
            >
                Calendar
            </button>
        </div>
    );
}