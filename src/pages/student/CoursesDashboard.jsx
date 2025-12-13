// src/pages/student/CoursesDashboard.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { 
  Search, Bell, ChevronDown, User, Settings, LogOut, 
  BookOpen, Award, TrendingUp, Clock, IndianRupee, 
  Megaphone, Activity, X
} from 'lucide-react';

import oip from '../../assets/OIP.jpg';
import node from '../../assets/node.webp';
import vue from '../../assets/vue.webp';
import python from '../../assets/python.webp';
import java from '../../assets/java.webp';
import ml from '../../assets/ML.webp';

export default function CoursesDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const user = { firstName: "Rahul", lastName: "Sharma", email: "rahul.sharma@codekart.com" };

  const notifications = [
    { id: 1, title: "New Assignment Posted", desc: "React Masterclass - Module 6", time: "5 mins ago", unread: true },
    { id: 2, title: "Live Class Tomorrow", desc: "Node.js Advanced at 7:00 PM", time: "2 hours ago", unread: true },
    { id: 3, title: "Certificate Ready", desc: "Vue.js Essentials completed!", time: "1 day ago", unread: false }
  ];

  const announcements = [
    { id: 1, title: "New Batch Starting!", desc: "Full Stack Web Dev - 15th Dec 2025", time: "2 hours ago" },
    { id: 2, title: "Exam Schedule Released", desc: "Final Assessment on 20th Dec", time: "1 day ago" }
  ];

  const recentActivity = [
    { id: 1, action: "Completed Module 5", course: "React Masterclass", time: "30 mins ago" },
    { id: 2, action: "Submitted Assignment", course: "Node.js Advanced", time: "2 hours ago" },
    { id: 3, action: "Joined Live Class", course: "Java Spring Boot", time: "Yesterday" }
  ];

  const stats = { enrolled: 8, completed: 3, inProgress: 5 };

  const allCourses = [
    { id: "react-101", title: "React Masterclass", instructor: "John Doe", thumbnail: oip, progress: 80, duration: "3 Months", price: 19999 },
    { id: "node-201", title: "Node.js Advanced", instructor: "Jane Smith", thumbnail: node, progress: 45, duration: "6 Months", price: 24999 },
    { id: "vue-301", title: "Vue.js Essentials", instructor: "Mike Chen", thumbnail: vue, progress: 100, duration: "1 Month", price: 14999 },
    { id: "python-742", title: "Python for Data Science", instructor: "Sarah Lee", thumbnail: python, progress: 60, duration: "3 Months", price: 22999 },
    { id: "java-501", title: "Java Spring Boot", instructor: "Raj Patel", thumbnail: java, progress: 20, duration: "12 Months", price: 34999 },
    { id: "ml-601", title: "Machine Learning A-Z", instructor: "Dr. Kim", thumbnail: ml, progress: 0, duration: "6 Months", price: 39999 }
  ];

  const filteredCourses = useMemo(() => {
    let filtered = allCourses;
    if (searchQuery) filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedDuration !== 'all') filtered = filtered.filter(c => c.duration.includes(selectedDuration));
    return filtered;
  }, [searchQuery, selectedDuration]);

  const coursesToShow = showAllCourses ? filteredCourses : filteredCourses.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* OFFICIAL CODEKART NAVBAR - EXACT #1e3a8a COLOR */}
      <header className="bg-[#1e3a8a] text-white sticky top-0 z-50 shadow-lg">
        <div className="px-8 py-4 flex justify-between items-center">
          {/* Left: Official Branding */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-xl flex items-center justify-center">
              <span className="text-3xl font-black">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">iLMS</h1>
              <p className="text-xs opacity-90 -mt-1">LET'S CRAFT THE FUTURE!</p>
            </div>
          </div>

          {/* Right: Bell + Profile */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2.5 hover:bg-white/10 rounded-xl transition"
              >
                <Bell className="w-6 h-6" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-[#1e3a8a] text-white p-5 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Notifications</h3>
                    <button onClick={() => setNotificationOpen(false)} className="hover:bg-white/20 p-1 rounded">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition ${notif.unread ? 'bg-blue-50' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{notif.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notif.desc}</p>
                            <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                          </div>
                          {notif.unread && <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 text-center">
                    <button className="text-[#1e3a8a] font-medium text-sm hover:underline">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 hover:bg-white/10 px-4 py-2.5 rounded-xl transition"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-lg">
                  {user.firstName[0]}
                </div>
                {/* <ChevronDown className={`w-5 h-5 transition-transform ${profileOpen ? 'rotate-180' : ''}`} /> */}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-[#1e3a8a] text-white p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white/25 rounded-full flex items-center justify-center text-3xl font-bold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="text-xl font-bold">{user.firstName} {user.lastName}</p>
                        <p className="text-sm opacity-90">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <button onClick={() => navigate('/student/profile')} className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-gray-50 rounded-xl transition">
                      <User className="w-5 h-5 text-[#1e3a8a]" /> <span className="font-medium text-[#1e3a8a]">My Profile</span>
                    </button>
                    <button className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-gray-50 rounded-xl transition">
                      <Settings className="w-5 h-5 text-[#1e3a8a]" /> <span className="font-medium text-[#1e3a8a]">Settings</span>
                    </button>
                    <hr className="my-3 border-gray-200" />
                    <button className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-red-50 text-red-600 rounded-xl transition">
                      <LogOut className="w-5 h-5" /> <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Search Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-2 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-3 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-2 bg-gray-50 rounded-full text-lg focus:ring-4 focus:ring-[#1e3a8a]/20 focus:outline-none transition"
              />
            </div>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-8 py-2 bg-gray-50 rounded-full text-lg focus:ring-4 focus:ring-[#1e3a8a]/20"
            >
              <option value="all">All Durations</option>
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6+ Months</option>
            </select>
            <button
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-10 py-2 rounded-full font-semibold text-lg shadow-xl transition"
            >
              {showAllCourses ? 'Show Less' : 'View All'}
            </button>
          </div>
        </div>

        {/* My Enrolled Courses */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">My Enrolled Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {coursesToShow.map((course) => (
            <div key={course.id} onClick={() => navigate(`/student/course/${course.id}`)} className="bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all cursor-pointer">
              <div className="h-56 relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                {course.progress === 100 && (
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-5 py-2 rounded-full font-bold shadow-lg">
                    COMPLETED
                  </div>
                )}
              </div>
              <div className="p-7">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-5">by {course.instructor}</p>
                <div className="flex justify-between text-sm text-gray-600 mb-6">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {course.duration}</span>
                  <span className="flex items-center gap-2"><IndianRupee className="w-4 h-4" /> ₹{course.price.toLocaleString()}</span>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-bold text-[#1e3a8a] text-lg">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="h-full bg-gradient-to-r from-[#1e3a8a] to-blue-600 rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <button className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-4 rounded-2xl shadow-xl transition">
                  {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity + Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-md shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <Activity className="w-7 h-7 text-[#1e3a8a]" />
              <h3 className="text-2xl font-bold">Recent Activity</h3>
            </div>
            {recentActivity.map(act => (
              <div key={act.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium">{act.action}</p>
                  <p className="text-sm text-gray-600">{act.course}</p>
                </div>
                <span className="text-sm text-gray-500">{act.time}</span>
              </div>
            ))}
          </div>

          {/* Announcements */}
          <div className="bg-gradient-to-br from-[#1e3a8a] to-indigo-800 text-white rounded-md shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Megaphone className="w-7 h-7" />
              <h3 className="text-2xl font-bold">Announcements</h3>
            </div>
            {announcements.map(a => (
              <div key={a.id} className="bg-white/15 backdrop-blur rounded-2xl p-5 mb-4">
                <p className="font-bold text-lg">{a.title}</p>
                <p className="text-sm opacity-90 mt-1">{a.desc}</p>
                <p className="text-xs opacity-70 mt-3">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
