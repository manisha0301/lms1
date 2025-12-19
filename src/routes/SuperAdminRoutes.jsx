import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import AcademicAdminsPage from "../pages/superAdmin/AcademicAdminsPage";
import FinanceDashboard from "../pages/superAdmin/FinanceDashboard";
import CoursesManagementPage from "../pages/superAdmin/CourseManagementPage";
import SuperAdminCourses from "../pages/superAdmin/superAdminCourses";
import CourseDetail from "../pages/superAdmin/CourseDetails";
import SuperAdminLogin from "../pages/auth/SuperAdminLogin";

export default function SuperAdminRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<SuperAdminLogin />} />
      <Route path="/dash" element={<SuperAdminDashboard />} />
      <Route path="/academic-admins" element={<AcademicAdminsPage />} />
      <Route path="/courses" element={<CoursesManagementPage />} />
      <Route path="/finance" element={<FinanceDashboard />} />
      <Route path="/superadmincourses" element={<SuperAdminCourses />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      //Settings Route Needed
    </Routes>
  );
}
