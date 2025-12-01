import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./PropertyDetails.css";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch property details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProperty(res.data.property || res.data);
        setImages(res.data.property?.images || []);
      } catch (err) {
        console.error("Error loading property:", err);
        navigate("/properties");
      }
    };
    fetchData();
  }, [id, navigate, token]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };


  if (!property) return <p className="loading">Loading property details...</p>;

  return (
    <div className="property-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      {/* --- Image Gallery --- */}
      <div className="details-header">
        {images.length > 0 ? (
          <div className="image-gallery">
            <img
              src={`http://127.0.0.1:8000/storage/${images[currentImage].image_path}`}
              alt={`Property ${currentImage + 1}`}
              className="details-image"
            />
            {images.length > 1 && (
              <>
                <button className="nav-btn left" onClick={prevImage}>
                  <FaChevronLeft />
                </button>
                <button className="nav-btn right" onClick={nextImage}>
                  <FaChevronRight />
                </button>
              </>
            )}
            <div className="thumbnails">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                  alt={`Thumb ${i + 1}`}
                  className={i === currentImage ? "thumb active" : "thumb"}
                  onClick={() => setCurrentImage(i)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="no-image">No Images Available</div>
        )}
      </div>

      {/* --- Details Section --- */}
      <div className="details-content">
        <div className="main-info">
          <h1 className="property-title">{property.title}</h1>
          <p className="property-location">
            <FaMapMarkerAlt /> {property.city}, {property.state}
          </p>

          <div className="price-section">
            <h2>₦{Number(property.price).toLocaleString()}</h2>
            <span className={`badge ${property.status}`}>{property.status}</span>
          </div>

          <div className="features">
            <div className="feature">
              <FaBed /> {property.bedrooms} Beds
            </div>
            <div className="feature">
              <FaBath /> {property.bathrooms} Baths
            </div>
            <div className="feature">
              <FaRulerCombined /> {property.size} sqft
            </div>
            <div className="feature">Type: {property.type}</div>
          </div>

          <div className="description">
            <h3>About this property</h3>
            <p>{property.address}</p>
          </div>

          {/* --- Google Map Preview --- */}
          <div className="map-preview">
            <iframe
              title="map"
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: "8px" }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${property.city}, ${property.state}`
              )}&output=embed`}
            ></iframe>
          </div>
        </div>

        {/* --- Contact Card --- */}
        <aside className="contact-card">
          <h3>Contact Agent</h3>
          <p>Interested in this property? Please log in to contact the agent.</p>
          <button
            onClick={() => navigate("/login")}
            className="login-btn"
          >
            Login to Message Agent
          </button>
        </aside>
      </div>

      {/* --- Similar Listings --- */}
      {similar.length > 0 && (
        <div className="similar-section">
          <h3>Similar Listings Nearby</h3>
          <div className="similar-grid">
            {similar.map((s) => (
              <div
                key={s.id}
                className="similar-card"
                onClick={() => navigate(`/properties/${s.id}`)}
              >
                {s.images && s.images.length > 0 ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${s.images[0].image_path}`}
                    alt={s.title}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}

                <div className="similar-info">
                  <h4>{s.title}</h4>
                  <p>
                    <FaMapMarkerAlt /> {s.city}
                  </p>
                  <p className="price">₦{Number(s.price).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;