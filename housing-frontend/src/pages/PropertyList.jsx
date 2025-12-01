import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import "./PropertyList.css";

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/properties", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setProperties(response.data.data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete property.");
    }
  };

  const handleEdit = (id) => navigate(`/properties/edit/${id}`);
  const handleCardClick = (id) => navigate(`/properties/${id}`);

  if (loading) return <p className="loading">Loading properties…</p>;

  return (
    <div className="property-container">
      <div className="header">
        <h2 className="title">🏠 Available Properties</h2>

        {user ? (
            <div className="actions">
                <LogoutButton />
                {(user.role === "agent" || user.role === "owner") ? (
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/add-property")}
                >
                    + Add Property
                </button>
                ) : (
                <button
                    className="btn btn-disabled"
                    disabled
                    title="Only agents and owners can add properties"
                >
                    Add Property (Restricted)
                </button>
                )}
            </div>
            ) : (
            <div className="actions">
                <button
                className="btn btn-secondary"
                onClick={() => navigate("/login")}
                >
                Login or Signup to Add Property
                </button>
            </div>
            )}
      </div>

      {properties.length === 0 ? (
        <p className="empty">No properties available.</p>
      ) : (
        <div className="grid-cards">
          {properties.map((p) => (
            <div
              key={p.id}
              className="card clickable"
              onClick={() => handleCardClick(p.id)}
            >
              {p.images && p.images.length > 0 ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${p.images[0].image_path}`}
                  alt={p.title}
                  className="card-image"
                />
              ) : (
                <div className="card-image-fallback">No Image</div>
              )}

              <div className="card-info">
                <h3 className="card-title">{p.title}</h3>
                <p className="card-location">📍 {p.city}, {p.state}</p>
                <p className="card-price">₦{Number(p.price).toLocaleString()}</p>
                <p className="card-type">
                  {p.type === "rent" ? "For Rent" : "For Sale"}
                </p>
                <span className={`badge ${p.status}`}>
                  {p.status.replace("_", " ")}
                </span>

                {/* Show edit/delete only for logged-in users */}
                {user && (
                  <div
                    className="card-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(p.id)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(p.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertyList;
