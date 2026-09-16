import { useNavigate } from "react-router-dom";

import "./dashboard.css"
import logo from "../../assets/PBUSDLogo.png"

export function Dashboard() {

    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <img src={logo} alt="BPUSD-logo" />
            
            <div className="dashboard-buttons">
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