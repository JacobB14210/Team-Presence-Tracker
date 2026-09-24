import { useNavigate } from "react-router-dom";

import "./dashboard.css"
import logo from "../../assets/PBUSDLogo.png"

export function Dashboard() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    console.log(currentUser);

    return (
        <div className="dashboard-container">
            <img src={logo} alt="BPUSD-logo" />
            
            <div className="dashboard-buttons">
                {currentUser?.role === "Admin" && (
                    <button
                        type="button"
                        onClick={() => navigate("/Approve")}>
                        Approve
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => navigate("/Time-Off")}>
                    Time Off Request
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/Calendar")}>
                    Calendar
                </button>
            </div>
            
        </div>
    );
}