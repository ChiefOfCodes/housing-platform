import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AddProperty from "./pages/AddProperty";
import PropertyList from "./pages/PropertyList";
import EditProperty from "./pages/EditProperty";
import PropertyDetails from "./pages/PropertyDetails";

import HomePage from "./pages/HomePage";
import UserDashboard from "./pages/UserDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import GuestLanding from "./pages/GuestLanding";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import Welcome from "./pages/Welcome";     // ✅ YOU FORGOT THIS IMPORT

import ProtectedRoute from "./components/ProtectedRoute";
import Topbar from "./components/Topbar";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const location = useLocation();

  // REDIRECT USERS BASED ON ROLE
  const getDashboard = () => {
    switch (role) {
      case "agent":
        return <Navigate to="/agent/dashboard" />;
      case "manager":
        return <Navigate to="/manager/dashboard" />;
      case "owner":
        return <Navigate to="/owner/dashboard" />;
      case "admin":
        return <Navigate to="/dashboard/admin" />;
      case "user":
        return <Navigate to="/user/dashboard" />;
      default:
        return <Navigate to="/guest" />;
    }
  };

  // HIDE TOPBAR ON LOGIN & REGISTER PAGE
  const hideTopbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideTopbar && <Topbar />}

      <Routes>
        {/* LANDING / ROOT ROUTE */}
        <Route
          path="/"
          element={
            user ? (
              user.has_completed_onboarding ? (
                getDashboard()
              ) : (
                <Navigate to="/welcome" />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PUBLIC ROUTES */}
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />

        {/* AUTHENTICATED ROUTES */}
        <Route
          path="/add-property"
          element={
            <ProtectedRoute allowedRoles={["agent", "manager", "owner"]}>
              <AddProperty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/properties/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["agent", "manager", "owner"]}>
              <EditProperty />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARDS */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute allowedRoles={["agent", "manager"]}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* WELCOME / ONBOARDING */}
        <Route path="/welcome" element={<Welcome />} />

        {/* GUEST PAGE */}
        <Route path="/guest" element={<GuestLanding />} />

        {/* UNAUTHORIZED */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
};

export default App;
