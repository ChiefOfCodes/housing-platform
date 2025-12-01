import React, { useEffect, useState } from "react";
import "./AgentDashboard.css";
import {
  FaSun,
  FaMoon,
  FaPlus,
  FaHome,
  FaUsers,
  FaWallet,
  FaEdit,
  FaTrash,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios";

const OwnerDashboard = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUnits: 0,
    totalTenants: 0,
    totalRevenue: 0,
  });
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOwnerDashboard();
  }, []);

  const fetchOwnerDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // ✔ Fetch owner profile
      const userRes = await axios.get("http://127.0.0.1:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userRes.data);

      // ✔ Fetch properties with units & payments
      const res = await axios.get("http://127.0.0.1:8000/api/my/properties", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const props = res.data.properties || [];
      setProperties(props);

      // Calculate owner stats
      let units = 0;
      let tenants = 0;
      let revenue = 0;

      props.forEach((p) => {
        if (p.units) {
          units += p.units.length;

          tenants += p.units.filter((u) => u.occupant !== null).length;
        }

        if (p.payments) {
          p.payments.forEach((pay) => {
            revenue += Number(pay.amount || 0);
          });
        }
      });

      setStats({
        totalProperties: props.length,
        totalUnits: units,
        totalTenants: tenants,
        totalRevenue: revenue,
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Unable to load owner dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    window.location.href = "/create-property";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property permanently?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error deleting property.");
    }
  };

  return (
    <div className={`agent-dashboard ${dark ? "dark" : ""}`}>
      <div className="max-container">

        {/* HEADER */}
        <header className="header">
          <div>
            <h1>Owner Dashboard</h1>
            <p>
              Welcome back,{" "}
              <span className="font-semibold">{user?.name || "Owner"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!dark)} className="btn btn-secondary">
              {dark ? <FaSun /> : <FaMoon />}
            </button>

            <button onClick={handleCreate} className="btn btn-gradient">
              <FaPlus /> Add Property
            </button>

            <button onClick={fetchOwnerDashboard} className="btn btn-secondary">
              Refresh
            </button>
          </div>
        </header>

        {/* STATS */}
        <div className="stat-grid">
          <div className="stat-card">
            <div><FaHome /></div>
            <div>
              <div className="label">Properties Owned</div>
              <div className="value">{stats.totalProperties}</div>
            </div>
          </div>

          <div className="stat-card">
            <div><FaUsers /></div>
            <div>
              <div className="label">Total Tenants</div>
              <div className="value">{stats.totalTenants}</div>
            </div>
          </div>

          <div className="stat-card">
            <div><FaChartLine /></div>
            <div>
              <div className="label">Total Units</div>
              <div className="value">{stats.totalUnits}</div>
            </div>
          </div>

          <div className="stat-card">
            <div><FaWallet /></div>
            <div>
              <div className="label">Total Revenue (₦)</div>
              <div className="value">
                ₦{stats.totalRevenue.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* PROPERTY LIST */}
        <div className="main-grid">
          <main>
            <h2 style={{ marginBottom: "10px", fontWeight: 600 }}>
              My Properties
            </h2>

            {loading ? (
              <div className="card">Loading…</div>
            ) : error ? (
              <div className="card" style={{ color: "red" }}>{error}</div>
            ) : properties.length === 0 ? (
              <div className="card">No properties found.</div>
            ) : (
              <div className="properties-grid">
                {properties.map((p) => (
                  <div key={p.id} className="property-card">
                    <div style={{ position: "relative" }}>
                      {p.images?.length > 0 ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${
                            p.images[0].image_path || p.images[0].path
                          }`}
                          alt={p.title}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}

                      <div className="actions">
                        <button onClick={() => (window.location.href = `/edit-property/${p.id}`)}>
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

                    <div className="body">
                      <h3>{p.title}</h3>
                      <p>{p.city}, {p.state}</p>

                      <p className="muted">
                        Units: {p.units?.length || 0} • Tenants:{" "}
                        {p.units?.filter((u) => u.occupant !== null).length || 0}
                      </p>

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
                Add Property
              </button>
              <button className="btn btn-secondary">
                Add Unit
              </button>
              <button className="btn btn-secondary">
                View Payments
              </button>
            </div>

            <div className="card">
              <h3>Notifications</h3>
              <p className="muted">No notifications.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
