// src/pages/student/AllCourses.jsx
import React, { useEffect, useState } from "react";
import { Search, Clock, IndianRupee, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import apiConfig from '../../config/apiConfig.js';

const AllCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${apiConfig.API_BASE_URL}/api/public/courses`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setCourses(data.courses || []);
        } else {
          console.warn("API returned success: false", data);
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      (course.title || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDuration =
      durationFilter === "all" ||
      String(course.duration || "")
        .toLowerCase()
        .includes(durationFilter.toLowerCase());

    const price = Number(course.price) || 0;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "under20" && price < 20000) ||
      (priceFilter === "20to30" && price >= 20000 && price <= 30000) ||
      (priceFilter === "above30" && price > 30000);

    return matchesSearch && matchesDuration && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="mx-auto px-6">
          <h1 className="text-3xl font-semibold">All Courses</h1>
          <p className="mt-2 text-blue-100">
            Explore job-oriented technical programs with live training and placement support
          </p>
        </div>
      </div>

      <div className="mx-auto px-6 py-10">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by course or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition"
              />
            </div>

            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af]"
            >
              <option value="all">All Durations</option>
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="4">4 Months</option>
              <option value="5">5 Months</option>
              <option value="6">6+ Months</option>
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af]"
            >
              <option value="all">All Prices</option>
              <option value="under20">Under ₹20,000</option>
              <option value="20to30">₹20,000 - ₹30,000</option>
              <option value="above30">Above ₹30,000</option>
            </select>

            <button className="bg-[#1e40af] text-white px-6 py-3 rounded-md hover:bg-[#1e3a8a] transition flex items-center justify-center gap-2 font-medium cursor-pointer">
              <Filter className="w-4 h-4" /> Apply Filters
            </button>
          </div>
        </div>

        {/* Course Grid */}
        {loading && (
          <div className="text-center py-20 text-gray-500">Loading courses...</div>
        )}

        {!loading && (
          <>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course._id || course.id || Math.random()}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
                  >
                    <div className="h-48 border-b border-gray-200 relative overflow-hidden">
                      <img
                        src={
                          course.thumbnail
                            ? `${apiConfig.API_BASE_URL}/uploads/${course.thumbnail}`
                            : "https://via.placeholder.com/400x200?text=Course+Image"
                        }
                        alt={course.title || "Course"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded">
                        {course.is_live ? "LIVE" : "SELF-PACED"}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {course.title || "Untitled Course"}
                      </h3>

                      {/* Removed: instructor name line */}

                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration || "—"}</span>
                        </div>
                        {/* Removed: Calendar + batch_start_date */}
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-xl font-bold text-[#1e40af]">
                            <IndianRupee className="w-5 h-5" />
                            {(Number(course.price) || 0).toLocaleString()}
                          </div>
                          {course.original_price && (
                            <del className="text-xs text-gray-500">
                              ₹{Number(course.original_price).toLocaleString()}
                            </del>
                          )}
                        </div>
                        <Link
                          to={`/courses/${course._id || course.id}/overview`}
                          className="bg-[#1e40af] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#1e3a8a] transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  {searchTerm || durationFilter !== "all" || priceFilter !== "all"
                    ? "No courses match your filters."
                    : "No courses available at the moment."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllCourses;