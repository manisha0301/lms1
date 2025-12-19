import { Routes, Route, Navigate } from "react-router-dom";
import AcademicDashboard from "../pages/academic/AcademicDashboard";
import TotalCourses from "../pages/academic/TotalCourses";
import CentersManagement from "../pages/academic/CentersManagement";
import FacultiesManagement from "../pages/academic/FacultiesManagement";
import PendingApprovals from "../pages/academic/PendingApprovals";
import AcademicLogin from "../pages/auth/AcademicLogin";
import AcademicSettings from "../pages/academic/AcademicSettings";
import MyProfile from "../pages/academic/MyProfile";

export default function AcademicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<AcademicLogin />} />
      <Route path="/dash" element={<AcademicDashboard />} />
      <Route path="/totalcourses" element={<TotalCourses />} />
      <Route path="/centers" element={<CentersManagement />} />
      <Route path="/faculties" element={<FacultiesManagement />} />
      <Route path="/approvals" element={<PendingApprovals />} />
      <Route path="/settings" element={<AcademicSettings />} />
      <Route path="/profile" element={<MyProfile />} />
    </Routes>
  );
}
