// src/pages/admin/ViewStudentDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Clock,
  MessageSquare,
  Download,
  Loader2,
  FileText,
} from "lucide-react";
import axios from 'axios';
import apiConfig from '../../config/apiConfig';

const ViewStudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/admin/students/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          const studentData = response.data.student;
          if (!studentData.bio) {
            studentData.bio = "Passionate computer science student at DTU with strong foundation in JavaScript, React, and Node.js. Actively contributing to open-source projects and building full-stack applications. Seeking mentorship and real-world experience through Cybernetics LMS.\n ";
          }
          setStudent(studentData);
        } else {
          setError(response.data.error || "Student not found");
        }
      } catch (err) {
        console.error("Failed to fetch student:", err);
        setError("Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

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

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">{error || "Student not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
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
            ID: <span className="font-bold">{student.student_id || "N/A"}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto px-8 py-2 pt-12">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-10">
              {/* Left: Initials + Status */}
              <div className="text-center flex-shrink-0">
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-6xl font-black shadow-2xl ring-8 ring-blue-50">
                  {student.first_name?.[0] || ""}{student.last_name?.[0] || ""}
                </div>

                {/* ACTIVE STUDENT badge */}
                <span className="mt-6 inline-block px-6 py-3 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700">
                  ACTIVE STUDENT
                </span>
              </div>

              {/* Right: Details */}
              <div className="flex-1 space-y-8">
                {/* Name + Course + Batch (mock for now) */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-lg text-[#1e3a8a] font-semibold mt-2">
                      Full Stack MERN Development
                    </p>
                    <p className="text-md text-gray-600">Weekend Batch - Nov 2025</p>
                  </div>
                </div>

                {/* Contact + University + Joined Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-[#1e3a8a]" />
                    <span className="font-medium">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-[#1e3a8a]" />
                    <span className="font-medium">{student.mobile_number}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <GraduationCap className="w-6 h-6 text-[#1e3a8a]" />
                    <span className="font-medium">{student.graduation_university || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="w-6 h-6 text-[#1e3a8a]" />
                    <span className="font-medium">
                      {student.created_at 
                        ? new Date(student.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })
                        : "N/A"}
                    </span>
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