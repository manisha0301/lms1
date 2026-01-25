// src/pages/student/CourseDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, FileText, Calendar, Clock, CheckCircle, 
  Lock, CreditCard, Users, Video, BookOpen, Award,
  Download
} from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import { ChapterItem } from './ChapterItemStudent';


export default function CourseDetail() {
    // Assignment Modal State
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignmentUploadLoading, setAssignmentUploadLoading] = useState(false);
    const [assignmentUploadError, setAssignmentUploadError] = useState(null);
    const [uploadedAnswers, setUploadedAnswers] = useState({}); // { assignmentId: fileUrl }
    const fileInputRefs = useRef({});
    // Dummy assignments data for demonstration (replace with real API data)
    const assignmentsByWeek = useMemo(() => {
      // You should fetch this from backend and structure by week
      // Here is a mock structure:
      return [
        {
          week: 'Week 1',
          assignments: [
            {
              id: 1,
              title: 'Assignment 1: Security Basics',
              marks: 20,
              dueDate: '2026-01-28',
              questionPdf: '/assignments/week1-assignment1.pdf',
              answerPdf: uploadedAnswers[1] || null
            },
            {
              id: 2,
              title: 'Assignment 2: System Protection',
              marks: 15,
              dueDate: '2026-01-30',
              questionPdf: '/assignments/week1-assignment2.pdf',
              answerPdf: uploadedAnswers[2] || null
            }
          ]
        },
        {
          week: 'Week 2',
          assignments: [
            {
              id: 3,
              title: 'Assignment 3: Network Security',
              marks: 25,
              dueDate: '2026-02-05',
              questionPdf: '/assignments/week2-assignment1.pdf',
              answerPdf: uploadedAnswers[3] || null
            }
          ]
        }
      ];
    }, [uploadedAnswers]);
    // Handle answer PDF upload
    const handleAnswerUpload = async (assignmentId, file) => {
      setAssignmentUploadLoading(true);
      setAssignmentUploadError(null);
      try {
        // TODO: Replace with real upload logic (API call)
        // Simulate upload delay
        await new Promise(res => setTimeout(res, 1000));
        // For demo, just use a local URL
        const fileUrl = URL.createObjectURL(file);
        setUploadedAnswers(prev => ({ ...prev, [assignmentId]: fileUrl }));
      } catch (err) {
        setAssignmentUploadError('Failed to upload answer.');
      } finally {
        setAssignmentUploadLoading(false);
      }
    };
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const todayLiveClass = useMemo(() => {
  if (!course?.liveClasses || course.liveClasses.length === 0) return null;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return course.liveClasses.find(cls => cls.date === today);
}, [course]);

  

  // Registration Flow States
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const availableSlots = [
    { date: '2025-12-01', time: '10:00 AM - 1:00 PM' },
    { date: '2025-12-01', time: '2:00 PM - 5:00 PM' },
    { date: '2025-12-02', time: '10:00 AM - 1:00 PM' }
  ];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Please login first");

        const response = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/student/courses/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const dbCourse = response.data.course;
        console.log("Course data received:", dbCourse);

        let sections = [];

        // Handle array response (joined rows with week/module/content data)
        if (Array.isArray(dbCourse) && dbCourse.length > 0) {
          const weeksMap = new Map();

          dbCourse.forEach(row => {
            if (!row) return;

            const weekId = row.week_id;
            const weekTitle = row.week_title;
            const moduleId = row.module_id;
            const moduleName = row.module_title;
            const contentId = row.content_id;
            const contentTitle = row.content_title;
            const contentDuration = row.content_duration;
            const contentType = row.content_type;

            // Skip rows that don't have week or module
            if (!weekId && !moduleId) return;

            // Ensure week entry
            const wKey = weekId ?? 'week_unassigned';
            if (!weeksMap.has(wKey)) {
              weeksMap.set(wKey, {
                id: weekId || null,
                title: weekTitle || "Unassigned",
                modulesMap: new Map(),
              });
            }

            const weekEntry = weeksMap.get(wKey);

            // If module exists, ensure module entry
            if (moduleId) {
              if (!weekEntry.modulesMap.has(moduleId)) {
                weekEntry.modulesMap.set(moduleId, {
                  id: moduleId,
                  title: moduleName || "Untitled Module",
                  chapters: []
                });
              }

              const moduleEntry = weekEntry.modulesMap.get(moduleId);

              // Add content/chapter if it exists
              if (contentId) {
                if (!moduleEntry.chapters.some(c => c.id === contentId)) {
                  moduleEntry.chapters.push({
                    id: contentId,
                    title: contentTitle || "Untitled Content",
                    duration: contentDuration,
                    type: contentType || 'video'
                  });
                }
              }
            }
          });

          sections = Array.from(weeksMap.values()).map(w => ({
            id: w.id,
            title: w.title,
            modules: Array.from(w.modulesMap.values())
          }));

          console.log('Parsed sections:', sections);
        } else if (dbCourse && typeof dbCourse === 'object' && !Array.isArray(dbCourse)) {
          // Handle single object response
          if (dbCourse.contents && Array.isArray(dbCourse.contents)) {
            sections = dbCourse.contents;
          }
        }

        setCourse({
          id: dbCourse.id || (Array.isArray(dbCourse) ? dbCourse[0]?.course_id : null),
          title: dbCourse.name || (Array.isArray(dbCourse) ? dbCourse[0]?.course_name : 'Course Title Not Available'),
          instructor: dbCourse.instructors || 'No instructor assigned yet',
          duration: dbCourse.duration || '3 Months',
          price: `₹${parseFloat(dbCourse.price || 0).toLocaleString('en-IN')}`,
          thumbnail: dbCourse.image 
            ? `${apiConfig.API_BASE_URL}/uploads/${dbCourse.image}`
            : 'https://via.placeholder.com/600x400?text=No+Image+Uploaded',
          description: dbCourse.description || 'Course description not available yet.',
          rating: 4.8,
          students: dbCourse.enrolledStudents || 0,
          
          // Real batch schedule from admin
          liveClasses: dbCourse.liveClasses || [
            { topic: 'No upcoming sessions', instructor: 'TBA', date: 'TBA', time: 'TBA', link: '#' }
          ],

          // Real course content from database
          sections: sections,

          // Dummy content remains unchanged
          modules: [
            {
              id: 1,
              title: 'Module 1: Fundamentals',
              chapters: [
                { id: 1, title: 'Introduction to React', duration: '45 min', type: 'video', locked: true },
                { id: 2, title: 'JSX & Components', duration: '60 min', type: 'video', locked: true },
                { id: 3, title: 'State & Props', duration: '55 min', type: 'video', locked: true },
                { id: 4, title: 'Quiz: Basics', type: 'quiz', locked: true }
              ]
            },
            {
              id: 2,
              title: 'Module 2: Advanced Concepts',
              chapters: [
                { id: 5, title: 'Hooks Deep Dive', duration: '70 min', type: 'video', locked: true },
                { id: 6, title: 'Context API', duration: '50 min', type: 'video', locked: true },
                { id: 7, title: 'Assignment: Todo App', type: 'assignment', locked: true }
              ]
            }
          ],
          examLink: null,
          notes: []
        });
      } catch (err) {
        console.error("Course fetch failed:", err);
        setError(err.response?.data?.error || "Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  


  const isRegistered = true;

  const handleRegister = () => setShowSlotModal(true);
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowSlotModal(false);
    setShowPayment(true);
  };
  const handlePayment = () => {
    alert('Payment Successful! You are now registered.');
    setShowPayment(false);
    navigate(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-medium">Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error || "Course not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Course Header */}
      <div className="bg-[#1e3a8a] text-white">
        <div className="mx-auto px-20 py-12">
          <div className="grid md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-3xl">
                {course.description}
              </p>
              {!isRegistered && (
                <div className="flex flex-wrap gap-8 text-blue-50">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    <div>
                      <p className="text-sm opacity-80">Enrolled Students</p>
                      <p className="text-xl font-semibold">{course.students}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6" />
                    <div>
                      <p className="text-sm opacity-80">Duration</p>
                      <p className="text-xl font-semibold">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6" />
                    <div>
                      <p className="text-sm opacity-80">Rating</p>
                      <p className="text-xl font-semibold">{course.rating} / 5.0</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl -rotate-6 scale-95"></div>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl border-4 border-white/30"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
                    e.target.onerror = null;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {!isRegistered ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-8 text-center">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">Complete Registration to Unlock Full Access</h2>
                <button
                  onClick={handleRegister}
                  className="w-full max-w-sm mx-auto bg-[#1e40af] hover:bg-[#1e3a8a] text-white py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-3 shadow-lg cursor-pointer"
                >
                  Register Now — {course.price}
                </button>
                <p className="mt-4 text-amber-700">
                  Select your preferred batch & complete payment to start learning
                </p>
              </div>
            ) : (
              <>
                {/* Course Content */}
                <div className="space-y-8 ">
                  <div className="flex items-center justify-between ml-1">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <BookOpen className="w-7 h-7 text-[#1e3a8a]" />
                      Course Contents
                    </h2>
                  </div>

                  {!course.sections || course.sections.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
                      No course content available yet.
                    </div>
                  ) : (
                    <div className="space-y-6 max-h-[700px] overflow-y-auto shadow-lg rounded-2xl">
                      {course.sections.map((section) => (
                        <div key={section.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                          <div className="bg-gradient-to-r from-[#1e3a8a]/10 to-[#1e40af]/5 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div>
                                <h3 className="font-semibold text-[#1e3a8a] text-lg">
                                  {section.title}
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div className="p-6">
                            {!section.modules || section.modules.length === 0 ? (
                              <p className="text-gray-500 italic text-center py-8">
                                No modules in this section yet
                              </p>
                            ) : (
                              <div className="space-y-6">
                                {section.modules.map((module) => (
                                  <div key={module.id} className="border-l-4 border-[#1e3a8a]/40 pl-5 py-2">
                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-black text-lg">
                                      <FileText size={18} className="text-[#1e3a8a]" />
                                      {module.title}
                                    </h4>

                                    <div className="space-y-2.5 ml-2">
                                      {!module.chapters || module.chapters.length === 0 ? (
                                        <p className="text-gray-500 italic text-sm py-4">No chapters in this module yet</p>
                                      ) : (
                                        module.chapters.map((chapter, idx) => (
  <ChapterItem
    key={chapter.id || idx}
    chapter={chapter}
    idx={idx}
    isLocked={chapter.locked}
  />
))
                                      )}
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

                {/* Live Classes – NOW REAL */}
                {todayLiveClass ? (
                  <div className="flex items-center justify-between p-5 bg-blue-50 rounded-lg border border-blue-100">
                    <div>
                      <p className="font-semibold text-gray-900">{todayLiveClass.topic}</p>
                      <p className="text-sm text-gray-600">with {todayLiveClass.instructor}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">{todayLiveClass.date}</p>
                      <p className="text-sm text-gray-600">{todayLiveClass.time}</p>
                    </div>

                    <a
                      href={todayLiveClass.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`ml-6 px-5 py-2 rounded-md text-sm font-medium transition ${
                        todayLiveClass.link !== '#'
                          ? 'bg-[#1e40af] text-white hover:bg-[#1e3a8a] cursor-pointer'
                          : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      }`}
                    >
                      {todayLiveClass.link !== '#' ? 'Join Live' : 'No Link'}
                    </a>
                  </div>
                ) : (
                  <div className="p-5 bg-gray-50 rounded-lg text-center text-gray-500">
                    No live classes scheduled for today
                  </div>
                )}


                {/* Notes */}
                {course.notes.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-[#1e40af]" /> Downloadable Notes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.notes.map((note, i) => (
                        <a
                          key={i}
                          href="#"
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                        >
                          <span className="font-medium text-gray-800">{note}</span>
                          <Download className="w-5 h-5 text-[#1e40af] group-hover:translate-x-1 transition" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Course Details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Instructor</span>
                  <span className="font-semibold text-gray-900">{course.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="text-xl font-bold text-green-600">{course.price}</span>
                </div>
              </div>
            </div>

            {isRegistered && (
              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-4">Final Exam</h3>
                  <a
                    href={course.examLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
                  >
                    Start Exam
                  </a>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-4">Assignments</h3>
                  <button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition cursor-pointer"
                    onClick={() => setShowAssignmentModal(true)}
                  >
                    View Assignments
                  </button>
                </div>
                    {/* Assignment Modal */}
                    {showAssignmentModal && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
                          <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
                            onClick={() => setShowAssignmentModal(false)}
                          >
                            &times;
                          </button>
                          <h2 className="text-2xl font-bold mb-6 text-[#1e3a8a]">Assignments</h2>
                          {assignmentsByWeek.map((week, wIdx) => (
                            <div key={wIdx} className="mb-8">
                              <h3 className="text-lg font-semibold mb-3 text-indigo-700">{week.week}</h3>
                              <div className="overflow-x-auto">
                                <table className="min-w-full shadow-xl rounded-2xl overflow-hidden">
                                  <thead>
                                    <tr className="bg-gradient-to-r from-[#1e3a8a]/90 to-[#1e40af]/80">
                                      <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Title</th>
                                      <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Marks</th>
                                      <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Due Date</th>
                                      <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Question PDF</th>
                                      <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Answer PDF</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {week.assignments.map((a, idx) => (
                                      <tr
                                        key={a.id}
                                        className={`transition-all ${idx % 2 === 0 ? 'bg-blue-50/60' : 'bg-white'} hover:bg-blue-100/70`}
                                      >
                                        <td className="px-6 py-3 font-semibold text-[#1e3a8a] text-base border-b border-blue-100">{a.title}</td>
                                        <td className="px-6 py-3 border-b border-blue-100 text-gray-700 font-medium">{a.marks}</td>
                                        <td className="px-6 py-3 border-b border-blue-100 text-gray-700 font-medium">{a.dueDate}</td>
                                        <td className="px-6 py-3 border-b border-blue-100">
                                          <a href={a.questionPdf} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-semibold text-xs hover:bg-blue-200 transition">Download</a>
                                        </td>
                                        <td className="px-6 py-3 border-b border-blue-100">
                                          {a.answerPdf ? (
                                            <a href={a.answerPdf} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-lg font-semibold text-xs mr-2 hover:bg-green-200 transition">View</a>
                                          ) : null}
                                          <input
                                            type="file"
                                            accept="application/pdf"
                                            style={{ display: 'none' }}
                                            ref={el => fileInputRefs.current[a.id] = el}
                                            onChange={e => {
                                              if (e.target.files && e.target.files[0]) {
                                                handleAnswerUpload(a.id, e.target.files[0]);
                                              }
                                            }}
                                          />
                                          <button
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${a.answerPdf ? 'bg-indigo-100 text-indigo-800 hover:bg-[#1e3a8a]' : 'bg-[#1e3a8a] text-white hover:bg-indigo-700'}`}
                                            onClick={() => fileInputRefs.current[a.id]?.click()}
                                            disabled={assignmentUploadLoading}
                                          >
                                            {a.answerPdf ? 'Re-upload' : 'Upload'}
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                          {assignmentUploadError && (
                            <div className="text-red-600 text-sm mt-2">{assignmentUploadError}</div>
                          )}
                        </div>
                      </div>
                    )}
              </div>
            )}

            {isRegistered && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <p className="font-bold text-emerald-800 text-lg">You are enrolled</p>
                <p className="text-emerald-700 mt-1">Enjoy your learning journey!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slot Selection Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Choose Your Batch Slot</h3>
            <div className="space-y-3 mb-6">
              {availableSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => handleSlotSelect(slot)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left cursor-pointer"
                >
                  <p className="font-medium">{slot.date}</p>
                  <p className="text-sm text-gray-600">{slot.time}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSlotModal(false)}
              className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Course: <span className="font-medium">{course.title}</span></p>
              <p className="text-sm text-gray-600">Slot: <span className="font-medium">{selectedSlot?.date} {selectedSlot?.time}</span></p>
              <p className="text-lg font-bold text-green-600 mt-3">Total: {course.price}</p>
            </div>
            <button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 transition cursor-pointer"
            >
              Pay Now
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}