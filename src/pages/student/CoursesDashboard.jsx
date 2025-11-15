// src/pages/student/CoursesDashboard.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { BookOpen, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import oip from '../../assets/OIP.jpg';
import node from '../../assets/node.webp';
import vue from '../../assets/vue.webp';
import python from '../../assets/python.webp';
import java from '../../assets/java.webp';
import ml from '../../assets/ML.webp';

export default function CoursesDashboard() {
  const navigate = useNavigate();

  // MOCK DATA (Frontend Only)
  const user = { firstName: "Rahul" };

  const stats = {
    enrolled: 8,
    completed: 3,
    inProgress: 5
  };

  const allCourses = [
    { id: "react-101", title: "React Masterclass", instructor: "John Doe", thumbnail: oip, progress: 80, nextItem: { title: "Lesson 4 – Hooks", dueDate: "2025-11-18" }, duration: 3 },
    { id: "node-201", title: "Node.js Advanced", instructor: "Jane Smith", thumbnail: node, progress: 45, nextItem: { title: "Quiz 2 – REST APIs", dueDate: "2025-11-20" }, duration: 6 },
    { id: "vue-301", title: "Vue.js Essentials", instructor: "Mike Chen", thumbnail: vue, progress: 100, nextItem: null, duration: 1 },
    { id: "python-401", title: "Python for Data Science", instructor: "Sarah Lee", thumbnail: python, progress: 60, nextItem: { title: "Project: Pandas", dueDate: "2025-12-01" }, duration: 3 },
    { id: "java-501", title: "Java Spring Boot", instructor: "Raj Patel", thumbnail: java, progress: 20, nextItem: { title: "Module 1 – Setup", dueDate: "2025-11-25" }, duration: 12 },
    { id: "ml-601", title: "Machine Learning A-Z", instructor: "Dr. Kim", thumbnail: ml, progress: 0, nextItem: { title: "Lesson 1 – Intro", dueDate: null }, duration: 6 }
  ];

  const recentActivity = [
    { message: "Started Lesson 2", time: "2 hours ago" },
    { message: "Submitted Quiz 1", time: "5 hours ago" },
    { message: "Enrolled in Vue Basics", time: "1 day ago" }
  ];

  const announcements = [
    { text: "System maintenance on 20 Nov 02:00–04:00 AM", type: "maintenance" },
    { text: "New course “Node.js Advanced” released!", type: "info" }
  ];

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all'); // 'all', '1', '3', '6', '12'
  const [showAllCourses, setShowAllCourses] = useState(false);

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    let filtered = allCourses;

    // Search by name
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by duration
    if (selectedDuration !== 'all') {
      filtered = filtered.filter(c => c.duration === parseInt(selectedDuration));
    }

    return filtered;
  }, [searchQuery, selectedDuration]);

  const coursesToShow = showAllCourses ? filteredCourses : filteredCourses.slice(0, 3);

  const handleCourseClick = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cybernetics LMS</h1>
          <p className="text-lg text-gray-600 mt-1">Welcome back, <span className="font-semibold">{user.firstName}</span>!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {user.firstName[0]}
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Enrolled", value: stats.enrolled, icon: BookOpen, color: "blue" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, color: "green" },
          { label: "In Progress", value: stats.inProgress, icon: Clock, color: "orange" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition">
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Search + Filter */}
      <section className="mb-6">
       <div className="bg-white rounded-xl shadow-lg p-3 gap-4 w-fit">
  <div className="flex items-center gap-3">

    {/* Filter Dropdown */}
    <select 
      value={selectedDuration} 
      onChange={(e) => setSelectedDuration(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 min-w-[120px]"
    >
      <option value="all">All Durations</option>
      <option value="1">1 Month</option>
      <option value="3">3 Months</option>
      <option value="6">6 Months</option>
      <option value="12">12 Months</option>
    </select>

    {/* Search Field */}
    <div className="relative min-w-[200px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>

  </div>
</div>

      </section>

      {/* My Courses */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            My Courses
          </h2>
          <button
            onClick={() => setShowAllCourses(!showAllCourses)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {showAllCourses ? 'Show Less' : 'View All Courses'}
            <span className="text-xs">({filteredCourses.length})</span>
          </button>
        </div>

        {coursesToShow.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No courses found matching your filters.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coursesToShow.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                      {course.duration} {course.duration > 1 ? 'Months' : 'Month'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Next Item */}
                  {course.nextItem ? (
                    <p className="text-sm text-gray-700 mb-4">
                      <strong>Next:</strong> {course.nextItem.title}
                      {course.nextItem.dueDate && (
                        <span className="text-red-600 text-xs ml-1">
                          (due {new Date(course.nextItem.dueDate).toLocaleDateString()})
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 font-medium mb-4">Course Completed!</p>
                  )}

                  {/* Continue Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCourseClick(course.id);
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition ${
                      course.progress === 100
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700'
                    }`}
                    disabled={course.progress === 100}
                  >
                    {course.progress === 100 ? 'Completed' : 'Continue Learning'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-600" />
          Recent Activity
        </h2>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ul className="space-y-3">
            {recentActivity.map((act, i) => (
              <li key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{act.message}</span>
                <span className="text-gray-500">{act.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-purple-600" />
            Announcements
          </h2>
          <div className="space-y-3">
            {announcements.map((ann, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl text-white flex items-center gap-3 ${
                  ann.type === 'maintenance' ? 'bg-red-500' : 'bg-indigo-600'
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                <span>{ann.text}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}



// export default CoursesDashboard;   