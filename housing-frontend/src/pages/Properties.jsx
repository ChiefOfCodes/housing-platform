import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Properties() {
  const [properties, setProperties] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/properties", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProperties(res.data.data || res.data))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) navigate("/login");
      });
  }, []);

  return (
    <div className="container">
      <h2>Property Listings</h2>
      <Link to="/properties/add">
        <button>Add New Property</button>
      </Link>

      <div className="property-list">
        {properties.length > 0 ? (
          properties.map((p) => (
            <div key={p.id} className="property-card">
              {p.images && p.images.length > 0 ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${p.images[0].image_path}`}
                  alt={p.title}
                  width="200"
                />
                ) : (
                <div
                  style={{
                    width: "200px",
                    height: "150px",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                  }}
                >
                  No Image
                </div>
              )}
              <h3>{p.title}</h3>
              <p>
                {p.city}, {p.state}
              </p>
              <p>₦{p.price}</p>
              <p>{p.type}</p>
            </div>
          ))
        ) : (
          <p>No properties available.</p>
        )}
      </div>
    </div>
  );
}

export default Properties;
