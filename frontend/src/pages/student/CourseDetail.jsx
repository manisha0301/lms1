// src/pages/student/CourseDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, FileText, Calendar, Clock, CheckCircle, 
  Lock, CreditCard, Users, Video, BookOpen, Award,
  Download, X, Loader2, Star
} from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';

export default function CourseDetail() {
  // Helper to format date as DD-MM-YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Assignment Modal State
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentUploadLoading, setAssignmentUploadLoading] = useState(false);
  const [assignmentUploadError, setAssignmentUploadError] = useState(null);
  const [uploadedAnswers, setUploadedAnswers] = useState({}); // { assignmentId: fileUrl for preview }
  const fileInputRefs = useRef({});

  // Real assignments from backend
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);

  // NEW: Real exam activation states
  const [activeExam, setActiveExam] = useState(null);
  const [examLoading, setExamLoading] = useState(true);

  // NEW: Exam Results Modal & Data
  const [showExamModal, setShowExamModal] = useState(false);
  const [examResults, setExamResults] = useState([]);
  const [examResultsLoading, setExamResultsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for chapter modal
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoError, setVideoError] = useState('');

  // Added Rating State
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

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
          } else if (dbCourse.sections && Array.isArray(dbCourse.sections)) {
            sections = dbCourse.sections;
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

          // Real course content from database - safe fallback
          sections: sections || [],

          // ... rest of your course object ...
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

  // NEW: Fetch the logged-in user's own rating for this course on page load / refresh
  useEffect(() => {
    const fetchMyRating = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/student/courses/${id}/my-rating`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (res.data.success && res.data.rating !== null) {
          setUserRating(res.data.rating); // Restore your previous rating after refresh
        }
      } catch (err) {
        console.error('Failed to fetch your previous rating:', err);
      }
    };

    if (!loading && id) {
      fetchMyRating();
    }
  }, [id, loading]);

  // NEW: Fetch real exam activation status
  useEffect(() => {
    const fetchActiveExam = async () => {
      setExamLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/student/courses/${id}/exam-link`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success && res.data.exam) {
          setActiveExam(res.data.exam);
        } else {
          setActiveExam(null);
        }
      } catch (err) {
        console.error("Failed to fetch exam status:", err);
        setActiveExam(null);
      } finally {
        setExamLoading(false);
      }
    };

    fetchActiveExam();
  }, [id]);

  // NEW: Fetch real exam results when modal opens
  useEffect(() => {
    if (!showExamModal || !id) return;

    const fetchExamResults = async () => {
      setExamResultsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/student/courses/${id}/exam-results`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setExamResults(res.data.results || []);
        }
      } catch (err) {
        console.error("Failed to fetch exam results:", err);
        setExamResults([]);
      } finally {
        setExamResultsLoading(false);
      }
    };

    fetchExamResults();
  }, [showExamModal, id]);

  // Fetch real assignments when modal opens
  useEffect(() => {
    if (showAssignmentModal && id) {
      const fetchAssignments = async () => {
        setAssignmentsLoading(true);
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `${apiConfig.API_BASE_URL}/api/auth/student/courses/${id}/assignments`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (res.data.success) {
            setAssignments(res.data.assignments || []);
            console.log("Assignments fetched:", res.data.assignments);
          }
        } catch (err) {
          console.error("Failed to load assignments:", err);
          setAssignmentUploadError("Could not load assignments");
        } finally {
          setAssignmentsLoading(false);
        }
      };

      fetchAssignments();
    }
  }, [showAssignmentModal, id]);

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

  // Updated: Real upload to backend
  const handleAnswerUpload = async (assignmentId, file) => {
    setAssignmentUploadLoading(true);
    setAssignmentUploadError(null);
    try {
      const formData = new FormData();
      formData.append('assessmentPdf', file);

      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/student/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.data.success) {
        const fileUrl = URL.createObjectURL(file); // local preview
        setUploadedAnswers(prev => ({ ...prev, [assignmentId]: fileUrl }));
        alert('Answer uploaded successfully!');
      }
    } catch (err) {
      setAssignmentUploadError('Failed to upload answer: ' + (err.response?.data?.error || err.message));
    } finally {
      setAssignmentUploadLoading(false);
    }
  };

  // NEW: Open chapter modal and fetch real video using student endpoint
  const openChapterModal = async (chapter) => {
    setSelectedChapter(chapter);
    setShowChapterModal(true);
    setVideoData(null);
    setVideoError('');
    setLoadingVideo(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${apiConfig.API_BASE_URL}/api/auth/student/chapter-video/${chapter.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success && res.data.video) {
        setVideoData(res.data.video);
      } else {
        setVideoError('No lecture video available yet');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setVideoError('No lecture video uploaded for this chapter yet');
      } else {
        setVideoError('Failed to load video. Please try again.');
        console.error('Video fetch error:', err);
      }
    } finally {
      setLoadingVideo(false);
    }
  };

  // NEW: Submit rating to backend
  const handleSubmitRating = async (selectedRating) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to rate this course');
        return;
      }

      const response = await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/student/courses/${id}/rate`,
        { rating: selectedRating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setUserRating(selectedRating); // Update local state to show filled stars
        alert(`Thank you! You rated this course ${selectedRating}/5`);
      } else {
        alert(response.data.error || 'Failed to submit rating');
      }
    } catch (err) {
      console.error('Rating submission error:', err);
      const errorMsg = err.response?.data?.error || 'Something went wrong. Please try again.';
      alert(errorMsg);
    }
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

              {/* ⭐ Interactive Rating */}
              <div className="flex items-left gap-2 mt-4 flex-col">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      className={`cursor-pointer transition ${
                        (hoverRating || userRating) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleSubmitRating(star)}
                    />
                  ))}
                </div>
                <span className="text-blue-100 text-sm">
                  {userRating > 0
                    ? `You rated this course ${userRating} / 5`
                    : "Rate this course"}
                </span>
              </div>

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
                <div className="space-y-8">
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
                                          <div
                                            key={chapter.id || idx}
                                            onClick={() => openChapterModal(chapter)}
                                            className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer group"
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
                                                <Play className="w-5 h-5 text-[#1e40af] opacity-0 group-hover:opacity-100 transition" />
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
                {course.notes?.length > 0 && (
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

                  {examLoading ? (
                    <button
                      className="block w-full bg-gray-400 text-white py-3 rounded-lg font-medium transition cursor-not-allowed"
                      disabled
                    >
                      Checking exam status...
                    </button>
                  ) : activeExam ? (
                    <a
                      href={activeExam.examLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
                    >
                      Start Exam
                    </a>
                  ) : (
                    <button
                      className="block w-full bg-gray-400 text-white py-3 rounded-lg font-medium transition cursor-not-allowed"
                      disabled
                    >
                      No Active Exam
                    </button>
                  )}
                  <button 
                    onClick={() => setShowExamModal(true)}
                    className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    View Exam Results
                  </button>
                </div>

                {showExamModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-8 relative max-h-[80vh] overflow-y-auto">
                      <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold cursor-pointer"
                        onClick={() => setShowExamModal(false)}
                      >
                        <X />
                      </button>
                      <h2 className="text-2xl font-bold mb-6 text-[#1e3a8a]">Exam Results</h2>

                      {examResultsLoading ? (
                        <div className="text-center py-10">
                          <Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a] mx-auto" />
                          <p className="mt-4 text-gray-600">Loading your results...</p>
                        </div>
                      ) : examResults.length === 0 ? (
                        <div className="text-center py-10 text-gray-600">
                          No exam results available yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-[#1e3a8a] text-white">
                              <tr>
                                <th className="px-4 py-3 text-center text-sm">Submitted At</th>
                                <th className="px-4 py-3 text-center text-sm">Full Marks</th>
                                <th className="px-4 py-3 text-center text-sm">Marks Obtained</th>
                                <th className="px-4 py-3 text-center text-sm">Remarks</th>
                                <th className="px-4 py-3 text-center text-sm">Answer Sheet</th>
                              </tr>
                            </thead>
                            <tbody>
                              {examResults.map((exam, index) => (
                                <tr key={index} className="border-b hover:bg-blue-50">
                                  <td className="px-4 py-3 text-center text-sm">
                                    {formatDate(exam.submitted_at)}
                                  </td>
                                  <td className="px-4 py-3 text-center text-sm font-medium">
                                    {exam.full_marks}
                                  </td>
                                  <td className="px-4 py-3 text-center text-sm font-medium">
                                    {exam.marks_obtained ?? 'Not Graded'}
                                  </td>
                                  <td className="px-4 py-3 text-center text-sm">
                                    {exam.remarks || '-'}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {exam.answer_pdf_path ? (
                                      <a
                                        href={`${apiConfig.API_BASE_URL}/uploads/${exam.answer_pdf_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 font-semibold hover:underline text-sm"
                                      >
                                        View Answer Sheet
                                      </a>
                                    ) : (
                                      <span className="text-gray-500 text-sm">Not Available</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
                      <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
                        onClick={() => setShowAssignmentModal(false)}
                      >
                        ×
                      </button>

                      <h2 className="text-2xl font-bold mb-6 text-[#1e3a8a]">Assessments</h2>

                      {assignmentsLoading ? (
                        <p className="text-center text-gray-500 py-8">Loading assessments...</p>
                      ) : assignments.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No assessments available yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-[#1e3a8a] text-white">
                              <tr>
                                <th className="px-4 py-3 text-left">Test Name</th>
                                <th className="px-4 py-3 text-center">Full Marks</th>
                                <th className="px-4 py-3 text-center">Due Date</th>
                                <th className="px-4 py-3 text-center">Question</th>
                                <th className="px-4 py-3 text-center">Answer</th>
                                <th className="px-4 py-3 text-center">Marks Obtained</th>
                                <th className="px-4 py-3 text-center">Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {assignments.map((a) => (
                                <tr key={a.id} className="border-b hover:bg-blue-50">
                                  <td className="px-4 py-3 font-medium">{a.test_name}</td>
                                  <td className="px-4 py-3 text-center">{a.marks}</td>
                                  <td className="px-4 py-3 text-center">{formatDate(a.due_date)}</td>
                                  <td className="px-4 py-3 text-center">
                                    <a
                                      href={`${apiConfig.API_BASE_URL}/uploads/${a.question_pdf}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 font-semibold hover:underline"
                                    >
                                      Download
                                    </a>
                                  </td>
                                  <td className="px-4 py-3 text-center">

                                    {(a.answer_pdf || uploadedAnswers[a.id]) ? (
                                      <a
                                        href={a.answer_pdf ? `${apiConfig.API_BASE_URL}/uploads/${a.answer_pdf}` : uploadedAnswers[a.id]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 font-semibold mr-2"
                                      >
                                        View
                                      </a>
                                    ) : null}

                                    <input
                                      type="file"
                                      accept="application/pdf"
                                      hidden
                                      ref={el => (fileInputRefs.current[a.id] = el)}
                                      onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleAnswerUpload(a.id, e.target.files[0]);
                                        }
                                      }}
                                    />

                                    <button
                                      onClick={() => fileInputRefs.current[a.id]?.click()}
                                      className="bg-[#1e3a8a] text-white px-3 py-1 rounded-md text-sm hover:bg-[#1e40af]"
                                      disabled={assignmentUploadLoading}
                                    >
                                      {(a.answer_pdf || uploadedAnswers[a.id]) ? 'Re-upload' : 'Upload'}
                                    </button>
                                  </td>
                                  <td className="px-4 py-3 text-center">{a.marks_obtained ?? 'Not Assigned'}</td>
                                  <td className="px-4 py-3 text-center">{a.remarks ?? 'Not Assigned'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {assignmentUploadError && (
                        <p className="text-red-600 mt-3 text-sm text-center">{assignmentUploadError}</p>
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

      {/* Chapter Modal - Opens when clicking a chapter */}
      {showChapterModal && selectedChapter && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-100 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedChapter.title || 'Chapter Content'}
              </h3>
              <button
                onClick={() => setShowChapterModal(false)}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Body - Real video fetch & playback */}
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              {loadingVideo ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-[#1e40af]" />
                  <p className="text-gray-700">Loading lecture video...</p>
                </div>
              ) : videoError ? (
                <div className="flex flex-col items-center gap-4">
                  <Play className="w-16 h-16 text-[#1e40af]" />
                  <h4 className="text-2xl font-bold text-gray-800">
                    No Lecture Video Yet
                  </h4>
                  <p className="text-gray-600 max-w-md">
                    {videoError}
                  </p>
                </div>
              ) : videoData ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <video
                    controls
                    autoPlay
                    className="w-full max-h-[70vh] rounded-lg shadow-lg"
                    src={`${apiConfig.API_BASE_URL}${videoData.video_path}`}
                    onError={() => setVideoError('Failed to play video - file may be unavailable')}
                  >
                    <source src={`${apiConfig.API_BASE_URL}${videoData.video_path}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <p className="text-gray-700">Preparing...</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 text-center">
              <button
                onClick={() => setShowChapterModal(false)}
                className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
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