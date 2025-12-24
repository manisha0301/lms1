// src/pages/superAdmin/SuperAdminCourses.jsx
import React, { useState } from "react";
import { Search, Clock, Users, Calendar, IndianRupee, Filter, Plus, X, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

const SuperAdminCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newCourse, setNewCourse] = useState({
    title: "",
    duration: "",
    price: "",
    originalPrice: "",
    thumbnail: null, // For file upload
    live: true,
  });

  const initialCourses = [
    { id: 1, title: "Full Stack Web Development", instructor: "Er. Rajesh Kumar", duration: "6 Months", students: 2847, price: 24999, originalPrice: 49999, live: true },
    { id: 2, title: "Data Science & Machine Learning", instructor: "Dr. Priya Sharma", duration: "8 Months", students: 1892, price: 34999, originalPrice: 69999, live: true },
    { id: 3, title: "MERN Stack Developer", instructor: "Aman Singh", duration: "5 Months", students: 3201, price: 19999, originalPrice: 39999, live: true },
    { id: 4, title: "Python Django + React", instructor: "Sachin Patel", duration: "4 Months", students: 1567, price: 17999, originalPrice: 35999, live: false },
    { id: 5, title: "Java Full Stack with Spring Boot", instructor: "Neha Gupta", duration: "7 Months", students: 987, price: 29999, originalPrice: 59999, live: true },
    { id: 6, title: "UI/UX Design Professional", instructor: "Rohan Mehta", duration: "3 Months", students: 2103, price: 14999, originalPrice: 29999, live: true },
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

  const handleAddCourse = async () => {
    // Validation
    if (!newCourse.title || !newCourse.duration || !newCourse.price) {
      alert("Please fill in all required fields marked with *");
      return;
    }

    const price = parseInt(newCourse.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const courseToAdd = {
      id: Date.now(),
      title: newCourse.title,
      instructor: "",
      description: "Comprehensive course with hands-on projects and live training.",
      duration: newCourse.duration,
      students: 0,
      price,
      originalPrice: newCourse.originalPrice ? parseInt(newCourse.originalPrice) : Math.round(price * 2),
      thumbnail: newCourse.thumbnail ? URL.createObjectURL(newCourse.thumbnail) : null,
      live: newCourse.live,
    };

    setCourses(prev => [...prev, courseToAdd]);

    // Reset form and close modal
    setNewCourse({
      title: "",
      duration: "",
      price: "",
      originalPrice: "",
      thumbnail: null,
      live: true,
    });
    setIsAddModalOpen(false);
    setIsSubmitting(false);
    
    alert("Course added successfully!");
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewCourse(prev => ({ ...prev, thumbnail: file }));
    } else {
      alert("Please select a valid image file");
    }
  };

  const removeThumbnail = () => {
    setNewCourse(prev => ({ ...prev, thumbnail: null }));
  };

  const isFormValid = newCourse.title && newCourse.duration && newCourse.price;

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
              className="bg-white text-[#1e40af] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition shadow-md hover:-translate-y-0.5 cursor-pointer"
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

      {/* ADD NEW COURSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isSubmitting && setIsAddModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Course</h2>
                  <p className="text-gray-600 mt-1">Create a new course with all necessary details</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewCourse({
                      title: "",
                      duration: "",
                      price: "",
                      originalPrice: "",
                      thumbnail: null,
                      live: true,
                    });
                  }}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition"
                    placeholder="e.g., Full Stack Web Development with React & Node.js"
                  />
                </div>


              </div>



              {/* Duration & Pricing */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition"
                    placeholder="e.g., 6 Months"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition"
                    placeholder="e.g., 24999"
                  />
                </div>
              </div>

              {/* Original Price & Live Toggle */}
              <div className="grid md:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newCourse.originalPrice}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition"
                    placeholder="Leave empty for auto-calculation (2x course price)"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newCourse.live}
                      onChange={(e) => setNewCourse(prev => ({ ...prev, live: e.target.checked }))}
                      className="w-5 h-5 text-[#1e40af] rounded focus:ring-[#1e40af]"
                    />
                    <span>Live Course (Real-time classes)</span>
                  </label>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#1e40af]" />
                  Course Thumbnail (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#1e40af] transition-colors cursor-pointer">
                  {newCourse.thumbnail ? (
                    <div className="space-y-3">
                      <img
                        src={URL.createObjectURL(newCourse.thumbnail)}
                        alt="Thumbnail preview"
                        className="w-32 h-32 object-cover mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600">{newCourse.thumbnail.name}</p>
                      <button
                        onClick={removeThumbnail}
                        className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-1">Drag & drop image</p>
                        <p className="text-sm text-gray-500 mb-4">or click to browse (JPG, PNG up to 5MB)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label
                          htmlFor="thumbnail-upload"
                          className="bg-[#1e40af] text-white px-6 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-[#1e3a8a] transition shadow-md inline-block"
                        >
                          Choose Image
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewCourse({
                    title: "",
                    duration: "",
                    price: "",
                    originalPrice: "",
                    thumbnail: null,
                    live: true,
                  });
                }}
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                disabled={!isFormValid || isSubmitting}
                className={`px-8 py-2.5 rounded-xl font-semibold text-white flex items-center gap-2 transition-all cursor-pointer ${
                  !isFormValid || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-[#1e40af] hover:bg-[#1e3a8a] shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminCourses;