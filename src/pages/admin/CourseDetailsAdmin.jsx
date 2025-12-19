// src/pages/admin/CourseDetailsAdmin.jsx
import React, { useState } from "react";
import {
  Calendar, Clock, Link2, Edit3, Plus, Trash2, X, ChevronRight,
  Users, FileText, CheckCircle, AlertCircle, BookOpen, FolderOpen,
  ArrowLeft
} from "lucide-react";

const CourseDetailsAdmin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  const [sections] = useState([
    {
      id: 1,
      name: "Week 1 - Introduction",
      modules: [
        {
          id: 1,
          name: "Module 1: Getting Started",
          chapters: ["Welcome & Setup", "Course Overview", "Tools Installation"]
        },
        {
          id: 2,
          name: "Module 2: React Basics",
          chapters: ["JSX & Components", "State & Props", "Event Handling"]
        }
      ]
    },
    {
      id: 2,
      name: "Week 2 - Advanced Concepts",
      modules: [
        {
          id: 3,
          name: "Module 3: Hooks Deep Dive",
          chapters: ["useState & useEffect", "Custom Hooks", "Performance Optimization"]
        }
      ]
    }
  ]);

  const course = {
    name: "React Masterclass 2025",
    batch: { startDate: "2025-01-10", endDate: "2025-04-10", startTime: "07:00 PM", endTime: "09:00 PM" },
    meetingLink: "https://zoom.us/j/987654321",
    description: "Complete React mastery with hooks, context, Redux Toolkit, real projects, and deployment strategies.",
    students: [
      { id: 1, name: "Aarav Sharma", phone: "+91 98765 43210", email: "aarav@gmail.com", assignments: 8, exams: 3 },
      { id: 2, name: "Priya Singh", phone: "+91 87654 32109", email: "priya@yahoo.com", assignments: 10, exams: 3 },
      { id: 3, name: "Rohan Patel", phone: "+91 76543 21098", email: "rohan@outlook.com", assignments: 7, exams: 2 },
    ]
  };

  const [newSection, setNewSection] = useState({
    name: "",
    modules: [
      { name: "", chapters: [""] }
    ]
  });

  // Reset when modal opens
  const openContentModal = () => {
    setNewSection({ name: "", modules: [{ name: "", chapters: [""] }] });
    setShowContentModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="mx-auto px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-semibold">{course.name}</h1>
              <p className="mt-2 text-blue-100">Manage all aspects of this course</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 pb-10 pt-2">

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-4 border-b border-gray-200">
          {["overview", "content", "students"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition cursor-pointer ${
                activeTab === tab
                  ? "border-b-4 border-[#1e3a8a] text-[#1e3a8a]"
                  : "text-gray-600 hover:text-[#1e3a8a]"
              }`}
            >
              {tab === "overview" && "Overview"}
              {tab === "content" && "Course Content"}
              {tab === "students" && "Students"}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Batch Info */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-[#1e3a8a]" /> Batch Schedule
                </h3>
                <button onClick={() => setShowBatchModal(true)} className="text-[#1e3a8a] cursor-pointer">
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#1e3a8a]" />
                  Start Date: {course.batch.startDate}
                </p>
                <p className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#1e3a8a]" />
                  End Date: {course.batch.endDate}
                </p>
                <p className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#1e3a8a]" />
                  Time: {course.batch.startTime} - {course.batch.endTime}
                </p>
              </div>
            </div>

            {/* Meeting Link */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <Link2 className="w-6 h-6 text-[#1e3a8a]" /> Class Meeting Link
                </h3>
                <button onClick={() => setShowLinkModal(true)} className="text-[#1e3a8a] cursor-pointer">
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
              <a href={course.meetingLink} target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] hover:underline flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                {course.meetingLink}
              </a>
            </div>

            {/* Description */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-xl border border-gray-100 p-8">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#1e3a8a]" /> Course Description
                </h3>
                <button onClick={() => setShowContentModal(true)} className="text-[#1e3a8a] cursor-pointer">
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="flex justify-end items-end">
            <button
              onClick={openContentModal}
              className="w-52 py-3 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 transition hover:scale-105 cursor-pointer"
            >
              <Plus className="w-6 h-6" />
              Add New Section
            </button>
            </div>
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-xl font-bold text-gray-800">{section.name}</h3>
                  <button className="text-red-600 hover:text-red-800 cursor-pointer">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {section.modules.map((module) => (
                    <div key={module.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{module.name}</h4>
                        <button className="text-red-600 hover:text-red-800 cursor-pointer">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {module.chapters.map((chapter, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <span className="text-gray-800">{chapter}</span>
                            <button className="text-red-600 hover:text-red-800 cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === "students" && (
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-[#1e3a8a] text-white p-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Users className="w-7 h-7" />
                Enrolled Students ({course.students.length})
              </h2>
            </div>
            <div className="p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-600 border-b border-gray-200">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Assignments</th>
                    <th className="py-3 px-4">Exams</th>
                  </tr>
                </thead>
                <tbody>
                  {course.students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-4 font-medium text-gray-900">{student.name}</td>
                      <td className="py-4 px-4 text-gray-600">{student.phone}</td>
                      <td className="py-4 px-4 text-gray-600">{student.email}</td>
                      <td className="py-4 px-4 text-gray-600">{student.assignments} submitted</td>
                      <td className="py-4 px-4 text-gray-600">{student.exams} attempted</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Batch Schedule Modal */}
        {showBatchModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Batch Schedule</h2>
                <button onClick={() => setShowBatchModal(false)} className="hover:bg-white/20 p-1 rounded cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input type="time" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input type="time" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer" />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setShowBatchModal(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer">
                    Save Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Meeting Link Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Meeting Link</h2>
                <button onClick={() => setShowLinkModal(false)} className="hover:bg-white/20 p-1 rounded cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <input type="url" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://zoom.us/j/..." />
                <div className="flex justify-end gap-4">
                  <button onClick={() => setShowLinkModal(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer">
                    Save Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Content Modal */}
        {showContentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Add New Section</h2>
                <button onClick={() => setShowContentModal(false)} className="hover:bg-white/20 p-1 rounded cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
                  <input
                    type="text"
                    value={newSection.name}
                    onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                    placeholder="e.g. Week 1 - Fundamentals"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Modules</h3>
                    <button
                      onClick={() => {
                        const updated = [...newSection.modules];
                        updated.push({ name: "", chapters: [""] });
                        setNewSection({ ...newSection, modules: updated });
                      }}
                      className="text-[#1e3a8a] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Module
                    </button>
                  </div>

                  {newSection.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="mb-6 p-5 border border-gray-200 rounded-xl bg-white">
                      <div className="flex justify-between items-center mb-3">
                        <input
                          type="text"
                          value={module.name}
                          onChange={(e) => {
                            const updated = [...newSection.modules];
                            updated[moduleIndex].name = e.target.value;
                            setNewSection({ ...newSection, modules: updated });
                          }}
                          placeholder="Module Name (e.g. Hooks Deep Dive)"
                          className="text-lg font-medium px-3 py-2 border-b border-gray-300 bg-transparent outline-none w-full focus:ring-0"
                        />
                        {newSection.modules.length > 1 && (
                          <button
                            onClick={() => {
                              const updated = [...newSection.modules];
                              updated.splice(moduleIndex, 1);
                              setNewSection({ ...newSection, modules: updated });
                            }}
                            className="text-red-600 hover:text-red-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3 ml-6">
                        {module.chapters.map((chapter, chapIndex) => (
                          <div key={chapIndex} className="flex items-center gap-3">
                            <ChevronRight className="w-5 h-5 text-[#1e3a8a] mt-1" />
                            <input
                              type="text"
                              placeholder="Chapter / Topic name"
                              value={chapter}
                              onChange={(e) => {
                                const updated = [...newSection.modules];
                                updated[moduleIndex].chapters[chapIndex] = e.target.value;
                                setNewSection({ ...newSection, modules: updated });
                              }}
                              className="flex-1 px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                            />
                            {module.chapters.length > 1 && (
                              <button
                                onClick={() => {
                                  const updated = [...newSection.modules];
                                  updated[moduleIndex].chapters.splice(chapIndex, 1);
                                  setNewSection({ ...newSection, modules: updated });
                                }}
                                className="text-red-500 hover:text-red-700 transition cursor-pointer"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          onClick={() => {
                            const updated = [...newSection.modules];
                            updated[moduleIndex].chapters.push("");
                            setNewSection({ ...newSection, modules: updated });
                          }}
                          className="flex items-center gap-2 text-[#1e3a8a] hover:text-[#1e3a8a]/80 font-medium text-sm mt-4 transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Add Chapter / Topic
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowContentModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Add logic to save new section
                      setShowContentModal(false);
                    }}
                    className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    Create Section
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

export default CourseDetailsAdmin;