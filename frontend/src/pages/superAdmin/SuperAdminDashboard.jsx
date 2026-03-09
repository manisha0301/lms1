import React, { useEffect, useState } from 'react';
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
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import NotificationDetailPanel from "../../components/notifications/NotificationDetailPanel";
import axios from 'axios';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // New state for selected notification detail modal (same as faculty)
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [stats, setStats] = useState({
      totalStudents: 0,
      totalFaculties: 0,
      totalCentres: 0,
      totalAcademics: 0,
      totalAdmins: 0,
      totalCourses: 0,
      totalExams: 0,
      totalAssignments: 0,
      totalRevenue: 0,
  });

  // ────────────────────────────────────────────────
  // NEW: State for real revenue data from API
  // ────────────────────────────────────────────────
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    formattedTotal: "₹0",
    thisMonthRevenue: 0,
    formattedThisMonth: "₹0",
    percentageChange: "0.0",
    changeSign: ""
  });
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState(null);

  const [notifications, setNotifications] = useState([]);  // Full list for modal
  const [recentNotifications, setRecentNotifications] = useState([]);  // Top 4 for summary
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('superAdminToken');
        const response = await fetch('http://localhost:5000/api/auth/superadmin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          console.error('Failed to load stats:', data.error);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    // NEW: Fetch notifications
    const fetchNotifications = async () => {
      try {
        setNotificationsLoading(true);
        const token = localStorage.getItem('superAdminToken');

        // Fetch recent (limit 4) for sidebar preview
        const recentRes = await fetch('http://localhost:5000/api/auth/superadmin/notifications?limit=4', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const recentData = await recentRes.json();
        if (recentData.success) {
          setRecentNotifications(
            recentData.notifications.map(notif => ({
              ...notif,
              time: formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })
            }))
          );
        }

        // Fetch full list for dropdown
        const fullRes = await fetch('http://localhost:5000/api/auth/superadmin/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const fullData = await fullRes.json();
        if (fullData.success) {
          setNotifications(
            fullData.notifications.map(notif => ({
              ...notif,
              time: formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })
            }))
          );
        }
      } catch (err) {
        setNotificationsError(err.message);
        console.error('Notifications fetch error:', err);
      } finally {
        setNotificationsLoading(false);
      }
    };

    // ────────────────────────────────────────────────
    // NEW: Fetch real revenue data from backend
    // ────────────────────────────────────────────────
    const fetchRevenue = async () => {
      try {
        setRevenueLoading(true);
        setRevenueError(null);
        const token = localStorage.getItem('superAdminToken');
        const response = await axios.get('http://localhost:5000/api/auth/superadmin/revenue/overview', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setRevenueData(response.data.data);
        } else {
          setRevenueError(response.data.error || 'Failed to load revenue');
        }
      } catch (err) {
        console.error('Failed to fetch revenue:', err);
        setRevenueError('Failed to load revenue data');
      } finally {
        setRevenueLoading(false);
      }
    };

    fetchNotifications();
    fetchStats();
    fetchRevenue();           // ← This fetches the actual revenue from backend
  }, []);

  // Calculate unread count for bell badge (same as faculty)
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  // Handle clicking a notification → open detail panel + mark as read (exact same as faculty)
  const handleNotificationClick = async (notif) => {
    // Open detail panel immediately
    setSelectedNotification(notif);

    // If already read → no need to call API
    if (notif.status === 'read') return;

    try {
      const token = localStorage.getItem('superAdminToken');
      await axios.put(
        `http://localhost:5000/api/auth/superadmin/notifications/${notif.id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Optimistic update: mark as read in local state
      const updateList = (list) =>
        list.map(n => n.id === notif.id ? { ...n, status: 'read' } : n);

      setNotifications(prev => updateList(prev));
      setRecentNotifications(prev => updateList(prev));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // Regular stats (non-clickable)
  const safeLocaleString = (val) => {
    if (typeof val === 'number' && !isNaN(val)) return val.toLocaleString();
    return '0';
  };
  const regularStats = [
    { label: "Total Students", value: safeLocaleString(stats.totalStudents), icon: Users },
    { label: "Faculties", value: safeLocaleString(stats.totalFaculties), icon: UserCheck },
    { label: "Centres", value: safeLocaleString(stats.totalCentres), icon: Building2 },
    { label: "Exams Conducted", value: safeLocaleString(stats.totalExams), icon: FileCheck },
  ];

  const handleLogOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header - Matching AcademicDashboard style */}
      <header className="bg-[#1e3a8a] text-white sticky top-0 z-50 shadow-lg">
        <div className="px-8 py-4 flex justify-between items-center mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-xl flex items-center justify-center">
              <span className="text-3xl font-black">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Kristellar iLMS Super Admin Panel</h1>
              <p className="text-xs opacity-90 -mt-1">Super Administrator Portal</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button className="p-2.5 hover:bg-white/10 rounded-xl transition cursor-pointer" onClick={() => navigate('/settings')}>
              <Settings className="w-6 h-6" />
            </button>

            {/* Notification Bell */}
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

              {/* Notification Dropdown – now clickable (same as faculty) */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
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
                    {notificationsLoading ? (
                      <div className="p-6 text-center text-gray-500">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">No notifications yet</div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                            notif.status === 'unread'
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
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notif.time}
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

            <div className="flex items-center gap-3 pl-6 border-l border-white/20">
              <div className="text-right">
                <p className="font-semibold">Super Admin</p>
                <p className="text-xs opacity-90">superadmin@kristellar.com</p>
              </div>
              <div 
              className="w-11 h-11 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl font-bold cursor-pointer relative"
              onClick={() => setProfileOpen(!profileOpen)}>
                SA
              </div>
              {profileOpen && (
              <div className="absolute top-20 right-8 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 w-80">
                <div className="bg-[#1e3a8a] text-white p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white/25 rounded-full flex items-center justify-center text-3xl font-bold">
                        SA
                      </div>
                      <div>
                        <p className="text-xl font-bold">Super Admin</p>
                        <p className="text-sm opacity-90">superadmin@kristellar.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <button onClick={() => navigate('/profile')} className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                      <User className="w-5 h-5 text-[#1e3a8a]" /> <span className="font-medium text-[#1e3a8a]">My Profile</span>
                    </button>
                    <hr className="my-3 border-gray-200" />
                    <button className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-red-50 text-red-600 rounded-xl transition cursor-pointer"
                      onClick={handleLogOut}>
                      <LogOut className="w-5 h-5" /> <span className="font-medium">Logout</span>
                    </button>
                  </div>
              </div>
              )}
              
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 hover:bg-white/10 rounded-xl"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#1e3a8a]/95 backdrop-blur px-8 py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                SA
              </div>
              <div>
                <p className="font-semibold">Super Admin</p>
                <p className="text-xs opacity-90">superadmin@kristellar.com</p>
              </div>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left py-3 px-4 hover:bg-white/10 rounded-xl">Settings</button>
              <button onClick={handleLogOut}
              className="w-full text-left py-3 px-4 text-red-400 hover:bg-red-500/20 rounded-xl">Logout</button>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto px-8 pt-10 pb-5">
        {/* Clickable Action Cards - Academic Admins & Courses */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {/* Academic Admins Card */}
          <button
            onClick={() => navigate('/academic-admins')}
            className="group bg-white rounded-md shadow-xl border border-gray-100 p-8 text-left hover:-translate-y-4 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-gray-600 font-medium text-lg">Academic Admins</p>
                <p className="text-3xl font-black text-gray-900 mt-3">{stats.totalAcademics}</p>
                <p className="text-gray-600 mt-4">Manage roles & permissions</p>
              </div>
              <div className="w-14 h-14 bg-[#1e3a8a] rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#1e3a8a] font-bold">
              View all admins <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          {/* Courses Card */}
          <button
            onClick={() => navigate('/courses')}
            className="group bg-white rounded-md shadow-xl border border-gray-100 p-8 text-left hover:-translate-y-4 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-gray-600 font-medium text-lg">Courses Enrolled</p>
                <p className="text-3xl font-black text-gray-900 mt-3">{stats.totalCourses}</p>
                <p className="text-gray-600 mt-4">View, edit & approve courses</p>
              </div>
              <div className="w-16 h-16 bg-[#1e3a8a] rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#1e3a8a] font-bold">
              Manage courses <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => navigate('/superadmincourses')}
            className="group bg-white rounded-md shadow-xl border border-gray-100 p-8 text-left hover:-translate-y-4 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-gray-600 font-medium text-lg">Total Courses</p>
                <p className="text-3xl font-black text-gray-900 mt-3">{stats.totalCourses}</p>
                <p className="text-gray-600 mt-4">View, edit & approve courses</p>
              </div>
              <div className="w-16 h-16 bg-[#1e3a8a] rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#1e3a8a] font-bold">
              Manage courses <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>

        {/* Regular Stats Grid */}
        <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {regularStats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-md shadow-xl border border-gray-100 p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 font-medium text-md">{item.label}</p>
                  <p className="text-3xl font-black text-gray-900 mt-4">{item.value}</p>
                </div>
                <div className="w-14 h-14 bg-[#1e3a8a] rounded-2xl shadow-lg flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue and Recent Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Card  */}
          <button 
            onClick={() => navigate('/finance')} 
            className="group bg-gradient-to-br from-[#1e3a8a] to-indigo-800 text-white rounded-md shadow-xl px-8 relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-white/80 font-medium text-lg mb-2 text-left">Total Platform Revenue</p>
                  
                  {/* Dynamic total revenue */}
                  {revenueLoading ? (
                    <p className="text-5xl font-black mb-3 text-left">Loading...</p>
                  ) : revenueError ? (
                    <p className="text-5xl font-black mb-3 text-left text-red-300">Error</p>
                  ) : (
                    <p className="text-5xl font-black mb-3 text-left">{revenueData.formattedTotal || '₹0'}</p>
                  )}

                  <div className="flex items-center gap-2 text-white/90">
                    <TrendingUp className="w-5 h-5" />
                    {revenueLoading ? (
                      <span className="font-bold">Loading...</span>
                    ) : revenueError ? (
                      <span className="font-bold text-red-300">Failed to load</span>
                    ) : (
                      <span className="font-bold">
                        {revenueData.changeSign}{revenueData.formattedThisMonth || '₹0'} this month 
                        ({revenueData.changeSign}{revenueData.percentageChange || '0.0'}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <IndianRupee className="w-8 h-8" />
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="flex justify-between items-center">
                  View detailed report <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </button>

          {/* Recent Notifications – NOW CLICKABLE (exact same pattern as faculty sidebar) */}
          <div className="bg-white rounded-md shadow-xl border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1e3a8a] rounded-2xl shadow-lg flex items-center justify-center">
                  <BellRing className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Recent Notifications</h3>
              </div>
            </div>

            {/* Scrollable Notification List */}
            <div className="space-y-5 max-h-[230px] overflow-y-auto pr-2">
              {notificationsLoading ? (
                <div className="text-center py-10 text-gray-500">Loading notifications...</div>
              ) : recentNotifications.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No new notifications</div>
              ) : (
                recentNotifications.map((notif, idx) => (
                  <div
                    key={`${notif.id}-${idx}`}
                    onClick={() => handleNotificationClick(notif)}
                    className="p-5 bg-gradient-to-r from-[#1e3a8a]/5 to-white rounded-2xl border border-[#1e3a8a]/10 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${
                          notif.type === 'warning'
                            ? 'bg-orange-500'
                            : notif.type === 'success' || notif.type === 'revenue'
                            ? 'bg-emerald-500'
                            : 'bg-[#1e3a8a]'
                        }`}
                      />
                      <div>
                        <p className="font-bold text-gray-900">{notif.message}</p>
                        <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 font-medium">© 2026 Kristellar Solutions Pvt. Ltd.</p>
          <p className="text-xs text-gray-500 mt-2">
            CIN: U62099OD2023PTC043827 | 3rd Floor, The Utkal Chamber of Commerce and Industry Limited, N/6, beside Union Bank of India, Indradhanu Market, IRC Village, Nayapalli, Bhubaneswar, Odisha 751015
          </p>
        </div>
      </div>

      {/* Notification Detail Modal – same as faculty */}
      {selectedNotification && (
        <NotificationDetailPanel
          notification={selectedNotification}
          recipient_type="superadmin"
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard;