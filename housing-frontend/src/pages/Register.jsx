import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate, Link } from "react-router-dom";
import { getRedirectRoute } from "../utils/roleRedirect";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", formData);

      const { token, user } = res.data;

      // store data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // go to welcome for onboarding
      navigate("/welcome");

    } catch (err) {
      setError("Registration failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        <h2>Create Account 🏡</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleRegister}>

          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email address" onChange={handleChange} required />

          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="agent">Agent</option>
            <option value="manager">Manager</option>
          </select>

          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="password" name="password_confirmation" placeholder="Confirm Password" onChange={handleChange} required />

          <button className="auth-btn" type="submit">Sign Up</button>

        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>

      </div>
    </div>
  );
};

export default Register;
