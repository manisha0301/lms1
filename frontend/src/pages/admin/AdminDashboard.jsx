// src/pages/admin/AdminDashboard.jsx
import {
  Users, BookOpen, GraduationCap, Building2,
  Bell, Clock, TrendingUp, Award, AlertCircle,
  ChevronRight, Search, X,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDetailPanel from "../../components/notifications/NotificationDetailPanel";
import axios from 'axios';
import apiConfig from '../../config/apiConfig';

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("adminUser"));
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ─── Real states for notifications 
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  // New state for selected notification detail modal
  const [selectedNotification, setSelectedNotification] = useState(null);

  // ─── Stats states ──────────────────────────────
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    studentGrowth: "0%",
    courseGrowth: "0%",
    facultyGrowth: "0%"
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // ─── Fetch both stats and real notifications ─────────────────────
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${apiConfig.API_BASE_URL}/api/auth/admin/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${apiConfig.API_BASE_URL}/api/auth/admin/notifications?limit=5`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.success && data.notifications) {
          const formatted = data.notifications.map(notif => ({
            id: notif.id,
            type: notif.type || 'info',
            message: notif.message,
            time: new Date(notif.created_at).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            // Dynamic icon mapping based on notification type
            icon: notif.type === 'course' ? BookOpen :
                  notif.type === 'student' || notif.type === 'new-enrollment' ? Users :
                  notif.type === 'faculty' ? GraduationCap :
                  notif.type === 'alert' ? AlertCircle :
                  notif.type === 'achievement' ? Award : Users, // fallback
            // ─── FIXED: Added created_at so modal can use it for date display
            created_at: notif.created_at,
            priority: notif.priority,
            status: notif.status
          }));

          setRecentNotifications(formatted);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchDashboardStats();
    fetchNotifications();
  }, []);

  const branchHierarchy = [
    { id: 1, name: "Mumbai Main Campus", dean: "Dr. Anita Sharma", students: 892, faculty: 28 },
    { id: 2, name: "Delhi NCR", dean: "Prof. Rajesh Kumar", students: 678, faculty: 22 },
    { id: 3, name: "Bangalore Tech Hub", dean: "Dr. Priya Menon", students: 512, faculty: 18 },
    { id: 4, name: "Pune Campus", dean: "Prof. Vikram Singh", students: 398, faculty: 12 },
    { id: 5, name: "Hyderabad", dean: "Dr. Neha Reddy", students: 245, faculty: 6 },
    { id: 6, name: "Chennai", dean: "Prof. Arjun Nair", students: 122, faculty: 3 },
  ];

  const handlelogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate('/login');
  };

  // Handle clicking a notification → open modal + mark as read
  const handleNotificationClick = async (notif) => {
    setSelectedNotification(notif);

    if (notif.status === 'read') return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${apiConfig.API_BASE_URL}/api/auth/admin/notifications/${notif.id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecentNotifications(prev =>
        prev.map(n =>
          n.id === notif.id ? { ...n, status: 'read' } : n
        )
      );
    } catch (err) {
      console.error('Failed to mark admin notification as read:', err);
    }
  };

  // Count unread for bell badge
  const unreadCount = recentNotifications.filter(n => n.status === 'unread' || n.status === 'Unread').length;

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

              {/* Notification Bell – updated with real unread count */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2.5 hover:bg-white/10 rounded-xl transition cursor-pointer"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown – matched faculty style */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="bg-[#1e3a8a] text-white p-5 flex justify-between items-center">
                      <h3 className="font-bold text-lg">Notifications</h3>
                      <button onClick={() => setIsNotificationOpen(false)} className="hover:bg-white/20 p-1 rounded cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notificationsLoading ? (
                        <div className="p-6 text-center text-gray-500">Loading notifications...</div>
                      ) : recentNotifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">No notifications yet</div>
                      ) : (
                        recentNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                              notif.status === 'unread' || notif.status === 'Unread'
                                ? notif.priority === 'high'
                                  ? 'bg-red-50'
                                  : notif.priority === 'medium'
                                  ? 'bg-yellow-50'
                                  : 'bg-blue-50'
                                : 'bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                                notif.priority === 'high' ? 'bg-red-500' :
                                notif.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 line-clamp-2">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notif.created_at).toLocaleString('en-IN', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 text-center">
                      <button className="text-[#1e3a8a] font-medium text-sm hover:underline cursor-pointer">
                        View all notifications
                      </button>
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
          {/* Statistics Grid - Updated with real MoM % */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { 
                label: "Total Students", 
                value: loadingStats ? '...' : stats.totalStudents.toLocaleString(), 
                icon: Users, 
                growth: loadingStats ? '...' : stats.studentGrowth,
                color: loadingStats ? 'bg-gray-100 text-gray-700' : 
                      stats.studentGrowth?.startsWith('+') ? 'bg-emerald-100 text-emerald-700' :
                      stats.studentGrowth?.startsWith('-') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              },
              { 
                label: "Active Courses", 
                value: loadingStats ? '...' : stats.totalCourses, 
                icon: BookOpen, 
                growth: loadingStats ? '...' : stats.courseGrowth,
                color: loadingStats ? 'bg-gray-100 text-gray-700' : 
                      stats.courseGrowth?.startsWith('+') ? 'bg-emerald-100 text-emerald-700' :
                      stats.courseGrowth?.startsWith('-') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              },
              { 
                label: "Faculty Members", 
                value: loadingStats ? '...' : stats.totalFaculty, 
                icon: GraduationCap, 
                growth: loadingStats ? '...' : stats.facultyGrowth,
                color: loadingStats ? 'bg-gray-100 text-gray-700' : 
                      stats.facultyGrowth?.startsWith('+') ? 'bg-emerald-100 text-emerald-700' :
                      stats.facultyGrowth?.startsWith('-') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              },
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
                  <span className={`px-4 py-2 ${stat.color} font-bold rounded-full text-sm`}>
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
                      key={`${branch.id}-${index}`}
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

            {/* Recent Notifications Panel - matched faculty style */}
            <div>
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 ">
                <div className="bg-white text-[#1e3a8a] px-8 pt-6 rounded-t-xl">
                  <h2 className="text-2xl font-bold flex items-center gap-4">
                    <Bell className="w-8 h-8" />
                    Notifications
                  </h2>
                  <p className="opacity-90 mt-1">Latest system updates</p>
                </div>
                <div className="p-6 max-h-[525px] overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="text-center py-10 text-gray-500">
                      Loading notifications...
                    </div>
                  ) : recentNotifications.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      No new notifications yet
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {recentNotifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`py-4 flex items-start gap-3 hover:bg-gray-50 transition cursor-pointer ${
                            (notif.status === 'unread' || notif.status === 'Unread')
                              ? notif.priority === 'high'
                                ? 'bg-red-50'
                                : notif.priority === 'medium'
                                ? 'bg-yellow-50'
                                : 'bg-blue-50'
                              : ''
                          }`}
                        >
                          <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                            notif.priority === 'high' ? 'bg-red-500' :
                            notif.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 line-clamp-2">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notif.created_at).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailPanel
          notification={selectedNotification}
          recipient_type="academicadmin"  
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </>
  );
}