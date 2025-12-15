import { Routes, Route, Navigate } from "react-router-dom";
import AllCourses from "../pages/student/AllCourses";
import CoursesDashboard from "../pages/student/CoursesDashboard";
import ProfileDashboard from "../pages/student/ProfileDashboard";
import CourseDetail from "../pages/student/CourseDetail";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import Signup from "../pages/auth/Signup";

export default function StudentRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      <Route path="/courses" element={<AllCourses />} />
      <Route path="/dash" element={<CoursesDashboard />} />
      <Route path="/profile" element={<ProfileDashboard />} />
      <Route path="/course/:id" element={<CourseDetail />} />
        //Settings Route Needed
        //Assignment Route Needed
    </Routes>
  );
}
