// src/pages/student/ProfileDashboard.jsx
import { useState } from 'react';
import {
  User, Mail, Phone, Calendar, Clock, BookOpen,
  CheckCircle, AlertCircle, Edit2, LogOut, Award,
  FileText, Users, ChevronRight
} from 'lucide-react';

export default function ProfileDashboard() {
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
    { id: 2, course: 'Node.js Advanced', date: '2025-11-22', time: '6:30 PM', instructor: 'Jane Smith' }
  ];

  const pendingAssignments = 3;

  const registeredCourses = [
    { id: 'react-101', title: 'React Masterclass', progress: 80, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop', 
      exams: { completed: 1, total: 3, next: { name: 'Midterm Quiz', date: '2025-11-25', link: 'https://exam.codekart.com/react-midterm' } } },
    { id: 'vue-301', title: 'Vue.js Essentials', progress: 100, thumbnail: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=200&h=200&fit=crop', 
      exams: { completed: 3, total: 3, next: null } },
    { id: 'node-201', title: 'Node.js Advanced', progress: 45, thumbnail: 'https://images.unsplash.com/photo-1610986603166-f78428624e76?w=200&h=200&fit=crop', 
      exams: { completed: 0, total: 4, next: { name: 'API Project Review', date: '2025-12-01', link: 'https://exam.codekart.com/node-review' } } },
    { id: 'python-401', title: 'Python Basics', progress: 60, thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f65d4af39a5?w=200&h=200&fit=crop', 
      exams: { completed: 2, total: 5, next: { name: 'Data Structures Exam', date: '2025-11-28', link: 'https://exam.codekart.com/python-ds' } } },
    { id: 'java-501', title: 'Java Enterprise', progress: 30, thumbnail: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=200&h=200&fit=crop', 
      exams: { completed: 1, total: 4, next: { name: 'Spring Boot Test', date: '2025-12-10', link: 'https://exam.codekart.com/java-spring' } } }
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
    // In real app: navigate('/login')
  };

  const goToCourse = (id) => {
    alert(`Navigating to course: ${id}`);
    // In real app: navigate(`/student/course/${id}`)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Cybernetics LMS
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Welcome back, <span className="font-semibold text-gray-800">{user.firstName}</span>! 👋
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Left Column: Profile + Upcoming Classes */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                Profile Details
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit2 className="w-5 h-5 text-blue-600" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-600">{user.university}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 p-2 hover:bg-gray-50 rounded-lg transition">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>

          {/* ii. Upcoming Classes */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              Upcoming Classes
            </h2>
            <div className="space-y-3">
              {upcomingClasses.map(cls => (
                <div key={cls.id} className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition flex items-start gap-3">
                  <div className="mt-1">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{cls.course}</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" /> {cls.date}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {cls.time}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">with {cls.instructor}</p>
                  </div>
                </div>
              ))}
              {upcomingClasses.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">No upcoming classes</p>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column: Progress & Exams */}
        <div className="space-y-6">
          {/* iii. Overall Progress & Pending Assignments */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Overall Progress</h2>
            <div className="mb-6">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-700">Course Completion</span>
                <span className="text-gray-800">{overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">Pending Assignments</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">{pendingAssignments}</span>
            </div>
          </div>

          {/* iv. Exam Progress */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              Exam Progress
            </h2>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-800">{examProgress.completed}/{examProgress.total}</p>
              <p className="text-sm text-gray-600">Exams Completed</p>
            </div>
            {/* vi. Upcoming Exam */}
            <div className="p-4 bg-green-50 rounded-xl">
              <h3 className="font-medium text-sm mb-2">Next Upcoming Exam:</h3>
              {upcomingExam ? (
                <>
                  <p className="text-sm text-gray-800 font-semibold">{upcomingExam.name}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> {upcomingExam.date}
                  </p>
                  <a
                    href={upcomingExam.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 bg-green-600 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    Start Exam
                  </a>
                </>
              ) : (
                <p className="text-sm text-gray-500">No upcoming exams</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Registered Courses */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 self-start">
          {/* v. Registered Courses - Horizontal Scroll */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            Registered Courses
          </h2>
          <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {registeredCourses.map(course => (
              <div
                key={course.id}
                onClick={() => goToCourse(course.id)}
                className="flex-shrink-0 w-64 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 cursor-pointer transition-all duration-300 snap-start hover:scale-105"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-36 object-cover rounded-lg mb-3 shadow-sm"
                />
                <h3 className="font-medium text-base text-gray-800 mb-1 line-clamp-1">{course.title}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <span>Progress: {course.progress}%</span>
                  <div className="w-16 bg-gray-300 rounded-full h-1.5">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all"
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






// import { useState } from 'react';
// import {
//   User, Mail, Phone, Calendar, Clock, BookOpen,
//   CheckCircle, AlertCircle, Edit2, LogOut, Award,
//   FileText, Users, ChevronRight
// } from 'lucide-react';

// export default function ProfileDashboard() {
//   const [user, setUser] = useState({
//     firstName: 'Rahul',
//     lastName: 'Sharma',
//     email: 'rahul.sharma@example.com',
//     phone: '+91 98765 43210',
//     university: 'Delhi University',
//     avatar: null
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({ ...user });
//   const [hoveredCourse, setHoveredCourse] = useState(null);

//   const upcomingClasses = [
//     { id: 1, course: 'React Masterclass', date: '2025-11-20', time: '7:00 PM', instructor: 'John Doe' },
//     { id: 2, course: 'Node.js Advanced', date: '2025-11-22', time: '6:30 PM', instructor: 'Jane Smith' }
//   ];

//   const overallProgress = 68;
//   const pendingAssignments = 3;

//   const examProgress = {
//     completed: 2,
//     total: 5,
//     nextExam: { name: 'React Final Exam', date: '2025-12-05', link: 'https://exam.codekart.com/react-final' }
//   };

//   const registeredCourses = [
//     { id: 'react-101', title: 'React Masterclass', progress: 80, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=200&fit=crop' },
//     { id: 'vue-301', title: 'Vue.js Essentials', progress: 100, thumbnail: 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=200&h=200&fit=crop' }
//   ];

//   const handleSave = () => {
//     setUser(editForm);
//     setIsEditing(false);
//     alert('Profile updated successfully!');
//   };

//   const handleLogout = () => {
//     alert('Logging out...');
//   };

//   const goToCourse = (id) => {
//     alert(`Navigating to course: ${id}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
//       <header className="max-w-7xl mx-auto mb-8">
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//               Cybernetics LMS
//             </h1>
//             <p className="text-lg text-gray-600 mt-1">
//               Welcome back, <span className="font-semibold text-gray-800">{user.firstName}</span>! 👋
//             </p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//           >
//             <LogOut className="w-5 h-5" /> Logout
//           </button>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
//             <div className="flex justify-between items-start mb-6">
//               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <User className="w-5 h-5 text-blue-600" />
//                 </div>
//                 Profile Details
//               </h2>
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                 title="Edit Profile"
//               >
//                 <Edit2 className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
//               <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                 {user.firstName[0]}{user.lastName[0]}
//               </div>
//               <div>
//                 <p className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</p>
//                 <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
//                   <BookOpen className="w-4 h-4" />
//                   {user.university}
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                 <div className="p-2 bg-white rounded-lg shadow-sm">
//                   <Mail className="w-4 h-4 text-gray-600" />
//                 </div>
//                 <span className="text-sm text-gray-700">{user.email}</span>
//               </div>
//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                 <div className="p-2 bg-white rounded-lg shadow-sm">
//                   <Phone className="w-4 h-4 text-gray-600" />
//                 </div>
//                 <span className="text-sm text-gray-700">{user.phone}</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <Calendar className="w-5 h-5 text-purple-600" />
//               </div>
//               Upcoming Classes
//             </h2>
//             <div className="space-y-3">
//               {upcomingClasses.map(cls => (
//                 <div key={cls.id} className="group p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300 border border-purple-100">
//                   <p className="font-semibold text-sm text-gray-800 mb-1">{cls.course}</p>
//                   <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
//                     <Calendar className="w-3 h-3" />
//                     <span>{cls.date}</span>
//                     <Clock className="w-3 h-3 ml-2" />
//                     <span>{cls.time}</span>
//                   </div>
//                   <div className="flex items-center gap-1 text-xs text-gray-500">
//                     <Users className="w-3 h-3" />
//                     <span>with {cls.instructor}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <BookOpen className="w-5 h-5 text-blue-600" />
//               </div>
//               Overall Progress
//             </h2>
//             <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
//               <div className="flex justify-between text-sm mb-2 font-medium">
//                 <span className="text-gray-700">Course Completion</span>
//                 <span className="text-blue-600 font-bold">{overallProgress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
//                 <div
//                   className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
//                   style={{ width: `${overallProgress}%` }}
//                 />
//               </div>
//             </div>
//             <div className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 hover:shadow-md transition-all">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-orange-100 rounded-lg">
//                   <AlertCircle className="w-5 h-5 text-orange-600" />
//                 </div>
//                 <span className="font-semibold text-gray-800">Pending Assignments</span>
//               </div>
//               <div className="text-2xl font-bold text-orange-600 bg-white px-4 py-1 rounded-lg shadow-sm">
//                 {pendingAssignments}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <Award className="w-5 h-5 text-green-600" />
//               </div>
//               Exam Progress
//             </h2>
//             <div className="text-center mb-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
//               <div className="inline-flex items-baseline gap-1">
//                 <p className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
//                   {examProgress.completed}
//                 </p>
//                 <p className="text-2xl font-semibold text-gray-400">/{examProgress.total}</p>
//               </div>
//               <p className="text-sm text-gray-600 mt-2 font-medium">Exams Completed</p>
//             </div>
//             <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
//               <div className="flex items-start gap-2 mb-2">
//                 <FileText className="w-4 h-4 text-green-600 mt-0.5" />
//                 <p className="font-semibold text-sm text-gray-800">Next Exam:</p>
//               </div>
//               <p className="text-sm font-medium text-gray-800 ml-6">{examProgress.nextExam.name}</p>
//               <div className="flex items-center gap-1 ml-6 mt-1">
//                 <Calendar className="w-3 h-3 text-gray-500" />
//                 <p className="text-xs text-gray-600">{examProgress.nextExam.date}</p>
//               </div>
//             </div>
//           </div>

//           <a
//             href={examProgress.nextExam.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//           >
//             <div className="flex items-center justify-center gap-2">
//               <FileText className="w-5 h-5" />
//               Start Exam
//               <ChevronRight className="w-5 h-5" />
//             </div>
//           </a>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <BookOpen className="w-5 h-5 text-indigo-600" />
//               </div>
//               Registered Courses
//             </h2>
//             <div className="space-y-3">
//               {registeredCourses.map(course => (
//                 <div
//                   key={course.id}
//                   onClick={() => goToCourse(course.id)}
//                   onMouseEnter={() => setHoveredCourse(course.id)}
//                   onMouseLeave={() => setHoveredCourse(null)}
//                   className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-200 group"
//                 >
//                   <div className="relative">
//                     <img
//                       src={course.thumbnail}
//                       alt={course.title}
//                       className="w-14 h-14 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all"
//                     />
//                     {course.progress === 100 && (
//                       <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
//                         <CheckCircle className="w-3 h-3 text-white" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-semibold text-sm text-gray-800 group-hover:text-indigo-600 transition-colors">
//                       {course.title}
//                     </p>
//                     <div className="flex items-center gap-2 mt-2">
//                       <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
//                         <div
//                           className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
//                           style={{ width: `${course.progress}%` }}
//                         />
//                       </div>
//                       <span className="text-xs font-semibold text-indigo-600 min-w-[3rem] text-right">
//                         {course.progress}%
//                       </span>
//                     </div>
//                   </div>
//                   <ChevronRight 
//                     className={`w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-all ${
//                       hoveredCourse === course.id ? 'translate-x-1' : ''
//                     }`} 
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {isEditing && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold text-gray-800">Edit Profile</h3>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <span className="text-xl text-gray-400">×</span>
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
//                 <input
//                   type="text"
//                   placeholder="Enter first name"
//                   value={editForm.firstName}
//                   onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
//                 <input
//                   type="text"
//                   placeholder="Enter last name"
//                   value={editForm.lastName}
//                   onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                 <input
//                   type="email"
//                   placeholder="Enter email"
//                   value={editForm.email}
//                   onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                 <input
//                   type="tel"
//                   placeholder="Enter phone number"
//                   value={editForm.phone}
//                   onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
//                 <input
//                   type="text"
//                   placeholder="Enter university name"
//                   value={editForm.university}
//                   onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3 mt-8">
//               <button
//                 onClick={handleSave}
//                 className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//               >
//                 Save Changes
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="flex-1 border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition-all font-semibold"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





// // src/pages/student/ProfileDashboard.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   User, Mail, Phone, Calendar, Clock, BookOpen,
//   CheckCircle, AlertCircle, Edit2, LogOut, Award,
//   FileText, Video, Users, ChevronRight
// } from 'lucide-react';

// export default function ProfileDashboard() {
//   const navigate = useNavigate();

//   // Mock User Data (from localStorage after login)
//   const [user, setUser] = useState({
//     firstName: 'Rahul',
//     lastName: 'Sharma',
//     email: 'rahul.sharma@example.com',
//     phone: '+91 98765 43210',
//     university: 'Delhi University',
//     avatar: null
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({ ...user });

//   // Mock Data
//   const upcomingClasses = [
//     { id: 1, course: 'React Masterclass', date: '2025-11-20', time: '7:00 PM', instructor: 'John Doe' },
//     { id: 2, course: 'Node.js Advanced', date: '2025-11-22', time: '6:30 PM', instructor: 'Jane Smith' }
//   ];

//   const overallProgress = 68;
//   const pendingAssignments = 3;

//   const examProgress = {
//     completed: 2,
//     total: 5,
//     nextExam: { name: 'React Final Exam', date: '2025-12-05', link: 'https://exam.codekart.com/react-final' }
//   };

//   const registeredCourses = [
//     { id: 'react-101', title: 'React Masterclass', progress: 80, thumbnail: '/assets/react-thumb.jpg' },
//     { id: 'vue-301', title: 'Vue.js Essentials', progress: 100, thumbnail: '/assets/vue.webp' }
//   ];

//   // Handle Edit Save
//   const handleSave = () => {
//     setUser(editForm);
//     setIsEditing(false);
//     alert('Profile updated successfully!');
//   };

//   // Handle Logout
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   // Redirect to course
//   const goToCourse = (id) => {
//     navigate(`/student/course/${id}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
//       {/* Header */}
//       <header className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Cybernetics LMS</h1>
//           <p className="text-lg text-gray-600">Welcome back, <span className="font-semibold">{user.firstName}</span>!</p>
//         </div>
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
//         >
//           <LogOut className="w-5 h-5" /> Logout
//         </button>
//       </header>

//       <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
//         {/* Left Column: Profile + Upcoming Classes */}
//         <div className="space-y-6">
//           {/* i. Profile Details & Edit */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <div className="flex justify-between items-start mb-4">
//               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                 <User className="w-6 h-6 text-blue-600" /> Profile Details
//               </h2>
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="text-blue-600 hover:text-blue-700"
//               >
//                 <Edit2 className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="flex items-center gap-4 mb-6">
//               <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
//                 {user.firstName[0]}{user.lastName[0]}
//               </div>
//               <div>
//                 <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
//                 <p className="text-sm text-gray-600">{user.university}</p>
//               </div>
//             </div>

//             <div className="space-y-3 text-sm">
//               <div className="flex items-center gap-2 text-gray-700">
//                 <Mail className="w-4 h-4 text-gray-500" />
//                 <span>{user.email}</span>
//               </div>
//               <div className="flex items-center gap-2 text-gray-700">
//                 <Phone className="w-4 h-4 text-gray-500" />
//                 <span>{user.phone}</span>
//               </div>
//             </div>
//           </div>

//           {/* ii. Upcoming Classes */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <Calendar className="w-6 h-6 text-purple-600" /> Upcoming Classes
//             </h2>
//             <div className="space-y-3">
//               {upcomingClasses.map(cls => (
//                 <div key={cls.id} className="p-3 bg-purple-50 rounded-lg">
//                   <p className="font-medium text-sm">{cls.course}</p>
//                   <p className="text-xs text-gray-600">{cls.date} at {cls.time}</p>
//                   <p className="text-xs text-gray-500">with {cls.instructor}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Middle Column: Progress & Exams */}
//         <div className="space-y-6">
//           {/* iii. Overall Progress & Pending Assignments */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Overall Progress</h2>
//             <div className="mb-6">
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Course Completion</span>
//                 <span>{overallProgress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div
//                   className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all"
//                   style={{ width: `${overallProgress}%` }}
//                 />
//               </div>
//             </div>
//             <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <AlertCircle className="w-5 h-5 text-orange-600" />
//                 <span className="font-medium">Pending Assignments</span>
//               </div>
//               <span className="text-xl font-bold text-orange-600">{pendingAssignments}</span>
//             </div>
//           </div>

//           {/* iv. Exam Progress */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <Award className="w-6 h-6 text-green-600" /> Exam Progress
//             </h2>
//             <div className="text-center mb-4">
//               <p className="text-3xl font-bold text-gray-800">{examProgress.completed}/{examProgress.total}</p>
//               <p className="text-sm text-gray-600">Exams Completed</p>
//             </div>
//             <div className="p-3 bg-green-50 rounded-lg">
//               <p className="font-medium text-sm">Next Exam:</p>
//               <p className="text-xs">{examProgress.nextExam.name}</p>
//               <p className="text-xs text-gray-600">{examProgress.nextExam.date}</p>
//             </div>
//           </div>

//           {/* vi. Upcoming Exam Link */}
//           <a
//             href={examProgress.nextExam.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-medium hover:bg-green-700 transition"
//           >
//             Start Exam
//           </a>
//         </div>

//         {/* Right Column: Registered Courses */}
//         <div className="space-y-6">
//           {/* v. Registered Courses */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <BookOpen className="w-6 h-6 text-indigo-600" /> Registered Courses
//             </h2>
//             <div className="space-y-3">
//               {registeredCourses.map(course => (
//                 <div
//                   key={course.id}
//                   onClick={() => goToCourse(course.id)}
//                   className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
//                 >
//                   <img
//                     src={course.thumbnail}
//                     alt={course.title}
//                     className="w-12 h-12 object-cover rounded-md"
//                   />
//                   <div className="flex-1">
//                     <p className="font-medium text-sm">{course.title}</p>
//                     <div className="flex items-center gap-1 text-xs text-gray-600">
//                       <span>{course.progress}%</span>
//                       <div className="w-16 bg-gray-300 rounded-full h-1.5">
//                         <div
//                           className="bg-indigo-600 h-1.5 rounded-full"
//                           style={{ width: `${course.progress}%` }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <ChevronRight className="w-5 h-5 text-gray-400" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Profile Modal */}
//       {isEditing && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//             <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="First Name"
//                 value={editForm.firstName}
//                 onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Last Name"
//                 value={editForm.lastName}
//                 onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={editForm.email}
//                 onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="tel"
//                 placeholder="Phone"
//                 value={editForm.phone}
//                 onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//               <input
//                 type="text"
//                 placeholder="University"
//                 value={editForm.university}
//                 onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={handleSave}
//                 className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//               >
//                 Save Changes
//               </button>
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




