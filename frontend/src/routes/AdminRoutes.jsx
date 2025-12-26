// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // ← Import it (adjust path if needed)

import AdminDashboard from "../pages/admin/AdminDashboard";
import ViewStudentDetails from "../pages/admin/ViewStudentDetails";
import FacultyManagement from "../pages/admin/FacultyManagement";
import AcademicManagement from "../pages/admin/AcademicManagement";
import CoursesManagement from "../pages/admin/CoursesManagement";
import CourseDetailsAdmin from "../pages/admin/CourseDetailsAdmin";
import SettingsAdmin from "../pages/admin/SettingsAdmin";
import AdminLogin from "../pages/auth/AdminLogin";
import TotalStudents from "../pages/admin/TotalStudents";
import MyProfile from "../pages/admin/MyProfile";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected routes — only accessible after login */}
      <Route
        path="/dash"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <TotalStudents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students/:id"
        element={
          <ProtectedRoute>
            <ViewStudentDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty"
        element={
          <ProtectedRoute>
            <FacultyManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/academics"
        element={
          <ProtectedRoute>
            <AcademicManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CoursesManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:id"
        element={
          <ProtectedRoute>
            <CourseDetailsAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        }
      />

      {/* Catch-all — redirect unknown paths to dashboard */}
      <Route path="*" element={<Navigate to="/dash" replace />} />
    </Routes>
  );
}