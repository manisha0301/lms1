// src/pages/admin/TotalStudents.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Mail,
  Phone,
  Calendar,
  Filter,
  ChevronRight,
  Building2,
  GraduationCap,
} from "lucide-react";

const TotalStudents = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedCenter, setSelectedCenter] = useState("all");

  // Mock Students Data
  const students = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya.sharma@student.dtu.ac.in",
      mobile: "+91 98765 43210",
      university: "Delhi Technological University",
      course: "Full Stack MERN Development",
      batch: "Weekend Batch - Nov 2025",
      center: "Delhi NCR",
      enrollmentDate: "15 Aug 2025",
      status: "active",
    },
    {
      id: 2,
      name: "Rahul Verma",
      email: "rahul.v@nitk.edu.in",
      mobile: "+91 87654 32109",
      university: "NIT Kurukshetra",
      course: "Data Science with Python",
      batch: "Full-Time - Oct 2025",
      center: "Bangalore Tech Hub",
      enrollmentDate: "02 Oct 2025",
      status: "active",
    },
    {
      id: 3,
      name: "Ananya Reddy",
      email: "ananya.r@vit.ac.in",
      mobile: "+91 76543 21098",
      university: "VIT Vellore",
      course: "React Native Masterclass",
      batch: "Part-Time - Sep 2025",
      center: "Hyderabad",
      enrollmentDate: "10 Sep 2025",
      status: "active",
    },
    {
      id: 4,
      name: "Vikram Singh",
      email: "vikram.s@iitb.ac.in",
      mobile: "+91 65432 10987",
      university: "IIT Bombay",
      course: "Ethical Hacking Pro",
      batch: "Weekend Batch - Dec 2025",
      center: "Mumbai Main Campus",
      enrollmentDate: "01 Dec 2025",
      status: "pending",
    },
  ];


  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold">Total Students</h1>
          <p className="opacity-90 mt-1">
            Manage and view all enrolled students across centers
          </p>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-8 py-4">

        {/* Search & Filters */}
        <div className="bg-white py-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-2 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition text-lg"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition"
              >
                <option value="all">All Centers</option>
                <option>Mumbai Main Campus</option>
                <option>Delhi NCR</option>
                <option>Bangalore Tech Hub</option>
                <option>Hyderabad</option>
              </select>

              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition"
              >
                <option value="all">All Batches</option>
                <option>Weekend Batch</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => navigate(`/students/${student.id}`)} // Opens ViewStudentDetails
              className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {student.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    student.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {student.status === "active" ? "Active" : "Pending"}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1e3a8a] transition">
                {student.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{student.course}</p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{student.mobile}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span>{student.center}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {student.enrollmentDate}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-[#1e3a8a] font-bold">
                <span>View Full Profile</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition" />
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No students found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalStudents;