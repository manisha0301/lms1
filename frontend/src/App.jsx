import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentRoutes from "./routes/StudentRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import AcademicRoutes from "./routes/AcademicRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

import { useEffect } from "react";

function RedirectToSubdomain() {
  useEffect(() => {
    const hostname = window.location.hostname;
    const port = window.location.port;

    // Map specific ports to subdomains when not using DNS-based subdomains.
    const portMap = {
      "5173": "student",
      "5174": "faculty",
      "5175": "academic",
      "5176": "admin",
      "5177": "superadmin",
    };

    // Determine the desired subdomain either from the hostname or the port.
    let desired = null;
    if (port && portMap[port]) {
      desired = portMap[port];
    } else if (hostname) {
      const parts = hostname.split(".");
      if (parts.length > 1) {
        desired = parts[0];
      }
    }

    // nothing to do if we're already on the correct subdomain
    if (!desired || hostname.startsWith(desired)) return;

    const portPart = port ? `:${port}` : "";
    let targetHostname;

    // localhost / IP special handling: simply prepend the subdomain as a prefix
    if (hostname === "localhost" || hostname === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      targetHostname = `${desired}.${hostname}`;
    } else {
      targetHostname = `${desired}.${hostname}`;
    }

    const target = `${window.location.protocol}//${targetHostname}${portPart}/`;
    window.location.replace(target);
  }, []);
  return null;
}

export default function App() {
  // Determine subdomain based on hostname or port
  const hostname = window.location.hostname;
  const port = window.location.port;

  // ports are used for development to route directly to the desired subdomain
  const portMap = {
    "5173": "student",
    "5174": "faculty",
    "5175": "academic",
    "5176": "admin",
    "5177": "superadmin",
  };

  let subdomain = "";
  if (port && portMap[port]) {
    subdomain = portMap[port];
  } else if (hostname) {
    if (hostname === "localhost" || hostname === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      // default to student when no explicit subdomain is present
      subdomain = "student";
    } else {
      subdomain = hostname.split(".")[0];
    }
  }

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
          <Route path="/" element={<RedirectToSubdomain />} />
          <Route path="*" element={<RedirectToSubdomain />} />
        </Routes>
      )}
    </Router>
  );
}
