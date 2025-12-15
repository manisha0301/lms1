import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ViewStudentDetails from "../pages/admin/ViewStudentDetails";
import FacultyManagement from "../pages/admin/FacultyManagement";
import AcademicManagement from "../pages/admin/AcademicManagement";
import CoursesManagement from "../pages/admin/CoursesManagement";
import CourseDetailsAdmin from "../pages/admin/CourseDetailsAdmin";
import SettingsAdmin from "../pages/admin/SettingsAdmin";
import AdminLogin from "../pages/auth/AdminLogin";
import TotalStudents from "../pages/admin/TotalStudents";

export default function AdminRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/students/:id" element={<ViewStudentDetails />} />
      <Route path="/students" element={<TotalStudents />} />
      <Route path="/faculty" element={<FacultyManagement />} />
      <Route path="/academics" element={<AcademicManagement />} /> //Unknown route and Left
      <Route path="/courses" element={<CoursesManagement />} />
      <Route path="/course/:id" element={<CourseDetailsAdmin />} /> 
      <Route path="/settings" element={<SettingsAdmin />} /> //Left
      //Revenue Route Needed and Left
    </Routes>
  );
}
