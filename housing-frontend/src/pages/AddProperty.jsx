import React, { useState } from "react";
import axios from "axios";
import "./AddProperty.css";
import { useNavigate } from "react-router-dom";

const AddProperty = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    price: "",
    property_type: "",
    status: "available",
  });

  const [images, setImages] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  /* --------------------------
     Buildings helpers
  ---------------------------*/
  const addBuilding = () =>
    setBuildings((b) => [
      ...b,
      { id: Date.now(), building_name: "", floors: "" },
    ]);

  const updateBuilding = (id, field, value) =>
    setBuildings((b) => b.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const removeBuilding = (id) => setBuildings((b) => b.filter((x) => x.id !== id));

  /* --------------------------
     Units helpers
  ---------------------------*/
  const addUnit = () =>
    setUnits((u) => [
      ...u,
      {
        id: Date.now(),
        building_id: null,
        unit_name: "",
        floor: "",
        bedrooms: "",
        bathrooms: "",
        size: "",
        rent_price: "",
      },
    ]);

  const updateUnit = (id, field, value) =>
    setUnits((u) => u.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const removeUnit = (id) => setUnits((u) => u.filter((x) => x.id !== id));

  /* --------------------------
     Submit
  ---------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    setSubmitting(true);

    try {
      const formData = new FormData();

      // append basic form fields
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined) formData.append(k, v);
      });

      // append images (images[])
      images.forEach((img) => {
        formData.append("images[]", img);
      });

      // append buildings and units as JSON strings (backend expects string)
      if (buildings.length > 0) formData.append("buildings", JSON.stringify(buildings));
      if (units.length > 0) formData.append("units", JSON.stringify(units));

      const res = await axios.post("http://127.0.0.1:8000/api/properties", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type - axios will set proper multipart/form-data boundary
        },
      });

      setMessage("✅ Property created successfully!");
      setTimeout(() => navigate("/agent/dashboard"), 1200);
    } catch (err) {
      console.error("Add property error:", err.response || err.message);

      if (err.response?.status === 422) {
        // Laravel typically returns validation errors as object { field: [messages] }
        const v = err.response.data;
        // support either {errors: {...}} or direct object of errors
        const errs = v.errors || v;
        setErrors(errs || {});
        setMessage("❌ Please correct the errors.");
      } else if (err.response) {
        setMessage(`❌ ${err.response.statusText || "Server error"}`);
      } else {
        setMessage("❌ Network or client error. See console.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* Helper to render first validation message for a field */
  const firstErr = (field) => {
    const val = errors[field];
    if (!val) return null;
    return Array.isArray(val) ? val[0] : val;
  };

  return (
    <div className="add-property-container">
      <div className="add-property-card">
        <h2 className="title">➕ Register New Property</h2>

        <form onSubmit={handleSubmit} className="form-box" noValidate>
          <section>
            <h3 className="section-title">Property Details</h3>

            <label className="field">
              <span>Title</span>
              <input
                name="title"
                placeholder="Property Title"
                value={form.title}
                onChange={handleChange}
                required
              />
              {firstErr("title") && <div className="error">{firstErr("title")}</div>}
            </label>

            <label className="field">
              <span>Description</span>
              <textarea
                name="description"
                placeholder="Short description"
                value={form.description}
                onChange={handleChange}
              />
              {firstErr("description") && <div className="error">{firstErr("description")}</div>}
            </label>

            <div className="two-cols">
              <label className="field">
                <span>Address</span>
                <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
                {firstErr("address") && <div className="error">{firstErr("address")}</div>}
              </label>

              <label className="field">
                <span>City</span>
                <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
                {firstErr("city") && <div className="error">{firstErr("city")}</div>}
              </label>
            </div>

            <div className="two-cols">
              <label className="field">
                <span>State</span>
                <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
                {firstErr("state") && <div className="error">{firstErr("state")}</div>}
              </label>

              <label className="field">
                <span>Base Price</span>
                <input name="price" type="number" placeholder="Base Price" value={form.price} onChange={handleChange} required />
                {firstErr("price") && <div className="error">{firstErr("price")}</div>}
              </label>
            </div>

            <div className="two-cols">
              <label className="field">
                <span>Property Type</span>
                <select name="property_type" value={form.property_type} onChange={handleChange} required>
                  <option value="">Select type</option>
                  <option value="estate">Estate (multiple buildings)</option>
                  <option value="apartment">Apartment Building (units)</option>
                  <option value="plaza">Plaza / Shopping Complex</option>
                  <option value="land">Land</option>
                  <option value="house">House</option>
                </select>
                {firstErr("property_type") && <div className="error">{firstErr("property_type")}</div>}
              </label>

              <label className="field">
                <span>Status</span>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="sold">Sold</option>
                </select>
                {firstErr("status") && <div className="error">{firstErr("status")}</div>}
              </label>
            </div>
          </section>

          <section>
            <h3 className="section-title">Images</h3>
            <label className="field">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} />
              {firstErr("images") && <div className="error">{firstErr("images")}</div>}
            </label>

            <div className="preview-row">
              {images.map((img, i) => (
                <div key={i} className="preview-wrap">
                  <img src={URL.createObjectURL(img)} alt={`preview-${i}`} className="preview-img" />
                </div>
              ))}
            </div>
          </section>

          {/* BUILDINGS (estate) */}
          {form.property_type === "estate" && (
            <section>
              <h3 className="section-title">Buildings</h3>

              {buildings.map((b) => (
                <div key={b.id} className="dynamic-box">
                  <input
                    placeholder="Building Name"
                    value={b.building_name}
                    onChange={(e) => updateBuilding(b.id, "building_name", e.target.value)}
                  />
                  <input
                    placeholder="Floors"
                    type="number"
                    value={b.floors}
                    onChange={(e) => updateBuilding(b.id, "floors", e.target.value)}
                  />
                  <button type="button" className="remove-btn" onClick={() => removeBuilding(b.id)}>Remove</button>
                </div>
              ))}

              <button type="button" className="add-btn" onClick={addBuilding}>➕ Add Building</button>
            </section>
          )}

          {/* UNITS */}
          {(form.property_type === "apartment" ||
            form.property_type === "plaza" ||
            form.property_type === "estate" ||
            form.property_type === "house") && (
            <section>
              <h3 className="section-title">Units / Flats / Shops</h3>

              {units.map((u) => (
                <div key={u.id} className="dynamic-box">
                  <input placeholder="Unit Name (e.g. Shop 1, Flat A2)" value={u.unit_name} onChange={(e) => updateUnit(u.id, "unit_name", e.target.value)} />
                  <input placeholder="Floor" value={u.floor} onChange={(e) => updateUnit(u.id, "floor", e.target.value)} />
                  <input placeholder="Bedrooms" type="number" value={u.bedrooms} onChange={(e) => updateUnit(u.id, "bedrooms", e.target.value)} />
                  <input placeholder="Bathrooms" type="number" value={u.bathrooms} onChange={(e) => updateUnit(u.id, "bathrooms", e.target.value)} />
                  <input placeholder="Size (sqft)" type="number" value={u.size} onChange={(e) => updateUnit(u.id, "size", e.target.value)} />
                  <input placeholder="Rent Price" type="number" value={u.rent_price} onChange={(e) => updateUnit(u.id, "rent_price", e.target.value)} />
                  <button type="button" className="remove-btn" onClick={() => removeUnit(u.id)}>Remove</button>
                </div>
              ))}

              <button type="button" className="add-btn" onClick={addUnit}>➕ Add Unit</button>
            </section>
          )}

          <div className="submit-row">
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Saving..." : "Save Property"}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          </div>

          {message && <div className={`message ${message.startsWith("✅") ? "ok" : "err"}`}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
