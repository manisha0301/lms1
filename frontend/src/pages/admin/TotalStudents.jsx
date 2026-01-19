// src/pages/admin/TotalStudents.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Mail,
  Phone,
  Calendar,
  Filter,
  ChevronRight,
} from "lucide-react";
import axios from 'axios';
import apiConfig from '../../config/apiConfig';

const TotalStudents = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real students for this university
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token"); // or your admin token key
        const response = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/admin/university-students`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          setStudents(response.data.students || []);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students by search (client-side)
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="  mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold">Total Students</h1>
          <p className="opacity-90 mt-1">
            Manage and view all enrolled students across centers
          </p>
        </div>
      </header>

      <div className="mx-auto px-8 py-4">
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

            {/* Filters kept but disabled for now - only university data */}
            <div className="flex gap-4 opacity-50 pointer-events-none">
              <select className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-2xl">
                <option>All Centers</option>
              </select>
              <select className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-2xl">
                <option>All Batches</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No students found in your university.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/students/${student.id}`)}
                className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {student.name?.split(" ").map(n => n[0]).join("") || "S"}
                  </div>
                  {/* Status can be added later */}
                </div>

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1e3a8a] transition">
                  {student.name || "Unknown Student"}
                </h3>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{student.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {student.joined_at 
                      ? new Date(student.joined_at).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'short', year: 'numeric' 
                        }) 
                      : "N/A"}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-[#1e3a8a] font-bold">
                  <span>View Full Profile</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalStudents;