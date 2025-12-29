// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminProtectedRoute } from "./ProtectedRoute"; // Admin-protected route component

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
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <AdminProtectedRoute>
            <TotalStudents />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/students/:id"
        element={
          <AdminProtectedRoute>
            <ViewStudentDetails />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/faculty"
        element={
          <AdminProtectedRoute>
            <FacultyManagement />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/academics"
        element={
          <AdminProtectedRoute>
            <AcademicManagement />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <AdminProtectedRoute>
            <CoursesManagement />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/course/:id"
        element={
          <AdminProtectedRoute>
            <CourseDetailsAdmin />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <AdminProtectedRoute>
            <SettingsAdmin />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <AdminProtectedRoute>
            <MyProfile />
          </AdminProtectedRoute>
        }
      />

      {/* Catch-all — redirect unknown paths to dashboard */}
      <Route path="*" element={<Navigate to="/dash" replace />} />
    </Routes>
  );
}