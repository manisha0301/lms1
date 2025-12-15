// src/pages/faculty/CourseDetailsFaculty.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  Link as LinkIcon,
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Settings,
  CheckCircle,
  FileText,
} from 'lucide-react';

import node from '../../assets/node.webp';

export default function CourseDetailsFaculty() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // MOCK DATA - Faculty View (same as before)
  const course = {
    id: courseId || "node-201",
    title: "Advanced Node.js",
    code: "CSE-405",
    thumbnail: node,
    instructor: "Dr. Sarah Chen",
    semester: "Fall 2025",
    totalStudents: 48,
    duration: "6 Months",
    status: "Active",
    description: "Master backend development with Node.js, Express, MongoDB, and real-time applications. Build scalable APIs and full-stack projects.",
    schedule: "Tue & Thu, 10:00 AM – 11:30 AM",
    room: "Room A-204",
  };

  const modules = [
    {
      id: 1,
      title: "Module 1: Node.js Fundamentals",
      lessons: [
        { id: 101, title: "Introduction to Node.js", duration: "45 min" },
        { id: 102, title: "Event Loop & Async Programming", duration: "60 min" },
        { id: 103, title: "NPM & Package Management", duration: "30 min" },
      ],
      assessment: {
        title: "Quiz 1: Node.js Basics",
        type: "Quiz",
        totalMarks: 20,
        dueDate: "2025-11-22",
        published: true,
        submissions: 42,
        totalStudents: 48,
      },
    },
    {
      id: 2,
      title: "Module 2: Express.js & REST APIs",
      lessons: [
        { id: 201, title: "Setting up Express Server", duration: "50 min" },
        { id: 202, title: "Routing & Middleware", duration: "70 min" },
        { id: 203, title: "Error Handling", duration: "40 min" },
      ],
      assessment: {
        title: "Assignment 1 Build a REST API",
        type: "Assignment",
        totalMarks: 50,
        due: "2025-12-05",
        published: true,
        submissions: 31,
        totalStudents: 48,
      },
    },
    {
      id: 3,
      title: "Module 3: Database Integration",
      lessons: [
        { id: 301, title: "MongoDB with Mongoose", duration: "60 min" },
        { id: 302, title: "CRUD Operations", duration: "55 min" },
      ],
      assessment: null,
    },
  ];

  const [classLink, setClassLink] = useState("https://zoom.us/j/1234567890");
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [tempLink, setTempLink] = useState(classLink);

  const handleSaveLink = () => {
    setClassLink(tempLink);
    setIsEditingLink(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header – exactly same as CourseDetails.jsx */}
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition cursor-pointer"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <div>
                <h1 className="text-3xl font-semibold">{course.title}</h1>
                <p className="mt-2 text-blue-100">
                  Course ID: #{course.id} • {course.code} • {course.totalStudents} students
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="space-y-8">
          {/* Live Class Link Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#1e40af]" /> Live Class Link
              </h2>
              {!isEditingLink && (
                <button
                  onClick={() => setIsEditingLink(true)}
                  className="text-[#1e40af] hover:bg-blue-50 p-2 rounded-md transition cursor-pointer"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <input
              type="url"
              value={isEditingLink ? tempLink : classLink}
              onChange={(e) => setTempLink(e.target.value)}
              disabled={!isEditingLink}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition disabled:bg-gray-100"
            />

            {isEditingLink && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleSaveLink}
                  className="px-6 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Save Link
                </button>
                <button
                  onClick={() => {
                    setIsEditingLink(false);
                    setTempLink(classLink);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Course Info Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Users, label: "Students", value: course.totalStudents },
                { icon: Clock, label: "Duration", value: course.duration },
                { icon: Calendar, label: "Semester", value: course.semester },
                { icon: CheckCircle, label: "Status", value: course.status },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="inline-flex p-3 bg-blue-50 rounded-lg mb-3">
                      <Icon className="w-6 h-6 text-[#1e40af]" />
                    </div>
                    <p className="text-sm text-gray-600">{item.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
              <div className="mt-6 flex flex-wrap gap-8 text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {course.schedule}
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {course.room}
                </span>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1e40af]" /> Course Content
              </h2>
              <button className="px-6 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" /> Add Module
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No modules added yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="border border-gray-200 rounded-lg hover:shadow-md transition p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#1e40af]" />
                        {module.title}
                      </h3>
                      <div className="flex gap-2">
                        <button className="text-[#1e40af] hover:bg-blue-50 p-2 rounded-md transition">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button className="text-red-600 hover:bg-red-50 p-2 rounded-md transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="ml-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          Lessons ({module.lessons.length})
                        </h4>
                        <button className="text-sm text-[#1e40af] hover:underline">
                          + Add Lesson
                        </button>
                      </div>
                      <ul className="space-y-2 ml-6">
                        {module.lessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className="flex items-center justify-between text-gray-700"
                          >
                            <span className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              {lesson.title} • <span className="text-sm text-gray-500">{lesson.duration}</span>
                            </span>
                            <div className="flex gap-2">
                              <button className="text-gray-500 hover:text-gray-700">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-500 hover:text-gray-700">
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Assessment */}
                    <div className="mt-6 border-t pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-gray-500" />
                          Assessment
                        </h4>
                        {!module.assessment && (
                          <button className="text-sm text-[#1e40af] hover:underline">
                            + Create Assessment
                          </button>
                        )}
                      </div>

                      {module.assessment ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-semibold text-gray-900">
                                {module.assessment.title}
                                <span className={`ml-3 text-xs px-2 py-1 rounded-full ${
                                  module.assessment.type === 'Quiz'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {module.assessment.type}
                                </span>
                              </h5>
                              <div className="mt-2 text-sm text-gray-600 space-y-1">
                                <div>Total Marks: <strong>{module.assessment.totalMarks}</strong></div>
                                <div>Due: <strong>{new Date(module.assessment.due).toLocaleDateString()}</strong></div>
                                <div>
                                  Submissions: <strong>{module.assessment.submissions}/{module.assessment.totalStudents}</strong>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-4 py-2 bg-[#1e40af] text-white text-sm rounded-md hover:bg-[#1e3a8a] transition">
                                View Submissions
                              </button>
                              <button className="px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition">
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No assessment created yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}