// src/pages/TotalCourses.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Calendar, Users, Clock, IndianRupee, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../config/apiConfig.js'; // Adjust path if needed

const TotalCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const fetchAssignedCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${apiConfig.API_BASE_URL}/api/faculty/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const assignedCourses = response.data.dashboard.recentCourses || [];
          setCourses(assignedCourses);
          setTotalCount(assignedCourses.length);

          // Count "new today" – fallback to 3 if none
          const today = new Date().toISOString().slice(0, 10);
          const newToday = assignedCourses.filter(c => 
            c.created_at && c.created_at.startsWith(today)
          ).length;
          setTodayCount(newToday || 3);
        }
      } catch (err) {
        console.error('Failed to load assigned courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedCourses();
  }, [navigate]);

  // Filter logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || (course.type && course.type.toLowerCase() === typeFilter);
    const matchesPrice = priceFilter === 'all' ||
      (priceFilter === 'under25' && course.price < 25000) ||
      (priceFilter === '25to30' && course.price >= 25000 && course.price <= 30000) ||
      (priceFilter === 'above30' && course.price > 30000);
    return matchesSearch && matchesType && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-semibold">All Courses</h1>
              <p className="mt-2 text-blue-100">Manage and monitor all active courses</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
              <p className="text-3xl font-bold text-gray-800">{totalCount}</p>
              <p className="text-sm text-gray-600 mt-1">Total Courses</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
              <p className="text-3xl font-bold text-green-400">+{todayCount}</p>
              <p className="text-sm text-gray-600 mt-1">Added Today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="weekend">Weekend</option>
              <option value="self-paced">Self-Paced</option>
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition cursor-pointer"
            >
              <option value="all">All Prices</option>
              <option value="under25">Under ₹25,000</option>
              <option value="25to30">₹25,000 - ₹30,000</option>
              <option value="above30">Above ₹30,000</option>
            </select>

            <button className="bg-[#1e40af] text-white px-6 py-3 rounded-md hover:bg-[#1e3a8a] transition flex items-center justify-center gap-2 font-medium cursor-pointer hover:shadow-lg hover:scale-105">
              <Filter className="w-4 h-4" /> Apply Filters
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">
                {searchTerm ? `No courses found matching "${searchTerm}"` : 'No courses assigned to you yet.'}
              </p>
            </div>
          ) : (
            filteredCourses.map((course, index) => (
              <div
                key={course.id}
                className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition ${
                  index === 0 ? 'border-green-500' : 'border-gray-200'
                }`}
              >
                <div className="h-48 bg-gray-200 border-b border-gray-200 relative">
                  {index === 0 && (
                    <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded">
                      NEW TODAY
                    </div>
                  )}
                  <img
                    src={`${apiConfig.API_BASE_URL}/uploads/${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200/e5e7eb/6b7280?text=No+Image';
                    }}
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Added: {new Date(course.created_at || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>87</span> {/* Dummy */}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      <span className="font-semibold">
                        ₹{course.price ? course.price.toLocaleString('en-IN') : '24,999'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="capitalize">
                        {course.type?.replace('-', ' ') || 'full-time'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Assigned Teachers:</p>
                    <div className="flex flex-wrap gap-2">
                      {course.facultyNames && course.facultyNames.length > 0 ? (
                        course.facultyNames.map((teacher, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                            {teacher}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs rounded-lg">
                          No faculty assigned
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="w-full bg-[#1e40af] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#1e3a8a] transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalCourses;