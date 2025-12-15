// src/pages/admin/ViewStudentDetails.jsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  University,
  User,
  Loader2,
  MessageSquare,
  Download,
  Calendar,
  MapPin,
  GraduationCap,
  Clock,
  FileText,
  Link,
} from "lucide-react";

const ViewStudentDetails = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStudent({
        fullName: "Priya Sharma",
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.sharma@student.dtu.ac.in",
        mobile: "+91 98765 43210",
        university: "Delhi Technological University",
        address: "New Delhi, India",
        studentId: "STU-2025-4872",
        enrollmentDate: "15 Aug 2025",
        course: "Full Stack MERN Development",
        batch: "Weekend Batch - Nov 2025",
        status: "active",
        appliedOn: "15 Aug 2025",
        bio: "Passionate computer science student at DTU with strong foundation in JavaScript, React, and Node.js. Actively contributing to open-source projects and building full-stack applications. Seeking mentorship and real-world experience through Cybernetics LMS.",
        linkedin: "https://linkedin.com/in/priyasharma",
        github: "https://github.com/priyasharma",
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#1e3a8a] animate-spin mx-auto mb-6" />
          <p className="text-xl text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => window.history.back()}
              className="p-3 hover:bg-white/10 rounded-xl transition group"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Student Profile</h1>
              <p className="opacity-90 mt-1">Complete academic and enrollment details</p>
            </div>
          </div>
          <div className="text-sm opacity-90">
            ID: <span className="font-bold">{student.studentId}</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-8 py-2">

        {/* Main Profile Card - Same Design as Faculty Approval Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-10">

              {/* Left: Photo + Status */}
              <div className="text-center flex-shrink-0">
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-6xl font-black shadow-2xl ring-8 ring-blue-50">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <p className="mt-6 text-sm font-medium text-orange-600 flex items-center gap-2 justify-center">
                  <Clock className="w-5 h-5" />
                  Enrolled on {student.enrollmentDate}
                </p>

                <span className={`mt-6 inline-block px-6 py-3 rounded-full text-sm font-bold ${
                  student.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {student.status === "active" ? "ACTIVE STUDENT" : "PENDING"}
                </span>
              </div>

              {/* Right: Details */}
              <div className="flex-1 space-y-8">

                {/* Name + Course */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">{student.fullName}</h3>
                    <p className="text-lg text-[#1e3a8a] font-semibold mt-2">{student.course}</p>
                    <p className="text-md text-gray-600">{student.batch}</p>
                  </div>
                </div>

                {/* Contact & Academic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-[#1e3a8a]" />
                    <span className="font-medium">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-[#1e3a8a]" />
                    <span className="font-medium">{student.mobile}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <University className="w-6 h-6 text-[#1e3a8a]" />
                    <span className="font-medium">{student.university}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="w-ml-1 w-7 h-7 text-[#1e3a8a]" />
                    <span className="font-medium">{student.address}</span>
                  </div>
                </div>

                {/* Bio / Short Summary */}
                <div className="pt-6 border-t-2 border-dashed border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                    <FileText className="w-6 h-6 text-[#1e3a8a]" />
                    About Student
                  </h4>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl text-base">
                    {student.bio}
                  </p>
                </div>


                {/* Action Buttons */}
                <div className="flex justify-end gap-5 pt-8 border-t-2 border-gray-200">
                  <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition">
                    View Attendance
                  </button>
                  <button className="px-10 py-4 bg-[#1e3a8a] text-white rounded-xl hover:bg-blue-800 font-bold shadow-lg flex items-center gap-3 transition hover:scale-105">
                    <MessageSquare className="w-6 h-6" />
                    Send Message
                  </button>
                  <button className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-3 transition hover:scale-105">
                    <Download className="w-6 h-6" />
                    Download Report
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewStudentDetails;