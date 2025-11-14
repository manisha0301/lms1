// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/Home';
import FacultySignup from './pages/auth/FacultySignup';
import AcademicSignup from './pages/auth/AcademicSignup';
import VerifyOTP from './pages/auth/VerifyOTP';
import CoursesDashboard from './pages/student/CoursesDashboard';

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
      </Routes>
    </Router>
  );
}