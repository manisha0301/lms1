// src/pages/CoursesManagement.jsx
import React, { useState } from 'react';
import { ArrowLeft, Search, Edit2, Calendar, Users, Clock, IndianRupee, X, BookOpen, Upload } from 'lucide-react';
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

  const filteredCourses = coursesData.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-8 py-5 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackClick}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                All Courses
              </h1>
              <p className="text-xs text-gray-500 font-medium">Manage and monitor all active courses</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">{totalCount}</p>
              <p className="text-sm text-gray-600">Total Courses</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">+{todayCount}</p>
              <p className="text-sm text-gray-600">Added Today</p>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-8 py-6 max-w-[1600px] mx-auto">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-gray-800 placeholder-gray-400 text-lg"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="px-8 pb-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                course.today ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-100'
              }`}
            >
              <div className="p-6">
                <div className="flex flex-row items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                    {course.today && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-3">
                            NEW TODAY
                        </span>
                        )}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Added: {course.addedOn}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{course.students} students enrolled</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <IndianRupee className="w-4 h-4" />
                    <span className="font-semibold">₹{course.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="capitalize">{course.type.replace('-', ' ')}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Assigned Teachers:</p>
                  <div className="flex flex-wrap gap-2">
                    {course.teachers.map((teacher, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                        {teacher}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='flex flex-row gap-4'>
                <button
                onClick={() => setSelectedCourseForDetails(course)}
                  className="mt-5 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  View Course
                </button>
                <button
                  onClick={() => openEditModal(course)}
                  className="mt-5 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Course
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No courses found matching "{searchTerm}"</p>
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
              <button onClick={() => { setEditForm(null); setImagePreview(null); }} className="p-2 hover:bg-gray-100 rounded-xl">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
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
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label><input type="date" required value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">End Date</label><input type="date" required value={editForm.endDate} onChange={e => setEditForm({...editForm, endDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label><input type="time" required value={editForm.startTime} onChange={e => setEditForm({...editForm, startTime: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">End Time</label><input type="time" required value={editForm.endTime} onChange={e => setEditForm({...editForm, endTime: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div>
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
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold">
                  Cancel
                </button>
                <button type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg hover:scale-105 transition-all">
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