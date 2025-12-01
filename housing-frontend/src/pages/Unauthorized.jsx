// src/pages/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Access Denied 🚫</h2>
      <p>You do not have permission to view this page.</p>
      <Link to="/">Go Back Home</Link>
    </div>
  );
}

export default Unauthorized;
