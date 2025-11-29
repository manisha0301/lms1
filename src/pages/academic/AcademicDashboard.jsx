import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Building2, 
  Bell, 
  PlusCircle, 
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  BarChart3,
  X,
  Upload,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AcademicDashboard = () => {
  const navigate= useNavigate();
  const [hoveredStat, setHoveredStat] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const [courseFormData, setCourseFormData] = useState({
    courseImage: null,
    courseName: '',
    courseType: 'full-time',
    coursePrice: '',
    meetingLink: '',
    selectedTeachers: [],
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  const [courseImagePreview, setCourseImagePreview] = useState(null);

  // Faculty Form State
  const [facultyFormData, setFacultyFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    employmentStatus: 'employed',
    designation: '',
    qualification: '',
    profilePicture: null,
    password: ''
  });
  const [profilePreview, setProfilePreview] = useState(null);

  // Sample teachers for multi-select
  const availableTeachers = [
    { id: 1, name: "Dr. Priya Sharma", subject: "React & Node.js" },
    { id: 2, name: "Prof. Amit Kumar", subject: "MERN Stack" },
    { id: 3, name: "Ms. Sneha Patel", subject: "Python & Django" },
    { id: 4, name: "Mr. Rajesh Mehta", subject: "Data Science" },
  ];

  const stats = {
    totalCourses: 48,
    totalFaculties: 23,
    totalCenters: 12,
    todayAddedCourses: 3,
  };

  const recentCourses = [
    { id: 1, name: "Advanced React & Node.js", addedOn: "Nov 18, 2025", students: 87, trend: "+12%" },
    { id: 2, name: "Full Stack MERN Bootcamp", addedOn: "Nov 17, 2025", students: 102, trend: "+8%" },
    { id: 3, name: "Data Science with Python", addedOn: "Nov 16, 2025", students: 65, trend: "+15%" },
  ];

  const recentFaculties = [
    { id: 1, name: "Dr. Priya Sharma", qualification: "PhD Computer Science", joined: "2 days ago", initials: "PS" },
    { id: 2, name: "Prof. Amit Kumar", qualification: "M.Tech AI/ML", joined: "5 days ago", initials: "AK" },
  ];

  const topCourses = [
    { rank: 1, name: "MERN Stack Development", enrollments: 342, rating: 4.9, category: "Web Dev" },
    { rank: 2, name: "Python Django Full Course", enrollments: 298, rating: 4.8, category: "Backend" },
    { rank: 3, name: "React Native Mobile App", enrollments: 276, rating: 4.7, category: "Mobile" },
  ];

  const notifications = [
    { id: 1, type: "exam", message: "Prof. Rahul requested exam link approval for 'JavaScript Advanced'", time: "2 hours ago", status: "pending", priority: "high" },
    { id: 2, type: "exam", message: "Prof. Sneha requested exam approval for 'React Hooks'", time: "5 hours ago", status: "pending", priority: "medium" },
    { id: 3, type: "info", message: "New batch scheduled for MERN course starting Dec 1", time: "1 day ago", status: "approved", priority: "low" },
    { id: 4, type: "info", message: "New batch scheduled for MERN course starting Dec 1", time: "1 day ago", status: "approved", priority: "low" },
    { id: 5, type: "info", message: "New batch scheduled for MERN course starting Dec 1", time: "1 day ago", status: "approved", priority: "low" },
    { id: 6, type: "info", message: "New batch scheduled for MERN course starting Dec 1", time: "1 day ago", status: "approved", priority: "low" },
    { id: 7, type: "info", message: "New batch scheduled for MERN course starting Dec 1", time: "1 day ago", status: "approved", priority: "low" },
    { id: 8, type: "info", message: "New batch scheduled for MERN course starting Dec 1", time: "1 day ago", status: "approved", priority: "low" },
    { id: 9, type: "info", message: "New batch scheduled for MERN course starting Dec 1", time: "1 day ago", status: "approved", priority: "low" },
  ];

  // Handle image upload
  const handleCourseImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseFormData({ ...courseFormData, courseImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Picture Upload
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFacultyFormData({ ...facultyFormData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Toggle teacher selection
  const toggleTeacher = (teacherId) => {
    setCourseFormData(prev => ({
      ...prev,
      selectedTeachers: prev.selectedTeachers.includes(teacherId)
        ? prev .selectedTeachers.filter(id => id !== teacherId)
        : [...prev.selectedTeachers, teacherId]
    }));
  };

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    console.log("New Course Data:", courseFormData);
    alert("Course created successfully!");
    setIsCourseModalOpen(false);
    // Reset form
    setCourseFormData({
      courseImage: null, courseName: '', courseType: 'full-time', coursePrice: '',
      meetingLink: '', selectedTeachers: [], startDate: '', endDate: '',
      startTime: '', endTime: '', description: ''
    });
    setCourseImagePreview(null);
  };

  const handleFacultySubmit = (e) => {
    e.preventDefault();
    console.log("New Faculty:", facultyFormData);
    alert("Faculty added successfully!");
    setIsFacultyModalOpen(false);
    // Reset form
    setFacultyFormData({
      name: '', email: '', phone: '', address: '', employmentStatus: 'employed',
      designation: '', qualification: '', profilePicture: null, password: ''
    });
    setProfilePreview(null);
  };

  const handleCourseClick = () => {
    navigate('/academic/totalcourses');
  };

  const handleCenterClick = () => {
    navigate('/academic/centers');
  };

  const handleFacultyClick = () => {
    navigate('/academic/faculties');
  };

  const handleApprovalsClick = () => {
    navigate('/academic/approvals');
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-8 py-4 flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Academic Dashboard
              </h1>
              <p className="text-xs text-gray-500 font-medium">Learning Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2.5 text-gray-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:scale-105">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-white"></span>
              </button>
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  
                  {/* Dropdown Box */}
                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <h3 className="text-lg font-bold">Notifications</h3>
                      <p className="text-sm opacity-90">You have {notifications.length} unread messages</p>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.slice(0, 3).map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all cursor-pointer ${
                            notif.priority === 'high' ? 'bg-red-50' : notif.priority === 'medium' ? 'bg-orange-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              notif.type === 'exam' ? 'bg-orange-100' : 'bg-blue-100'
                            }`}>
                              {notif.type === 'exam' ? 
                                <CheckCircle className="w-5 h-5 text-orange-600" /> : 
                                <Bell className="w-5 h-5 text-blue-600" />
                              }
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                              {notif.status === 'pending' && (
                                <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                                  PENDING
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <button 
                        onClick={() => {
                          setShowAllNotifications(true);
                          setIsNotificationOpen(false);
                        }}
                        className="w-full text-center text-indigo-600 font-semibold hover:text-indigo-700 transition-all hover:underline"
                      >
                        View All Notifications →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">Academic Admin</p>
                <p className="text-xs text-gray-500">admin@codekart.com</p>
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                AA
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 py-8 max-w-[1600px] mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={handleCourseClick}
            onMouseEnter={() => setHoveredStat(1)}
            onMouseLeave={() => setHoveredStat(null)}
            className={`bg-white rounded-2xl p-6 shadow-lg border border-blue-100 transition-all duration-300 cursor-pointer ${
              hoveredStat === 1 ? 'scale-105 shadow-2xl shadow-blue-500/20' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalCourses}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    +{stats.todayAddedCourses} today
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={handleFacultyClick}
            onMouseEnter={() => setHoveredStat(2)}
            onMouseLeave={() => setHoveredStat(null)}
            className={`bg-white rounded-2xl p-6 shadow-lg border border-green-100 transition-all duration-300 cursor-pointer ${
              hoveredStat === 2 ? 'scale-105 shadow-2xl shadow-green-500/20' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Faculties</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalFaculties}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    Active & Approved
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={handleCenterClick}
            onMouseEnter={() => setHoveredStat(3)}
            onMouseLeave={() => setHoveredStat(null)}
            className={`bg-white rounded-2xl p-6 shadow-lg border border-purple-100 transition-all duration-300 cursor-pointer ${
              hoveredStat === 3 ? 'scale-105 shadow-2xl shadow-purple-500/20' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Centers</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalCenters}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    Across India
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={handleApprovalsClick}
            onMouseEnter={() => setHoveredStat(4)}
            onMouseLeave={() => setHoveredStat(null)}
            className={`bg-white rounded-2xl p-6 shadow-lg border border-orange-100 transition-all duration-300 cursor-pointer ${
              hoveredStat === 4 ? 'scale-105 shadow-2xl shadow-orange-500/20' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium mb-1">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">2</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                    Exam Links
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notifications & Exam Approvals */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Notifications & Approvals</h2>
                    <p className="text-xs text-gray-500">Manage pending exam requests</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                  2 pending
                </span>
              </div>
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div key={notif.id} className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {notif.type === 'exam' ? (
                          <div className="w-11 h-11 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5 text-amber-600" />
                          </div>
                        ) : (
                          <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1 leading-relaxed">{notif.message}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{notif.time}</span>
                            {notif.priority === 'high' && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                                High Priority
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {notif.status === 'pending' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center gap-1.5 shadow-lg shadow-green-500/20 transition-all duration-200 hover:scale-105">
                            <CheckCircle className="w-4 h-4" /> Approve
                          </button>
                          <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 flex items-center gap-1.5 shadow-lg shadow-red-500/20 transition-all duration-200 hover:scale-105">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Statistics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Course Statistics</h2>
                  <p className="text-xs text-gray-500">Enrollment trends over time</p>
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-gray-50 to-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Chart Visualization</p>
                  <p className="text-xs text-gray-400 mt-1">Recharts / Chart.js Integration</p>
                </div>
              </div>
            </div>

            {/* Recent Courses */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Recent Courses</h2>
                    <p className="text-xs text-gray-500">Latest additions to catalog</p>
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {recentCourses.map(course => (
                  <div key={course.id} className="group flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">{course.name}</p>
                      <p className="text-sm text-gray-500">Added on {course.addedOn}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {course.students}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">students</p>
                      </div>
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                        {course.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setIsCourseModalOpen(true)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:scale-105 font-semibold">
                  <PlusCircle className="w-5 h-5" />
                  <span>Create New Course</span>
                </button>
                <button 
                  onClick={() => setIsFacultyModalOpen(true)}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-indigo-300 transition-all duration-200 font-semibold hover:scale-105">
                  <Users className="w-5 h-5" />
                  <span>Add New Faculty</span>
                </button>
              </div>
            </div>

            {/* Recently Joined Faculties */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">New Faculties</h3>
              </div>
              <div className="space-y-4">
                {recentFaculties.map(faculty => (
                  <div key={faculty.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                      {faculty.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{faculty.name}</p>
                      <p className="text-xs text-gray-600 font-medium">{faculty.qualification}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Joined {faculty.joined}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Courses */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Top Performers</h3>
              </div>
              <div className="space-y-3">
                {topCourses.map(course => (
                  <div key={course.rank} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0 ${
                        course.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-500/30' : 
                        course.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-500/30' : 
                        'bg-gradient-to-br from-orange-500 to-red-500 shadow-orange-500/30'
                      }`}>
                        {course.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                          {course.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500 font-medium">{course.enrollments} enrolled</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            {course.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                      <span>★</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Add New Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
              <button 
                onClick={() => setIsCourseModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCourseSubmit} className="p-8 space-y-6">
              {/* Course Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Course Image</label>
                <div className="flex items-center gap-6">
                  <div className="shrink-0">
                    {courseImagePreview ? (
                      <img src={courseImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl shadow-lg" />
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                        <Upload className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCourseImageUpload}
                      className="hidden"
                      id="course-image"
                    />
                    <label 
                      htmlFor="course-image"
                      className="px-5 py-3 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 font-medium"
                    >
                      <Upload className="w-4 h-4" /> Upload Image
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Recommended: 1200x800px, JPG/PNG</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Name</label>
                  <input
                    type="text"
                    required
                    value={courseFormData.courseName}
                    onChange={(e) => setCourseFormData({...courseFormData, courseName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Advanced MERN Stack Development"
                  />
                </div>

                {/* Course Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Type</label>
                  <select
                    value={courseFormData.courseType}
                    onChange={(e) => setCourseFormData({...courseFormData, courseType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="weekend">Weekend Batch</option>
                    <option value="self-paced">Self-Paced</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Course Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={courseFormData.coursePrice}
                    onChange={(e) => setCourseFormData({...courseFormData, coursePrice: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="29999"
                  />
                </div>

                {/* Meeting Link */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Class Meeting Link</label>
                  <input
                    type="url"
                    value={courseFormData.meetingLink}
                    onChange={(e) => setCourseFormData({...courseFormData, meetingLink: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="https://meet.google.com/abc-def-ghi"
                  />
                </div>
              </div>

              {/* Assign Teachers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Assign Teachers</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableTeachers.map(teacher => (
                    <label 
                      key={teacher.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        courseFormData.selectedTeachers.includes(teacher.id)
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={courseFormData.selectedTeachers.includes(teacher.id)}
                        onChange={() => toggleTeacher(teacher.id)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
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
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Batch Schedule
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                    <input type="date" required value={courseFormData.startDate} onChange={e => setCourseFormData({...courseFormData, startDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                    <input type="date" required value={courseFormData.endDate} onChange={e => setCourseFormData({...courseFormData, endDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
                    <input type="time" required value={courseFormData.startTime} onChange={e => setCourseFormData({...courseFormData, startTime: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
                    <input type="time" required value={courseFormData.endTime} onChange={e => setCourseFormData({...courseFormData, endTime: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Description</label>
                <textarea
                  rows={5}
                  required
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({...courseFormData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Describe the course content, objectives, prerequisites, and what students will learn..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    {/* Add New Faculty Modal */}
    {isFacultyModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Faculty</h2>
              <button 
                onClick={() => setIsFacultyModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleFacultySubmit} className="p-8 space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-8">
                <div className="shrink-0">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" id="profile-pic" />
                  <label htmlFor="profile-pic" className="px-6 py-3 bg-indigo-600 text-white rounded-xl cursor-pointer hover:bg-indigo-700 inline-flex items-center gap-2 font-medium shadow-lg">
                    <Upload className="w-5 h-5" /> Upload Profile Picture
                  </label>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG • Max 2MB • Square recommended</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Full Name
                  </label>
                  <input required type="text" value={facultyFormData.name} onChange={e => setFacultyFormData({...facultyFormData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Dr. Priya Sharma" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input required type="email" value={facultyFormData.email} onChange={e => setFacultyFormData({...facultyFormData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="priya@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </label>
                  <input required type="tel" value={facultyFormData.phone} onChange={e => setFacultyFormData({...facultyFormData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="+91 98765 43210" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Address
                  </label>
                  <input required type="text" value={facultyFormData.address} onChange={e => setFacultyFormData({...facultyFormData, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="123 Main St, Mumbai" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Employment Status
                  </label>
                  <select value={facultyFormData.employmentStatus} onChange={e => setFacultyFormData({...facultyFormData, employmentStatus: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="employed">Currently Employed</option>
                    <option value="unemployed">Currently Unemployed</option>
                    <option value="freelancer">Freelancer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Current Designation
                  </label>
                  <input type="text" value={facultyFormData.designation} onChange={e => setFacultyFormData({...facultyFormData, designation: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Senior React Developer" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Highest Qualification
                  </label>
                  <input required type="text" value={facultyFormData.qualification} onChange={e => setFacultyFormData({...facultyFormData, qualification: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="PhD in Computer Science" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Password
                  </label>
                  <input required type="password" value={facultyFormData.password} onChange={e => setFacultyFormData({...facultyFormData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button type="button" onClick={() => setIsFacultyModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold">
                  Cancel
                </button>
                <button type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
                  Add Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    {/* Full Notifications Screen */}
{showAllNotifications && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Notifications</h2>
          <p className="text-sm text-gray-500">Stay updated with all activities</p>
        </div>
        <button 
          onClick={() => setShowAllNotifications(false)}
          className="p-3 hover:bg-gray-100 rounded-xl transition-all"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-[65vh] divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`px-8 py-6 hover:bg-gray-50 transition-all ${
                notif.priority === 'high' ? 'bg-red-50' : notif.priority === 'medium' ? 'bg-orange-50' : 'bg-gray-50/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notif.type === 'exam' ? 'bg-orange-100' : 'bg-indigo-100'
                }`}>
                  {notif.type === 'exam' ? 
                    <CheckCircle className="w-6 h-6 text-orange-600" /> : 
                    <Bell className="w-6 h-6 text-indigo-600" />
                  }
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{notif.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{notif.time}</span>
                    {notif.status && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        notif.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        notif.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {notif.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 text-center">
        <button 
          onClick={() => setShowAllNotifications(false)}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg hover:scale-105 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default AcademicDashboard;