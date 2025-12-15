import { Routes, Route, Navigate } from "react-router-dom";
import FacultyHome from "../pages/faculty/FacultyHome";
import CourseDetailsFaculty from "../pages/faculty/CourseDetailsFaculty";
import ExamManagement from "../pages/faculty/ExamManagement";
import AssignmentManagement from "../pages/faculty/AssignmentManagement";
import FacultyProfile from "../pages/faculty/FacultyProfile";
import FacultySignup from "../pages/auth/FacultySignup";
import FacultyLogin from "../pages/faculty/FacultyLogin";
import TotalCourses from "../pages/faculty/TotalCourses";

export default function FacultyRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<FacultyLogin />} />
        <Route path="/signup" element={<FacultySignup />} />
      <Route path="/home" element={<FacultyHome />} />
      <Route path="/course/:id" element={<CourseDetailsFaculty />} />
      <Route path="/exams" element={<ExamManagement />} /> 
      <Route path="/assignments" element={<AssignmentManagement />} /> 
      <Route path="/profile" element={<FacultyProfile />} />
      <Route path="/totalcourses" element={<TotalCourses />} />
      //Settings Route Needed
      //Total STudents Enrolled Route Needed
    </Routes>
  );
}
