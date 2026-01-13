// frontend/src/pages/superAdmin/CourseDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Play, FileText, Calendar, Clock, CheckCircle,
  Lock, CreditCard, Users, Video, BookOpen, Award,
  Download, X, Plus, Trash2, ChevronRight, Edit3
} from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assign Course modal 
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [academicAdmins, setAcademicAdmins] = useState([]);

  // New Content Modal (Add Section)
  const [showContentModal, setShowContentModal] = useState(false);
  const [newSection, setNewSection] = useState({
    name: "",
    week: "",
    customTitle: "",
    modules: [{ name: "", chapters: [""] }],
  });

  // Edit Section Modal
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  // Course content sections (now fetched from backend and mutable)
  const [sections, setSections] = useState([]);

  const openContentModal = () => {
    setNewSection({ name: "", week: "", customTitle: "", modules: [{ name: "", chapters: [""] }] });
    setShowContentModal(true);
  };

  const openEditSectionModal = (section) => {
    // Parse name to week and customTitle if needed
    let week = section.week || "";
    let customTitle = section.customTitle || "";
    if (!week && section.name.startsWith("Week ")) {
      const parts = section.name.split(" - ");
      week = parts[0].replace("Week ", "").trim();
      customTitle = parts[1] || "";
    }
    setEditingSection({
      ...section,
      week,
      customTitle,
    });
    setIsEditSectionModalOpen(true);
  };

  const handleOrgToggle = (adminId) => {
    setSelectedOrgs((prev) =>
      prev.includes(adminId)
        ? prev.filter((id) => id !== adminId)
        : [...prev, adminId]
    );
  };

  const handleAssignSubmit = async () => {
    if (selectedOrgs.length === 0) {
      alert("Please select at least one institution.");
      return;
    }

    try {
      const token = localStorage.getItem("superAdminToken");
      const res = await fetch("http://localhost:5000/api/auth/superadmin/courses/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: course.id,
          adminIds: selectedOrgs
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setIsAssignModalOpen(false);
        setSelectedOrgs([]);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Assign error:", err);
      alert("Network error");
    }
  };

  const openAssignModal = async () => {
    try {
      const token = localStorage.getItem("superAdminToken");

      const adminsRes = await fetch("http://localhost:5000/api/auth/superadmin/academic-admins-assign", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const adminsData = await adminsRes.json();

      const assignRes = await fetch(`http://localhost:5000/api/auth/superadmin/courses/${id}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assignData = await assignRes.json();

      if (adminsData.success && assignData.success) {
        setAcademicAdmins(adminsData.admins);
        setSelectedOrgs(assignData.assignedIds || []);
        setIsAssignModalOpen(true);
      } else {
        alert("Failed to load data");
      }
    } catch (err) {
      console.error("Error loading assignment data:", err);
      alert("Network error");
    }
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
        console.log(data.course);
        setCourse(data.course);
        // Map backend structure to frontend sections
        const mappedSections = (data.course.contents || []).map((week, index) => ({
          id: week.id || index + 1, // Use backend id if available, else local
          name: week.title,
          week: week.weekNumber ? week.weekNumber.toString() : "",
          customTitle: extractCustomTitle(week.title, week.weekNumber),
          modules: week.modules.map((mod, modIndex) => ({
            id: mod.id || modIndex + 1,
            name: mod.title,
            chapters: mod.chapters.map(chap => chap.title || chap), // Extract titles if objects
          })),
        }));
        setSections(mappedSections);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract customTitle from name/title
  const extractCustomTitle = (name, week) => {
    if (week && name.startsWith(`Week ${week} - `)) {
      return name.replace(`Week ${week} - `, "").trim();
    }
    return name;
  };

  // Function to save entire structure to backend
  const saveStructureToBackend = async (updatedSections) => {
    try {
      const token = localStorage.getItem("superAdminToken");
      // Map to backend format: array of {name, week, modules: [{name, chapters: [strings or objects]}]}
      const backendStructure = updatedSections.map(sec => ({
        name: sec.name,
        week: sec.week,
        modules: sec.modules.map(mod => ({
          name: mod.name,
          chapters: mod.chapters, // strings
        })),
      }));
      const res = await fetch(`http://localhost:5000/api/auth/superadmin/courses/${id}/contents`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contents: backendStructure }),
      });
      const data = await res.json();
      if (data.success) {
        // Refetch to get updated ids etc.
        await fetchCourse();
      } else {
        alert("Error saving structure: " + data.error);
      }
    } catch (err) {
      console.error("Save structure error:", err);
      alert("Network error");
    }
  };

  // Handle Add Section Submit
  const handleAddSubmit = () => {
    if (!newSection.name.trim()) {
      alert("Section name is required");
      return;
    }
    // Filter empty modules/chapters
    const cleanedModules = newSection.modules
      .map(m => ({
        ...m,
        chapters: m.chapters.filter(c => c.trim() !== ""),
      }))
      .filter(m => m.name.trim() !== "");

    if (cleanedModules.length === 0) {
      alert("Add at least one module");
      return;
    }

    const newSec = {
      ...newSection,
      id: Math.max(0, ...sections.map(s => s.id || 0)) + 1,
      modules: cleanedModules,
    };

    const updatedSections = [...sections, newSec];
    setSections(updatedSections);
    setShowContentModal(false);
    // Save to backend
    saveStructureToBackend(updatedSections);
  };

  // Handle Edit Section Submit (already in code, enhanced)
  const handleEditSubmit = () => {
    // Filter empty
    const cleaned = {
      ...editingSection,
      modules: editingSection.modules
        .map(m => ({
          ...m,
          chapters: m.chapters.filter(c => c.trim() !== ""),
        }))
        .filter(m => m.name.trim() !== ""),
    };

    const updatedSections = sections.map(s =>
      s.id === editingSection.id ? cleaned : s
    );
    setSections(updatedSections);
    setIsEditSectionModalOpen(false);
    // Save to backend
    saveStructureToBackend(updatedSections);
  };

  // Add delete section functionality (optional, but recommended)
  const handleDeleteSection = (sectionId) => {
    if (!window.confirm("Delete this section?")) return;
    const updatedSections = sections.filter(s => s.id !== sectionId);
    setSections(updatedSections);
    // Save to backend
    saveStructureToBackend(updatedSections);
  };

  if (loading) return <p className="text-center py-20">Loading course...</p>;
  if (!course) return <p className="text-center py-20">Course not found</p>;

  return (
    <div className="min-h-screen bg-white">
      {/* Course Header */}
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

                <button
                  onClick={openAssignModal}
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

      {/* Course Content Section */}
      <div className="mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#1e40af]" /> Course Content
            </h2>
            <button
              onClick={openContentModal}
              className="w-52 py-3 bg-[#1e3a8a] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-5 h-5" /> Add Section
            </button>
          </div>

          {/* Render Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">{section.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => openEditSectionModal(section)} className="text-blue-600">
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteSection(section.id)} className="text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {section.modules.map((module) => (
                  <div key={module.id} className="bg-gray-50 rounded-xl p-6 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{module.name}</h4>
                    <ul className="space-y-2">
                      {module.chapters.map((chapter, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <span className="text-gray-800">{chapter}</span>
                        </div>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Add New Section</h2>
              <button onClick={() => setShowContentModal(false)} className="hover:bg-white/20 p-1 rounded cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <select
                      value={newSection.week}
                      onChange={(e) => {
                        const week = e.target.value;
                        setNewSection({
                          ...newSection,
                          week,
                          name: week ? `Week ${week} - ${newSection.customTitle || ""}`.trim() : newSection.customTitle || "",
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Select Week</option>
                      {[...Array(20)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={newSection.customTitle}
                      onChange={(e) => {
                        const customTitle = e.target.value;
                        setNewSection({
                          ...newSection,
                          customTitle,
                          name: newSection.week ? `Week ${newSection.week} - ${customTitle}`.trim() : customTitle,
                        });
                      }}
                      placeholder="e.g. Fundamentals, Advanced Concepts..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Modules</h3>
                  <button
                    onClick={() => setNewSection({ ...newSection, modules: [...newSection.modules, { name: "", chapters: [""] }] })}
                    className="text-[#1e3a8a] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Module
                  </button>
                </div>

                {newSection.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="mb-6 p-5 border border-gray-200 rounded-xl bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <input
                        type="text"
                        value={module.name}
                        onChange={(e) => {
                          const updated = [...newSection.modules];
                          updated[moduleIndex].name = e.target.value;
                          setNewSection({ ...newSection, modules: updated });
                        }}
                        placeholder="Module Name"
                        className="text-lg font-medium px-3 py-2 border-b border-gray-300 bg-transparent outline-none w-full focus:ring-0"
                      />
                      <button
                        onClick={() => {
                          const updated = newSection.modules.filter((_, i) => i !== moduleIndex);
                          setNewSection({ ...newSection, modules: updated });
                        }}
                        className="text-red-600 hover:text-red-700 transition cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 ml-6">
                      {module.chapters.map((chapter, chapIndex) => (
                        <div key={chapIndex} className="flex items-center gap-3">
                          <ChevronRight className="w-5 h-5 text-[#1e3a8a] mt-1" />
                          <input
                            type="text"
                            placeholder="Chapter / Topic name"
                            value={chapter}
                            onChange={(e) => {
                              const updated = [...newSection.modules];
                              updated[moduleIndex].chapters[chapIndex] = e.target.value;
                              setNewSection({ ...newSection, modules: updated });
                            }}
                            className="flex-1 px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                          />
                          <button
                            onClick={() => {
                              const updated = [...newSection.modules];
                              updated[moduleIndex].chapters.splice(chapIndex, 1);
                              setNewSection({ ...newSection, modules: updated });
                            }}
                            className="text-red-500 hover:text-red-700 transition cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          const updated = [...newSection.modules];
                          updated[moduleIndex].chapters.push("");
                          setNewSection({ ...newSection, modules: updated });
                        }}
                        className="flex items-center gap-2 text-[#1e3a8a] hover:text-[#1e3a8a]/80 font-medium text-sm mt-4 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Chapter / Topic
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowContentModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubmit}
                  className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  Add Section
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Section Modal (already present, updated with handleEditSubmit) */}
      {isEditSectionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Edit Section</h2>
              <button onClick={() => setIsEditSectionModalOpen(false)} className="hover:bg-white/20 p-1 rounded cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <select
                      value={editingSection.week || ""}
                      onChange={(e) => {
                        const week = e.target.value;
                        setEditingSection({
                          ...editingSection,
                          week,
                          name: week ? `Week ${week} - ${editingSection.customTitle || ""}`.trim() : editingSection.customTitle || "",
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Select Week</option>
                      {[...Array(20)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={editingSection.customTitle || ""}
                      onChange={(e) => {
                        const customTitle = e.target.value;
                        setEditingSection({
                          ...editingSection,
                          customTitle,
                          name: editingSection.week ? `Week ${editingSection.week} - ${customTitle}`.trim() : customTitle,
                        });
                      }}
                      placeholder="e.g. Fundamentals, Advanced Concepts..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Modules</h3>
                  <button
                    onClick={() => setEditingSection({ ...editingSection, modules: [...editingSection.modules, { name: "", chapters: [""] }] })}
                    className="text-[#1e3a8a] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Module
                  </button>
                </div>

                {editingSection.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="mb-6 p-5 border border-gray-200 rounded-xl bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <input
                        type="text"
                        value={module.name}
                        onChange={(e) => {
                          const updated = [...editingSection.modules];
                          updated[moduleIndex].name = e.target.value;
                          setEditingSection({ ...editingSection, modules: updated });
                        }}
                        placeholder="Module Name"
                        className="text-lg font-medium px-3 py-2 border-b border-gray-300 bg-transparent outline-none w-full focus:ring-0"
                      />
                      <button
                        onClick={() => {
                          const updated = editingSection.modules.filter((_, i) => i !== moduleIndex);
                          setEditingSection({ ...editingSection, modules: updated });
                        }}
                        className="text-red-600 hover:text-red-700 transition cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 ml-6">
                      {module.chapters.map((chapter, chapIndex) => (
                        <div key={chapIndex} className="flex items-center gap-3">
                          <ChevronRight className="w-5 h-5 text-[#1e3a8a] mt-1" />
                          <input
                            type="text"
                            placeholder="Chapter / Topic name"
                            value={chapter}
                            onChange={(e) => {
                              const updated = [...editingSection.modules];
                              updated[moduleIndex].chapters[chapIndex] = e.target.value;
                              setEditingSection({ ...editingSection, modules: updated });
                            }}
                            className="flex-1 px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                          />
                          <button
                            onClick={() => {
                              const updated = [...editingSection.modules];
                              updated[moduleIndex].chapters.splice(chapIndex, 1);
                              setEditingSection({ ...editingSection, modules: updated });
                            }}
                            className="text-red-500 hover:text-red-700 transition cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          const updated = [...editingSection.modules];
                          updated[moduleIndex].chapters.push("");
                          setEditingSection({ ...editingSection, modules: updated });
                        }}
                        className="flex items-center gap-2 text-[#1e3a8a] hover:text-[#1e3a8a]/80 font-medium text-sm mt-4 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Chapter / Topic
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsEditSectionModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal (unchanged) */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAssignModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Assign Course to Academic Partners
              </h2>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Select one or more educational institutions to assign <strong>{course.name}</strong>:
            </p>
            <div className="space-y-3 max-h-96 overflow-y-auto mb-8">
              {academicAdmins.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No institutions found</p>
              ) : (
                academicAdmins.map((admin) => (
                  <label key={admin.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={selectedOrgs.includes(admin.id)}
                      onChange={() => handleOrgToggle(admin.id)}
                      className="w-5 h-5 text-[#1e40af] rounded focus:ring-[#1e40af]"
                    />
                    <span className="text-gray-800 font-medium">
                      {admin.institution || 'Unnamed Institution'}
                    </span>
                  </label>
                ))
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsAssignModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer">
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
    </div>
  );
}