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
import axios from 'axios';
import apiConfig from '../../config/apiConfig.js'; // Adjust path if needed

const CourseDetailsAdmin = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Batch schedule form state
  const [batchForm, setBatchForm] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  });

  // Meeting link form state
  const [meetingLinkForm, setMeetingLinkForm] = useState({
    meetingLink: ''
  });

  // Course data (without fake students)
  const [course, setCourse] = useState({
    name: "Loading...",
    description: "Loading course details...",
    batch: null,
    meetingLink: null,
  });

  // University students state
  const [universityStudents, setUniversityStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Course structure (weeks/sections)
  const [sections, setSections] = useState([]);

  const [newSection, setNewSection] = useState({
    name: "",
    modules: [{ name: "", chapters: [""] }],
  });

  const openContentModal = () => {
    setNewSection({ name: "", modules: [{ name: "", chapters: [""] }] });
    setShowContentModal(true);
  };

  // Fetch course details + university students
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch course basic info + structure
        const res = await fetch(`http://localhost:5000/api/auth/admin/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Course details fetched:", data.course);

        // The API sometimes returns an ARRAY of rows (joined rows for weeks/modules/content)
        // Normalize both cases (array or single object) and build `sections` as expected by the UI
        const coursePayload = data.course;

        if (Array.isArray(coursePayload) && coursePayload.length > 0) {
          // Use the first row that has `name` or fallback to the first element
          const first = coursePayload.find(item => item && item.name) || coursePayload[0];

          setCourse(prev => ({
            ...prev,
            name: first.name || "Untitled Course",
            description: first.description || "No description available.",
          }));

          // Build weeks → modules → chapters
          const weeksMap = new Map();

          coursePayload.forEach(row => {
            if (!row) return;

            const weekId = row.week_id;
            const weekTitle = row.week_title;
            const moduleId = row.module_id;
            const moduleName = row.module_name;
            const contentId = row.content_id;
            const contentTitle = row.content_title;

            // Skip rows that don't include a week or module identifier
            if (!weekId && !moduleId) return;

            // Ensure week entry
            const wKey = weekId ?? `week_unassigned`;
            if (!weeksMap.has(wKey)) {
              weeksMap.set(wKey, {
                id: weekId || null,
                name: weekTitle || "Unassigned",
                modulesMap: new Map(),
              });
            }

            const weekEntry = weeksMap.get(wKey);

            // If module exists, ensure module entry
            if (moduleId) {
              if (!weekEntry.modulesMap.has(moduleId)) {
                weekEntry.modulesMap.set(moduleId, { id: moduleId, name: moduleName || "Untitled Module", chapters: [] });
              }

              const moduleEntry = weekEntry.modulesMap.get(moduleId);

              if (contentId) {
                // Avoid duplicate chapters
                if (!moduleEntry.chapters.some(c => c.id === contentId)) {
                  moduleEntry.chapters.push({ id: contentId, title: contentTitle || "Untitled Content" });
                }
              }
            }
          });

          const sectionsArr = Array.from(weeksMap.values()).map(w => ({
            id: w.id,
            name: w.name,
            modules: Array.from(w.modulesMap.values())
          }));

          setSections(sectionsArr);
          console.log('Parsed sections:', sectionsArr);
        } else if (coursePayload && typeof coursePayload === 'object') {
          // Legacy/single-object response
          setCourse(prev => ({
            ...prev,
            name: coursePayload.name || "Untitled Course",
            description: coursePayload.description || "No description available.",
          }));

          // Keep previous simple mapping if week fields are present
          if (coursePayload.week_title) {
            setSections([{
              id: coursePayload.week_id,
              name: coursePayload.week_title,
              modules: [{
                id: coursePayload.module_id,
                name: coursePayload.module_name,
                chapters: [{
                  id: coursePayload.content_id,
                  title: coursePayload.content_title
                }]
              }]
            }]);
          }
        } else {
          // No course data available
          setCourse(prev => ({ ...prev, name: "Untitled Course", description: "No description available." }));
        }
        // Fetch real per-admin schedule (batch + meeting link)
        const scheduleRes = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/admin/courses/${id}/schedule`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (scheduleRes.data.success && scheduleRes.data.schedule) {
          setCourse(prev => ({
            ...prev,
            batch: scheduleRes.data.schedule,
            meetingLink: scheduleRes.data.schedule.meeting_link || null
          }));
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching course:", err);
        setLoading(false);
      }
    };

    const fetchUniversityStudents = async () => {
      try {
        setStudentsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          "http://localhost:5000/api/auth/admin/university-students",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.success && Array.isArray(data.students)) {
          const formatted = data.students.map(s => ({
            id: s.id,
            name: s.name || "Unknown Student",
            phone: s.phone || s.mobile_number || "—",
            email: s.email || "—",
            assignments: "0", // placeholder for now
            exams: "0",       // placeholder for now
          }));

          setUniversityStudents(formatted);
        }
      } catch (error) {
        console.error("Error fetching university students:", error);
      } finally {
        setStudentsLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
      fetchUniversityStudents();
    }
  }, [id]);

  // Save batch schedule
  const handleSaveBatch = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!batchForm.startDate || !batchForm.endDate || !batchForm.startTime || !batchForm.endTime) {
        alert('Please fill all fields');
        return;
      }

      const res = await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/admin/courses/${id}/schedule`,
        {
          ...batchForm,
          meetingLink: course.meetingLink // Preserve existing meeting link
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCourse(prev => ({
          ...prev,
          batch: res.data.schedule,
          meetingLink: res.data.schedule.meeting_link || null
        }));
        setShowBatchModal(false);
        alert('Batch schedule updated successfully!');
      }
    } catch (err) {
      console.error('Failed to save batch:', err);
      alert('Failed to update batch schedule');
    }
  };

  // Save meeting link
  const handleSaveLink = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!meetingLinkForm.meetingLink.trim()) {
        alert('Please enter a meeting link');
        return;
      }
      const res = await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/admin/courses/${id}/schedule`,
        { meetingLink: meetingLinkForm.meetingLink.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCourse(prev => ({
          ...prev,
          meetingLink: res.data.schedule.meeting_link
        }));
        setShowLinkModal(false);
        alert('Meeting link updated successfully!');
      }
    } catch (err) {
      console.error('Failed to save link:', err);
      alert('Failed to update meeting link');
    }
  };

  // Improved version - better prefill handling for all date formats
  const openBatchModal = () => {
    const formatDateForInput = (dateValue) => {
      if (!dateValue) return '';

      // Already in YYYY-MM-DD format → perfect for input type="date"
      if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue;
      }

      // Try to parse various common formats
      try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (e) {
        console.warn('Could not parse date:', dateValue);
        return '';
      }
    };

    setBatchForm({
      startDate: formatDateForInput(course.batch?.start_date) || '',
      endDate: formatDateForInput(course.batch?.end_date) || '',
      // Most time inputs expect HH:mm, so we cut seconds if present
      startTime: course.batch?.start_time?.slice(0, 5) || '',
      endTime: course.batch?.end_time?.slice(0, 5) || ''
    });

    setShowBatchModal(true);
  };

  // Open meeting link modal + pre-fill
  const openLinkModal = () => {
    setMeetingLinkForm({
      meetingLink: course.meetingLink || ''
    });
    setShowLinkModal(true);
  };

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
                <button onClick={openBatchModal} className="text-[#1e3a8a] cursor-pointer">
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>

              {course.batch ? (
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#1e3a8a]" />
                    Start Date: {new Date(course.batch.start_date).toLocaleDateString('en-IN')}
                  </p>
                  <p className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#1e3a8a]" />
                    End Date: {new Date(course.batch.end_date).toLocaleDateString('en-IN')}
                  </p>
                  <p className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#1e3a8a]" />
                    Time: {course.batch.start_time.slice(0, 5)} - {course.batch.end_time.slice(0, 5)}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Batch is not scheduled yet</p>
                  <p className="text-sm mt-2">Click the edit icon to schedule the batch</p>
                </div>
              )}
            </div>

            {/* Meeting Link */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <Link2 className="w-6 h-6 text-[#1e3a8a]" /> Class Meeting Link
                </h3>
                <button onClick={openLinkModal} className="text-[#1e3a8a] cursor-pointer">
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>

              {course.meetingLink ? (
                <a
                  href={course.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1e3a8a] hover:underline flex items-center gap-2 break-all"
                >
                  <Link2 className="w-5 h-5" />
                  {course.meetingLink}
                </a>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Link2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Class Meeting Link is not available yet</p>
                  <p className="text-sm mt-2">Click the edit icon to add a meeting link</p>
                </div>
              )}
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
                No course content available yet.
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
                              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-black text-lg">
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
                Enrolled Students ({universityStudents.length})
              </h2>
            </div>

            <div className="p-6">
              {studentsLoading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading students...
                </div>
              ) : universityStudents.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No students found</p>
                  <p className="mt-2">Students from your institution will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
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
                      {universityStudents.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
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
              )}
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
                    <input
                      type="date"
                      value={batchForm.startDate}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={batchForm.endDate}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={batchForm.startTime}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={batchForm.endTime}
                      onChange={(e) => setBatchForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setShowBatchModal(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBatch}
                    className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
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
                <input
                  type="url"
                  value={meetingLinkForm.meetingLink}
                  onChange={(e) => setMeetingLinkForm({ meetingLink: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="https://zoom.us/j/..."
                />
                <div className="flex justify-end gap-4">
                  <button onClick={() => setShowLinkModal(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveLink}
                    className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
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