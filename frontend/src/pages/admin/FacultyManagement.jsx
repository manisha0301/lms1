// src/pages/admin/FacultyManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Users, UserPlus, Search, Calendar, CheckCircle, XCircle,
  Eye, Trash2, Edit, Key, BookOpen, Camera, X, Loader2,
  Mail, Phone, Home, Briefcase, GraduationCap, Lock, UserCheck,
  MapPin, Shield, AlertCircle, ArrowLeft, Check, X as RejectIcon,
  Calendar1
} from "lucide-react";
import apiConfig from "../../config/apiConfig";

const FacultyManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [modalType, setModalType] = useState("");

  const [faculties, setFaculties] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // State to track real-time validation errors for add form
  const [addFormErrors, setAddFormErrors] = useState({});

  // Edit form state
  const [editForm, setEditForm] = useState({
    phone: "",
    address: "",
    designation: "",
    qualification: "",
  });
  const [editErrors, setEditErrors] = useState({});

  const fetchFacultyData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${apiConfig.API_BASE_URL}/api/auth/admin/faculty`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setFaculties(data.faculties || []);
        setPendingRequests(data.pendingRequests || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
    // Fetch all courses for course count per faculty
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${apiConfig.API_BASE_URL}/api/auth/admin/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses || []);
        } else {
          setCourses([]);
        }
      } catch (err) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const filteredFaculties = faculties.filter(f =>
    f.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (type, faculty) => {
    setSelectedFaculty(faculty);
    setModalType(type);

    // Pre-fill edit form when opening edit modal
    if (type === "edit" && faculty) {
      setEditForm({
        phone: faculty.phone || "",
        address: faculty.address || "",
        designation: faculty.designation || "",
        qualification: faculty.qualification || "",
      });
      setEditErrors({});
    }
  };

  const closeModal = () => {
    setSelectedFaculty(null);
    setModalType("");
    setEditForm({ phone: "", address: "", designation: "", qualification: "" });
    setEditErrors({});
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    document.getElementById('profilePicInput').value = '';
  };

  // Real-time validation for add form (runs on every change)
  const validateAddFormLive = (field, value) => {
    const errors = { ...addFormErrors };

    if (field === "fullName") {
      const trimmed = (value || "").trim();
      const nameRegex = /^[A-Za-z ]+$/;
      if (!trimmed) {
        errors.fullName = "Full name is required";
      } else if (!nameRegex.test(trimmed)) {
        errors.fullName = "Full name must contain only letters and spaces.";
      } else if (trimmed.length < 2) {
        errors.fullName = "Full name is too short (minimum 2 characters)";
      } else if (trimmed.length > 100) {
        errors.fullName = "Full name is too long (maximum 100 characters)";
      } else {
        delete errors.fullName;
      }
    }

    if (field === "email") {
      const trimmed = (value || "").trim().toLowerCase();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!trimmed) {
        errors.email = "Email is required";
      } else if (!emailRegex.test(trimmed)) {
        errors.email = "Please enter a valid email address";
      } else {
        const domainPart = trimmed.split('@')[1] || '';
        const tld = domainPart.split('.').pop() || '';
        if (/\d$/.test(tld)) {
          errors.email = "Invalid email domain – top-level domain cannot end with a number";
        } else {
          delete errors.email;
        }
      }
    }

    if (field === "phone") {
      const cleaned = (value || "").replace(/[\s\-+]/g, '');
      const phoneRegex = /^[6789]\d{9}$/;
      if (cleaned && !phoneRegex.test(cleaned)) {
        errors.phone = "Mobile number must be a valid 10-digit number (e.g., 9876543210)";
      } else {
        delete errors.phone;
      }
    }

    if (field === "password") {
      if (!value) {
        errors.password = "Password is required";
      } else if (value.length < 8 || value.length > 16) {
        errors.password = "Password must be between 8 and 16 characters long";
      } else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;
        if (!passwordRegex.test(value)) {
          errors.password = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        } else {
          delete errors.password;
        }
      }
    }

    setAddFormErrors(errors);
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Final validation pass before submit
    validateAddFormLive("fullName", data.fullName || '');
    validateAddFormLive("email", data.email || '');
    validateAddFormLive("phone", data.phone || '');
    validateAddFormLive("password", data.password || '');

    // If any error remains → don't submit
    if (Object.keys(addFormErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${apiConfig.API_BASE_URL}/api/auth/admin/faculty`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const responseData = await res.json();

      if (responseData.success) {
        setShowAddModal(false);
        setSelectedFile(null);
        setFilePreview(null);
        setFaculties(prev => [responseData.faculty, ...prev]);
        e.target.reset();
        setAddFormErrors({});
        alert("Faculty added successfully");
      } else {
        alert("Error: " + (responseData.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to add faculty. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  // Approve faculty
  const handleApprove = async (facultyId) => {
    if (!window.confirm("Approve this faculty member? They will be able to log in.")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${apiConfig.API_BASE_URL}/api/auth/admin/faculty/${facultyId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (data.success) {
        setPendingRequests(prev => prev.filter(f => f.id !== facultyId));
        setFaculties(prev => [data.faculty, ...prev]);
        alert("Faculty approved successfully!");
      } else {
        alert("Approval failed: " + data.error);
      }
    } catch (err) {
      console.error("Approve error:", err);
      alert("Failed to approve faculty.");
    }
  };

  // Reject faculty
  const handleReject = async (facultyId) => {
    if (!window.confirm("Reject this faculty request? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${apiConfig.API_BASE_URL}/api/auth/admin/faculty/${facultyId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (data.success) {
        setPendingRequests(prev => prev.filter(f => f.id !== facultyId));
        alert("Faculty request rejected.");
      } else {
        alert("Rejection failed: " + data.error);
      }
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject faculty.");
    }
  };

  // Handle edit form input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));

    // Basic validation
    const newErrors = { ...editErrors };
    if (name === "phone" && value.trim()) {
      const cleaned = value.replace(/[\s\-+]/g, '');
      if (!/^[6789]\d{9}$/.test(cleaned)) {
        newErrors.phone = "Invalid 10-digit mobile number";
      } else {
        delete newErrors.phone;
      }
    }
    if (name === "designation" && !value.trim()) {
      newErrors.designation = "Designation is required";
    } else if (name === "designation") {
      delete newErrors.designation;
    }
    if (name === "qualification" && !value.trim()) {
      newErrors.qualification = "Qualification is required";
    } else if (name === "qualification") {
      delete newErrors.qualification;
    }
    setEditErrors(newErrors);
  };

  // Save edited faculty
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    // Final validation
    const errors = {};
    if (editForm.phone.trim() && !/^[6789]\d{9}$/.test(editForm.phone.replace(/[\s\-+]/g, ''))) {
      errors.phone = "Invalid 10-digit mobile number";
    }
    if (!editForm.designation?.trim()) {
      errors.designation = "Designation is required";
    }
    if (!editForm.qualification?.trim()) {
      errors.qualification = "Qualification is required";
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${apiConfig.API_BASE_URL}/api/auth/admin/faculty/${selectedFaculty.id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setFaculties(prev =>
          prev.map(f =>
            f.id === selectedFaculty.id ? { ...f, ...editForm } : f
          )
        );
        alert("Faculty updated successfully!");
        closeModal();
      } else {
        alert("Update failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update faculty. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="mx-auto px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Faculty Management</h1>
              <p className="mt-2 text-blue-100">Manage, approve, and monitor all faculty members</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
              <p className="text-3xl font-bold text-[#1e3a8a]">{faculties.length + pendingRequests.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Faculties</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
              <p className="text-3xl font-bold text-[#1e3a8a]">{pendingRequests.length}</p>
              <p className="text-sm text-gray-600 mt-1">Pending Requests</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
              <p className="text-3xl font-bold text-[#1e3a8a]">
                {faculties.filter(f => f.status === "Active").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Active Faculties</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-8 pb-10">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-semibold transition cursor-pointer ${activeTab === "overview" ? "border-b-4 border-[#1e3a8a] text-[#1e3a8a]" : "text-gray-600 hover:text-[#1e3a8a]"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("faculties")}
            className={`px-6 py-3 font-semibold transition cursor-pointer ${activeTab === "faculties" ? "border-b-4 border-[#1e3a8a] text-[#1e3a8a]" : "text-gray-600 hover:text-[#1e3a8a]"}`}
          >
            Faculties
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-semibold transition cursor-pointer ${activeTab === "pending" ? "border-b-4 border-[#1e3a8a] text-[#1e3a8a]" : "text-gray-600 hover:text-[#1e3a8a]"}`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
        </div>

        {/* Search + Add Button */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search faculties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition text-lg"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-3"
          >
            <UserPlus className="w-6 h-6" />
            Add New Faculty
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-16 h-16 text-[#1e3a8a] animate-spin mb-6" />
            <p className="text-xl text-gray-600">Loading faculty data...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Faculties */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-100">
                  <div className="bg-[#1e3a8a] text-white p-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <Users className="w-7 h-7" />
                      Faculties Overview
                    </h2>
                  </div>
                  <div className="p-6 space-y-4 overflow-y-auto max-h-[400px]">
                    {faculties.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No active faculties yet</p>
                    ) : (
                      faculties.map((faculty) => (
                        <div
                          key={faculty.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50 transition cursor-pointer"
                          onClick={() => openModal("view", faculty)}
                        >
                          <div className="flex items-center gap-4">
                            {faculty.profile_picture ? (
                              <img
                                src={`${apiConfig.API_BASE_URL}/uploads/faculty/${faculty.profile_picture}`}
                                alt={faculty.name}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-300"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                {faculty.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-gray-800">{faculty.name}</h3>
                              <p className="text-sm text-gray-600">{faculty.code} • {faculty.address || 'Location not set'}</p>
                            </div>
                          </div>
                          <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-full text-sm">
                            Active
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Pending Requests */}
                <div className="bg-white rounded-xl shadow-xl border border-gray-100">
                  <div className="bg-[#1e3a8a] text-white p-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <AlertCircle className="w-7 h-7" />
                      Pending Requests
                    </h2>
                  </div>
                  <div className="p-6 space-y-4 overflow-y-auto max-h-[400px]">
                    {pendingRequests.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No pending requests</p>
                    ) : (
                      pendingRequests.map((request) => (
                        <div key={request.id} className="p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-center justify-between mb-4">
                            {request.profile_picture ? (
                              <img
                                src={`${apiConfig.API_BASE_URL}/uploads/faculty/${request.profile_picture}`}
                                alt={request.name}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-300"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl">
                                {request.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-gray-800">{request.name}</h3>
                              <p className="text-sm text-gray-600">{request.designation}</p>
                            </div>
                            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 font-bold rounded-full text-sm">
                              Pending
                            </span>
                          </div>
                          <div className="flex justify-end gap-4">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="px-6 py-2 bg-[#1e3a8a] text-white rounded-xl font-semibold transition cursor-pointer hover:scale-105"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="px-6 py-2 bg-white text-black rounded-xl font-semibold transition cursor-pointer hover:scale-105 border border-gray-300"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Faculties Tab */}
            {activeTab === "faculties" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFaculties.length === 0 ? (
                  <p className="col-span-full text-center text-gray-500 py-12">No faculties found</p>
                ) : (
                  filteredFaculties.map((faculty) => (
                    <div
                      key={faculty.id}
                      className="bg-white rounded-xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                    >
                      <div className="bg-[#1e3a8a] text-white p-6">
                        <h2 className="text-xl font-bold">{faculty.name}</h2>
                        <p className="text-sm opacity-90 mt-1">{faculty.code}</p>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex justify-center mb-4">
                          {faculty.profile_picture ? (
                            <img
                              src={`${apiConfig.API_BASE_URL}/uploads/faculty/${faculty.profile_picture}`}
                              alt={faculty.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-[#1e3a8a]"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold text-3xl">
                              {faculty.name.split(" ").map(n => n[0]).join("")}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 flex items-center gap-2"><Mail className="w-4 h-4" /> {faculty.email}</p>
                        <p className="text-gray-600 flex items-center gap-2"><Phone className="w-4 h-4" /> {faculty.phone}</p>
                        <p className="text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4" /> {faculty.address || 'Not provided'}</p>
                        <p className="text-gray-600 flex items-center gap-2"><BookOpen className="w-4 h-4" /> {
                          (() => {
                            if (!courses.length) return '0 Courses';
                            const count = courses.filter(course => Array.isArray(course.teachers) && course.teachers.includes(faculty.id)).length;
                            return `${count} Course${count === 1 ? '' : 's'}`;
                          })()
                        }</p>
                      </div>
                      <div className="flex justify-end gap-4 px-6 pb-6">
                        <button onClick={() => openModal("view", faculty)} className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
                          <Eye className="w-5 h-5 text-[#1e3a8a]" />
                        </button>
                        <button onClick={() => openModal("edit", faculty)} className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
                          <Edit className="w-5 h-5 text-emerald-600" />
                        </button>
                        <button onClick={() => openModal("delete", faculty)} className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Tab */}
            {activeTab === "pending" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingRequests.length === 0 ? (
                  <p className="col-span-full text-center text-gray-500 py-12">No pending requests</p>
                ) : (
                  pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white rounded-xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                    >
                      <div className="bg-[#1e3a8a] text-white p-6">
                        <h2 className="text-xl font-bold">{request.name}</h2>
                        <p className="text-sm opacity-90 mt-1">{request.code}</p>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex justify-center mb-4">
                          {request.profile_picture ? (
                            <img
                              src={`${apiConfig.API_BASE_URL}/uploads/faculty/${request.profile_picture}`}
                              alt={request.name}
                              className="w-24 h-24 rounded-full object-cover border-4 border-[#1e3a8a]"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                              {request.name.split(" ").map(n => n[0]).join("")}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 flex items-center gap-2"><Mail className="w-4 h-4" /> {request.email}</p>
                        <p className="text-gray-600 flex items-center gap-2"><Phone className="w-4 h-4" /> {request.phone}</p>
                        <p className="text-gray-600 flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {request.qualification}</p>
                        <p className="text-gray-600 flex items-center gap-2"><Briefcase className="w-4 h-4" /> {request.designation}</p>
                      </div>
                      <div className="flex justify-end gap-4 px-6 pb-6">
                        <button 
                          onClick={() => handleApprove(request.id)}
                          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(request.id)}
                          className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* View Modal */}
        {modalType === "view" && selectedFaculty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Faculty Details</h2>
                <button onClick={closeModal} className="hover:bg-white/20 p-1 rounded cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedFaculty.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p className="flex items-center gap-3"><Mail className="w-5 h-5 text-[#1e3a8a]" /> {selectedFaculty.email}</p>
                  <p className="flex items-center gap-3"><Phone className="w-5 h-5 text-[#1e3a8a]" /> {selectedFaculty.phone}</p>
                  <p className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#1e3a8a]" /> {selectedFaculty.address}</p>
                  <p className="flex items-center gap-3"><Briefcase className="w-5 h-5 text-[#1e3a8a]" /> {selectedFaculty.designation}</p>
                  <p className="flex items-center gap-3"><GraduationCap className="w-5 h-5 text-[#1e3a8a]" /> {selectedFaculty.qualification}</p>
                  <p className="flex items-center gap-3"><Calendar1 className="w-5 h-5 text-[#1e3a8a]" />
                    {selectedFaculty.created_at ?
                      new Date(selectedFaculty.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'long', year: 'numeric'
                      }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {modalType === "edit" && selectedFaculty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Faculty</h2>
                <button onClick={closeModal} className="hover:bg-white/20 p-1 rounded cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Read-only reference fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={selectedFaculty.name}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={selectedFaculty.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl cursor-not-allowed"
                    />
                  </div>

                  {/* Editable fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition ${
                        editErrors.phone ? "border-red-500 ring-red-500/30" : "border-gray-300"
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {editErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="address"
                      value={editForm.address}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition ${
                        editErrors.address ? "border-red-500 ring-red-500/30" : "border-gray-300"
                      }`}
                      placeholder="123 Academic Street, Mumbai"
                    />
                    {editErrors.address && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="designation"
                      value={editForm.designation}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition ${
                        editErrors.designation ? "border-red-500 ring-red-500/30" : "border-gray-300"
                      }`}
                      placeholder="Associate Professor"
                    />
                    {editErrors.designation && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.designation}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="qualification"
                      value={editForm.qualification}
                      onChange={handleEditChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition ${
                        editErrors.qualification ? "border-red-500 ring-red-500/30" : "border-gray-300"
                      }`}
                      placeholder="PhD in Artificial Intelligence"
                    />
                    {editErrors.qualification && (
                      <p className="mt-1 text-sm text-red-600">{editErrors.qualification}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || Object.keys(editErrors).length > 0}
                    className={`px-8 py-3 text-white rounded-xl font-semibold shadow transition-all flex items-center gap-2 min-w-[140px] justify-center ${
                      submitting || Object.keys(editErrors).length > 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105"
                    }`}
                  >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {modalType === "delete" && selectedFaculty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Delete Faculty Permanently?</h2>
                <button onClick={closeModal} className="hover:bg-white/20 p-1 rounded">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-14 h-14 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Delete Faculty Permanently?</h3>
                <p className="text-gray-600 leading-relaxed">
                  You are about to delete <span className="font-bold text-red-600">"{selectedFaculty.name}"</span>.<br />
                  This will remove the faculty, all associated records, and access.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                  <p className="text-sm font-medium text-red-700">
                    This action <strong>cannot be undone</strong>.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("adminToken");
                        const response = await fetch(`${apiConfig.API_BASE_URL}/api/auth/admin/faculty/${selectedFaculty.id}`, {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                        });

                        const data = await response.json();

                        if (data.success) {
                          // Remove from UI list
                          setFaculties((prev) => prev.filter((f) => f.id !== selectedFaculty.id));
                          alert("Faculty deleted successfully!");
                          closeModal();
                        } else {
                          alert("Delete failed: " + (data.error || "Unknown error"));
                        }
                      } catch (err) {
                        console.error("Delete error:", err);
                        alert("Failed to delete faculty. Check console.");
                      }
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    Yes, Delete Faculty
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Faculty Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Add New Faculty</h2>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setAddFormErrors({});
                  }} 
                  className="hover:bg-white/20 p-1 rounded"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="p-6 space-y-6" onSubmit={handleAddFaculty}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="fullName"
                      required
                      onChange={(e) => validateAddFormLive("fullName", e.target.value)}
                      onKeyPress={(e) => {
                        if (!/[A-Za-z ]/.test(e.key)) e.preventDefault();
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition ${
                        addFormErrors.fullName ? "border-red-500 ring-red-500/30" : "border-gray-300"
                      }`}
                      placeholder="Dr. Sarah Johnson"
                    />
                    {addFormErrors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{addFormErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      onChange={(e) => validateAddFormLive("email", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition ${
                        addFormErrors.email ? "border-red-500 ring-red-500/30" : "border-gray-300"
                      }`}
                      placeholder="sarah@university.edu"
                    />
                    {addFormErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{addFormErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      name="phone"
                      onChange={(e) => validateAddFormLive("phone", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition ${
                        addFormErrors.phone ? "border-red-500 ring-red-500/30" : "border-gray-300"
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {addFormErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{addFormErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="password"
                      type="password"
                      required
                      onChange={(e) => validateAddFormLive("password", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none transition ${
                        addFormErrors.password ? "border-red-500 ring-red-500/30" : "border-gray-300"
                      }`}
                      placeholder="••••••••"
                    />
                    {addFormErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{addFormErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input 
                      name="address" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                      placeholder="123 Academic Street, Mumbai" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Designation</label>
                    <input 
                      name="designation" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                      placeholder="Professor" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification</label>
                    <input 
                      name="qualification" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none"
                      placeholder="PhD in Physics" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                    <select 
                      name="employmentStatus" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] outline-none cursor-pointer"
                    >
                      <option>Employed</option>
                      <option>Unemployed</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-indigo-400 transition cursor-pointer group"
                    onClick={() => document.getElementById('profilePicInput').click()}
                  >
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4 group-hover:text-indigo-400 transition" />
                    <p className="text-gray-500 group-hover:text-indigo-600 transition">Click to upload or drag and drop</p>
                    <input
                      id="profilePicInput"
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                  {filePreview && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative inline-block">
                        <img src={filePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border" />
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition -translate-y-2 translate-x-2 shadow-lg"
                          title="Remove picture"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddModal(false);
                      setAddFormErrors({});
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting || Object.keys(addFormErrors).length > 0}
                    className={`px-8 py-3 text-white rounded-xl font-semibold shadow transition-all flex items-center gap-2 ${
                      submitting || Object.keys(addFormErrors).length > 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105"
                    }`}
                  >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {submitting ? "Adding..." : "Add Faculty"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyManagement;