//frontend/ src/pages/admin/CoursesManagement.jsx
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Upload,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Link2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoursesManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalType, setModalType] = useState("");

  const [courses, setCourses] = useState([]);
  const [activeFaculties, setActiveFaculties] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]); // for edit modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login again");
          navigate("/login");
          return;
        }

        // Fetch courses
        const res = await fetch("http://localhost:5000/api/auth/admin/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.success) {
          // Use real data 
          setCourses(data.courses.map(course => ({
            id: course.id,
            name: course.name || "Untitled Course",
            price: course.price || 0,
            description: course.description || "No description available.",
            type: course.type || "Live",
            teachers: course.teachers || [], 
            batch: course.batches?.[0] || {
              startDate: "2025-01-10",
              endDate: "2025-04-10",
              startTime: "07:00 PM",
              endTime: "09:00 PM"
            },
            addedToday: false 
          })));
        } else {
          setCourses([]);
        }

        // Fetch active faculties
        const facultyRes = await fetch("http://localhost:5000/api/auth/admin/faculty", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const facultyData = await facultyRes.json();
        if (facultyData.success) {
          setActiveFaculties(facultyData.faculties || []);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
      }
    };

    fetchData();
  }, [navigate]);

  const todayAdded = courses.filter(c => c.addedToday).length;
  const filtered = courses.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Helper to get faculty name from ID
  const getFacultyName = (id) => {
    const faculty = activeFaculties.find(f => f.id === id);
    return faculty ? faculty.name : "Unknown Faculty";
  };

  const openModal = (type, course = null) => {
    setSelectedCourse(course);
    setModalType(type);
    setIsModalOpen(true);

    if (type === "edit" && course) {
      setSelectedTeachers(course.teachers || []);
    } else {
      setSelectedTeachers([]);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setModalType("");
    setSelectedTeachers([]);
  };

  // Save teachers
  const handleSaveTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/auth/admin/courses/${selectedCourse.id}/teachers`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ teacherIds: selectedTeachers })
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setCourses(prev => prev.map(c => 
          c.id === selectedCourse.id 
            ? { ...c, teachers: selectedTeachers }
            : c
        ));
        closeModal();
        alert("Teachers assigned successfully!");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to save teachers");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="mx-auto px-6 flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold">Courses Management</h1>
            <p className="mt-2 text-blue-100">Create, edit and manage all courses beautifully</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
              <p className="text-3xl font-bold text-gray-800">{courses.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Courses</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
              <p className="text-3xl font-bold text-green-400">{todayAdded}</p>
              <p className="text-sm text-gray-600 mt-1">Added Today</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
              <p className="text-3xl font-bold text-indigo-600">
                {courses.filter(c => c.type === "Live").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Live Now</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-10">
        {/* Search */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition text-lg"
            />
          </div>

          <button
            onClick={() => openModal("add")}
            className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Add New Course
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-2xl text-gray-600">No courses assigned yet</p>
            </div>
          ) : (
            filtered.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="bg-[#1e3a8a] text-white p-6">
                  <h2 className="text-2xl font-bold">{course.name}</h2>
                  <p className="text-sm opacity-90 mt-1">{course.type}</p>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-lg font-bold text-gray-900">₹{Math.trunc(course.price).toLocaleString()}</p>
                  <p className="text-gray-600 line-clamp-1">{course.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    {course.teachers.length > 0 
                      ? course.teachers.map(getFacultyName).join(", ")
                      : "No faculty assigned"
                    }
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {course.batch.startDate} - {course.batch.endDate}
                  </div>
                </div>
                <div className="flex justify-end gap-4 px-6 pb-6">
                  <button 
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition"
                  >
                    <Eye className="w-5 h-5 text-[#1e3a8a]" />
                  </button>
                  <button onClick={() => openModal("edit", course)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                    <Edit className="w-5 h-5 text-emerald-600" />
                  </button>
                  <button onClick={() => openModal("delete", course)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        {isModalOpen && modalType === "edit" && selectedCourse && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold">Edit Course</h2>
                <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-xl transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Image</label>
                  <div className="relative w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer">
                    <img src="https://via.placeholder.com/600" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Weekend Batch</option>
                      <option>Self-Paced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course Price (₹)</label>
                    <input type="number" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class Meeting Link</label>
                    <input type="url" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>

                {/* Assign Teachers — DYNAMIC, ONLY NAMES, SAME UI */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Assign Teachers</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {activeFaculties.length === 0 ? (
                      <p className="col-span-full text-gray-500 text-center py-4">No active faculties available</p>
                    ) : (
                      activeFaculties.map((faculty) => (
                        <div key={faculty.id} className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            id={`teacher-${faculty.id}`} 
                            checked={selectedTeachers.includes(faculty.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTeachers(prev => [...prev, faculty.id]);
                              } else {
                                setSelectedTeachers(prev => prev.filter(id => id !== faculty.id));
                              }
                            }}
                            className="w-5 h-5 border-gray-300 rounded" 
                          />
                          <label 
                            htmlFor={`teacher-${faculty.id}`} 
                            className="text-gray-700 cursor-pointer"
                          >
                            {faculty.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Batch Schedule */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" /> Batch Schedule
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label><input type="date" className="w-full px-3 py-2 border rounded-lg cursor-pointer" /></div>
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">End Date</label><input type="date" className="w-full px-3 py-2 border rounded-lg cursor-pointer" /></div>
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label><input type="time" className="w-full px-3 py-2 border rounded-lg cursor-pointer" /></div>
                    <div><label className="block text-xs font-medium text-gray-600 mb-1">End Time</label><input type="time" className="w-full px-3 py-2 border rounded-lg cursor-pointer" /></div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Description</label>
                  <textarea rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t pt-6">
                  <button onClick={closeModal} className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveTeachers}
                    className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {modalType === "view" && selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Course Details</h2>
                <button onClick={closeModal} className="hover:bg-white/20 p-1 rounded">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <img src="https://via.placeholder.com/600" alt="" className="w-full h-64 object-cover rounded-2xl" />
                <h3 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h3>
                <p className="text-gray-600">{selectedCourse.description}</p>
                <div className="space-y-3 text-base">
                  <div className="flex justify-between"><strong>Type:</strong> <span>{selectedCourse.type}</span></div>
                  <div className="flex justify-between"><strong>Price:</strong> <span>₹{selectedCourse.price}</span></div>
                  <div className="flex justify-between"><strong>Teachers:</strong> <span>{selectedCourse.teachers.join(", ")}</span></div>
                  <div className="flex justify-between"><strong>Batch:</strong> <span>{selectedCourse.batch.startDate} to {selectedCourse.batch.endDate}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {modalType === "delete" && selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Delete Course</h2>
                <button onClick={closeModal} className="hover:bg-white/20 p-1 rounded">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-14 h-14 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Delete Course Permanently?</h3>
                <p className="text-gray-600 leading-relaxed">
                  You are about to delete <span className="font-bold text-red-600">"{selectedCourse.name}"</span>.<br />
                  This will remove the course, all enrolled students, materials, and records.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                  <p className="text-sm font-medium text-red-700">
                    This action <strong>cannot be undone</strong>.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Delete logic
                      closeModal();
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    Yes, Delete Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesManagement;