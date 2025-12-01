import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHome, FaMoneyBill, FaTools } from "react-icons/fa";

export default function TenantDashboard() {
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const auth = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    loadTenantData();
  }, []);

  async function loadTenantData() {
    try {
      const res = await axios.get(`/api/tenant/unit/${user.id}`, auth());
      setUnit(res.data.unit);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Tenant Dashboard</h1>

      {unit ? (
        <>
          <div className="bg-white p-4 rounded-2xl shadow-sm mt-4">
            <h3 className="font-semibold">Your Unit</h3>
            <p className="text-gray-600">
              {unit.property?.title} — {unit.unit_name}
            </p>
            <p className="mt-2">
              Status:{" "}
              <span className="px-2 py-1 text-sm rounded bg-green-100 text-green-700">
                Active Tenant
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <FaMoneyBill className="text-indigo-600 text-2xl" />
              <p className="mt-2 text-sm text-gray-500">Rent Amount</p>
              <p className="font-bold text-lg">
                ₦{Number(unit.rent_amount).toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <FaTools className="text-indigo-600 text-2xl" />
              <p className="mt-2 text-sm text-gray-500">Maintenance</p>
              <button className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-lg">
                Submit Request
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <FaHome className="text-indigo-600 text-2xl" />
              <p className="mt-2 text-sm text-gray-500">Property</p>
              <p className="font-semibold">{unit.property?.title}</p>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-4 text-gray-500">You are not assigned to any unit.</p>
      )}
    </div>
  );
}
