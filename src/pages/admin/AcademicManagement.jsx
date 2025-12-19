// src/pages/admin/AcademicManagement.jsx
import React, { useState } from "react";
import {
  UserPlus,
  Search,
  Eye,
  Edit,
  Trash2,
  Key,
  X,
  Calendar,
  Mail,
  User,
  Lock,
  Home,
  MapPin,
  Globe,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Singapore",
  "United Arab Emirates",
  "Japan",
];

const AcademicManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAcademic, setSelectedAcademic] = useState(null);
  const [modalType, setModalType] = useState(""); // "view", "edit", "password", "delete"

  const [academics, setAcademics] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya.academic@lms.com",
      username: "priya_sharma",
      dob: "1985-06-15",
      address: "45 MG Road",
      city: "Mumbai",
      postalCode: "400001",
      country: "India",
    },
    {
      id: 2,
      name: "Rahul Verma",
      email: "rahul.verma@lms.com",
      username: "rahul_verma92",
      dob: "1990-03-22",
      address: "Koramangala 6th Block",
      city: "Bangalore",
      postalCode: "560095",
      country: "India",
    },
    {
      id: 3,
      name: "Aisha Khan",
      email: "aisha@lms.com",
      username: "aisha_k",
      dob: "1988-11-30",
      address: "123 Park Street",
      city: "Dubai",
      postalCode: "00000",
      country: "United Arab Emirates",
    },
  ]);

  const filtered = academics.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (type, academic = null) => {
    setSelectedAcademic(academic);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedAcademic(null);
    setModalType("");
  };

  const handleAddAcademic = () => {
    // In real app: API call
    alert("New Course Admin added successfully!");
    setShowAddModal(false);
  };

  const handleDeleteAcademic = () => {
    // In real app: API call
    setAcademics(academics.filter((a) => a.id !== selectedAcademic.id));
    closeModal();
    alert("Course Admin deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold">Academic Management</h1>
              <p className="opacity-90 mt-1">Manage course coordinators and academic administrators</p>
            </div>
          </div>
          <div className="text-right bg-white backdrop-blur px-6 py-4 rounded-xl">
            <p className="text-3xl font-bold text-[#1e3a8a] text-center">{academics.length}</p>
            <p className="text-sm opacity-90 text-black font-bold">Total Admins</p>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-8 py-10">
        {/* Search + Add Button */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition text-lg shadow-sm"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-lg hover:shadow-xl flex items-center gap-3 transition hover:scale-105"
          >
            <UserPlus className="w-6 h-6" />
            Add New Course Admin
          </button>
        </div>

        {/* Academics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((academic) => (
            <div
              key={academic.id}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {academic.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal("view", academic)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openModal("edit", academic)}
                    className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openModal("delete", academic)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900">{academic.name}</h3>
              <p className="text-sm text-gray-600 mt-1">Username: {academic.username}</p>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span className="truncate">{academic.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>DOB: {new Date(academic.dob).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{academic.city}, {academic.country}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Home className="w-5 h-5" />
                  <span>{academic.address}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">Active</span>
                <button
                  onClick={() => openModal("password", academic)}
                  className="text-[#1e3a8a] font-medium flex items-center gap-2 hover:underline"
                >
                  <Key className="w-4 h-4" />
                  Reset Password
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No course admins found matching your search.</p>
          </div>
        )}
      </div>

      {/* Add New Course Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold">Add New Course Admin</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InputField icon={<User />} label="Full Name" placeholder="Priya Sharma" />
                <InputField icon={<Mail />} label="Email" type="email" placeholder="priya@lms.com" />
                <InputField icon={<Calendar />} label="Date of Birth" type="date" />
                <InputField icon={<User />} label="Username" placeholder="priya_sharma" />
                <InputField icon={<Lock />} label="Password" type="password" placeholder="••••••••" />
                <InputField icon={<Home />} label="Address" placeholder="45 MG Road" />
                <InputField icon={<MapPin />} label="City" placeholder="Mumbai" />
                <InputField icon={<MapPin />} label="Postal Code" placeholder="400001" />
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Country
                  </label>
                  <select className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] transition">
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAcademic}
                  className="px-10 py-4 bg-gradient-to-r from-[#1e3a8a] to-blue-700 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition"
                >
                  Create Course Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View / Edit Modal */}
      {(modalType === "view" || modalType === "edit") && selectedAcademic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
            <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold">
                {modalType === "view" ? "View" : "Edit"} Course Admin
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-xl transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={selectedAcademic.name}
                    disabled={modalType === "view"}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={selectedAcademic.email}
                    disabled={modalType === "view"}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] disabled:bg-gray-100"
                  />
                </div>
                {/* Add other fields similarly if needed */}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition"
                >
                  {modalType === "view" ? "Close" : "Cancel"}
                </button>
                {modalType === "edit" && (
                  <button className="px-10 py-4 bg-[#1e3a8a] text-white rounded-xl font-bold shadow-lg hover:scale-105 transition">
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === "delete" && selectedAcademic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
            <div className="bg-red-600 text-white p-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-bold">Delete Course Admin</h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-xl transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-14 h-14 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Are you sure?</h3>
              <p className="text-gray-600">
                You are about to permanently delete <strong>{selectedAcademic.name}</strong>.
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={closeModal}
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAcademic}
                  className="px-10 py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Input Component
const InputField = ({ icon, label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <input
      className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/20 transition"
      {...props}
    />
  </div>
);

export default AcademicManagement;