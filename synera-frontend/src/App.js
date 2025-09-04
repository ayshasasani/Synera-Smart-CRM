import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Landing from "./components/Landing/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Unauthorized from "./components/Unauthorized";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import CustomersList from "./components/CustomersList";
import AddCustomer from "./components/AddCustomer";
import EditCustomer from "./components/EditCustomer";
import LeadsList from "./components/LeadsList";
import AddLead from "./components/AddLead";
import EditLead from "./components/EditLead";
import HighPriorityLeads from "./components/HighPriorityLeads";
import Products from "./components/Products";
import GmailAuth from "./components/GmailAuth";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar */}
        <Navbar />

        {/* Toast notifications */}
        <ToastContainer position="top-center" autoClose={3000} />

        <div style={{ padding: "20px" }}>
          <Routes>
            {/* Landing page as default */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />

            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Dashboard (protected) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Admin-only routes */}
            <Route
              path="/customers"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <CustomersList />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-customer"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AddCustomer />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-customer/:id"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <EditCustomer />
                </PrivateRoute>
              }
            />

            {/* Admin and Sales routes */}
            <Route
              path="/leads"
              element={
                <PrivateRoute allowedRoles={["admin", "sales"]}>
                  <LeadsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-lead"
              element={
                <PrivateRoute allowedRoles={["admin", "sales"]}>
                  <AddLead />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-lead/:id"
              element={
                <PrivateRoute allowedRoles={["admin", "sales"]}>
                  <EditLead />
                </PrivateRoute>
              }
            />
            <Route
              path="/high-priority-leads"
              element={
                <PrivateRoute allowedRoles={["admin", "sales"]}>
                  <HighPriorityLeads />
                </PrivateRoute>
              }
            />

            {/* Products (Admin/Sales) */}
            <Route
              path="/products"
              element={
                <PrivateRoute allowedRoles={["admin", "sales"]}>
                  <Products />
                </PrivateRoute>
              }
            />

            {/* Gmail Integration */}
            <Route
              path="/gmail-auth"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <GmailAuth />
                </PrivateRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
