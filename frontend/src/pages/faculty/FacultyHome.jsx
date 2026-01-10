// src/pages/faculty/FacultyHome.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Users,
  Star,
  Clock,
  Calendar,
  Bell,
  BarChart3,
  Search,
  ChevronRight,
  X,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig.js'; 

const FacultyHome = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data state
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${apiConfig.API_BASE_URL}/api/faculty/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setDashboardData(response.data.dashboard);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Unable to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  
  const facultyName = dashboardData?.faculty?.name || '';
  const facultyDesignation = dashboardData?.faculty?.designation || 'Faculty Member';

  const initials = facultyName
    ? facultyName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  const totalCourses = dashboardData?.totalCourses ?? 0;

  const assignedCourses = dashboardData?.recentCourses
    ? dashboardData.recentCourses.map(course => ({
        id: course.id,
        title: course.title,
        code: `CSE-${String(course.id).padStart(3, '0')}`,
        students: Math.floor(Math.random() * 60) + 20, 
        status: course.type === 'Live' ? 'Active' : 'Upcoming',
        thumbnail: course.thumbnail
      }))
    : [];

  const filteredCourses = useMemo(() => {
    return assignedCourses.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, assignedCourses]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  
  const upcomingClasses = [
    { title: "Advanced ML – Lecture 12", datetime: "Tomorrow, 10:00 AM – 11:30 AM", room: "Room A-204" },
    { title: "DSA – Lab Session", datetime: "Nov 20, 2:00 PM – 4:00 PM", room: "Lab B-12" },
    { title: "Advanced ML – Lecture 12", datetime: "Tomorrow, 10:00 AM – 11:30 AM", room: "Room A-204" },
    { title: "DSA – Lab Session", datetime: "Nov 20, 2:00 PM – 4:00 PM", room: "Lab B-12" },
    { title: "Advanced ML – Lecture 12", datetime: "Tomorrow, 10:00 AM – 11:30 AM", room: "Room A-204" },
    { title: "DSA – Lab Session", datetime: "Nov 20, 2:00 PM – 4:00 PM", room: "Lab B-12" },
    { title: "Advanced ML – Lecture 12", datetime: "Tomorrow, 10:00 AM – 11:30 AM", room: "Room A-204" },
    { title: "DSA – Lab Session", datetime: "Nov 20, 2:00 PM – 4:00 PM", room: "Lab B-12" },
  ];

  const upcomingExams = [
    { title: "Mid-term – Advanced ML", datetime: "Nov 25, 9:00 AM – 11:00 AM", location: "Hall C" },
    { title: "Quiz – DSA", datetime: "Nov 28, 3:00 PM – 4:00 PM", location: "Online" },
    { title: "Mid-term – Advanced ML", datetime: "Nov 25, 9:00 AM – 11:00 AM", location: "Hall C" },
    { title: "Quiz – DSA", datetime: "Nov 28, 3:00 PM – 4:00 PM", location: "Online" },
    { title: "Mid-term – Advanced ML", datetime: "Nov 25, 9:00 AM – 11:00 AM", location: "Hall C" },
    { title: "Quiz – DSA", datetime: "Nov 28, 3:00 PM – 4:00 PM", location: "Online" },
  ];

  const notifications = [
    { message: "Mid-term schedule released", time: "2 hours ago", type: "urgent" },
    { message: "Room change for CSE-405", time: "5 hours ago", type: "warning" },
    { message: "New grading policy update", time: "Yesterday", type: "info" },
    { message: "Mid-term schedule released", time: "2 hours ago", type: "urgent" },
    { message: "Room change for CSE-405", time: "5 hours ago", type: "warning" },
    { message: "New grading policy update", time: "Yesterday", type: "info" }
  ];

  // Loading & Error states (after all hooks)
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl text-red-600">{error || 'No dashboard data available'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white sticky top-0 z-50 shadow-lg">
        <div className="px-8 py-4 flex justify-between items-center   mx-auto">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-xl flex items-center justify-center">
              <span className="text-3xl font-black">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">iLMS Faculty</h1>
              <p className="text-xs opacity-90 -mt-1">Faculty Management Portal</p>
            </div>
          </div>

          {/* Right Side – Notification + Profile */}
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2.5 hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-[#1e3a8a] text-white p-5 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Notifications</h3>
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="hover:bg-white/20 p-1 rounded cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif, i) => (
                      <div key={i} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                          notif.type === 'urgent' ? 'bg-red-50' : notif.type === 'warning' ? 'bg-yellow-50' : ''
                      }`}>
                        <p className="font-semibold text-gray-900">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <div className="text-right">
                <p className="font-semibold">{facultyName}</p>
                <p className="text-xs opacity-90">{facultyDesignation}</p>
              </div>
              <div
                className="w-11 h-11 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl font-bold cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {initials}
              </div>

              {/* Profile Dropdown */}
              <div>
              {isProfileOpen && (
                <div className="absolute right-8 mt-9 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-[#1e3a8a] text-white p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                        {initials}
                      </div>
                      <div>
                        <p className="text-lg font-bold">{facultyName}</p>
                        <p className="text-sm opacity-90">{facultyDesignation}</p>
                      </div>
                    </div>
                  </div>

                    {/* Body */}
                  <div className="p-3">
                    <button
                        onClick={() => navigate('/profile')}
                      className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-gray-50 rounded-xl transition cursor-pointer"
                    >
                      <User className="w-5 h-5 text-[#1e3a8a]" />
                      <span className="font-medium text-gray-800">My Profile</span>
                    </button>

                    <button
                        onClick={() => navigate('/settings')}
                      className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-gray-50 rounded-xl transition cursor-pointer"
                    >
                      <Settings className="w-5 h-5 text-[#1e3a8a]" />
                      <span className="font-medium text-gray-800">Settings</span>
                    </button>

                    <hr className="my-2 border-gray-200" />

                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                      }}
                      className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-red-50 text-red-600 rounded-xl transition cursor-pointer"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-8 py-10">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Courses", value: totalCourses, icon: BookOpen, link: "/totalcourses" },
            { label: "Students Enrolled", value: 342, icon: Users },
            { label: "Average Rating", value: "4.6/5", icon: Star }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition cursor-pointer"
                onClick={() => stat.link && navigate(stat.link)}
              >
                <div className="p-3 rounded-xl bg-[#1e3a8a]">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* My Recent Courses */}
          <section className="md:col-span-2">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#1e3a8a]" />
                My Recent Courses
              </h2>
              <button className="text-[#1e3a8a] hover:text-indigo-700 font-medium flex items-center gap-1 cursor-pointer"
              onClick={() => navigate('/totalcourses')}>
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg max-h-80 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {filteredCourses.length === 0 ? (
                  <li className="p-6 text-center text-gray-500">No courses found</li>
                ) : (
                  filteredCourses.map((course) => (
                    <li
                      key={course.id}
                      onClick={() => handleCourseClick(course.id)}
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition"
                    >
                      <img
                        src={course.thumbnail ? `${apiConfig.API_BASE_URL}/uploads/${course.thumbnail}` : '/fallback-course.jpg'}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                        onError={(e) => (e.target.src = '/fallback-course.jpg')}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.code} • {course.students} students</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                          course.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#1e3a8a]" />
              Notifications
            </h2>
            <div className="bg-white rounded-2xl shadow-lg max-h-80 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {notifications.map((notif, i) => (
                  <li key={i} className="p-4 flex items-start gap-3">
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                      notif.type === 'urgent' ? 'bg-red-500' : 
                      notif.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-500">{notif.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Upcoming Classes & Exams */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Upcoming Classes */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-600" />
              Upcoming Classes
            </h2>
            <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {upcomingClasses.map((cls, i) => (
                <div key={i} className="p-5 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{cls.title}</p>
                    <p className="text-sm text-gray-500">{cls.datetime}</p>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                    {cls.room}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Exams */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-600" />
              Upcoming Exams
            </h2>
            <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {upcomingExams.map((exam, i) => (
                <div key={i} className="p-5 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{exam.title}</p>
                    <p className="text-sm text-gray-500">{exam.datetime}</p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    {exam.location}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Analytical Dashboard */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Analytical Dashboard
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl h-64 flex items-center justify-center p-6">
                <p className="text-gray-400 text-center">Student Performance Analytics<br/>(Chart.js / ApexCharts)</p>
              </div>
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl h-64 flex items-center justify-center p-6">
                <p className="text-gray-400 text-center">Attendance & Engagement Trends<br/>(Chart.js / ApexCharts)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
          © 2025 Cybernetics LMS • Faculty Portal
        </footer>
      </div>
    </div>
  );
};

export default FacultyHome;