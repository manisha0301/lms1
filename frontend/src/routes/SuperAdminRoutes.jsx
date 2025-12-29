// src/routes/SuperAdminRoutes.jsx (or wherever it is)
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // Adjust path if needed

import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import AcademicAdminsPage from "../pages/superAdmin/AcademicAdminsPage";
import FinanceDashboard from "../pages/superAdmin/FinanceDashboard";
import CoursesManagementPage from "../pages/superAdmin/CourseManagementPage";
import SuperAdminCourses from "../pages/superAdmin/SuperAdminCourses";  
import CourseDetail from "../pages/superAdmin/CourseDetails";  
import SuperAdminLogin from "../pages/auth/SuperAdminLogin";
import MyProfile from "../pages/superAdmin/MyProfile";
import Settings from "../pages/superAdmin/SuperAdminSettings";

export default function SuperAdminRoutes() {
  return (
    <Routes>
      {/* Public routes - accessible without login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<SuperAdminLogin />} />

      {/* Protected routes - require login */}
      <Route
        path="/dash"
        element={
          <ProtectedRoute>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/academic-admins"
        element={
          <ProtectedRoute>
            <AcademicAdminsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CoursesManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <FinanceDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmincourses"
        element={
          <ProtectedRoute>
            <SuperAdminCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:id"
        element={
          <ProtectedRoute>
            <CourseDetail />
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
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Optional: Catch-all for unknown routes under super admin */}
      <Route path="*" element={<Navigate to="/dash" replace />} />
    </Routes>
  );
}