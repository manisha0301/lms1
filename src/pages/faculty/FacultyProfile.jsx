// src/pages/faculty/FacultyProfile.jsx
import { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Building,
  Edit3,
  Save,
  X,
  HelpCircle,
  LogOut,
  ChevronRight,
  BookOpen,
  Award,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FacultyProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Mock Faculty Data
  const [faculty, setFaculty] = useState({
    name: "Dr. Sarah Chen",
    email: "sarah.chen@cybernetics.edu",
    phone: "+91 98765 43210",
    employeeId: "FAC-2025-108",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    joiningDate: "2018-07-15",
    qualifications: "Ph.D. in Computer Science, Stanford University",
    coursesTeaching: ["Advanced Node.js (CSE-405)", "Machine Learning A-Z (CSE-601)"],
    totalClasses: 124,
    totalStudents: 168
  });

  const [editData, setEditData] = useState({ ...faculty });

  const handleSave = () => {
    setFaculty({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...faculty });
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Clear session and redirect
    alert("Logged out successfully!");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mb-8 bg-[#1e3a8a] border border-gray-200 shadow-sm px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-white mt-1">Manage your personal information and settings</p>
        </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {faculty.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-4">{faculty.name}</h2>
              <p className="text-indigo-600 font-medium">{faculty.designation}</p>
              <p className="text-sm text-gray-600 mt-1">{faculty.department}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-[#1e3a8a]/5 rounded-xl p-4">
                    <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">{faculty.coursesTeaching.length}</p>
                    <p className="text-xs text-gray-600">Courses</p>
                  </div>
                  <div className="bg-[#1e3a8a]/5 rounded-xl p-4">
                    <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-800">{faculty.totalStudents}</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1e3a8a] text-white rounded-xl hover:bg-indigo-700 transition font-medium"
              >
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </button>
              <button
                onClick={() => setShowHelp(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                <HelpCircle className="w-5 h-5" />
                Help & Support
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-6 h-6 text-indigo-600" />
                Personal Information
              </h3>
              {isEditing && (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                    <Save className="w-5 h-5" />
                    Save
                  </button>
                  <button onClick={handleCancel} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: faculty.name, key: "name", icon: User },
                { label: "Employee ID", value: faculty.employeeId, key: "employeeId", icon: Award },
                { label: "Email Address", value: faculty.email, key: "email", icon: Mail },
                { label: "Phone Number", value: faculty.phone, key: "phone", icon: Phone },
                { label: "Department", value: faculty.department, key: "department", icon: Building },
                { label: "Qualifications", value: faculty.qualifications, key: "qualifications", icon: Award },
                { label: "Joining Date", value: new Date(faculty.joiningDate).toLocaleDateString('en-IN'), key: "joiningDate", icon: Calendar },
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <field.icon className="w-4 h-4" />
                    {field.label}
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData[field.key]}
                      onChange={(e) => setEditData({...editData, [field.key]: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{field.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Courses Teaching */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Courses Currently Teaching
            </h3>
            <div className="space-y-4">
              {faculty.coursesTeaching.map((course, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1e3a8a]/5 to-white rounded-xl hover:shadow-md transition">
                  <div>
                    <p className="font-semibold text-gray-800">{course}</p>
                    <p className="text-sm text-gray-600 mt-1">Semester: Fall 2025</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-indigo-600" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-row gap-10">
            <button
              onClick={() => navigate('/exams')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#162c6a] transition font-medium"
            >
              <Clock className="w-5 h-5" />
              Exams
            </button>
            <button 
              onClick={() => navigate('/assignments')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#162c6a] transition font-medium"
            >
              <BookOpen className="w-5 h-5" />
              Assignments
            </button>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Help & Support</h2>
                <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center">
                <HelpCircle className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">How can we help you?</h3>
              </div>
              <div className="space-y-4">
                {[
                  { title: "Technical Support", desc: "Facing login or system issues?", email: "support@cybernetics.edu" },
                  { title: "Academic Queries", desc: "Course or exam related questions", email: "academics@cybernetics.edu" },
                  { title: "Emergency", desc: "Urgent assistance required", phone: "+91 98765 00000" }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                    <p className="text-indigo-600 font-medium mt-2">
                      {item.email || item.phone}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © 2025 Cybernetics LMS • Faculty Portal
      </footer>
    </div>
  );
}