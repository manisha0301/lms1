// src/pages/student/ProfileDashboard.jsx
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  User, Mail, Phone, Calendar, Clock, BookOpen,
  CheckCircle, AlertCircle, Edit2, LogOut, Award,
  FileText, Users, ChevronRight, UploadCloud, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../config/apiConfig.js';

export default function ProfileDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const [assignmentStats, setAssignmentStats] = useState({
    totalAssignments: 0,
    submittedAssignments: 0,
    pendingAssignments: 0,
    progressPercent: 0
  });

  const [todayExam, setTodayExam] = useState(null);
  const [examLoading, setExamLoading] = useState(true);

  // INTERACTIVE UPLOAD STATES
  const fileInputRef = useRef(null);
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [examFile, setExamFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // NEW: State for live grace period tracking
  const [graceActive, setGraceActive] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get(`${apiConfig.API_BASE_URL}/api/auth/student/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setProfile(res.data.profile);
          setEditForm(res.data.profile);
        } else {
          setError(res.data.error || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Unable to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Fetch real upcoming classes
  useEffect(() => {
    const fetchUpcomingClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`${apiConfig.API_BASE_URL}/api/auth/student/upcoming-classes`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setUpcomingClasses(res.data.upcomingClasses || []);
        }
      } catch (err) {
        console.error('Upcoming classes fetch error:', err);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchUpcomingClasses();
  }, []);

  useEffect(() => {
    const fetchAssignmentProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/student/assignment-progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setAssignmentStats(res.data);
        }
      } catch (err) {
        console.error('Assignment progress fetch error:', err);
      }
    };

    fetchAssignmentProgress();
  }, []);

  // Fetch today's active exam from all enrolled courses
  useEffect(() => {
    const fetchTodayExam = async () => {
      setExamLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const coursesRes = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/student/courses`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!coursesRes.data.success || !coursesRes.data.courses?.length) {
          setTodayExam(null);
          setExamLoading(false);
          return;
        }

        const enrolledCourses = coursesRes.data.courses;

        let activeExam = null;
        for (const course of enrolledCourses) {
          const courseId = course.id || course.course_id;
          if (!courseId) continue;

          try {
            const examRes = await axios.get(
              `${apiConfig.API_BASE_URL}/api/auth/student/courses/${courseId}/exam-link`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (examRes.data.success && examRes.data.exam) {
              activeExam = examRes.data.exam;
              break;
            }
          } catch (err) {
            console.warn(`No active exam for course ${courseId}:`, err.message);
          }
        }

        setTodayExam(activeExam);
      } catch (err) {
        console.error('Failed to fetch today\'s exam:', err);
        setTodayExam(null);
      } finally {
        setExamLoading(false);
      }
    };

    fetchTodayExam();
  }, []);

  // NEW: Live grace period checker (runs immediately + every 60 seconds)
  useEffect(() => {
    if (!todayExam) {
      setGraceActive(false);
      return;
    }

    const checkGrace = () => {
      const active = isWithinGracePeriod();
      setGraceActive(active);
    };

    checkGrace(); // run immediately

    const interval = setInterval(checkGrace, 60000); // every 1 minute

    return () => clearInterval(interval);
  }, [todayExam]);

  const handleFileValidation = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Only PDF or DOC files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size must be under 5MB.");
      return;
    }

    setExamFile(file);
    setErrorMsg("");
  };

  const handleUpload = async () => {
    if (!selectedExamId || !examFile) {
      setErrorMsg("Please select exam and upload file.");
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(0);
      setErrorMsg("");
      setSuccessMsg("");

      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append("examId", selectedExamId);
      formData.append("file", examFile);

      await axios.post(
        `${apiConfig.API_BASE_URL}/api/auth/student/upload-exam`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          }
        }
      );

      setSuccessMsg("Exam answers uploaded successfully!");

      setTimeout(() => {
        setShowExamModal(false);
        setExamFile(null);
        setUploadProgress(0);
        setSelectedExamId("");
        setSuccessMsg("");
      }, 1500);

    } catch (err) {
      // ────────────────────────────────────────────────
      // IMPROVED ERROR HANDLING – shows exact backend message
      // ────────────────────────────────────────────────
      let errorMessage = "Upload failed. Please try again.";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 403) {
        errorMessage = "You have already submitted answers for this exam.";
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.error || "Invalid file or request.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setErrorMsg(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to format 24h time to 12h AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Check if we are still within the 15-minute grace period after exam end
  const isWithinGracePeriod = () => {
    if (!todayExam || !todayExam.date || !todayExam.endTime) {
      return false;
    }

    // Combine date and time into a valid date string
    const examEndStr = `${todayExam.date}T${todayExam.endTime}:00`;
    const examEnd = new Date(examEndStr);

    if (isNaN(examEnd.getTime())) {
      console.warn("Could not parse exam end time:", examEndStr);
      return true; // fallback - allow if parsing fails
    }

    const now = new Date();
    const graceEnd = new Date(examEnd.getTime() + 15 * 60 * 1000); // +15 minutes

    return now <= graceEnd;
  };

  const canUploadExam = todayExam && graceActive;

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.put(
        `${apiConfig.API_BASE_URL}/api/auth/student/profile`,
        {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          phone: editForm.phone,
          university: editForm.university
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        setProfile(res.data.profile);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(res.data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully');
    navigate('/login');
  };

  const goToCourse = (id) => {
    alert(`Navigating to course: ${id}`);
  };

  const initials = profile ? `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.toUpperCase() : '';

  const todayUpcomingClass = useMemo(() => {
    if (!upcomingClasses || upcomingClasses.length === 0) return null;
    const todayISO = new Date().toISOString().split('T')[0];
    return upcomingClasses.find(cls => cls.rawDate === todayISO);
  }, [upcomingClasses]);

  const overallProgress = assignmentStats.progressPercent || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-600">{error || 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Consistent Blue Header with breadcrumb-style text */}
      <div className="bg-[#1e3a8a] text-white p-8 mb-8">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-white mt-1 opacity-90">Manage your academic journey and track your milestones</p>
        </div>
      </div>

      <div className="mx-auto px-4 flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: Profile Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mx-auto">
                {initials}
              </div>
              {/* Active Status Badge */}
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-blue-600 font-medium mb-2">Student</p>
            <p className="text-xs text-gray-400 mb-6">
              Joined {profile.joinedDate || 'Date not available'}
            </p>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2.5 px-4 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-800 transition-shadow shadow-md"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          {/* Upcoming Classes Sidebar Card - REAL DATA */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-100 rounded-md">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              Upcoming Classes
            </h3>
            <div className="space-y-4 h-75 overflow-y-auto pr-2">
              {loadingClasses ? (
                <p className="text-sm text-gray-500 text-center py-4">Loading upcoming classes...</p>
              ) : !todayUpcomingClass ? (
                <p className="text-sm text-gray-500 text-center py-4">No class scheduled for today</p>
              ) : (
                <div className="p-3 border border-gray-50 bg-gray-50/50 rounded-lg hover:bg-purple-50 transition-colors">
                  <p className="font-semibold text-sm text-gray-800">{todayUpcomingClass.title}</p>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3"/> {todayUpcomingClass.datetime}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3"/> {todayUpcomingClass.instructor}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Content Area */}
        <div className="lg:w-2/3 space-y-6">
          {/* Section 1: Personal Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-8 pb-3 border-b border-gray-50">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">FULL NAME</p>
                <p className="text-gray-800 font-medium">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">EMAIL ADDRESS</p>
                <p className="text-gray-800 font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">PHONE NUMBER</p>
                <p className="text-gray-800 font-medium">{profile.phone}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">UNIVERSITY</p>
                <p className="text-gray-800 font-medium">{profile.university || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Overall Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Overall Progress</h3>
              </div>
              <span className="text-blue-600 font-bold">{overallProgress}%</span>
            </div>

            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-6">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm font-bold text-orange-900">Pending Assignments</p>
                  <p className="text-xs text-orange-700">Submit these before the deadline</p>
                </div>
              </div>
              <span className="text-3xl font-black text-orange-600">
                {assignmentStats.pendingAssignments}
              </span>
            </div>
          </div>

          {/* Section 3: Exam Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-green-100 rounded-md">
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Exam Progress</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Add Exam Answers Card */}
              <div className="flex flex-col justify-center items-center p-8 border border-gray-100 rounded-xl bg-white shadow-sm">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Add Exam Answers
                </h4>

                <button
                  onClick={() => setShowExamModal(true)}
                  disabled={!canUploadExam}
                  className={`px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg ${
                    canUploadExam
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed opacity-70"
                  }`}
                >
                  {canUploadExam ? "Upload Exam Sheet" : "Upload Closed (Grace Period Ended)"}
                </button>
              </div>

              {/* Right: Real exam data */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-green-700 font-bold uppercase mb-1">NEXT UPCOMING EXAM</p>

                  {examLoading ? (
                    <p className="text-gray-500 mt-2">Loading...</p>
                  ) : todayExam ? (
                    <>
                      <p className="text-xl font-bold text-gray-900">{todayExam.topic}</p>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {todayExam.date} {todayExam.startTime ? `${formatTime(todayExam.startTime)} - ${formatTime(todayExam.endTime)}` : ''}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold text-gray-900">None Scheduled</p>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        N/A
                      </p>
                    </>
                  )}
                </div>

                <button
                  onClick={() => todayExam?.examLink && window.open(todayExam.examLink, '_blank', 'noopener,noreferrer')}
                  disabled={!todayExam?.is_active_now}
                  className={`mt-4 w-full py-2 rounded-lg text-sm font-bold transition-colors shadow-sm ${
                    todayExam?.is_active_now
                      ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  Start Exam
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform scale-100 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Edit Profile</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                value={editForm.firstName || ''}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={editForm.lastName || ''}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="email"
                placeholder="Email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="text"
                placeholder="University"
                value={editForm.university || ''}
                onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE Upload Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">

            <button
              onClick={() => {
                setShowExamModal(false);
                setExamFile(null);
                setUploadProgress(0);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Upload Exam Answers
            </h3>

            {successMsg && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {errorMsg}
              </div>
            )}

            <select
              value={selectedExamId}
              onChange={(e) => {
                setSelectedExamId(e.target.value);
                setErrorMsg("");
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4"
            >
              <option value="">Select Exam</option>
              {todayExam && (
                <option value={todayExam.id}>
                  {todayExam.topic}
                </option>
              )}
            </select>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFileValidation(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <UploadCloud className="mx-auto mb-3 text-blue-600" size={40} />
              <p className="text-sm text-gray-600">
                Drag & Drop or Click to Upload
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF / DOC / DOCX (Max 5MB)
              </p>

              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileValidation(e.target.files[0])}
              />
            </div>

            {examFile && (
              <div className="mt-4 bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                <span className="truncate text-sm">{examFile.name}</span>
                <button
                  onClick={() => setExamFile(null)}
                  className="text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
            )}

            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {uploadProgress}%
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowExamModal(false)}
                className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                disabled={submitting}
                onClick={handleUpload}
                className={`flex-1 py-2.5 rounded-lg text-white ${
                  submitting
                    ? "bg-blue-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitting ? "Uploading..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}