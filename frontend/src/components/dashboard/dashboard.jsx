import { useNavigate } from "react-router-dom";

import "./dashboard.css"

import logo from "../../assets/PBUSDLogo.png"

export function Dashboard() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const handleSignOut = async (e) => {
        e.preventDefault();

        // Remove user from local storage
        localStorage.removeItem("currentUser");

        // Go back to login page
        window.location.href = "/"
    }

    return (
        <div className="dashboard-container">
            <img src={logo} alt="BPUSD-logo" />
            
            <div className="dashboard-buttons">
                {currentUser?.role === "Admin" && ( /* Checks if user is admin */
                    <div className="admin-buttons">
                        <button
                            type="button"
                            onClick={() => navigate("/Approve")}>
                            Approve
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/Accounts")}>
                            Accounts
                        </button>
                    </div>
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

                <button
                    type="button"
                    onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        </div>
    );
}