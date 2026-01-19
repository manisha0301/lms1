// src/pages/student/CourseDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, FileText, Calendar, Clock, CheckCircle, 
  Lock, CreditCard, Users, Video, BookOpen, Award,
  Download
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';


export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

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

  // Auto-cycle through daily live classes
  useEffect(() => {
    if (course && course.liveClasses && course.liveClasses.length > 0) {
      const interval = setInterval(() => {
        setCurrentDayIndex((prevIndex) => 
          (prevIndex + 1) % course.liveClasses.length
        );
      }, 24 * 60 * 60 * 1000); // Change every 24 hours

      return () => clearInterval(interval);
    }
  }, [course]);

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
                <div className="space-y-8 max-h-[700px] overflow-y-auto">
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
                    <div className="space-y-6">
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
                                          <div
                                            key={chapter.id || idx}
                                            className={`flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group ${
                                              chapter.locked ? 'opacity-60' : ''
                                            }`}
                                          >
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 group-hover:bg-[#1e3a8a]/10 group-hover:text-[#1e3a8a] transition">
                                              {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                              <p className="font-medium text-gray-800">{chapter.title}</p>
                                              {chapter.duration && <p className="text-xs text-gray-500 mt-0.5">{chapter.duration}</p>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                              {chapter.type === 'video' && <Video className="w-4 h-4 text-[#1e3a8a]" />}
                                              {chapter.type === 'quiz' && <Award className="w-4 h-4 text-green-600" />}
                                              {chapter.type === 'assignment' && <FileText className="w-4 h-4 text-orange-600" />}
                                              {chapter.locked ? (
                                                <Lock className="w-4 h-4 text-gray-400" />
                                              ) : (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                              )}
                                            </div>
                                          </div>
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#1e40af]" /> Live Classes Schedule
                  </h2>
                  {course.liveClasses && course.liveClasses.length > 0 ? (
                    <div className="flex items-center justify-between p-5 bg-blue-50 rounded-lg border border-blue-100">
                      <div>
                        <p className="font-semibold text-gray-900">{course.liveClasses[currentDayIndex].topic}</p>
                        <p className="text-sm text-gray-600">with {course.liveClasses[currentDayIndex].instructor}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{course.liveClasses[currentDayIndex].date}</p>
                        <p className="text-sm text-gray-600">{course.liveClasses[currentDayIndex].time}</p>
                      </div>
                      <a
                        href={course.liveClasses[currentDayIndex].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`ml-6 px-5 py-2 rounded-md text-sm font-medium transition ${
                          course.liveClasses[currentDayIndex].link !== '#' 
                            ? 'bg-[#1e40af] text-white hover:bg-[#1e3a8a] cursor-pointer' 
                            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        }`}
                      >
                        {course.liveClasses[currentDayIndex].link !== '#' ? 'Join Live' : 'No Link'}
                      </a>
                    </div>
                  ) : (
                    <div className="p-5 bg-gray-50 rounded-lg text-center text-gray-500">
                      No live classes scheduled
                    </div>
                  )}
                </div>

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
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition cursor-pointer">
                    View Assignments
                  </button>
                </div>
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