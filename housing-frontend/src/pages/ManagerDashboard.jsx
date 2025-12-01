import React from "react";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard">
            <h2>Admin / Manager Dashboard</h2>
            <p>Full control over users, properties, and platform activity.</p>
            <div className="actions">
                <button onClick={() => navigate("/properties")}>Manage Properties</button>
                <button onClick={() => navigate("/users")}>Manage Users</button>
            </div>
        </div>
    );
}

export default ManagerDashboard;