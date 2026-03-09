// frontend/src/pages/student/CourseOverview.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import apiConfig from "../../config/apiConfig.js";

export default function CourseOverview() {
  const { courseId } = useParams(); // from URL: /courses/:courseId/overview

  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${apiConfig.API_BASE_URL}/api/public/courses/${courseId}/overview`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setCourse(data.course);
          setContent(data.content || []);
        } else {
          setError(data.message || "Failed to load course");
        }
      } catch (err) {
        console.error("Course fetch error:", err);
        setError("Could not load course details");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading course...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error || "Course not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header – real data */}
      <div className="bg-[#1e3a8a] text-white">
        <div className="mx-auto px-20 py-12">
          <div className="grid md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-3xl">
                {course.description || "No description available."}
              </p>
              <div className="flex flex-wrap gap-8 text-blue-50">
                <div className="w-52" /> {/* spacer */}
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl -rotate-6 scale-95"></div>
                {course.thumbnail ? (
                  <img
                    src={`${apiConfig.API_BASE_URL}/uploads/${course.thumbnail}`}
                    alt={course.title}
                    className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl border-4 border-white/30 h-60 object-cover"
                  />
                ) : (
                  <div className="relative z-10 w-full max-w-md h-60 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl border-4 border-white/30 flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-white/40" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content – only text titles (no video, no URLs, no extra details) */}
      <div className="mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#1e40af]" /> Course Content
            </h2>
          </div>

          {content.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No content structure available for this course yet.
            </p>
          ) : (
            <div className="space-y-6">
              {content.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="bg-gradient-to-r from-[#1e3a8a]/10 to-[#1e40af]/5 px-6 py-4">
                    <h3 className="font-semibold text-[#1e3a8a] text-lg">
                      {section.name}
                    </h3>
                  </div>

                  <div className="p-6">
                    {section.modules?.length > 0 ? (
                      section.modules.map((module) => (
                        <div
                          key={module.id}
                          className="border-l-4 border-[#1e3a8a]/40 pl-5 py-2 mb-6"
                        >
                          <h4 className="text-gray-800 mb-3 flex items-center gap-2 font-bold text-lg">
                            <BookOpen size={18} className="text-[#1e3a8a]" />
                            {module.name}
                          </h4>

                          <div className="space-y-2.5 ml-2">
                            {module.chapters?.length > 0 ? (
                              module.chapters.map((chap, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 py-2.5 px-4 bg-gray-50 rounded-lg"
                                >
                                  <ChevronRight className="w-5 h-5 text-[#1e3a8a]" />
                                  <span className="text-gray-800">
                                    {chap.title}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 italic ml-2">
                                No chapters in this module
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-center py-8">
                        No modules in this week
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}