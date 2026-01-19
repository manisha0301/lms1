// src/pages/student/ProfileDashboard.jsx
import { use, useState } from 'react';
import {
  User, Mail, Phone, Calendar, Clock, BookOpen,
  CheckCircle, AlertCircle, Edit2, LogOut, Award,
  FileText, Users, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 
export default function ProfileDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    university: 'Delhi University',
    avatar: null
  });
 
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
 
  const upcomingClasses = [
    { id: 1, course: 'React Masterclass', date: '2025-11-20', time: '7:00 PM', instructor: 'John Doe' },
    { id: 2, course: 'Node.js Advanced', date: '2025-11-22', time: '6:30 PM', instructor: 'Jane Smith' },
    { id: 3, course: 'Python Basics', date: '2025-11-25', time: '5:00 PM', instructor: 'Alice Johnson' },
    { id: 4, course: 'Java Enterprise', date: '2025-11-28', time: '4:00 PM', instructor: 'Bob Wilson' },
    { id: 2, course: 'Node.js Advanced', date: '2025-11-22', time: '6:30 PM', instructor: 'Jane Smith' },
    { id: 3, course: 'Python Basics', date: '2025-11-25', time: '5:00 PM', instructor: 'Alice Johnson' },
    { id: 4, course: 'Java Enterprise', date: '2025-11-28', time: '4:00 PM', instructor: 'Bob Wilson' },
  ];
 
  const pendingAssignments = 3;
 
  const registeredCourses = [
    { id: 'react-101', title: 'React Masterclass', progress: 80, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop',
      exams: { completed: 1, total: 3, next: { name: 'Midterm Quiz', date: '2025-11-25', link: 'https://exam.kristellar.com/react-midterm' } } },
    { id: 'vue-301', title: 'Vue.js Essentials', progress: 100, thumbnail: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=200&h=200&fit=crop',
      exams: { completed: 3, total: 3, next: null } },
    { id: 'node-201', title: 'Node.js Advanced', progress: 45, thumbnail: 'https://images.unsplash.com/photo-1610986603166-f78428624e76?w=200&h=200&fit=crop',
      exams: { completed: 0, total: 4, next: { name: 'API Project Review', date: '2025-12-01', link: 'https://exam.kristellar.com/node-review' } } },
    { id: 'python-401', title: 'Python Basics', progress: 60, thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f65d4af39a5?w=200&h=200&fit=crop',
      exams: { completed: 2, total: 5, next: { name: 'Data Structures Exam', date: '2025-11-28', link: 'https://exam.kristellar.com/python-ds' } } },
    { id: 'java-501', title: 'Java Enterprise', progress: 30, thumbnail: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=200&h=200&fit=crop',
      exams: { completed: 1, total: 4, next: { name: 'Spring Boot Test', date: '2025-12-10', link: 'https://exam.kristellar.com/java-spring' } } }
  ];
 
  // Calculate overall progress from registered courses
  const overallProgress = registeredCourses.length > 0
    ? Math.round(registeredCourses.reduce((sum, c) => sum + c.progress, 0) / registeredCourses.length)
    : 0;
 
  // Calculate exam progress from registered courses
  const examProgress = registeredCourses.reduce((acc, c) => ({
    completed: acc.completed + c.exams.completed,
    total: acc.total + c.exams.total,
    nextExams: [...acc.nextExams, c.exams.next].filter(Boolean)
  }), { completed: 0, total: 0, nextExams: [] });
 
  // Get the soonest upcoming exam
  const upcomingExam = examProgress.nextExams
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;
 
  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully');
    navigate('/login');
    // In real app: navigate('/login')
  };
 
  const goToCourse = (id) => {
    alert(`Navigating to course: ${id}`);
    // In real app: navigate(`/student/course/${id}`)
  };
 
  return (
  <div className="min-h-screen bg-gray-50 pb-12">
    {/* Consistent Blue Header with breadcrumb-style text */}
    <div className="bg-[#1e3a8a] text-white p-8 mb-8">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-white mt-1 opacity-90">Manage your academic journey and track your milestones</p>
      </div>
    </div>
 
    <div className="mx-auto px-4 flex flex-col lg:flex-row gap-8">
     
      {/* LEFT COLUMN: Profile Sidebar */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg mx-auto">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            {/* Active Status Badge */}
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
          <p className="text-blue-600 font-medium mb-2">Student</p>
          <p className="text-xs text-gray-400 mb-6">Joined 26 Dec 2025</p>
         
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-2.5 px-4 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-800 transition-shadow shadow-md"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
 
        {/* Upcoming Classes Sidebar Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-purple-100 rounded-md">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            Upcoming Classes
          </h3>
          <div className="space-y-4 h-75 overflow-y-auto pr-2">
            {upcomingClasses.map(cls => (
              <div key={cls.id} className="p-3 border border-gray-50 bg-gray-50/50 rounded-lg hover:bg-purple-50 transition-colors">
                <p className="font-semibold text-sm text-gray-800">{cls.course}</p>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {cls.time}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1"><User className="w-3 h-3"/> {cls.instructor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* RIGHT COLUMN: Content Area */}
      <div className="lg:w-2/3 space-y-6">
       
        {/* Section 1: Personal Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-2 mb-8 pb-3 border-b border-gray-50">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
          </div>
         
          <div className="grid md:grid-cols-2 gap-y-8 gap-x-12">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-gray-800 font-medium">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Email Address</p>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Phone Number</p>
              <p className="text-gray-800 font-medium">{user.phone}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">University</p>
              <p className="text-gray-800 font-medium">{user.university}</p>
            </div>
          </div>
        </div>
 
        {/* Section 2: Overall Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-md">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Overall Progress</h3>
            </div>
            <span className="text-blue-600 font-bold">{overallProgress}%</span>
          </div>
         
          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
 
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-bold text-orange-900">Pending Assignments</p>
                <p className="text-xs text-orange-700">Submit these before the deadline</p>
              </div>
            </div>
            <span className="text-3xl font-black text-orange-600">{pendingAssignments}</span>
          </div>
        </div>
 
        {/* Section 3: Exam Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-green-100 rounded-md">
              <Award className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Exam Progress</h3>
          </div>
 
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-center items-center p-6 border border-gray-100 rounded-xl">
              <p className="text-4xl font-black text-gray-800">{examProgress.completed}<span className="text-gray-300 text-2xl mx-1">/</span>{examProgress.total}</p>
              <p className="text-xs text-gray-500 font-bold uppercase mt-2">Exams Completed</p>
            </div>
 
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex flex-col justify-between">
              <div>
                <p className="text-xs text-green-700 font-bold uppercase mb-1">Next Upcoming Exam</p>
                <p className="text-gray-900 font-bold">{upcomingExam?.name || "None Scheduled"}</p>
                <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {upcomingExam?.date}
                </p>
              </div>
              <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm">
                Start Exam
              </button>
            </div>
          </div>
        </div>
 
      </div>
    </div>
 
    {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform scale-100 transition-transform duration-300">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Edit Profile</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
              <input
                type="text"
                placeholder="University"
                value={editForm.university}
                onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
  </div>
);
}