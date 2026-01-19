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

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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
  const [notifications, setNotifications] = useState([]);  // Full list for modal
  const [recentNotifications, setRecentNotifications] = useState([]);  // Top 4 for summary
  const [notificationsLoading, setNotificationsLoading] = useState(true);  // NEW
  const [notificationsError, setNotificationsError] = useState(null);  // NEW

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

      // Fetch recent (limit 4)
      const recentRes = await fetch('http://localhost:5000/api/auth/superadmin/notifications?limit=4', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const recentData = await recentRes.json();
      if (recentData.success) {
        setRecentNotifications(
          recentData.notifications.map(notif => ({
            ...notif,
            time: formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })  // e.g., "2 mins ago"
          }))
        );
      } else {
        throw new Error(recentData.error);
      }

      // Fetch full list
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
      } else {
        throw new Error(fullData.error);
      }
    } catch (err) {
      setNotificationsError(err.message);
    } finally {
      setNotificationsLoading(false);
    }
  };

    fetchNotifications();
    fetchStats();
  }, []);

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
          {/* Revenue Card */}
          <button onClick={() => navigate('/finance')} className="group bg-gradient-to-br from-[#1e3a8a] to-indigo-800 text-white rounded-md shadow-xl p-8 relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-white/80 font-medium text-lg mb-2 text-left">Total Platform Revenue</p>
                  <p className="text-5xl font-black mb-3 text-left">₹28.5L</p>
                  <div className="flex items-center gap-2 text-white/90">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold">+₹3.2L this month (+12.5%)</span>
                  </div>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <IndianRupee className="w-8 h-8" />
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Next payout cycle</span>
                  <span className="font-bold">5 Dec 2025</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 font-bold opacity-90 group-hover:opacity-100">
                View detailed report <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </button>

          {/* Recent Notifications */}
          <div className="bg-white rounded-md shadow-xl border border-gray-100 p-8">
  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-[#1e3a8a] rounded-2xl shadow-lg flex items-center justify-center">
        <BellRing className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">Recent Notifications</h3>
    </div>
    {/* <button
      onClick={() => setShowAllNotifications(true)}
      className="text-[#1e3a8a] font-bold flex items-center gap-1 hover:underline cursor-pointer"
    >
      View all <ChevronRight className="w-4 h-4" />
    </button> */}
  </div>

  {/* Scrollable Notification List */}
  <div className="space-y-5 max-h-[230px] overflow-y-auto pr-2">
    {recentNotifications.map((notif, idx) => (
      <div
        key={`${notif.id}-${idx}`}
        className="p-5 bg-gradient-to-r from-[#1e3a8a]/5 to-white rounded-2xl border border-[#1e3a8a]/10 hover:shadow-md transition"
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
    ))}
  </div>
</div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 font-medium">© 2025 Kristellar Solutions Pvt. Ltd.</p>
          <p className="text-xs text-gray-500 mt-2">
            CIN: U72900OR2021PTC036225 | Plot No 504/2382/2701, Bhubaneswar, Odisha, India
          </p>
        </div>
      </div>

      {/* All Notifications Modal - Matching AcademicDashboard style */}
      {/* {showAllNotifications && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-[#1e3a8a] text-white px-8 py-6 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">All Notifications</h2>
                <p className="text-sm opacity-90">Stay updated with all activities</p>
              </div>
              <button 
                onClick={() => setShowAllNotifications(false)}
                className="p-3 hover:bg-white/20 rounded-xl transition cursor-pointer"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[65vh] divide-y divide-gray-200">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`px-8 py-6 hover:bg-gray-50 transition ${notif.priority === 'high' ? 'bg-red-50' : notif.priority === 'medium' ? 'bg-orange-50' : ''}`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      notif.type === 'exam' ? 'bg-orange-100' : 'bg-[#1e3a8a]/10'
                    }`}>
                      {notif.type === 'exam' ? 
                        <CheckCircle className="w-7 h-7 text-orange-600" /> : 
                        <Bell className="w-7 h-7 text-[#1e3a8a]" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-gray-900">{notif.message}</p>
                      <div className="flex items-center gap-4 mt-3 text-gray-600">
                        <span className="text-sm">{notif.time}</span>
                        {notif.status && (
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                            notif.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            notif.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : ''
                          }`}>
                            {notif.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 text-center">
              <button 
                onClick={() => setShowAllNotifications(false)}
                className="px-12 py-4 bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold rounded-2xl shadow-xl transition hover:scale-105 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default SuperAdminDashboard;