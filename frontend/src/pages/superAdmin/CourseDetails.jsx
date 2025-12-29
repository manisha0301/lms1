// frontend/src/pages/superAdmin/CourseDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  Play, FileText, Calendar, Clock, CheckCircle, 
  Lock, CreditCard, Users, Video, BookOpen, Award,
  Download, X 
} from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Model states 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  // Form states
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newChapters, setNewChapters] = useState([]);
  const [editModuleTitle, setEditModuleTitle] = useState("");
  const [editChapters, setEditChapters] = useState([]);

  // Assign Course modal 
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOrgs, setSelectedOrgs] = useState([]);

  const educationalOrganizations = [
    { id: 1, name: "IIT Kharagpur" },
    { id: 2, name: "Jadavpur University" },
    { id: 3, name: "St. Xavier's College, Kolkata" },
    { id: 4, name: "Presidency University" },
    { id: 5, name: "Techno India University" },
    { id: 6, name: "IIEST Shibpur" },
    { id: 7, name: "Calcutta University" },
    { id: 8, name: "Brainware University" }
  ];

  const handleOrgToggle = (orgId) => {
    setSelectedOrgs(prev =>
      prev.includes(orgId)
        ? prev.filter(id => id !== orgId)
        : [...prev, orgId]
    );
  };

  const handleAssignSubmit = async () => {
    if (selectedOrgs.length === 0) {
      alert("Please select at least one organization.");
      return;
    }
    alert(`Course assigned successfully to ${selectedOrgs.length} organization(s)!`);
    setIsAssignModalOpen(false);
    setSelectedOrgs([]);
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem("superAdminToken");
      const res = await fetch(`http://localhost:5000/api/auth/superadmin/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCourse(data.course);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveContents = async (updatedContents) => {
    try {
      const token = localStorage.getItem("superAdminToken");
      const res = await fetch(`http://localhost:5000/api/auth/superadmin/courses/${id}/contents`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contents: updatedContents }),
      });
      const data = await res.json();
      if (data.success) {
        setCourse(data.course);
        
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) {
      alert("Module title is required.");
      return;
    }
    if (newChapters.some(ch => !ch.title.trim())) {
      alert("All chapters must have a title.");
      return;
    }

    const newModule = {
      id: Date.now(),
      title: newModuleTitle,
      chapters: newChapters.map((ch, idx) => ({
        id: Date.now() + idx,
        title: ch.title,
        duration: ch.duration || "45 min",
        type: ch.type || "video",
      })),
    };

    const updated = [...(course.contents || []), newModule];
    saveContents(updated);

    setIsAddModalOpen(false);
    setNewModuleTitle("");
    setNewChapters([]);
  };

  const handleEditModule = () => {
    if (!editModuleTitle.trim()) {
      alert("Module title is required.");
      return;
    }

    const updated = course.contents.map(m =>
      m.id === editingModule.id
        ? { ...m, title: editModuleTitle, chapters: editChapters.map((ch, idx) => ({
            id: m.chapters[idx]?.id || Date.now() + idx,
            title: ch.title,
            duration: ch.duration || "45 min",
            type: ch.type || "video",
          }))}
        : m
    );
    saveContents(updated);

    setIsEditModalOpen(false);
    setEditingModule(null);
    setEditModuleTitle("");
    setEditChapters([]);
  };

  const handleDeleteModule = (moduleId) => {
    if (window.confirm("Delete this module?")) {
      const updated = course.contents.filter(m => m.id !== moduleId);
      saveContents(updated);
    }
  };

  const openEditModal = (module) => {
    setEditingModule(module);
    setEditModuleTitle(module.title);
    setEditChapters(module.chapters.map(ch => ({
      title: ch.title,
      duration: ch.duration || "45 min",
      type: ch.type || "video"
    })));
    setIsEditModalOpen(true);
  };

  if (loading) return <p className="text-center py-20">Loading course...</p>;
  if (!course) return <p className="text-center py-20">Course not found</p>;

  return (
    <div className="min-h-screen bg-white">
      {/* Course Header - Real Data + Assign Button + Rating */}
      <div className="bg-[#1e3a8a] text-white">
        <div className="mx-auto px-20 py-12">
          <div className="grid md:grid-cols-3 gap-10 items-center">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{course.name}</h1>
              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-3xl">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-8 text-blue-50">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-80">Duration</p>
                    <p className="text-xl font-semibold">{course.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-80">Rating</p>
                    <p className="text-xl font-semibold">4.8 / 5.0</p>
                  </div>
                </div>

                {/* Assign Course Button */}
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                                        className="bg-white hover:bg-gray-100 text-[#1e40af] px-8 py-3 rounded-md font-semibold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-5 h-5" />
                  Assign Course
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl -rotate-6 scale-95"></div>
                {course.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${course.image}`}
                    alt={course.name}
                    className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl border-4 border-white/30"
                  />
                ) : (
                  <div className="relative z-10 w-full max-w-md h-96 bg-gray-300 rounded-2xl border-4 border-white/30" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#1e40af]" /> Course Content
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
                                    className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition shadow-md cursor-pointer"
            >
              <Play className="w-5 h-5" />
              Add Content
            </button>
          </div>

          <div className="space-y-5">
            {(course.contents || []).length === 0 ? (
              <p className="text-center py-8 text-gray-500">No content added yet. Click "Add Content" to start.</p>
            ) : (
              course.contents.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                  <div className="bg-gray-50 px-5 py-3 font-semibold text-gray-800 flex justify-between items-center">
                    <span>{module.title}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(module)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-[#1e40af]/10 px-3 py-1 rounded-md cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium bg-[#1e40af]/10 px-3 py-1 rounded-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {module.chapters?.map((chapter) => (
                      <div key={chapter.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                        <div className="flex items-center gap-4">
                          {chapter.type === 'video' && <Video className="w-5 h-5 text-[#1e40af]" />}
                          {chapter.type === 'quiz' && <Award className="w-5 h-5 text-green-600" />}
                          {chapter.type === 'assignment' && <FileText className="w-5 h-5 text-orange-600" />}
                          <div>
                            <p className="font-medium text-gray-900">{chapter.title}</p>
                            <p className="text-sm text-gray-500">{chapter.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Assign Course Model */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAssignModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Assign Course to Academic Partners
              </h2>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Select one or more educational institutions to assign <strong>{course.name}</strong>:
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto mb-8">
              {educationalOrganizations.map((org) => (
                <label
                  key={org.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedOrgs.includes(org.id)}
                    onChange={() => handleOrgToggle(org.id)}
                    className="w-5 h-5 text-[#1e40af] rounded focus:ring-[#1e40af]"
                  />
                  <span className="text-gray-800 font-medium">{org.name}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                disabled={selectedOrgs.length === 0}
                className={`px-6 py-2.5 rounded-lg font-medium text-white cursor-pointer transition ${selectedOrgs.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#1e40af] hover:bg-[#1e3a8a] shadow-md'
                }`}
              >
                Assign to {selectedOrgs.length} Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6">Add New Module</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                <input
                  type="text"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                  placeholder="e.g., Advanced React Patterns"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-700">Chapters</label>
                  <button
                    type="button"
                    onClick={() => setNewChapters(prev => [...prev, { title: '', duration: '45 min', type: 'video' }])}
                                        className="text-[#1e40af] hover:text-[#1e3a8a] text-sm font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-4 h-4" /> Add Chapter
                  </button>
                </div>

                {newChapters.length === 0 && (
                                    <p className="text-gray-500 text-sm italic">No chapters added yet. Click "Add Chapter" to start.</p>
                )}

                <div className="space-y-4">
                  {newChapters.map((chapter, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Chapter Title</label>
                          <input
                            type="text"
                            value={chapter.title}
                            onChange={(e) => {
                              const updated = [...newChapters];
                              updated[index].title = e.target.value;
                              setNewChapters(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af]"
                                                        placeholder="e.g., Custom Hooks"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                          <input
                            type="text"
                            value={chapter.duration}
                            onChange={(e) => {
                              const updated = [...newChapters];
                              updated[index].duration = e.target.value;
                              setNewChapters(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af]"
                                                        placeholder="45 min"
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <select
                          value={chapter.type}
                          onChange={(e) => {
                            const updated = [...newChapters];
                            updated[index].type = e.target.value;
                            setNewChapters(updated);
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="video">Video Lesson</option>
                          <option value="quiz">Quiz</option>
                          <option value="assignment">Assignment</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => setNewChapters(prev => prev.filter((_, i) => i !== index))}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setNewModuleTitle('');
                  setNewChapters([]);
                }}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddModule}
                className="px-6 py-2.5 bg-[#1e40af] text-white rounded-lg font-medium"
              >
                Add Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-6">Edit Module</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                <input
                  type="text"
                  value={editModuleTitle}
                  onChange={(e) => setEditModuleTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-700">Chapters</label>
                  <button
                    type="button"
                    onClick={() => setEditChapters(prev => [...prev, { title: '', duration: '45 min', type: 'video' }])}
                                        className="text-[#1e40af] hover:text-[#1e3a8a] text-sm font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-4 h-4" /> Add Chapter
                  </button>
                </div>

                <div className="space-y-4">
                  {editChapters.map((chapter, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Chapter Title</label>
                          <input
                            type="text"
                            value={chapter.title}
                            onChange={(e) => {
                              const updated = [...editChapters];
                              updated[index].title = e.target.value;
                              setEditChapters(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                          <input
                            type="text"
                            value={chapter.duration}
                            onChange={(e) => {
                              const updated = [...editChapters];
                              updated[index].duration = e.target.value;
                              setEditChapters(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af]"
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <select
                          value={chapter.type}
                          onChange={(e) => {
                            const updated = [...editChapters];
                            updated[index].type = e.target.value;
                            setEditChapters(updated);
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="video">Video Lesson</option>
                          <option value="quiz">Quiz</option>
                          <option value="assignment">Assignment</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => setEditChapters(prev => prev.filter((_, i) => i !== index))}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button
                onClick={() => setIsEditModalOpen(false)}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEditModule}
                className="px-6 py-2.5 bg-[#1e40af] text-white rounded-lg font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}