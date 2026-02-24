import { Routes, Route, Navigate } from "react-router-dom";
import AllCourses from "../pages/student/AllCourses";
import CoursesDashboard from "../pages/student/CoursesDashboard";
import ProfileDashboard from "../pages/student/ProfileDashboard";
import CourseDetail from "../pages/student/CourseDetail";
import Login from "../pages/auth/Login";
import Home from "../pages/Home";
import Signup from "../pages/auth/Signup";
import StudentSettings from "../pages/student/StudentSettings";
import VerifyEmailOTP from "../pages/auth/VerifyEmailOTP"; 
import OTPVerification from "../pages/auth/VerifyOTP";
import Terms from "../pages/legal/terms";
import Privacy from "../pages/legal/privacy";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email-otp" element={<VerifyEmailOTP />} />
      <Route path="/verify-phone-otp" element={<OTPVerification />} />

      <Route path="/courses" element={<AllCourses />} />
      <Route path="/dash" element={<CoursesDashboard />} />
      <Route path="/profile" element={<ProfileDashboard />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/settings" element={<StudentSettings />} />
        //Assignment Route Needed
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  );
}