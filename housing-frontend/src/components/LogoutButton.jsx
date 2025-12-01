import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            // Optional: also tell backend to invalidate token
            await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (error) {
            console.warn("Logout request failed, clearing token anyway.");
        }

        // Clear local token and redirect
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
            }}
        >
            Logout
        </button>
    );
}

export default LogoutButton;