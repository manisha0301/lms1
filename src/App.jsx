// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import FacultySignup from './pages/auth/FacultySignup';
import AcademicSignup from './pages/auth/AcademicSignup';
import VerifyOTP from './pages/auth/VerifyOTP';
import CoursesDashboard from './pages/student/CoursesDashboard';
import CourseDetail from './pages/student/CourseDetail';
import ProfileDashboard from './pages/student/ProfileDashboard';
import AcademicDashboard from './pages/academic/AcademicDashboard';
import TotalCourses from './pages/academic/TotalCourses';
import CentersManagement from './pages/academic/CentersManagement';
import FacultiesManagement from './pages/academic/FacultiesManagement';
import PendingApprovals from './pages/academic/PendingApprovals';
import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard';
import AcademicAdminsPage from './pages/superAdmin/AcademicAdminsPage';
import FinanceDashboard from './pages/superAdmin/FinanceDashboard';
import CoursesManagementPage from './pages/superAdmin/CourseManagementPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect from root '/' to '/login' */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/facultysignup" element={<FacultySignup />} />
        <Route path="/academicsignup" element={<AcademicSignup />} />
        <Route path="/otp" element={<VerifyOTP />} />
        <Route path="/student/dash" element={<CoursesDashboard />} />
        <Route path="/student/profile" element={<ProfileDashboard />} />
        <Route path="/student/course/:id" element={<CourseDetail />} />
        <Route path="/academic/dash" element={<AcademicDashboard />} />
        <Route path="/academic/totalcourses" element={<TotalCourses />} />
        <Route path="/academic/centers" element={<CentersManagement />} />
        <Route path="/academic/faculties" element={<FacultiesManagement />} />
        <Route path="/academic/approvals" element={<PendingApprovals />} />
        <Route path="/superadmin/dash" element={<SuperAdminDashboard />} />
        <Route path="/academic-admins" element={<AcademicAdminsPage />} />
        <Route path="/courses" element={<CoursesManagementPage />} />
        <Route path='/finance' element={<FinanceDashboard />} />
      </Routes>
    </Router>
  );
}