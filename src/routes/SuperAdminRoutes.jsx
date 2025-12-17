import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import AcademicAdminsPage from "../pages/superAdmin/AcademicAdminsPage";
import FinanceDashboard from "../pages/superAdmin/FinanceDashboard";
import CoursesManagementPage from "../pages/superAdmin/CourseManagementPage";
import AllCourses from "../pages/superAdmin/AllCourses";
import CourseDetail from "../pages/superAdmin/CourseDetails";
import SuperAdminLogin from "../pages/auth/superAdminLogin";
import MyProfile from "../pages/superAdmin/MyProfile";
import Settings from "../pages/superAdmin/SuperAdminSettings";

export default function SuperAdminRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<SuperAdminLogin />} />
      <Route path="/dash" element={<SuperAdminDashboard />} />
      <Route path="/academic-admins" element={<AcademicAdminsPage />} />
      <Route path="/courses" element={<CoursesManagementPage />} />
      <Route path="/finance" element={<FinanceDashboard />} />
      <Route path="/allcourses" element={<AllCourses />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
