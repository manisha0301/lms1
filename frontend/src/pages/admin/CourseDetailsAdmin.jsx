// src/pages/admin/CourseDetailsAdmin.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Link2,
  Edit3,
  Plus,
  Trash2,
  X,
  ChevronRight,
  Users,
  FileText,
  Layers,
  BookOpen,
} from "lucide-react";

const CourseDetailsAdmin = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [loading, setLoading] = useState(false);


  // This will hold real name & description + dummy data
  const [course, setCourse] = useState({
    name: "Loading...",
    description: "Loading course details...",
    batch: { startDate: "2025-01-10", endDate: "2025-04-10", startTime: "07:00 PM", endTime: "09:00 PM" },
    meetingLink: "https://zoom.us/j/987654321",
    students: [
      { id: 1, name: "Aarav Sharma", phone: "+91 98765 43210", email: "aarav@gmail.com", assignments: 8, exams: 3 },
      { id: 2, name: "Priya Singh", phone: "+91 87654 32109", email: "priya@yahoo.com", assignments: 10, exams: 3 },
      { id: 3, name: "Rohan Patel", phone: "+91 76543 21098", email: "rohan@outlook.com", assignments: 7, exams: 2 },
    ],
  });

  // ── Real course structure (weeks/sections) ──────────────────
  const [sections, setSections] = useState([]); // array of weeks/sections

  const [newSection, setNewSection] = useState({
    name: "",
    modules: [{ name: "", chapters: [""] }],
  });

  const openContentModal = () => {
    setNewSection({ name: "", modules: [{ name: "", chapters: [""] }] });
    setShowContentModal(true);
  };

  // Fetch real name and description only
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/auth/admin/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Fetched course data:", data);

        if (data.success && data.course) {
          // Normalize: backend may return a single object or an array of rows
          const rows = Array.isArray(data.course) ? data.course : [data.course];

          // Set basic course info from the first row
          setCourse(prev => ({
            ...prev,
            name: rows[0]?.name || "Untitled Course",
            description: rows[0]?.description || "No description available.",
          }));

          // ── Important: transform DB structure to frontend friendly format ──
          // Current DB returns flat structure → we need to nest it
          const weekMap = new Map();

          rows.forEach(row => {
            if (!row.week_id) return;

            if (!weekMap.has(row.week_id)) {
              weekMap.set(row.week_id, {
                id: row.week_id,
                name: row.week_title || `Week ${row.week_number || "?"}`,
                weekNumber: row.week_number,
                order: row.week_order,
                modules: [],
              });
            }

            const week = weekMap.get(row.week_id);

            if (row.module_id && !week.modules.some(m => m.id === row.module_id)) {
              week.modules.push({
                id: row.module_id,
                name: row.module_name || "Untitled Module",
                order: row.module_order,
                chapters: [],
              });
            }

            if (row.content_id) {
              const module = week.modules.find(m => m.id === row.module_id);
              if (module) {
                module.chapters.push({
                  id: row.content_id,
                  title: row.content_title,
                  type: row.content_type || "other", // you can add type later
                });
              }
            }
          });

          // Convert map to sorted array
          const sortedSections = Array.from(weekMap.values())
            .sort((a, b) => a.order - b.order);

          setSections(sortedSections);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourseDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header*/}
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
          <div className="space-y-8">
            <div className="flex items-center justify-between ml-1">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Layers className="w-7 h-7 text-[#1e3a8a]" />
                Course Contents
              </h2>
            </div>

            {sections.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
                No course content structure available yet.
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map((section, sectionIndex) => (
                  <div
                    key={section.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    {/* Section / Week Header */}
                    <div className="bg-gradient-to-r from-[#1e3a8a]/10 to-[#1e40af]/5 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-[#1e3a8a] text-lg">
                            {section.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Modules inside section */}
                    <div className="p-6">
                      {section.modules?.length === 0 ? (
                        <p className="text-gray-500 italic text-center py-8">
                          No modules in this section yet
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {section.modules.map((module) => (
                            <div key={module.id} className="border-l-4 border-[#1e3a8a]/40 pl-5 py-2">
                              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                <BookOpen size={18} className="text-[#1e3a8a]" />
                                {module.name}
                              </h4>

                              <div className="space-y-2.5 ml-2">
                                {module.chapters?.map((chapter, idx) => (
                                  <div
                                    key={chapter.id || idx}
                                    className="flex items-center gap-3 py-2.5 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                                  >
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 group-hover:bg-[#1e3a8a]/10 group-hover:text-[#1e3a8a] transition">
                                      {idx + 1}
                                    </div>
                                    <span className="flex-1 font-medium text-gray-800">
                                      {chapter.title}
                                    </span>
                                    {/* You can show type icon here later */}
                                    {/* <Video size={16} className="text-gray-500" /> */}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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