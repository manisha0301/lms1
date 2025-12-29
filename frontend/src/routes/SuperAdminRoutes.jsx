// src/routes/SuperAdminRoutes.jsx (or wherever it is)
import { Routes, Route, Navigate } from "react-router-dom";
import { SuperAdminProtectedRoute } from "./ProtectedRoute"; // SuperAdmin-protected route component

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
          <SuperAdminProtectedRoute>
            <SuperAdminDashboard />
          </SuperAdminProtectedRoute>
        }
      />
      <Route
        path="/academic-admins"
        element={
          <SuperAdminProtectedRoute>
            <AcademicAdminsPage />
          </SuperAdminProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <SuperAdminProtectedRoute>
            <CoursesManagementPage />
          </SuperAdminProtectedRoute>
        }
      />
      <Route
        path="/finance"
        element={
          <SuperAdminProtectedRoute>
            <FinanceDashboard />
          </SuperAdminProtectedRoute>
        }
      />
      <Route
        path="/superadmincourses"
        element={
          <SuperAdminProtectedRoute>
            <SuperAdminCourses />
          </SuperAdminProtectedRoute>
        }
      />
      <Route
        path="/course/:id"
        element={
          <SuperAdminProtectedRoute>
            <CourseDetail />
          </SuperAdminProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <SuperAdminProtectedRoute>
            <MyProfile />
          </SuperAdminProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <SuperAdminProtectedRoute>
            <Settings />
          </SuperAdminProtectedRoute>
        }
      />

      {/* Optional: Catch-all for unknown routes under super admin */}
      <Route path="*" element={<Navigate to="/dash" replace />} />
    </Routes>
  );
}