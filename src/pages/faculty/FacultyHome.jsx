// src/pages/faculty/FacultyHome.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
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

// Placeholder thumbnails (use your actual assets)
import course1 from '../../assets/node.webp';
import course2 from '../../assets/vue.webp';
import course3 from '../../assets/python.webp';

const FacultyHome = () => {
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // MOCK DATA (Frontend Only)
  const faculty = { name: "Dr. Sarah Chen", avatar: "SC", email: "sarah.chen@university.edu" };

  const stats = {
    totalCourses: 12,
    totalStudents: 342,
    avgRating: 4.6
  };

  const recentCourses = [
    { id: "node-201", title: "Advanced Node.js", code: "CSE-405", students: 48, status: "Active", thumbnail: course1 },
    { id: "dsa-101", title: "Data Structures & Algorithms", code: "CSE-201", students: 72, status: "Active", thumbnail: course2 },
    { id: "web-310", title: "Full Stack Web Dev", code: "CSE-310", students: 55, status: "Upcoming", thumbnail: course3 }
  ];

  const upcomingClasses = [
    { title: "Advanced ML – Lecture 12", datetime: "Tomorrow, 10:00 AM – 11:30 AM", room: "Room A-204" },
    { title: "DSA – Lab Session", datetime: "Nov 20, 2:00 PM – 4:00 PM", room: "Lab B-12" }
  ];

  const upcomingExams = [
    { title: "Mid-term – Advanced ML", datetime: "Nov 25, 9:00 AM – 11:00 AM", location: "Hall C" },
    { title: "Quiz – DSA", datetime: "Nov 28, 3:00 PM – 4:00 PM", location: "Online" }
  ];

  const notifications = [
    { message: "Mid-term schedule released", time: "2 hours ago", type: "urgent" },
    { message: "Room change for CSE-405", time: "5 hours ago", type: "warning" },
    { message: "New grading policy update", time: "Yesterday", type: "info" }
  ];

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    return recentCourses.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white sticky top-0 z-50 shadow-lg">
        <div className="px-8 py-4 flex justify-between items-center max-w-[1600px] mx-auto">
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
                <p className="font-semibold">{faculty.name}</p>
                <p className="text-xs opacity-90">Faculty Member</p>
              </div>
              <div 
                className="w-11 h-11 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl font-bold cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {faculty.avatar}
              </div>
              {/* Profile Dropdown - To be implemented */}
              <div>
                {isProfileOpen && (
                  <div className="absolute right-8 mt-9 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-[#1e3a8a] text-white p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                          A
                        </div>
                        <div>
                          <p className="text-lg font-bold">{faculty.name}</p>
                          <p className="text-sm opacity-90">{faculty.email}</p>
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
                        onClick={() => navigate('/login')}
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

      <div className='mx-auto px-8 py-10'>
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "indigo", link: "/totalcourses" },
            { label: "Students Enrolled", value: stats.totalStudents, icon: Users, color: "green" },
            { label: "Average Rating", value: `${stats.avgRating}/5`, icon: Star, color: "yellow" }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(stat.link)}>
                <div className={`p-3 rounded-xl bg-[#1e3a8a]`}>
                  <Icon className={`w-6 h-6 text-white`} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Search Bar */}
        <section className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-3 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* My Recent Courses */}
          <section className="xl:col-span-2">
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

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                      <img src={course.thumbnail} alt={course.title} className="w-16 h-16 rounded-lg object-cover" />
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
            <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-200">
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
            <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-200">
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
}


export default FacultyHome;