// src/pages/EditProperty.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditProperty() {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setForm(res.data))
      .catch((err) => console.error("Fetch failed:", err));
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/properties/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Property updated successfully!");
      setTimeout(() => navigate("/properties"), 1000);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Failed to update property.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>Edit Property</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input name="title" value={form.title || ""} onChange={handleChange} />
        <input name="address" value={form.address || ""} onChange={handleChange} />
        <input name="city" value={form.city || ""} onChange={handleChange} />
        <input name="state" value={form.state || ""} onChange={handleChange} />
        <input
          name="price"
          type="number"
          value={form.price || ""}
          onChange={handleChange}
        />
        <select name="status" value={form.status || "available"} onChange={handleChange}>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="sold">Sold</option>
        </select>
        <button type="submit">Save Changes</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EditProperty;
