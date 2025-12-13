import React, { useState } from 'react';
import { 
  BookOpen, Users, Building2, Bell, PlusCircle, TrendingUp, Calendar,
  CheckCircle, XCircle, Clock, Award, BarChart3, X, Upload, Mail,
  Phone, MapPin, Briefcase, GraduationCap, Lock, Activity, Megaphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AcademicDashboard = () => {
  const navigate = useNavigate();
  const [hoveredStat, setHoveredStat] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const [courseFormData, setCourseFormData] = useState({
    courseImage: null, courseName: '', courseType: 'full-time', coursePrice: '',
    meetingLink: '', selectedTeachers: [], startDate: '', endDate: '',
    startTime: '', endTime: '', description: ''
  });
  const [courseImagePreview, setCourseImagePreview] = useState(null);

  const [facultyFormData, setFacultyFormData] = useState({
    name: '', email: '', phone: '', address: '', employmentStatus: 'employed',
    designation: '', qualification: '', profilePicture: null, password: ''
  });
  const [profilePreview, setProfilePreview] = useState(null);

  const availableTeachers = [
    { id: 1, name: "Dr. Priya Sharma", subject: "React & Node.js" },
    { id: 2, name: "Prof. Amit Kumar", subject: "MERN Stack" },
    { id: 3, name: "Ms. Sneha Patel", subject: "Python & Django" },
    { id: 4, name: "Mr. Rajesh Mehta", subject: "Data Science" },
  ];

  const stats = { totalCourses: 48, totalFaculties: 23, totalCenters: 12, todayAddedCourses: 3 };

  const recentCourses = [
    { id: 1, name: "Advanced React & Node.js", addedOn: "Nov 18, 2025", students: 87, trend: "+12%" },
    { id: 2, name: "Full Stack MERN Bootcamp", addedOn: "Nov 17, 2025", students: 102, trend: "+8%" },
    { id: 3, name: "Data Science with Python", addedOn: "Nov 16, 2025", students: 65, trend: "+15%" },
  ];

  const recentFaculties = [
    { id: 1, name: "Dr. Priya Sharma", qualification: "PhD Computer Science", joined: "2 days ago", initials: "PS" },
    { id: 2, name: "Prof. Amit Kumar", qualification: "M.Tech AI/ML", joined: "5 days ago", initials: "AK" },
  ];

  const topCourses = [
    { rank: 1, name: "MERN Stack Development", enrollments: 342, rating: 4.9, category: "Web Dev" },
    { rank: 2, name: "Python Django Full Course", enrollments: 298, rating: 4.8, category: "Backend" },
    { rank: 3, name: "React Native Mobile App", enrollments: 276, rating: 4.7, category: "Mobile" },
  ];

  const notifications = [
    { id: 1, type: "exam", message: "Prof. Rahul requested exam link approval for 'JavaScript Advanced'", time: "2 hours ago", status: "pending", priority: "high" },
    { id: 2, type: "exam", message: "Prof. Sneha requested exam approval for 'React Hooks'", time: "5 hours ago", status: "pending", priority: "medium" },
    { id: 3, type: "info", message: "New batch scheduled for MERN course starting Dec 1", time: "1 day ago", status: "approved", priority: "low" },
    { id: 4, type: "info", message: "New batch scheduled for MERN course starting Dec 1", time: "1 day ago", status: "approved", priority: "low" },
    { id: 5, type: "info", message: "New batch scheduled for MERN course starting Dec 1", time: "1 day ago", status: "approved", priority: "low" },
  ];

  const handleCourseImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseFormData({ ...courseFormData, courseImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setCourseImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFacultyFormData({ ...facultyFormData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleTeacher = (teacherId) => {
    setCourseFormData(prev => ({
      ...prev,
      selectedTeachers: prev.selectedTeachers.includes(teacherId)
        ? prev.selectedTeachers.filter(id => id !== teacherId)
        : [...prev.selectedTeachers, teacherId]
    }));
  };

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    alert("Course created successfully!");
    setIsCourseModalOpen(false);
    setCourseFormData({
      courseImage: null, courseName: '', courseType: 'full-time', coursePrice: '',
      meetingLink: '', selectedTeachers: [], startDate: '', endDate: '',
      startTime: '', endTime: '', description: ''
    });
    setCourseImagePreview(null);
  };

  const handleFacultySubmit = (e) => {
    e.preventDefault();
    alert("Faculty added successfully!");
    setIsFacultyModalOpen(false);
    setFacultyFormData({
      name: '', email: '', phone: '', address: '', employmentStatus: 'employed',
      designation: '', qualification: '', profilePicture: null, password: ''
    });
    setProfilePreview(null);
  };

  const handleCourseClick = () => navigate('/academic/totalcourses');
  const handleCenterClick = () => navigate('/academic/centers');
  const handleFacultyClick = () => navigate('/academic/faculties');
  const handleApprovalsClick = () => navigate('/academic/approvals');

  return (
    <>
      <div className="min-h-screen bg-gray-50">

        {/* Official Navbar - #1e3a8a */}
        <header className="bg-[#1e3a8a] text-white sticky top-0 z-50 shadow-lg">
          <div className="px-8 py-4 flex justify-between items-center max-w-[1600px] mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-xl flex items-center justify-center">
                <span className="text-3xl font-black">K</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">iLMS Admin</h1>
                <p className="text-xs opacity-90 -mt-1">Academic Management Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative">
                <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="relative p-2.5 hover:bg-white/10 rounded-xl transition cursor-pointer">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {notifications.filter(n => n.status === 'pending').length}
                  </span>
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="bg-[#1e3a8a] text-white p-5 flex justify-between items-center">
                      <h3 className="font-bold text-lg">Notifications</h3>
                      <button onClick={() => setIsNotificationOpen(false)} className="hover:bg-white/20 p-1 rounded cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.slice(0, 4).map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition ${notif.priority === 'high' ? 'bg-red-50' : ''}`}>
                          <p className="font-semibold text-gray-900">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          {notif.status === 'pending' && <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">PENDING</span>}
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-gray-50 text-center">
                      <button onClick={() => { setShowAllNotifications(true); setIsNotificationOpen(false); }} className="text-[#1e3a8a] font-bold hover:underline transition cursor-pointer">
                        View all notifications →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                <div className="text-right">
                  <p className="font-semibold">Academic Admin</p>
                  <p className="text-xs opacity-90">admin@kristellar.com</p>
                </div>
                <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl font-bold">
                  AA
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-10">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { label: "Total Courses", value: stats.totalCourses, today: stats.todayAddedCourses, icon: BookOpen, color: "from-blue-500 to-blue-600", onClick: handleCourseClick },
              { label: "Total Faculties", value: stats.totalFaculties, badge: "Active & Approved", icon: Users, color: "from-emerald-500 to-teal-600", onClick: handleFacultyClick },
              { label: "Total Centers", value: stats.totalCenters, badge: "Across India", icon: Building2, color: "from-purple-500 to-indigo-600", onClick: handleCenterClick },
              { label: "Pending Approvals", value: 2, badge: "Exam Links", icon: Clock, color: "from-orange-500 to-red-600", onClick: handleApprovalsClick },
            ].map((stat, i) => (
              <div key={i} onClick={stat.onClick} onMouseEnter={() => setHoveredStat(i)} onMouseLeave={() => setHoveredStat(null)}
                className={`bg-white rounded-md shadow-xl border border-gray-100 p-8 cursor-pointer transition-all hover:-translate-y-4 hover:shadow-2xl ${hoveredStat === i ? 'shadow-2xl' : ''}`}>
                <div className='flex flex-row justify-between items-center gap-4'>
                  <div className='flex flex-col'>
                    <p className="text-gray-600 font-medium text-md ">{stat.label}</p>
                    <p className="text-xl font-black text-gray-900 mt-2">{stat.value}</p>
                    {/* {stat.today && <span className="inline-block mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-full text-sm">+{stat.today} today</span>}
                    {stat.badge && <span className="inline-block mt-4 px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-full text-sm">{stat.badge}</span>} */}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 bg-[#1e3a8a] rounded-2xl shadow-lg flex items-center justify-center`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">

              {/* Pending Approvals */}
              <div className="bg-white rounded-md shadow-xl border border-gray-100 p-8">
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-[#1e3a8a] rounded-2xl shadow-lg flex items-center justify-center">
        <Bell className="w-7 h-7 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
        <p className="text-gray-600 text-md">Exam link requests</p>
      </div>
    </div>
    <span className="px-5 py-2 bg-[#1e3a8a]/10 text-[#1e3a8a] font-bold rounded-full text-sm">
      2 Pending
    </span>
  </div>

  <div className="space-y-5">
    {notifications.filter(n => n.status === 'pending').map(notif => (
      <div 
        key={notif.id} 
        className="p-4 bg-gradient-to-r from-[#1e3a8a]/5 to-white rounded-2xl border border-[#1e3a8a]/10"
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 bg-[#1e3a8a]/10 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#1e3a8a]" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{notif.message}</p>
              <p className="text-sm text-gray-500">{notif.time}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-3 bg-[#1e3a8a] text-sm text-white font-bold rounded-xl hover:bg-[#1e3a8a]/90 transition shadow-lg flex items-center gap-2 cursor-pointer">
              <CheckCircle className="w-5 h-5" /> Approve
            </button>
            <button className="px-6 py-3 bg-gray-600 text-sm text-white font-bold rounded-xl hover:bg-gray-700 transition shadow-lg flex items-center gap-2 cursor-pointer">
              <XCircle className="w-5 h-5" /> Reject
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

              {/* Recent Courses */}
              <div className="bg-white rounded-md shadow-xl border border-gray-100 p-8">
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-[#1e3a8a] rounded-2xl shadow-lg flex items-center justify-center">
        <BookOpen className="w-7 h-7 text-white" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Recent Courses</h2>
    </div>
    <button className="text-sm text-[#1e3a8a] font-bold hover:underline transition cursor-pointer">
      View all →
    </button>
  </div>

  <div className="space-y-5">
    {recentCourses.map(course => (
      <div
        key={course.id}
        className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1e3a8a]/5 to-white rounded-2xl border border-[#1e3a8a]/10 hover:border-[#1e3a8a]/20 hover:shadow-xl transition-all duration-300"
      >
        <div>
          <p className="font-bold text-gray-900 text-md">{course.name}</p>
          <p className="text-sm text-gray-600 mt-1">Added on {course.addedOn}</p>
        </div>

        <div className="text-right">
          <p className="text-xl font-black text-[#1e3a8a]">{course.students}</p>
          <p className="text-sm text-gray-600">students</p>
          
          {/* Professional trend badge using brand color */}
          <span className="inline-block mt-2 px-4 py-1.5 bg-[#1e3a8a]/10 text-[#1e3a8a] font-bold text-sm rounded-full border border-[#1e3a8a]/20">
            {course.trend}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
            </div>

            <div className="space-y-8">

              {/* Quick Actions */}
              <div className="bg-white rounded-md shadow-xl border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button onClick={() => setIsCourseModalOpen(true)} className="w-full bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold py-5 rounded-2xl shadow-xl transition flex items-center justify-center gap-3 text-md cursor-pointer">
                    <PlusCircle className="w-6 h-6" /> Create New Course
                  </button>
                  <button onClick={() => setIsFacultyModalOpen(true)} className="w-full border-2 border-gray-300 text-gray-800 font-bold py-5 rounded-2xl hover:bg-gray-50 transition flex items-center justify-center gap-3 text-md cursor-pointer">
                    <Users className="w-6 h-6" /> Add New Faculty
                  </button>
                </div>
              </div>

              {/* New Faculties */}
              <div className="bg-white rounded-md shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Activity className="w-8 h-8 text-[#1e3a8a]" />
                  <h3 className="text-xl font-bold">Recently Joined</h3>
                </div>
                {recentFaculties.map(f => (
                  <div key={f.id} className="flex items-center gap-5 py-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {f.initials}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{f.name}</p>
                      <p className="text-sm text-gray-600">{f.qualification}</p>
                      <p className="text-xs text-gray-500">Joined {f.joined}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top Courses */}
              <div className="bg-gradient-to-br from-[#1e3a8a] to-indigo-800 text-white rounded-md shadow-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Award className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Top Performers</h3>
                </div>
                {topCourses.map(c => (
                  <div key={c.rank} className="bg-white/15 backdrop-blur rounded-2xl p-5 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg ${c.rank === 1 ? 'bg-yellow-500' : c.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'}`}>
                          {c.rank}
                        </span>
                        <div>
                          <p className="font-bold text-sm">{c.name}</p>
                          <p className="text-sm opacity-90">{c.enrollments} enrolled • {c.category}</p>
                        </div>
                      </div>
                      {/* <div className="text-2xl">⭐ {c.rating}</div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Course Modal */}
        {isCourseModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-md shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-2 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Create New Course</h2>
                <button onClick={() => setIsCourseModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-xl transition cursor-pointer">
                  <X className="w-7 h-7 text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleCourseSubmit} className="p-8 space-y-8">
                <div className="flex items-center gap-8">
                  <div>
                    {courseImagePreview ? (
                      <img src={courseImagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-2xl shadow-xl" />
                    ) : (
                      <div className="w-40 h-40 bg-gray-100 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center">
                        <Upload className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input type="file" accept="image/*" onChange={handleCourseImageUpload} className="hidden" id="course-img" />
                    <label htmlFor="course-img" className="px-8 py-4 bg-[#1e3a8a] text-white font-bold rounded-2xl cursor-pointer hover:bg-blue-800 transition shadow-lg inline-flex items-center gap-3">
                      <Upload className="w-6 h-6" /> Upload Course Image
                    </label>
                    <p className="text-sm text-gray-500 mt-3">Recommended: 1200×800px</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Course Name</label>
                    <input required type="text" value={courseFormData.courseName} onChange={e => setCourseFormData({...courseFormData, courseName: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-2xl focus:border-[#1e3a8a] focus:ring-4 focus:ring-[#1e3a8a]/20 outline-none transition text-md" placeholder="Advanced MERN Stack" />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Course Type</label>
                    <select value={courseFormData.courseType} onChange={e => setCourseFormData({...courseFormData, courseType: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-2xl focus:border-[#1e3a8a] focus:ring-4 focus:ring-[#1e3a8a]/20 outline-none text-md">
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="weekend">Weekend Batch</option>
                      <option value="self-paced">Self-Paced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Price (₹)</label>
                    <input required type="number" value={courseFormData.coursePrice} onChange={e => setCourseFormData({...courseFormData, coursePrice: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-2xl focus:border-[#1e3a8a] focus:ring-4 focus:ring-[#1e3a8a]/20 outline-none text-md" placeholder="29999" />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Meeting Link</label>
                    <input type="url" value={courseFormData.meetingLink} onChange={e => setCourseFormData({...courseFormData, meetingLink: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-2xl focus:border-[#1e3a8a] focus:ring-4 focus:ring-[#1e3a8a]/20 outline-none text-md" placeholder="https://meet.google.com/..." />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-4">Assign Teachers</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {availableTeachers.map(t => (
                      <label key={t.id} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition ${courseFormData.selectedTeachers.includes(t.id) ? 'border-[#1e3a8a] bg-[#1e3a8a]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="checkbox" checked={courseFormData.selectedTeachers.includes(t.id)} onChange={() => toggleTeacher(t.id)} className="w-6 h-6 text-[#1e3a8a] rounded focus:ring-[#1e3a8a]" />
                        <div>
                          <p className="font-bold text-gray-900">{t.name}</p>
                          <p className="text-xs text-gray-600">{t.subject}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-md p-8 border-2 border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Calendar className="w-7 h-7 text-[#1e3a8a]" /> Batch Schedule
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <input type="date" required value={courseFormData.startDate} onChange={e => setCourseFormData({...courseFormData, startDate: e.target.value})} className="px-6 py-4 border-2 border-gray-300 rounded-2xl focus:border-[#1e3a8a] outline-none" placeholder="Start Date" />
                    <input type="date" required value={courseFormData.endDate} onChange={e => setCourseFormData({...courseFormData, endDate: e.target.value})} className="px-6 py-4 border-2 border-gray-300 rounded-2xl focus:border-[#1e3a8a] outline-none" />
                    <input type="time" required value={courseFormData.startTime} onChange={e => setCourseFormData({...courseFormData, startTime: e.target.value})} className="px-6 py-4 border-2 border-gray-300 rounded-2xl focus:border-[#1e3a8a] outline-none" />
                    <input type="time" required value={courseFormData.endTime} onChange={e => setCourseFormData({...courseFormData, endTime: e.target.value})} className="px-6 py-4 border-2 border-gray-300 rounded-2xl focus:border-[#1e3a8a] outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">Description</label>
                  <textarea rows={6} required value={courseFormData.description} onChange={e => setCourseFormData({...courseFormData, description: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-2xl focus:border-[#1e3a8a] focus:ring-4 focus:ring-[#1e3a8a]/20 outline-none resize-none text-md"
                    placeholder="Describe the course content, objectives, and outcomes..." />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button type="button" onClick={() => setIsCourseModalOpen(false)} className="px-8 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-8 py-2 bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold rounded-2xl shadow-xl transition hover:scale-105 cursor-pointer">
                    Create Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Faculty Modal */}
        {isFacultyModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Add New Faculty</h2>
                <button onClick={() => setIsFacultyModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-xl transition cursor-pointer">
                  <X className="w-7 h-7 text-gray-600" />
                </button>
              </div>
              <form onSubmit={handleFacultySubmit} className="p-8 space-y-8">
                <div className="flex items-center gap-10">
                  <div>
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile" className="w-40 h-40 rounded-full object-cover shadow-2xl border-8 border-white" />
                    ) : (
                      <div className="w-40 h-40 bg-gray-200 border-8 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                        <Users className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input type="file" accept="image/*" onChange={handleProfileUpload} className="hidden" id="profile-pic" />
                    <label htmlFor="profile-pic" className="px-8 py-4 bg-[#1e3a8a] text-white font-bold rounded-2xl cursor-pointer hover:bg-blue-800 transition shadow-lg inline-flex items-center gap-3">
                      <Upload className="w-6 h-6" /> Upload Photo
                    </label>
                    <p className="text-sm text-gray-500 mt-3">JPG/PNG • Max 2MB • Square</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Full Name", icon: Users, value: facultyFormData.name, key: "name" },
                    { label: "Email Address", icon: Mail, value: facultyFormData.email, key: "email", type: "email" },
                    { label: "Phone Number", icon: Phone, value: facultyFormData.phone, key: "phone" },
                    { label: "Address", icon: MapPin, value: facultyFormData.address, key: "address" },
                    { label: "Employment Status", icon: Briefcase, value: facultyFormData.employmentStatus, key: "employmentStatus", type: "select", options: ["employed", "unemployed", "freelancer"] },
                    { label: "Designation", icon: Briefcase, value: facultyFormData.designation, key: "designation" },
                    { label: "Highest Qualification", icon: GraduationCap, value: facultyFormData.qualification, key: "qualification" },
                    { label: "Password", icon: Lock, value: facultyFormData.password, key: "password", type: "password" },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-3">
                        <field.icon className="w-6 h-6 text-[#1e3a8a]" /> {field.label}
                      </label>
                      {field.type === "select" ? (
                        <select value={field.value} onChange={e => setFacultyFormData({...facultyFormData, [field.key]: e.target.value})}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#1e3a8a] focus:ring-4 focus:ring-[#1e3a8a]/20 outline-none text-lg">
                          <option value="employed">Currently Employed</option>
                          <option value="unemployed">Currently Unemployed</option>
                          <option value="freelancer">Freelancer</option>
                        </select>
                      ) : (
                        <input required type={field.type || "text"} value={field.value} onChange={e => setFacultyFormData({...facultyFormData, [field.key]: e.target.value})}
                          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-[#1e3a8a] focus:ring-4 focus:ring-[#1e3a8a]/20 outline-none text-lg"
                          placeholder={field.label.includes("Password") ? "••••••••" : field.label} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button type="button" onClick={() => setIsFacultyModalOpen(false)} className="px-10 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-12 py-4 bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold rounded-2xl shadow-xl transition hover:scale-105 cursor-pointer">
                    Add Faculty
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* All Notifications Modal */}
        {showAllNotifications && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-md shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-[#1e3a8a] text-white px-8 py-6 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">All Notifications</h2>
                  <p className="text-sm opacity-90">Stay updated with all activities</p>
                </div>
                <button onClick={() => setShowAllNotifications(false)} className="p-3 hover:bg-white/20 rounded-xl transition cursor-pointer">
                  <X className="w-7 h-7" />
                </button>
              </div>
              <div className="max-h-[65vh] overflow-y-auto divide-y divide-gray-200">
                {notifications.map(notif => (
                  <div key={notif.id} className={`px-8 py-4 hover:bg-gray-50 transition ${notif.priority === 'high' ? 'bg-red-50' : notif.priority === 'medium' ? 'bg-orange-50' : ''}`}>
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${notif.type === 'exam' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                        {notif.type === 'exam' ? <CheckCircle className="w-7 h-7 text-orange-600" /> : <Bell className="w-7 h-7 text-[#1e3a8a]" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-900">{notif.message}</p>
                        <div className="flex items-center gap-4 mt-3 text-gray-600">
                          <span className="text-sm">{notif.time}</span>
                          {notif.status && (
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${notif.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {notif.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 text-center border-t border-gray-200">
                <button onClick={() => setShowAllNotifications(false)} className="px-12 py-4 bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold rounded-2xl shadow-xl transition hover:scale-105 cursor-pointer">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AcademicDashboard;