// src/pages/admin/AdminDashboard.jsx
import {
  Users, BookOpen, GraduationCap, Building2,
  Bell, Clock, TrendingUp, Award, AlertCircle,
  ChevronRight, Search, X,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Mock Data
  const stats = {
    totalStudents: 2847,
    totalFaculty: 89,
    totalCourses: 42,
    totalBranches: 6,
    activeBatches: 24,
    revenueThisMonth: "₹48.2L",
    completionRate: 87
  };

  const branchHierarchy = [
    { id: 1, name: "Mumbai Main Campus", dean: "Dr. Anita Sharma", students: 892, faculty: 28 },
    { id: 2, name: "Delhi NCR", dean: "Prof. Rajesh Kumar", students: 678, faculty: 22 },
    { id: 3, name: "Bangalore Tech Hub", dean: "Dr. Priya Menon", students: 512, faculty: 18 },
    { id: 4, name: "Pune Campus", dean: "Prof. Vikram Singh", students: 398, faculty: 12 },
    { id: 5, name: "Hyderabad", dean: "Dr. Neha Reddy", students: 245, faculty: 6 },
    { id: 6, name: "Chennai", dean: "Prof. Arjun Nair", students: 122, faculty: 3 },
    { id: 4, name: "Pune Campus", dean: "Prof. Vikram Singh", students: 398, faculty: 12 },
    { id: 5, name: "Hyderabad", dean: "Dr. Neha Reddy", students: 245, faculty: 6 },
    { id: 6, name: "Chennai", dean: "Prof. Arjun Nair", students: 122, faculty: 3 },
    { id: 4, name: "Pune Campus", dean: "Prof. Vikram Singh", students: 398, faculty: 12 },
    { id: 5, name: "Hyderabad", dean: "Dr. Neha Reddy", students: 245, faculty: 6 },
    { id: 6, name: "Chennai", dean: "Prof. Arjun Nair", students: 122, faculty: 3 },
  ];

  const recentNotifications = [
    { id: 1, type: "new-enrollment", message: "156 new students enrolled today", time: "2 mins ago", icon: Users },
    { id: 2, type: "course", message: "New course 'Ethical Hacking Pro' published", time: "1 hour ago", icon: BookOpen },
    { id: 3, type: "faculty", message: "Prof. Sarah Lee joined as Full Stack Mentor", time: "3 hours ago", icon: GraduationCap },
    { id: 4, type: "alert", message: "Server maintenance scheduled at 2:00 AM", time: "5 hours ago", icon: AlertCircle },
    { id: 5, type: "achievement", message: "98% students passed React Masterclass!", time: "1 day ago", icon: Award }
  ];

  const handlelogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">

        {/* Official Navbar - Same as AcademicDashboard */}
        <header className="bg-[#1e3a8a] text-white sticky top-0 z-50 shadow-lg">
          <div className="px-8 py-5 flex justify-between items-center mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-xl flex items-center justify-center">
                <span className="text-3xl font-black">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Cybernetics LMS</h1>
                <p className="text-xs opacity-90 mt-1">Admin Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-6">


              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2.5 hover:bg-white/10 rounded-xl transition cursor-pointer"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    5
                  </span>
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="bg-[#1e3a8a] text-white p-5 flex justify-between items-center">
                      <h3 className="font-bold text-lg">Notifications</h3>
                      <button onClick={() => setIsNotificationOpen(false)} className="hover:bg-white/20 p-1 rounded cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {recentNotifications.map(notif => (
                        <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notif.type === 'alert' ? 'bg-red-100' :
                                notif.type === 'achievement' ? 'bg-emerald-100' : 'bg-indigo-100'
                              }`}>
                              <notif.icon className={`w-5 h-5 ${notif.type === 'alert' ? 'text-red-600' :
                                  notif.type === 'achievement' ? 'text-emerald-600' : 'text-indigo-600'
                                }`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {notif.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 pl-6 border-l border-white/20">
                <div className="text-right">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-xs opacity-90">{user.email}</p>
                </div>
                <div onClick={() => setProfileOpen(!profileOpen)}
                  className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl font-bold cursor-pointer select-none">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                {profileOpen && (
                  <div className="absolute top-17 right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {/* Header */}
                    <div className="bg-[#1e3a8a] text-white p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-lg font-bold">{user.fullName}</p>
                          <p className="text-sm opacity-90">{user.email}</p>
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
                        onClick={handlelogout}
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
        </header>

        <div className="mx-auto px-8 py-10 ">
          {/* Statistics Grid - Same Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { label: "Total Students", value: stats.totalStudents.toLocaleString(), icon: Users, growth: "+12%" },
              { label: "Active Courses", value: stats.totalCourses, icon: BookOpen, growth: "+3" },
              { label: "Faculty Members", value: stats.totalFaculty, icon: GraduationCap, growth: "+8" },
              // { label: "Revenue (Month)", value: stats.revenueThisMonth, icon: TrendingUp, growth: "+18%" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 cursor-pointer transition-all hover:-translate-y-4 hover:shadow-2xl group"
                onClick={() => navigate(
                  stat.label.includes("Students") ? "/students" :
                    stat.label.includes("Courses") ? "/courses" :
                      stat.label.includes("Faculty") ? "/faculty" : "/revenue"
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 bg-[#1e3a8a] rounded-2xl shadow-lg flex items-center justify-center`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-full text-sm">
                    {stat.growth}
                  </span>
                </div>
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
                <p className="text-md text-gray-600 font-medium mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Branch Hierarchy */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 ">
                <div className="bg-white text-white px-8 pt-6 ">
                  <h2 className="text-2xl font-bold flex items-center gap-4 text-[#1e3a8a]">
                    <Building2 className="w-8 h-8" />
                    Branch Hierarchy
                  </h2>
                  <p className="opacity-90 mt-1 text-[#1e3a8a]">All campuses across India</p>
                </div>
                <div className="p-8 space-y-5 overflow-y-auto flex-1 max-h-[525px]">
                  {branchHierarchy.map((branch, index) => (
                    <div
                      key={branch.id}
                      className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-6 p-6
                                bg-gradient-to-r from-[#1e3a8a]/5 to-white
                                rounded-2xl border border-[#1e3a8a]/10
                                hover:border-[#1e3a8a]/30 hover:shadow-lg transition-all
                                group cursor-pointer"
                    >
                      {/* Index */}
                      <div className="w-14 h-14 bg-[#1e3a8a] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {index + 1}
                      </div>

                      {/* Branch info */}
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {branch.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {branch.dean}
                        </p>
                      </div>

                      {/* Right aligned stats — FIXED COLUMN */}
                      <div className="text-right min-w-[120px]">
                        <p className="text-2xl font-black text-[#1e3a8a]">
                          {branch.students}
                        </p>
                        <p className="text-sm text-gray-600">
                          students • {branch.faculty} faculty
                        </p>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:translate-x-3 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Notifications Panel */}
            <div>
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 ">
                <div className="bg-white text-[#1e3a8a] px-8 pt-6 rounded-t-xl">
                  <h2 className="text-2xl font-bold flex items-center gap-4">
                    <Bell className="w-8 h-8" />
                    Recent Notifications
                  </h2>
                  <p className="opacity-90 mt-1">Latest system updates</p>
                </div>
                <div className="p-8 space-y-5 overflow-y-auto flex-1 max-h-[525px]">
                  {recentNotifications.map((notif) => (
                    <div key={notif.id} className="flex gap-5 p-5 bg-gray-50 rounded-2xl hover:bg-[#1e3a8a]/5 transition group">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.type === 'alert' ? 'bg-red-100' :
                          notif.type === 'achievement' ? 'bg-emerald-100' : 'bg-indigo-100'
                        }`}>
                        <notif.icon className={`w-6 h-6 ${notif.type === 'alert' ? 'text-red-600' :
                            notif.type === 'achievement' ? 'text-emerald-600' : 'text-indigo-600'
                          }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{notif.message}</p>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <Clock className="w-4 h-4" /> {notif.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-gray-500 text-sm">
            © 2025 Cybernetics LMS • Admin Portal • Secure & Powered by Love
          </div>
        </div>
      </div>
    </>
  );
}