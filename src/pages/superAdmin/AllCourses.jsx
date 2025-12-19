// src/pages/student/AllCourses.jsx
import React, { useState } from "react";
import { Search, Clock, Users, Calendar, IndianRupee, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const AllCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    instructor: "",
    duration: "",
    price: "",
    originalPrice: "",
    batch: "",
    live: true,
  });

  const initialCourses = [
    { id: 1, title: "Full Stack Web Development", instructor: "Er. Rajesh Kumar", duration: "6 Months", students: 2847, price: 24999, originalPrice: 49999, batch: "15 Jan 2026", live: true },
    { id: 2, title: "Data Science & Machine Learning", instructor: "Dr. Priya Sharma", duration: "8 Months", students: 1892, price: 34999, originalPrice: 69999, batch: "01 Feb 2026", live: true },
    { id: 3, title: "MERN Stack Developer", instructor: "Aman Singh", duration: "5 Months", students: 3201, price: 19999, originalPrice: 39999, batch: "10 Jan 2026", live: true },
    { id: 4, title: "Python Django + React", instructor: "Sachin Patel", duration: "4 Months", students: 1567, price: 17999, originalPrice: 35999, batch: "20 Jan 2026", live: false },
    { id: 5, title: "Java Full Stack with Spring Boot", instructor: "Neha Gupta", duration: "7 Months", students: 987, price: 29999, originalPrice: 59999, batch: "05 Feb 2026", live: true },
    { id: 6, title: "UI/UX Design Professional", instructor: "Rohan Mehta", duration: "3 Months", students: 2103, price: 14999, originalPrice: 29999, batch: "18 Jan 2026", live: true },
  ];

  const [courses, setCourses] = useState(initialCourses);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDuration = durationFilter === "all" || course.duration.includes(durationFilter);
    const matchesPrice = priceFilter === "all" ||
      (priceFilter === "under20" && course.price < 20000) ||
      (priceFilter === "20to30" && course.price >= 20000 && course.price <= 30000) ||
      (priceFilter === "above30" && course.price > 30000);
    return matchesSearch && matchesDuration && matchesPrice;
  });

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.instructor || !newCourse.duration || !newCourse.price || !newCourse.batch) {
      alert("Please fill in all required fields.");
      return;
    }

    const price = parseInt(newCourse.price);
    const originalPrice = newCourse.originalPrice ? parseInt(newCourse.originalPrice) : Math.round(price * 2);

    const courseToAdd = {
      id: Date.now(), // Unique ID
      title: newCourse.title,
      instructor: newCourse.instructor,
      duration: newCourse.duration,
      students: 0, // New course starts with 0
      price,
      originalPrice,
      batch: newCourse.batch,
      live: newCourse.live,
    };

    setCourses(prev => [...prev, courseToAdd]);

    // Reset and close modal
    setNewCourse({
      title: "",
      instructor: "",
      duration: "",
      price: "",
      originalPrice: "",
      batch: "",
      live: true,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-[#1e3a8a] text-white py-6">
        <div className="mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold">All Courses</h1>
              <p className="mt-2 text-blue-100">Explore job-oriented technical programs with live training and placement support</p>
            </div>

            {/* Add New Course Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-white text-[#1e40af] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add New Course
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-10">

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
              <div className="h-48 bg-gray-200 border-b border-gray-200 relative">
                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded">
                  {course.live ? "LIVE" : "SELF-PACED"}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{course.title}</h3>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xl font-bold text-[#1e40af]">
                      <IndianRupee className="w-5 h-5" />
                      {course.price.toLocaleString()}
                    </div>
                    <del className="text-xs text-gray-500">₹{course.originalPrice.toLocaleString()}</del>
                  </div>
                  <Link
                    to={`/course/${course.id}`}
                    className="bg-[#1e40af] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#1e3a8a] transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourses;