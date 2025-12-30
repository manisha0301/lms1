import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  UserCheck,
  GraduationCap,
  Building2,
  FileCheck,
  ClipboardList,
  IndianRupee,
  Calendar,
  Search,
  ChevronDown,
  ChevronRight,
  Eye,
  X,
  Target,
  Clock,
  Award,
  User,
} from 'lucide-react';

const CoursesManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAcademics, setExpandedAcademics] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  // Academic-wise course data
  const academicsData = [
    {
      academicId: 1,
      academicName: "Priya Sharma",
      academicEmail: "priya.sharma@kristellar.com",
      center: "Bhubaneswar Main Campus",
      totalCourses: 3,
      totalStudents: 829,
      totalRevenue: 3567500,
      courses: [
        {
          id: 101,
          title: "Full Stack Web Development (MERN)",
          code: "MERN-PRIYA-25A",
          faculty: "Dr. Vikash Ranjan",
          facultyEmail: "vikash@kristellar.com",
          duration: "6 months",
          startDate: "2025-08-01",
          totalStudents: 342,
          activeStudents: 318,
          examsConducted: 4,
          totalExams: 6,
          completedAssignments: 89,
          totalAssignments: 120,
          avgAttendance: 94,
          revenue: 1854000,
          status: "Ongoing",
          batchSize: 350,
          completionRate: 87,
          topPerformer: "Rohan Mehta",
          lastActivity: "2 hours ago",
        },
        {
          id: 102,
          title: "Python for Data Analytics",
          code: "PDA-PRIYA-25D",
          faculty: "Dr. Neha Sharma",
          facultyEmail: "neha@kristellar.com",
          duration: "3 months",
          startDate: "2025-10-01",
          totalStudents: 412,
          activeStudents: 401,
          examsConducted: 1,
          totalExams: 4,
          completedAssignments: 45,
          totalAssignments: 60,
          avgAttendance: 88,
          revenue: 1236000,
          status: "Ongoing",
          batchSize: 350,
          completionRate: 87,
          topPerformer: "Rohan Mehta",
          lastActivity: "2 hours ago",
        },
        {
          id: 103,
          title: "UI/UX Design Masterclass",
          code: "UIUX-PRIYA-25C",
          faculty: "Siddharth Patel",
          facultyEmail: "siddharth@kristellar.com",
          duration: "4 months",
          startDate: "2025-07-20",
          totalStudents: 198,
          activeStudents: 182,
          examsConducted: 5,
          totalExams: 5,
          completedAssignments: 78,
          totalAssignments: 85,
          avgAttendance: 96,
          revenue: 891000,
          status: "Completed",
          batchSize: 350,
          completionRate: 87,
          topPerformer: "Rohan Mehta",
          lastActivity: "2 hours ago",
        },
      ],
    },
    {
      academicId: 2,
      academicName: "Rahul Verma",
      academicEmail: "rahul.verma@kristellar.com",
      center: "Cuttack Extension Center",
      totalCourses: 2,
      totalStudents: 521,
      totalRevenue: 2218500,
      courses: [
        {
          id: 201,
          title: "Data Science & Machine Learning",
          code: "DSML-RAHUL-25B",
          faculty: "Prof. Ananya Mishra",
          facultyEmail: "ananya@kristellar.com",
          duration: "5 months",
          startDate: "2025-09-15",
          totalStudents: 287,
          activeStudents: 275,
          examsConducted: 3,
          totalExams: 5,
          completedAssignments: 67,
          totalAssignments: 90,
          avgAttendance: 91,
          revenue: 1583500,
          status: "Ongoing",
          batchSize: 350,
          completionRate: 87,
          topPerformer: "Rohan Mehta",
          lastActivity: "2 hours ago",
        },
        {
          id: 202,
          title: "Digital Marketing Professional",
          code: "DMP-RAHUL-25E",
          faculty: "Riya Kapoor",
          facultyEmail: "riya@kristellar.com",
          duration: "3 months",
          startDate: "2025-11-01",
          totalStudents: 234,
          activeStudents: 229,
          examsConducted: 1,
          totalExams: 3,
          completedAssignments: 34,
          totalAssignments: 45,
          avgAttendance: 93,
          revenue: 634500,
          status: "Ongoing",
          batchSize: 350,
          completionRate: 87,
          topPerformer: "Rohan Mehta",
          lastActivity: "2 hours ago",
        },
      ],
    },
    {
      academicId: 3,
      academicName: "Anita Das",
      academicEmail: "anita.das@kristellar.com",
      center: "Online Division",
      totalCourses: 1,
      totalStudents: 156,
      totalRevenue: 702000,
      courses: [
        {
          id: 301,
          title: "Advanced React & Next.js",
          code: "REACT-ANITA-25F",
          faculty: "Amit Singh",
          facultyEmail: "amit@kristellar.com",
          duration: "2 months",
          startDate: "2025-11-10",
          totalStudents: 156,
          activeStudents: 152,
          examsConducted: 0,
          totalExams: 2,
          completedAssignments: 18,
          totalAssignments: 30,
          avgAttendance: 89,
          revenue: 702000,
          status: "Live",
          batchSize: 350,
          completionRate: 87,
          topPerformer: "Rohan Mehta",
          lastActivity: "2 hours ago",
        },
      ],
    },
  ];

  // Flatten all courses for search
  const allCourses = academicsData.flatMap(ac => ac.courses.map(c => ({ ...c, academic: ac })));

  const toggleAcademic = (id) => {
    setExpandedAcademics(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredAcademics = academicsData.filter(academic =>
    academic.academicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    academic.academicEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    academic.center.toLowerCase().includes(searchTerm.toLowerCase()) ||
    academic.courses.some(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Modal for Course Details
  if (selectedCourse) {
    const course = selectedCourse.course;
    const academic = selectedCourse.academic;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-[#1e3a8a] text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">{course.title}</h2>
                <p className="opacity-90 mt-1">Course Code: {course.code}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                    {academic.academicName}
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                    {academic.center}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Faculty & Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {course.faculty.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Faculty In-Charge</p>
                    <p className="font-bold text-gray-900">{course.faculty}</p>
                    <p className="text-sm text-gray-600">{course.facultyEmail}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center">
                <IndianRupee className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-emerald-900">
                  ₹{(course.revenue / 100000).toFixed(1)}L
                </p>
                <p className="text-sm text-gray-600">Revenue Generated</p>
              </div>

              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center">
                <Target className="w-10 h-10 text-[#1e3a8a] mx-auto mb-3" />
                <p className="text-3xl font-bold text-[#1e3a8a]">{course.completionRate}%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center">
                <Users className="w-10 h-10 text-[#1e3a8a] mx-auto mb-3" />
                <p className="text-3xl font-bold">{course.totalStudents}</p>
                <p className="text-sm text-gray-600">Total Enrolled</p>
              </div>
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center">
                <FileCheck className="w-10 h-10 text-[#1e3a8a] mx-auto mb-3" />
                <p className="text-3xl font-bold">
                  {course.examsConducted}/{course.totalExams}
                </p>
                <p className="text-sm text-gray-600">Exams</p>
              </div>
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center">
                <ClipboardList className="w-10 h-10 text-[#1e3a8a] mx-auto mb-3" />
                <p className="text-3xl font-bold">
                  {course.completedAssignments}/{course.totalAssignments}
                </p>
                <p className="text-sm text-gray-600">Assignments</p>
              </div>
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center">
                <GraduationCap className="w-10 h-10 text-[#1e3a8a] mx-auto mb-3" />
                <p className="text-3xl font-bold">{course.activeStudents}</p>
                <p className="text-sm text-gray-600">Active Students</p>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-4">Course Timeline</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Start: {course.startDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Batch Size: {course.batchSize}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <UserCheck className="w-4 h-4" />
                    <span>Avg Attendance: {course.avgAttendance}%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-4">Performance Insights</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>Top Performer: {course.topPerformer}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Last Activity: {course.lastActivity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-10 py-4 bg-[#1e3a8a] text-white rounded-xl font-semibold hover:shadow-xl transition"
              >
                Close Detailed View
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="  mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold">Courses by Academic Admin</h1>
          <p className="opacity-90 mt-1">Monitor all courses organized by each Academic Admin, including faculty assignments and performance metrics</p>
        </div>
      </header>

      <div className="  mx-auto px-8 py-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Academic, Course, Faculty, Code or Center..."
            className="w-full pl-14 pr-6 py-2 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Academics List */}
        <div className="space-y-8">
          {filteredAcademics.map((academic) => (
            <div key={academic.academicId} className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Academic Header */}
              <button
                onClick={() => toggleAcademic(academic.academicId)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {academic.center.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1e3a8a] transition">{academic.center}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" /> {academic.academicName}
                      </span>
                      <span>•</span>
                      <span>{academic.totalCourses} Courses</span>
                      <span>•</span>
                      <span>{academic.totalStudents} Students</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{(academic.totalRevenue / 100000).toFixed(1)}L
                    </p>
                    <p className="text-sm text-gray-500">Revenue</p>
                  </div>
                  {expandedAcademics[academic.academicId] ? (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Courses List - Collapsible */}
              {expandedAcademics[academic.academicId] && (
                <div className="border-t border-gray-100 px-8 py-6 space-y-5">
                  {academic.courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#1e3a8a] transition">{course.title}</h4>
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-mono bg-gray-200 px-2 py-1 rounded">{course.code}</span>
                            {' • '}
                            <UserCheck className="inline w-4 h-4" /> {course.faculty}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          course.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700' :
                          course.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {course.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <Users className="w-8 h-8 text-[#1e3a8a] mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{course.totalStudents}</p>
                          <p className="text-xs text-gray-600">Enrolled</p>
                        </div>
                        <div className="text-center">
                          <FileCheck className="w-8 h-8 text-[#1e3a8a] mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">
                            {course.examsConducted}/{course.totalExams}
                          </p>
                          <p className="text-xs text-gray-600">Exams</p>
                        </div>
                        <div className="text-center">
                          <ClipboardList className="w-8 h-8 text-[#1e3a8a] mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">
                            {course.completedAssignments}/{course.totalAssignments}</p>
                          <p className="text-xs text-gray-600">Assignments</p>
                        </div>
                        <div className="text-center">
                          <IndianRupee className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{(course.revenue / 100000).toFixed(1)}L
                          </p>
                          <p className="text-xs text-gray-600">Revenue</p>
                        </div>
                      </div>

                      <div 
                      className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-[#1e3a8a] font-bold"
                      onClick={() => setSelectedCourse({ course, academic })}>
                        <span >View Detailed Report</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="mt-12 bg-[#1e3a8a] text-white rounded-xl shadow-xl p-8">
          <h3 className="text-2xl font-bold mb-6">Platform-Wide Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-bold">{academicsData.reduce((a, c) => a + c.totalCourses, 0)}</p>
              <p className="opacity-90 mt-2">Total Courses</p>
            </div>
            <div>
              <p className="text-4xl font-bold">{academicsData.length}</p>
              <p className="opacity-90 mt-2">Academic Admins</p>
            </div>
            <div>
              <p className="text-4xl font-bold">
                {academicsData.reduce((a, c) => a + c.totalStudents, 0).toLocaleString()}
              </p>
              <p className="opacity-90 mt-2">Total Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold">
                ₹{(academicsData.reduce((a, c) => a + c.totalRevenue, 0) / 100000).toFixed(1)}L
              </p>
              <p className="opacity-90 mt-2">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesManagementPage;