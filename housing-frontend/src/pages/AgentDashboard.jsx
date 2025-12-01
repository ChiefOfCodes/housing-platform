import React, { useEffect, useState } from "react";
import "./AgentDashboard.css";
import {
  FaPlus,
  FaSun,
  FaMoon,
  FaUsers,
  FaChartLine,
  FaTrash,
  FaHome,
  FaEdit
} from "react-icons/fa";
import axios from "axios";

const AgentDashboard = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({ total: 0, occupied: 0, vacant: 0 });
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // ✔ FIXED: correct user route
      const userRes = await axios.get("http://127.0.0.1:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userRes.data);

      // ✔ This route exists in your Laravel
      const propertiesRes = await axios.get(
        "http://127.0.0.1:8000/api/my/properties",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const props = propertiesRes.data.properties || [];
      setProperties(props);

      const occupied = props.filter((p) => p.status === "occupied").length;
      const vacant = props.filter((p) => p.status === "available").length;

      setStats({
        total: props.length,
        occupied,
        vacant,
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error deleting property");
    }
  };

  const handleCreate = () => {
    window.location.href = "/create-property";
  }

  return (
    <div className={`agent-dashboard ${dark ? "dark" : ""}`}>
      <div className="max-container">

        {/* HEADER */}
        <header className="header">
          <div>
            <h1>Agent / Manager Dashboard</h1>
            <p>
              Welcome back, <span className="font-semibold">{user?.name || "Agent"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!dark)} className="btn btn-secondary">
              {dark ? <FaSun /> : <FaMoon />}
            </button>

            <button onClick={handleCreate} className="btn btn-gradient">
              <FaPlus /> Add Property
            </button>

            {/* FIXED BUTTON — this caused your crash earlier */}
            <button onClick={fetchDashboardData} className="btn btn-secondary">
              Refresh
            </button>
          </div>
        </header>

        {/* STATS */}
        <div className="stat-grid">
          <div className="stat-card">
            <div><FaChartLine /></div>
            <div>
              <div className="label">Properties Managed</div>
              <div className="value">{stats.total}</div>
            </div>
          </div>

          <div className="stat-card">
            <div><FaUsers /></div>
            <div>
              <div className="label">Occupied Units</div>
              <div className="value">{stats.occupied}</div>
            </div>
          </div>

          <div className="stat-card">
            <div><FaHome /></div>
            <div>
              <div className="label">Vacant Units</div>
              <div className="value">{stats.vacant}</div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="main-grid">
          <main>
            <h2 style={{ fontWeight: 600, marginBottom: "10px" }}>My Properties</h2>

            {loading ? (
              <div className="card">Loading properties…</div>
            ) : error ? (
              <div className="card" style={{ color: "red" }}>{error}</div>
            ) : properties.length === 0 ? (
              <div className="card">No properties found.</div>
            ) : (
              <div className="properties-grid">
                {properties.map((p) => (
                  <div key={p.id} className="property-card">

                    {/* IMAGE */}
                    <div style={{ position: "relative" }}>
                      {p.images?.length > 0 ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${p.images[0].image_path || p.images[0].path
                            }`}
                          alt={p.title}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}

                      <div className="actions">
                        <button onClick={() => handleEdit(p.id)}>
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          style={{ color: "red" }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* BODY */}
                    <div className="body">
                      <h3>{p.title}</h3>
                      <p>{p.city}, {p.state}</p>

                      <span
                        className={`property-status ${p.status === "available" ? "status-available" : ""
                          }`}
                      >
                        {p.status}
                      </span>

                      <p style={{ marginTop: "10px" }}>
                        ₦{Number(p.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* SIDEBAR */}
          <aside>
            <div className="card">
              <h3>Quick Actions</h3>
              <button className="btn btn-secondary" onClick={handleCreate}>
                Create Property
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => (window.location.href = "/properties")}
              >
                View All Listings
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => alert("Maintenance not implemented")}
              >
                Maintenance
              </button>
            </div>

            <div className="card">
              <h3>Recent Activity</h3>
              <p className="muted">No recent activity.</p>
            </div>
          </aside>
        </div>

        {/* FLOAT BUTTON */}
        <button onClick={handleCreate} className="fab">
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default AgentDashboard;
