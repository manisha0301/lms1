// src/pages/CoursesManagement.jsx
import React, { useState } from 'react';
import { ArrowLeft, Search, Edit2, Calendar, Users, Clock, IndianRupee, X, BookOpen, Upload, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseDetails from './CourseDetails';

const coursesData = [
  { id: 1, name: "Advanced React & Node.js", addedOn: "Nov 18, 2025", students: 87, price: 24999, type: "full-time", teachers: ["Dr. Priya Sharma", "Prof. Amit Kumar"], today: true },
  { id: 2, name: "Full Stack MERN Bootcamp", addedOn: "Nov 17, 2025", students: 102, price: 29999, type: "full-time", teachers: ["Prof. Amit Kumar"], today: false },
  { id: 3, name: "Data Science with Python", addedOn: "Nov 16, 2025", students: 65, price: 34999, type: "part-time", teachers: ["Mr. Rajesh Mehta"], today: false },
  { id: 4, name: "Python Django Full Course", addedOn: "Nov 15, 2025", students: 98, price: 22999, type: "weekend", teachers: ["Ms. Sneha Patel"], today: false },
  { id: 5, name: "React Native Mastery", addedOn: "Nov 18, 2025", students: 74, price: 27999, type: "full-time", teachers: ["Dr. Priya Sharma"], today: true },
  { id: 6, name: "UI/UX Design Pro", addedOn: "Nov 18, 2025", students: 120, price: 19999, type: "self-paced", teachers: ["Prof. Neha Gupta"], today: true },
];

const availableTeachers = [
  { id: 1, name: "Dr. Priya Sharma", subject: "React & Node.js" },
  { id: 2, name: "Prof. Amit Kumar", subject: "MERN Stack" },
  { id: 3, name: "Ms. Sneha Patel", subject: "Python & Django" },
  { id: 4, name: "Mr. Rajesh Mehta", subject: "Data Science" },
  { id: 5, name: "Prof. Neha Gupta", subject: "UI/UX Design" },
];

const TotalCourses = ({ onBack }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState(null);

  const todayCount = coursesData.filter(c => c.today).length;
  const totalCount = coursesData.length;

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // Goes back to previous page
    }
  };

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || course.type === typeFilter;
    const matchesPrice = priceFilter === "all" ||
      (priceFilter === "under25" && course.price < 25000) ||
      (priceFilter === "25to30" && course.price >= 25000 && course.price <= 30000) ||
      (priceFilter === "above30" && course.price > 30000);
    return matchesSearch && matchesType && matchesPrice;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditForm({ ...editForm, image: file, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setEditForm({
      ...course,
      selectedTeachers: course.teachers.map(t => availableTeachers.find(at => at.name === t)?.id || 1)
    });
    setImagePreview(course.imageUrl || null);
  };

  const toggleTeacher = (teacherId) => {
    setEditForm(prev => ({
      ...prev,
      selectedTeachers: prev.selectedTeachers.includes(teacherId)
        ? prev.selectedTeachers.filter(id => id !== teacherId)
        : [...prev.selectedTeachers, teacherId]
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Updated Course:", editForm);
    alert("Course updated successfully!");
    setSelectedCourse(null);
    setEditForm(null);
    setImagePreview(null);
  };

  return (
    <>
    {selectedCourseForDetails ? (
      <CourseDetails 
        course={selectedCourseForDetails} 
        onBack={() => setSelectedCourseForDetails(null)} 
      />
    ) : (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
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
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-lg shadow-sm border ${course.today ? 'border-green-500' : 'border-gray-200'} hover:shadow-md transition`}
            >
              <div className="h-48 bg-gray-200 border-b border-gray-200 relative">
                {course.today && (
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded">
                    NEW TODAY
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{course.name}</h3>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Added: {course.addedOn}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    <span className="font-semibold">₹{course.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="capitalize">{course.type.replace('-', ' ')}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Assigned Teachers:</p>
                  <div className="flex flex-wrap gap-2">
                    {course.teachers.map((teacher, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                        {teacher}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => setSelectedCourseForDetails(course)}
                    className="flex-1 bg-[#1e40af] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#1e3a8a] transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(course)}
                    className="flex-1 bg-[#1e40af] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#1e3a8a] transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No courses found matching "{searchTerm}"</p>
          </div>
        )}
      </div>      
    </div>
    )}

    
      {/* Edit Modal (Future Ready) */}
      {editForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
              <button onClick={() => { setEditForm(null); setImagePreview(null); }} className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-8">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Course Image</label>
                <div className="flex items-center gap-6">
                  <div className="shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-2xl shadow-lg" />
                    ) : (
                      <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="edit-image" />
                    <label htmlFor="edit-image" className="px-6 py-3 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 inline-flex items-center gap-2 font-medium shadow-lg">
                      <Upload className="w-5 h-5" /> Change Image
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name</label>
                  <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Type</label>
                  <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="weekend">Weekend Batch</option>
                    <option value="self-paced">Self-Paced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Price (₹)</label>
                  <input required type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Class Meeting Link</label>
                  <input type="url" value={editForm.meetingLink} onChange={e => setEditForm({...editForm, meetingLink: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              {/* Assign Teachers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Assign Teachers</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableTeachers.map(teacher => (
                    <label key={teacher.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      editForm.selectedTeachers.includes(teacher.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                    }`}>
                      <input type="checkbox" checked={editForm.selectedTeachers.includes(teacher.id)} onChange={() => toggleTeacher(teacher.id)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                      <div>
                        <p className="font-medium text-gray-900">{teacher.name}</p>
                        <p className="text-xs text-gray-500">{teacher.subject}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Batch Schedule */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" /> Batch Schedule
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label><input type="date" required value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg cursor-pointer" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">End Date</label><input type="date" required value={editForm.endDate} onChange={e => setEditForm({...editForm, endDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg cursor-pointer" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label><input type="time" required value={editForm.startTime} onChange={e => setEditForm({...editForm, startTime: e.target.value})} className="w-full px-3 py-2 border rounded-lg cursor-pointer" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">End Time</label><input type="time" required value={editForm.endTime} onChange={e => setEditForm({...editForm, endTime: e.target.value})} className="w-full px-3 py-2 border rounded-lg cursor-pointer" /></div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Description</label>
                <textarea rows={6} required value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button type="button" onClick={() => { setEditForm(null); setImagePreview(null); }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer">
                  Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TotalCourses;