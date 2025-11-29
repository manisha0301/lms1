import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  GraduationCap,
  Shield,
  BookOpen,
  Building2,
  FileCheck,
  ClipboardList,
  IndianRupee,
  Activity,
  Database,
  BellRing,
  Clock,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Bell,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const stats = {
    totalStudents: 2847,
    totalFaculties: 87,
    totalCentres: 34,
    totalAcademics: 12,
    totalAdmins: 5,
    totalCourses: 156,
    totalExams: 892,
    totalAssignments: 2156,
    totalRevenue: 2847500,
  };

  const recentNotifications = [
    { id: 1, message: "New admin 'Rakesh Kumar' was created", time: "2 mins ago", type: "admin" },
    { id: 2, message: "Backup completed successfully", time: "1 hour ago", type: "success" },
    { id: 3, message: "Revenue milestone: ₹28,47,500 crossed!", time: "3 hours ago", type: "revenue" },
    { id: 4, message: "High server load detected (87%)", time: "5 hours ago", type: "warning" },
  ];

  const activityLogs = [
    { user: "admin@kristellar.com", action: "Approved faculty request", target: "Dr. Sneha Patel", time: "10:34 AM" },
    { user: "finance@kristellar.com", action: "Generated monthly report", target: "Nov 2025", time: "09:12 AM" },
    { user: "superadmin@kristellar.com", action: "Modified privileges", target: "Academic Admin #3", time: "08:55 AM" },
    { user: "system", action: "Auto backup triggered", target: "Full DB Backup", time: "02:00 AM" },
    { user: "admin@kristellar.com", action: "Approved faculty request", target: "Dr. Sneha Patel", time: "10:34 AM" },
    { user: "finance@kristellar.com", action: "Generated monthly report", target: "Nov 2025", time: "09:12 AM" },
    { user: "superadmin@kristellar.com", action: "Modified privileges", target: "Academic Admin #3", time: "08:55 AM" },
    { user: "system", action: "Auto backup triggered", target: "Full DB Backup", time: "02:00 AM" },
    { user: "admin@kristellar.com", action: "Approved faculty request", target: "Dr. Sneha Patel", time: "10:34 AM" },
    { user: "finance@kristellar.com", action: "Generated monthly report", target: "Nov 2025", time: "09:12 AM" },
    { user: "superadmin@kristellar.com", action: "Modified privileges", target: "Academic Admin #3", time: "08:55 AM" },
    { user: "system", action: "Auto backup triggered", target: "Full DB Backup", time: "02:00 AM" },
  ];

  // Regular stats (non-clickable)
  const regularStats = [
    { label: "Total Students", value: stats.totalStudents.toLocaleString(), icon: Users, color: "from-blue-500 to-blue-600", bgLight: "bg-blue-50", textColor: "text-blue-600" },
    { label: "Faculties", value: stats.totalFaculties, icon: UserCheck, color: "from-emerald-500 to-emerald-600", bgLight: "bg-emerald-50", textColor: "text-emerald-600" },
    { label: "Centres", value: stats.totalCentres, icon: Building2, color: "from-pink-500 to-pink-600", bgLight: "bg-pink-50", textColor: "text-pink-600" },
    { label: "Exams Conducted", value: stats.totalExams.toLocaleString(), icon: FileCheck, color: "from-cyan-500 to-cyan-600", bgLight: "bg-cyan-50", textColor: "text-cyan-600" },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-8 py-4 flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Super Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500 font-medium">Kristellar's LMS</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">Super Admin</p>
                <p className="text-xs text-gray-500">superadmin@kristellar.com</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                S
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Super Admin</p>
                <p className="text-xs text-gray-500">superadmin@kristellar.com</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Analytics
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-4 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back, Super Admin</h2>
          <p className="text-gray-600">Here's what's happening with your learning platform today.</p>
        </div>

        {/* Clickable Action Cards - Academic Admins & Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Academic Admins Card */}
          <button
            onClick={() => navigate('/academic-admins')}
            className="group bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-purple-100 text-sm font-medium">Academic Admins</p>
                <p className="text-5xl font-extrabold mt-2">{stats.totalAcademics}</p>
                <p className="text-purple-100 text-sm mt-3">Manage roles & permissions</p>
              </div>
              <div className="bg-white/20 backdrop-blur p-4 rounded-2xl group-hover:scale-110 transition-transform">
                <GraduationCap className="w-12 h-12" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              View all admins <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          {/* Courses Card */}
          <button
            onClick={() => navigate('/courses')}
            className="group bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Courses</p>
                <p className="text-5xl font-extrabold mt-2">{stats.totalCourses}</p>
                <p className="text-indigo-100 text-sm mt-3">View, edit & approve courses</p>
              </div>
              <div className="bg-white/20 backdrop-blur p-4 rounded-2xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-12 h-12" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              Manage courses <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>

        {/* Regular Stats Grid (Non-clickable) */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {regularStats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                </div>
                <div className={`${item.bgLight} p-3 rounded-xl`}>
                  <item.icon className={`w-6 h-6 ${item.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue and System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Card */}
          <div className="group bg-gradient-to-br from-green-600 via-green-600 to-emerald-600 text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-2">Total Platform Revenue</p>
                  <p className="text-5xl font-bold mb-2">₹28.5L</p>
                  <div className="flex items-center gap-2 text-green-100">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+₹3.2L this month (+12.5%)</span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                  <IndianRupee className="w-8 h-8 text-black" />
                </div>
              </div>
              <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-black">Next payout cycle</span>
                  <span className="text-sm font-bold text-black">5 Dec 2025</span>
                </div>
              </div>
              <button onClick={() => navigate('/finance')} className="mt-6 flex items-center gap-2 text-sm font-medium opacity-90 group-hover:opacity-100 cursor-pointer">
                View detailed report <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">System Health</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Server Status</span>
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle2 className="w-5 h-5" /> Online
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Database</span>
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <Database className="w-5 h-5" /> Connected
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Last Backup</span>
                <span className="text-sm text-gray-600 font-medium">2 hrs ago</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm font-medium text-gray-700">SSL Certificate</span>
                <span className="text-green-600 text-sm font-medium">Valid till Jun 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notifications */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <BellRing className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Recent Notifications</h3>
              </div>
              <button 
              onClick={() => setShowAllNotifications(true)}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 cursor-pointer">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recentNotifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                    notif.type === 'warning' ? 'bg-amber-500' : 
                    notif.type === 'success' ? 'bg-green-500' : 
                    notif.type === 'revenue' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">{notif.message}</p>
                    <p className="text-xs text-gray-500">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900">Activity Log</h3>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {activityLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-700">
                    {log.user[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">{log.user.split('@')[0]}</span>
                      {' '}
                      <span className="text-gray-600">{log.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {log.target} • {log.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* <button className="mt-6 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 w-full justify-center">
              View all logs <ChevronRight className="w-4 h-4" />
            </button> */}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 font-medium">© 2025 Kristellar Solutions Pvt. Ltd.</p>
          <p className="text-xs text-gray-500 mt-2">
            CIN: U72900OR2021PTC036225 | Plot No 504/2382/2701, Bhubaneswar, Odisha, India
          </p>
        </div>
      </div>

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
    </div>
  );
};

export default SuperAdminDashboard;