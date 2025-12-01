import React from "react";
import { useNavigate } from "react-router-dom";

function GuestLanding() {
    const navigate = useNavigate();

    return (
        <div className="dashboard">
            <h2>Welcome, Guest</h2>
            <p>You’re currently browsing as a guest. Please sign up or log in for more features.</p>
            <div className="actions">
                <button onClick={() => navigate("/register")}>Register</button>
                <button onClick={() => navigate("/login")}>Login</button>
            </div>
        </div>
    );
}

export default GuestLanding;