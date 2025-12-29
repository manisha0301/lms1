import React, { useEffect } from 'react';
import {
  ChevronLeft,
  Mail,
  Phone,
  Building2,
  Edit3,
  Key,
  Shield,
  ToggleLeft,
  ToggleRight,
  UserX,
  Users,
  BookOpen,
  BellRing,
  Activity,
  CheckCircle2,
  XCircle,
  Lock,
} from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'text-green-600 bg-green-50';
    case 'Inactive': return 'text-amber-600 bg-amber-50';
    case 'Suspended': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Active': return <CheckCircle2 className="w-4 h-4" />;
    case 'Inactive': return <XCircle className="w-4 h-4" />;
    case 'Suspended': return <XCircle className="w-4 h-4" />;
    default: return null;
  }
};

const AdminDetailView = ({ admin, onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mb-8 bg-[#1e3a8a] border border-gray-200 shadow-sm p-8">
        <div className="  mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-white">Admin Profile Details</h1>
            <p className="text-white mt-1">View and manage administrator information</p>
          </div>
        </div>
      </div>

      <div className="  mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl">
                  {admin.profilePic}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-6">{admin.fullName}</h2>
                <p className="text-[#1e3a8a] font-medium">{admin.role}</p>
                <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(admin.status)}`}>
                  {getStatusIcon(admin.status)} {admin.status}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">{admin.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">{admin.mobile}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{admin.branch}</p>
                    <p className="text-xs text-gray-500">{admin.department}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button className="w-full bg-[#1e3a8a] text-white py-3 rounded-xl font-medium hover:bg-[#162c6a] transition flex items-center justify-center gap-2">
                  <Edit3 className="w-4 h-4" /> Edit Admin Details
                </button>
                <button className="w-full bg-amber-600 text-white py-3 rounded-xl font-medium hover:bg-amber-700 transition flex items-center justify-center gap-2">
                  <Key className="w-4 h-4" /> Reset Password
                </button>
                <button className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-900 transition flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" /> Modify Privileges
                </button>
                <button className={`w-full py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${admin.status === 'Active' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                  {admin.status === 'Active' ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                  {admin.status === 'Active' ? 'Deactivate' : 'Activate'} Admin
                </button>
                <button className="w-full border border-red-600 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 transition flex items-center justify-center gap-2">
                  <UserX className="w-4 h-4" /> Remove Admin
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-medium text-gray-800">{admin.username}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Created On</p>
                  <p className="font-medium text-gray-800">{new Date(admin.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="font-medium text-gray-800">{admin.lastLogin}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Access Type</p>
                  <p className="font-medium text-gray-800">{admin.roleType}</p>
                </div>
              </div>
            </div>

            {/* Privileges */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Assigned Privileges</h3>
              <div className="flex flex-wrap gap-3">
                {admin.privileges.map((priv, i) => (
                  <span key={i} className="px-4 py-2 bg-[#1e3a8a]/10 text-[#1e3a8a] rounded-lg text-sm font-medium">
                    {priv}
                  </span>
                ))}
              </div>
            </div>

            {/* Activity Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Activity Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-[#1e3a8a] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{admin.stats.facultiesManaged}</p>
                  <p className="text-sm text-gray-600">Faculties</p>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{admin.stats.studentsManaged}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="text-center">
                  <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{admin.stats.coursesAdministered}</p>
                  <p className="text-sm text-gray-600">Courses</p>
                </div>
                <div className="text-center">
                  <BellRing className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{admin.stats.notificationsSent}</p>
                  <p className="text-sm text-gray-600">Notifications</p>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h3>
              <div className="space-y-4">
                {admin.recentActivities.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm p-4 bg-[#1e3a8a]/5 rounded-xl">
                    <Activity className="w-4 h-4 text-[#1e3a8a] mt-0.5" />
                    <p className="text-gray-700">{act}</p>
                  </div>
                ))}
              </div>
              </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Security Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Email Verified</span>
                  </div>
                  {admin.emailVerified ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Two-Factor Auth</span>
                  </div>
                  {admin.twoFactor ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © 2025 Kristellar • Admin Portal
      </footer>
    </div>
  );
};

export default AdminDetailView;