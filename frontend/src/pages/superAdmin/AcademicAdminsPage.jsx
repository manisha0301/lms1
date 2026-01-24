// src/pages/superAdmin/AcademicAdminsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  ChevronRight,
  X,
  Loader2,
  User,
} from 'lucide-react';
import AdminDetailView from './AdminDetailView';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/auth/superadmin';

const AcademicAdminsPage = () => {
  const [academicAdmins, setAcademicAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [newAdmin, setNewAdmin] = useState({
    fullName: '',
    email: '',
    mobile: '',
    role: 'Academic Admin',
    academicAdmins: '',
    // department: '',
    password: '',
    confirmPassword: '',
    twoFactor: false,
  });

  // Fetch token from localStorage (assuming it's saved after super admin login)
  const getToken = () => localStorage.getItem('superAdminToken');

  // Fetch all academic admins
  const fetchAcademicAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const token = getToken();
      const response = await axios.get(`${API_BASE}/academic-admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAcademicAdmins(response.data.academicAdmins);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load academic admins. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicAdmins();
    window.scrollTo(0, 0);
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!newAdmin.fullName || !newAdmin.email || !newAdmin.academicAdmins) {
      setError('Please fill all required fields.');
      return;
    }
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (newAdmin.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (newAdmin.mobile && !/^\+?[0-9]{10,15}$/.test(newAdmin.mobile)) {
      setError('Please enter a valid mobile number.');
      return;
    }

    try {
      setSubmitting(true);
      const token = getToken();

      const response = await axios.post(
        `${API_BASE}/academic-admins`,
        {
          fullName: newAdmin.fullName.trim(),
          email: newAdmin.email.trim().toLowerCase(),
          mobile: newAdmin.mobile || null,
          role: newAdmin.role,
          academicAdmins: newAdmin.academicAdmins.trim(),
          // department: newAdmin.department.trim(),
          password: newAdmin.password,
          confirmPassword: newAdmin.confirmPassword,
          twoFactor: newAdmin.twoFactor,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Add the new admin to the list
        setAcademicAdmins((prev) => [response.data.admin, ...prev]);

        // Reset form and close modal
        setNewAdmin({
          fullName: '',
          email: '',
          mobile: '',
          role: 'Academic Admin',
          academicAdmins: '',
          // department: '',
          password: '',
          confirmPassword: '',
          twoFactor: false,
        });
        setIsAddModalOpen(false);
        alert('Academic Admin added successfully!');
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.error ||
        'Failed to add admin. Possibly email/username already exists.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (selectedAdmin) {
    return <AdminDetailView admin={selectedAdmin} onBack={() => setSelectedAdmin(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="  mx-auto px-8 py-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Admin Management</h1>
            <p className="opacity-90 mt-1">Overview of all academic administrators</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white text-[#1e3a8a] px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition shadow-md mt-2 cursor-pointer"
          >
            + Add New Academic Admin
          </button>
        </div>
      </header>

      <div className="  mx-auto px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a]" />
          </div>
        ) : academicAdmins.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No academic admins found.</p>
            <p>Add your first one using the button above.</p>
          </div>
        ) : (
          /* Admins Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {academicAdmins.map((admin) => (
              <div
                key={admin.id}
                // onClick={() => setSelectedAdmin(admin)}
                className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {admin.academicAdmins && admin.academicAdmins.trim().charAt(0).toUpperCase()}
                  </div>
                  <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    admin.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : admin.status === "Inactive"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  >
                    {admin.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1e3a8a] transition">
                  {admin.academicAdmins}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{admin.role}</p>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{admin.email}</span>
                  </div>
                  {admin.mobile && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{admin.mobile}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{admin.fullName}</span>
                  </div>
                </div>

              {/* <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Students Managed</span>
                  <span className="font-bold text-gray-900">{admin.stats.studentsManaged}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Courses Administered</span>
                  <span className="font-bold text-gray-900">{admin.stats.coursesAdministered}</span>
                </div>
              </div> */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Add New Academic Admin</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setError('');
                  setNewAdmin({
                    fullName: '',
                    email: '',
                    mobile: '',
                    role: 'Academic Admin',
                    academicAdmins: '',
                    password: '',
                    confirmPassword: '',
                    twoFactor: false,
                  });
                }}
                className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdmin.fullName}
                    onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="name@kristellar.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={newAdmin.mobile}
                    onChange={(e) => setNewAdmin({ ...newAdmin, mobile: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  >
                    <option>Academic Admin</option>
                    <option>Branch Admin</option>
                    <option>Course Admin</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Organisation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdmin.academicAdmins}
                    onChange={(e) => setNewAdmin({ ...newAdmin, academicAdmins: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="Bhubaneswar Main Campus"
                  />
                </div>

                {/* <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdmin.department}
                    onChange={(e) => setNewAdmin({ ...newAdmin, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                    placeholder="e.g., Computer Science & Engineering"
                  />
                </div> */}

                {/* Password fields remain unchanged */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdmin.confirmPassword}
                    onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="twoFactor"
                  checked={newAdmin.twoFactor}
                  onChange={(e) => setNewAdmin({ ...newAdmin, twoFactor: e.target.checked })}
                  className="w-5 h-5 text-[#1e3a8a] rounded focus:ring-[#1e3a8a]"
                />
                <label htmlFor="twoFactor" className="text-sm text-gray-700">
                  Enable Two-Factor Authentication (recommended)
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setError('');
                    setNewAdmin({
                      fullName: '',
                      email: '',
                      mobile: '',
                      role: 'Academic Admin',
                      academicAdmins: '',
                      password: '',
                      confirmPassword: '',
                      twoFactor: false,
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-800 transition shadow-lg flex items-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {submitting ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicAdminsPage;