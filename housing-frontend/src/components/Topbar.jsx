import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Topbar.css";

const Topbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="topbar">
      <div className="logo" onClick={() => navigate("/")}>
        🏡 HouseConnect
      </div>

      <div className="nav-links">
        <Link to="/properties">Properties</Link>
        <Link to="/add-property">Add Property</Link>
        {user ? (
          <>
            <span className="username">{user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="register-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Topbar;
