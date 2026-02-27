// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Curriculum from "./pages/Curriculum";
import FAQ from "./pages/FAQ";
import EnrollAndPay from "./pages/EnrollAndPay";
import Location from "./pages/Location";

// Dashboards
import ParentDashboard from "./pages/ParentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SelectChild from "./pages/SelectChild";
import ChildDashboard from "./pages/ChildDashboard";

import DashboardRedirect from "./pages/DashboardRedirect";
import AdminAudit from "./pages/AdminAudit";

export default function App() {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/curriculum" element={<Curriculum />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/enroll" element={<EnrollAndPay />} />
      <Route path="/location" element={<Location />} />

      {/* ========== PROTECTED DASHBOARD ROUTES ========== */}
      {/* All /dashboard/* routes must live under ONE protected parent route */}
      <Route element={<ProtectedRoute />}>
        {/* Base dashboard path → decide where to send user (by role) */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Parent-only */}
        <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
          <Route path="/dashboard/parent" element={<ParentDashboard />} />
          <Route path="/dashboard/select-child" element={<SelectChild />} />
          <Route path="/dashboard/child/:childId" element={<ChildDashboard />} />
        </Route>

        {/* Teacher-only */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        </Route>

        {/* Admin-only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/admin/audit" element={<AdminAudit />} />
        </Route>
      </Route>

      {/* ========== FALLBACK ========== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

