// src/pages/faculty/CourseDetailsFaculty.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig.js';
import {
  BookOpen, Users, Clock, Calendar, Link as LinkIcon,
  ChevronLeft, Plus, Edit2, Trash2, Eye, Settings,
  CheckCircle, FileText, Upload, File,
} from 'lucide-react';

import node from '../../assets/node.webp';

const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CourseDetailsFaculty() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  // Course state (fetched from backend)
  const [course, setCourse] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [courseError, setCourseError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setCourseError('Course ID is missing');
        setLoadingCourse(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const res = await axios.get(`${apiConfig.API_BASE_URL}/api/faculty/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Course fetch response:', res.data);

        if (res.data && res.data.success) {
          const c = res.data.course;
          const s = res.data.schedules ;

          // map fields to UI-friendly names
          setCourse({
            id: c.id,
            title: c.name || c.title || `Course ${c.id}`,
            code: c.code || `C-${c.id}`,
            thumbnail: c.image ? `${apiConfig.API_BASE_URL}/uploads/${c.image}` : node,
            instructor: (c.facultyNames && c.facultyNames.join(', ')) || 'TBD',
            semester: c.semester || 'N/A',
            totalStudents: c.totalStudents || 0,
            duration: c.duration || 'N/A',
            status: 'Active',
            description: c.description || '',
            schedule: s.map(sc => `${formatDateToYYYYMMDD(sc.start_date)}-${formatDateToYYYYMMDD(sc.end_date)} `).join(', ') || 'TBD',
            room: s.map(sc => `${sc.start_time}-${sc.end_time}`).join(', ') || 'TBD',
            classLink: s.map(sc => sc.meeting_link).join(', ') || 'TBD',
          });

          // Map backend structure to the expected weeks/modules/chapters shape
          const apiWeeks = Array.isArray(c.contents) ? c.contents : [];
          const mappedWeeks = apiWeeks.map((w, idx) => ({
            week: w.weekNumber || idx + 1,
            title: w.title || `Week ${idx + 1}`,
            modules: (w.modules || []).map(m => ({
              id: m.id,
              title: m.title,
              chapters: (m.chapters || []).map(ch => ({
                id: ch.id,
                title: ch.title,
                description: ch.type ? `${ch.type}${ch.duration ? ' · ' + ch.duration : ''}` : (ch.url || '')
              }))
            })),
            assessment: null
          }));

          setWeeks(mappedWeeks);
        } else {
          setCourseError((res.data && res.data.error) || 'Failed to load course');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setCourseError('Error fetching course details');
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId, navigate]);
  const [classLink, setClassLink] = useState("https://zoom.us/j/1234567890");
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [tempLink, setTempLink] = useState(classLink);

  // Modal states
  const [showAddAssessmentModal, setShowAddAssessmentModal] = useState(false);
  const [showViewSubmissionsModal, setShowViewSubmissionsModal] = useState(false);
  const [selectedWeekForModal, setSelectedWeekForModal] = useState(null);

  const handleSaveLink = () => {
    setClassLink(tempLink);
    setIsEditingLink(false);
  };

  if (loadingCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading course details...</p>
      </div>
    );
  }

  if (courseError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-600">{courseError}</p>
      </div>
    );
  }

  const openAddAssessment = (week) => {
    setSelectedWeekForModal(week);
    setShowAddAssessmentModal(true);
  };

  const openViewSubmissions = (week) => {
    setSelectedWeekForModal(week);
    setShowViewSubmissionsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="mx-auto px-6">
          <div className="flex flex-row items-center justify-between">
              {/* <div className="flex flex-row items-center justify-between"> */}
                <div className="md:flex-1">
                  <h1 className="text-4xl font-semibold">{course.title}</h1>
                  <p className="mt-2 text-blue-100 max-w-2xl">
                    {course.description}
                  </p>
                </div>
                <div className="w-80 flex-shrink-0">
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt="Course Thumbnail"
                      onError={(e) => { e.target.onerror = null; e.target.src = node; }}
                      className="w-full h-36 md:h-56 object-cover rounded-lg border-4 border-white shadow-md"
                    />
                  </div>
                </div>
              {/* </div> */}
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-10">
        <div className="space-y-8">
          {/* Live Class Link */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#1e40af]" /> Live Class Link
              </h2>
            </div>
            {course.classLink && course.classLink !== 'TBD' ? (
              <a
                href={course.classLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full px-4 py-3 rounded-md text-[#1e40af] hover:underline break-words"
              >
                {course.classLink}
              </a>
            ) : (
              <p className="w-full px-4 py-3 rounded-md text-gray-600">
                {course.classLink}
              </p>
            )}
          </div>

          {/* Course Info Summary - same as before */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, label: "Students", value: course.totalStudents },
                { icon: Clock, label: "Duration", value: course.duration },
                { icon: Calendar, label: "Semester", value: course.semester },
                { icon: CheckCircle, label: "Status", value: course.status },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="inline-flex p-3 bg-blue-50 rounded-lg mb-3">
                      <Icon className="w-6 h-6 text-[#1e40af]" />
                    </div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-gray-200">
              <div className="mt-6 flex flex-wrap gap-8 text-gray-600 justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {course.schedule}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {course.room}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1e40af]" /> Course Content
              </h2>
            </div>

            {weeks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
                No course content available yet.
              </div>
            ) : (
              <div className="space-y-6">
                {weeks.map((section) => (
                  <div key={section.week} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1e3a8a]/10 to-[#1e40af]/5 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-[#1e3a8a] text-lg">{section.title}</h3>
                          <p className="text-sm text-gray-600">Week {section.week}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {(!section.modules || section.modules.length === 0) ? (
                        <p className="text-gray-500 italic text-center py-8">No modules in this section yet</p>
                      ) : (
                        <div className="space-y-6">
                          {section.modules.map((module) => (
                            <div key={module.id || module.title} className="border-l-4 border-[#1e3a8a]/40 pl-5 py-2">
                              <h4 className="text-gray-800 mb-3 flex items-center gap-2 font-bold text-lg text-black">
                                <BookOpen size={18} className="text-[#1e3a8a]" />
                                {module.title || module.name}
                              </h4>

                              <div className="space-y-2.5 ml-2">
                                {module.chapters?.map((chapter, idx) => (
                                  <div key={chapter?.id || idx} className="flex items-center gap-3 py-2.5 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 group-hover:bg-[#1e3a8a]/10 group-hover:text-[#1e3a8a] transition">
                                      {idx + 1}
                                    </div>
                                    <span className="flex-1 font-medium text-gray-800">{(chapter && (chapter.title || chapter)) || 'Untitled'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Assessment Section for the Week */}
                    <div className="mt-4 pt-4 px-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                          <Settings className="w-5 h-5 text-gray-600" />
                          Week Assessment
                        </h4>

                        {!section.assessment && (
                          <button
                            onClick={() => openAddAssessment(section.week)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm"
                          >
                            <Plus className="w-4 h-4" /> Add Assessment
                          </button>
                        )}
                      </div>

                      {section.assessment ? (
                        <div className="bg-gray-50 rounded-lg p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-semibold text-lg">
                                {section.assessment.title}
                                <span className="ml-3 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                  {section.assessment.type}
                                </span>
                              </h5>
                              <div className="mt-2 text-sm text-gray-600 space-y-1">
                                <div>Total Marks: <strong>{section.assessment.totalMarks}</strong></div>
                                <div>Due: <strong>{new Date(section.assessment.dueDate).toLocaleDateString()}</strong></div>
                                <div>Submissions: <strong>{section.assessment.submissions}/{section.assessment.totalStudents}</strong></div>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => openViewSubmissions(section.week)}
                                className="px-4 py-2 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] text-sm"
                              >
                                View Submissions
                              </button>
                              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-center py-4">
                          No assessment created for this week yet.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------- Modals ---------------------- */}

      {/* Add Assessment Modal */}
      {showAddAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg">
            <h3 className="text-xl font-bold mb-6">Add Assessment - Week {selectedWeekForModal}</h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Assessment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Week 1 - Node.js Fundamentals Quiz"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#1e40af]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload File (PDF)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <input type="file" accept=".pdf" className="hidden" />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setShowAddAssessmentModal(false)}
                  className="px-6 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a]">
                  Create Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Submissions Modal */}
      {showViewSubmissionsModal && selectedWeekForModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-3xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                Submissions - Week {selectedWeekForModal} Assessment
              </h3>
              <button onClick={() => setShowViewSubmissionsModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Sl.</th>
                  <th className="p-3 text-left">Student Name</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {weeks
                  .find(w => w.week === selectedWeekForModal)
                  ?.assessment?.studentSubmissions?.map((student) => (
                    <tr key={student.sl} className="border-t">
                      <td className="p-3">{student.sl}</td>
                      <td className="p-3">{student.name}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          student.submitted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {student.submitted ? 'Submitted' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {student.submitted && student.fileUrl ? (
                          <a
                            href={student.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1e40af] hover:underline flex items-center justify-center gap-1"
                          >
                            <File className="w-4 h-4" /> View PDF
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowViewSubmissionsModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}