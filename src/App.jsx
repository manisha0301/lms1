import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentRoutes from "./routes/StudentRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AcademicRoutes from "./routes/AcademicRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
import FacultySignup from "./pages/auth/FacultySignup";
import AcademicSignup from "./pages/auth/AcademicSignup";
import VerifyOTP from "./pages/auth/VerifyOTP";
import VerifyEmailOTP from "./pages/auth/VerifyEmailOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";

import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Signup from "./pages/auth/Login";

export default function App() {
  const subdomain = window.location.hostname.split(".")[0];

  return (
    <Router>
      {subdomain === "student" && <StudentRoutes />}
      {subdomain === "faculty" && <FacultyRoutes />}
      {subdomain === "admin" && <AdminRoutes />}
      {subdomain === "academic" && <AcademicRoutes />}
      {subdomain === "superadmin" && <SuperAdminRoutes />}

      {/* fallback - root domain (homepage, landing, marketing site) */}
      {(subdomain !== "student" &&
        subdomain !== "faculty" &&
        subdomain !== "admin" &&
        subdomain !== "academic" &&
        subdomain !== "superadmin") && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/facultysignup" element={<FacultySignup />} />
        <Route path="/academicsignup" element={<AcademicSignup />} />
        <Route path="/otp" element={<VerifyOTP />} />
        <Route path="/verify-email-otp"element={<VerifyEmailOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      )}
    </Router>
  );
}

// src/App.jsx
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/auth/Login';
// import Signup from './pages/auth/Signup';
// import Home from './pages/Home';
// import FacultySignup from './pages/auth/FacultySignup';
// import AcademicSignup from './pages/auth/AcademicSignup';
// import VerifyOTP from './pages/auth/VerifyOTP';
// import CoursesDashboard from './pages/student/CoursesDashboard';
// import CourseDetail from './pages/student/CourseDetail';
// import ProfileDashboard from './pages/student/ProfileDashboard';
// import FacultyHome from './pages/faculty/FacultyHome';
// import CourseDetailsFaculty from './pages/faculty/CourseDetailsFaculty';
// import ExamManagement from './pages/faculty/ExamManagement';
// import AssignmentManagement from './pages/faculty/AssignmentManagement';
// import FacultyProfile from './pages/faculty/FacultyProfile';
// import AdminLogin from './pages/auth/AdminLogin';
// import ForgotPassword from './pages/auth/ForgotPassword';
// import VerifyEmailOTP from './pages/auth/VerifyEmailOTP';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import ViewStudentDetails from './pages/admin/ViewStudentDetails';  
// import FacultyManagement from './pages/admin/FacultyManagement';
// import AcademicManagement from './pages/admin/AcademicManagement';
// import CoursesManagement from './pages/admin/CoursesManagement';
// import CourseDetailsAdmin from './pages/admin/CourseDetailsAdmin';
// import SettingsAdmin from './pages/admin/SettingsAdmin';
// import AllCourses from './pages/student/AllCourses';
// import AcademicDashboard from './pages/academic/AcademicDashboard';
// import TotalCourses from './pages/academic/TotalCourses';
// import CentersManagement from './pages/academic/CentersManagement';
// import FacultiesManagement from './pages/academic/FacultiesManagement';
// import PendingApprovals from './pages/academic/PendingApprovals';
// import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard';
// import AcademicAdminsPage from './pages/superAdmin/AcademicAdminsPage';
// import FinanceDashboard from './pages/superAdmin/FinanceDashboard';
// import CoursesManagementPage from './pages/superAdmin/CourseManagementPage';

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Redirect from root '/' to '/home' */}
//         <Route path="/" element={<Navigate to="/home" replace />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/facultysignup" element={<FacultySignup />} />
//         <Route path="/academicsignup" element={<AcademicSignup />} />
//         <Route path="/otp" element={<VerifyOTP />} />
//         <Route path="/verify-email-otp"element={<VerifyEmailOTP />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         {/* Student Routes */}
//         <Route path="/student/courses" element={<AllCourses />} />
//         <Route path="/student/dash" element={<CoursesDashboard />} />
//         <Route path="/student/profile" element={<ProfileDashboard />} />
//         <Route path="/student/course/:id" element={<CourseDetail />} />
//         {/* Faculty Routes */}
//         <Route path="/faculty/home" element={<FacultyHome />} />
//         <Route path="/faculty/course/:id" element={<CourseDetailsFaculty />} />
//         <Route path="/faculty/exams" element={<ExamManagement />} />
//         <Route path="/faculty/assignments" element={<AssignmentManagement />} />
//         <Route path="/faculty/profile" element={<FacultyProfile />} />
//         {/* Admin Routes */}
//         <Route path="/Adminlogin" element={<AdminLogin />} />
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         <Route path="/admin/students" element={<ViewStudentDetails />} />
//         <Route path="/admin/faculty" element={<FacultyManagement />} />
//         <Route path="/admin/academics" element={<AcademicManagement />} />
//         <Route path="/admin/courses" element={<CoursesManagement />} />
//         <Route path="/admin/course/:id" element={<CourseDetailsAdmin />} />
//         <Route path="/admin/settings" element={<SettingsAdmin />} />
//         {/* Academic Admin Routes */}
//         <Route path="/academic/dash" element={<AcademicDashboard />} />
//         <Route path="/academic/totalcourses" element={<TotalCourses />} />
//         <Route path="/academic/centers" element={<CentersManagement />} />
//         <Route path="/academic/faculties" element={<FacultiesManagement />} />
//         <Route path="/academic/approvals" element={<PendingApprovals />} />
//         {/* Super Admin Routes */}
//         <Route path="/superadmin/dash" element={<SuperAdminDashboard />} />
//         <Route path="/academic-admins" element={<AcademicAdminsPage />} />
//         <Route path="/courses" element={<CoursesManagementPage />} />
//         <Route path='/finance' element={<FinanceDashboard />} />
//       </Routes>
//     </Router>
//   );
// }