import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/properties")
      .then((res) => setProperties(res.data.data?.slice(0, 3) || []))
      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  return (
    <div className="homepage">
      <header className="hero">
        <div className="overlay">
          <h1 className="hero-title">Find Your Dream Home</h1>
          <p className="hero-subtitle">Discover the best homes for rent and sale in your area.</p>
          <Link to="/properties" className="btn btn-primary">
            Browse Listings
          </Link>
        </div>
      </header>

      <section className="featured-section">
        <h2>Featured Properties</h2>
        <div className="featured-grid">
          {properties.map((p) => (
            <Link to={`/properties/${p.id}`} key={p.id} className="featured-card">
              <img
                src={
                  p.images && p.images.length > 0
                    ? `http://127.0.0.1:8000/storage/${p.images[0].image_path}`
                    : "https://via.placeholder.com/400x250"
                }
                alt={p.title}
              />
              <div className="info">
                <h3>{p.title}</h3>
                <p>📍 {p.city}, {p.state}</p>
                <strong>₦{Number(p.price).toLocaleString()}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Housing Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
