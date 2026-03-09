import { BrowserRouter as Router } from "react-router-dom";
import StudentRoutes from "./routes/StudentRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AcademicRoutes from "./routes/AcademicRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
import { useMemo } from "react";
 
const DEV_PORT_MAP = {
  "5173": "student",
  "5174": "faculty",
  "5175": "academic",
  "5176": "admin",
  "5177": "superadmin",
};
 
function getSubdomain() {
  const hostname = window.location.hostname;
  const port = window.location.port;
 
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
 
  // 🔹 DEVELOPMENT MODE (localhost + ports)
  if (isLocalhost && port && DEV_PORT_MAP[port]) {
    return DEV_PORT_MAP[port];
  }
 
  // 🔹 PRODUCTION MODE (real subdomain)
  if (!isLocalhost) {
    const parts = hostname.split(".");
    if (parts.length > 2) {
      return parts[0]; // student.example.com → student
    }
  }
 
  // 🔹 Root domain fallback (example.com or localhost without port)
  return null;
}
 
export default function App() {
  const subdomain = useMemo(() => getSubdomain(), []);
 
  return (
<Router>
      {subdomain === "student" && <StudentRoutes />}
      {subdomain === "faculty" && <FacultyRoutes />}
      {subdomain === "admin" && <AdminRoutes />}
      {subdomain === "academic" && <AcademicRoutes />}
      {subdomain === "superadmin" && <SuperAdminRoutes />}
 
      {/* Root domain (example.com) */}
      {!subdomain && (
<div>
<h1>Welcome to HRMS</h1>
<p>Please access via your designated subdomain.</p>
</div>
      )}
</Router>
  );
}