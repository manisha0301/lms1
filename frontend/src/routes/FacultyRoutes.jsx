import { Routes, Route, Navigate } from "react-router-dom";
import FacultyHome from "../pages/faculty/FacultyHome";
import CourseDetailsFaculty from "../pages/faculty/CourseDetailsFaculty";
import ExamManagement from "../pages/faculty/ExamManagement";
import AssignmentManagement from "../pages/faculty/AssignmentManagement";
import FacultyProfile from "../pages/faculty/FacultyProfile";
import FacultySignup from "../pages/auth/FacultySignup";
import FacultyLogin from "../pages/faculty/FacultyLogin";
import TotalCourses from "../pages/faculty/TotalCourses";
import FacultySettings from "../pages/faculty/FacultySettings";
import VerifyEmailOTP from "../pages/auth/VerifyEmailOTP"; 
import OTPVerification from "../pages/auth/VerifyOTP";
import Terms from "../pages/legal/terms";
import Privacy from "../pages/legal/privacy";

export default function FacultyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<FacultyLogin />} />
      <Route path="/signup" element={<FacultySignup />} />

      {/* Email OTP Verification – public */}
      <Route path="/verify-email-otp" element={<VerifyEmailOTP />} />

      {/* Phone OTP Verification */}
      <Route path="/verify-phone-otp" element={<OTPVerification />} />

      {/* Faculty protected routes */}
      <Route path="/home" element={<FacultyHome />} />
      <Route path="/course/:id" element={<CourseDetailsFaculty />} />
      <Route path="/exams" element={<ExamManagement />} />
      <Route path="/assignments" element={<AssignmentManagement />} />
      <Route path="/profile" element={<FacultyProfile />} />
      <Route path="/totalcourses" element={<TotalCourses />} />
      <Route path="/settings" element={<FacultySettings />} />
      {/* Add Total Students Enrolled route when ready */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  );
}