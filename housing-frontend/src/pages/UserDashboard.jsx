import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  if (!user) return <p className="loading">Loading your dashboard...</p>;

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>👋 Welcome, {user.name}</h2>
        <p>Your role: <span className="role">{user.role}</span></p>
      </div>

      <div className="dashboard-content">
        <div className="profile-card">
          <img
            src={user.profile_photo || "/default-avatar.png"}
            alt={user.name}
            className="profile-photo"
          />
          <div className="profile-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>Member since: {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="activity-card">
          <h3>Your Recent Activity</h3>
          <ul>
            <li>🏠 Viewed 3 properties this week</li>
            <li>💬 Contacted 1 agent</li>
            <li>❤️ Saved 2 listings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
