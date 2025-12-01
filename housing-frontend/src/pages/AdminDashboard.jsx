import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaHome, FaChartPie } from "react-icons/fa";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const token = localStorage.getItem("token");

  const auth = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const res = await axios.get("/api/admin/stats", auth());
    setStats(res.data);
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <FaUsers className="text-indigo-600 text-2xl" />
          <p className="text-sm text-gray-500 mt-1">Users</p>
          <p className="font-bold text-xl">{stats.users || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <FaHome className="text-indigo-600 text-2xl" />
          <p className="text-sm text-gray-500 mt-1">Properties</p>
          <p className="font-bold text-xl">{stats.properties || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <FaChartPie className="text-indigo-600 text-2xl" />
          <p className="text-sm text-gray-500 mt-1">Units</p>
          <p className="font-bold text-xl">{stats.units || 0}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm mt-6">
        <h2 className="font-semibold text-lg">System Management</h2>

        <div className="mt-4 space-y-3">
          <button className="px-4 py-2 w-full border rounded-lg">
            Manage Users
          </button>
          <button className="px-4 py-2 w-full border rounded-lg">
            Manage Properties
          </button>
          <button className="px-4 py-2 w-full border rounded-lg">
            Role & Permission Settings
          </button>
        </div>
      </div>
    </div>
  );
}
