import { Routes, Route } from "react-router-dom";
import AcademicDashboard from "../pages/academic/AcademicDashboard";
import TotalCourses from "../pages/academic/TotalCourses";
import CentersManagement from "../pages/academic/CentersManagement";
import FacultiesManagement from "../pages/academic/FacultiesManagement";
import PendingApprovals from "../pages/academic/PendingApprovals";

export default function AcademicRoutes() {
  return (
    <Routes>
      //Login
      <Route path="/dash" element={<AcademicDashboard />} />
      <Route path="/totalcourses" element={<TotalCourses />} />
      <Route path="/centers" element={<CentersManagement />} />
      <Route path="/faculties" element={<FacultiesManagement />} />
      <Route path="/approvals" element={<PendingApprovals />} />
      //Settings Route Needed
    </Routes>
  );
}
