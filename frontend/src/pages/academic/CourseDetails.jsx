// src/pages/CourseDetails.jsx
import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Link as LinkIcon, Users, FileText, Plus, Trash2, 
  Edit2, X, Save, Clock, BookOpen, FolderOpen, File
} from 'lucide-react';

const CourseDetails = ({ course, onBack }) => {
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  // Form States
  const [meetingLink, setMeetingLink] = useState(course.meetingLink || "https://meet.google.com/xyz-abcd");
  const [startDate, setStartDate] = useState(course.startDate || "2025-12-01");
  const [endDate, setEndDate] = useState(course.endDate || "2026-03-15");
  const [startTime, setStartTime] = useState(course.startTime || "10:00");
  const [endTime, setEndTime] = useState(course.endTime || "13:00");
  const [description, setDescription] = useState(course.description || "Master React and Node.js with real-world projects...");

  // Course Content
  const [sections, setSections] = useState([]);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);

  // Modal States
  const [newSectionName, setNewSectionName] = useState("");
  const [modules, setModules] = useState([{ id: 1, name: "", chapters: [""] }]);

  const students = [
    { id: 1, name: "Rohan Verma", mobile: "+91 98765 43210", email: "rohan@gmail.com", assignments: 8, exams: 3 },
    { id: 2, name: "Priya Singh", mobile: "+91 87654 32109", email: "priya.singh@outlook.com", assignments: 10, exams: 3 },
    { id: 3, name: "Amit Kumar", mobile: "+91 76543 21098", email: "amit.kumar@yahoo.com", assignments: 7, exams: 2 },
  ];

  const addModule = () => {
    setModules([...modules, { id: Date.now(), name: "", chapters: [""] }]);
  };

  const removeModule = (id) => {
    setModules(modules.filter(m => m.id !== id));
  };

  const updateModuleName = (id, name) => {
    setModules(modules.map(m => m.id === id ? { ...m, name } : m));
  };

  const addChapter = (moduleId) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, chapters: [...m.chapters, ""] } : m
    ));
  };

  const updateChapter = (moduleId, index, value) => {
    setModules(modules.map(m => 
      m.id === moduleId ? {
        ...m,
        chapters: m.chapters.map((c, i) => i === index ? value : c)
      } : m
    ));
  };

  const removeChapter = (moduleId, index) => {
    setModules(modules.map(m => 
      m.id === moduleId ? {
        ...m,
        chapters: m.chapters.filter((_, i) => i !== index)
      } : m
    ));
  };

  const handleSaveSection = () => {
    if (!newSectionName.trim()) return;

    const validModules = modules
      .filter(m => m.name.trim())
      .map(m => ({
        id: m.id,
        name: m.name,
        chapters: m.chapters.filter(c => c.trim())
      }))
      .filter(m => m.chapters.length > 0);

    if (validModules.length === 0) return;

    setSections([...sections, {
      id: Date.now(),
      name: newSectionName,
      modules: validModules
    }]);

    // Reset modal
    setNewSectionName("");
    setModules([{ id: 1, name: "", chapters: [""] }]);
    setIsAddSectionModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header - same style as FacultiesManagement */}
      <div className="bg-[#1e3a8a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-lg transition cursor-pointer">
                <ArrowLeft className="w-8 h-8" />
              </button>
              <div>
                <h1 className="text-3xl font-semibold">{course.name}</h1>
                <p className="mt-2 text-blue-100">Course ID: #{course.id} • {course.type.replace('-', ' ')} • {course.students} students</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="space-y-8">
          {/* Batch Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1e40af]" /> Batch Schedule
              </h2>
              {!isEditingSchedule && (
                <button onClick={() => setIsEditingSchedule(true)} className="text-[#1e40af] hover:bg-blue-50 p-2 rounded-md transition cursor-pointer">
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Start Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                  disabled={!isEditingSchedule} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition disabled:bg-gray-100" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">End Date</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={e => setEndDate(e.target.value)} 
                  disabled={!isEditingSchedule} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition disabled:bg-gray-100" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Start Time</label>
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={e => setStartTime(e.target.value)} 
                  disabled={!isEditingSchedule} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition disabled:bg-gray-100" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">End Time</label>
                <input 
                  type="time" 
                  value={endTime} 
                  onChange={e => setEndTime(e.target.value)} 
                  disabled={!isEditingSchedule} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition disabled:bg-gray-100" 
                />
              </div>
            </div>

            {isEditingSchedule && (
              <div className="mt-6 flex gap-4">
                <button 
                  onClick={() => { setIsEditingSchedule(false); alert("Schedule saved!"); }} 
                  className="px-6 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Schedule
                </button>
                <button 
                  onClick={() => setIsEditingSchedule(false)} 
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Meeting Link */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#1e40af]" /> Class Meeting Link
              </h2>
              {!isEditingLink && (
                <button onClick={() => setIsEditingLink(true)} className="text-[#1e40af] hover:bg-blue-50 p-2 rounded-md transition cursor-pointer">
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <input 
              type="url" 
              value={meetingLink} 
              onChange={e => setMeetingLink(e.target.value)} 
              disabled={!isEditingLink} 
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition disabled:bg-gray-100" 
            />
            {isEditingLink && (
              <div className="mt-6 flex gap-4">
                <button 
                  onClick={() => { setIsEditingLink(false); alert("Link updated!"); }} 
                  className="px-6 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Link
                </button>
                <button 
                  onClick={() => setIsEditingLink(false)} 
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1e40af]" /> Course Content
              </h2>
              <button 
                onClick={() => setIsAddSectionModalOpen(true)} 
                className="px-6 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Section
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No content added yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map(section => (
                  <div key={section.id} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#1e40af]" /> {section.name}
                    </h3>
                    {section.modules.map(module => (
                      <div key={module.id} className="ml-4 mb-4">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" /> {module.name}
                        </h4>
                        <ul className="ml-6 space-y-2">
                          {module.chapters.map((chapter, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                              <File className="w-4 h-4 text-gray-400" />
                              {chapter}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Course Description</h2>
              {!isEditingDesc && (
                <button onClick={() => setIsEditingDesc(true)} className="text-[#1e40af] hover:bg-blue-50 p-2 rounded-md transition cursor-pointer">
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <textarea
              rows={6}
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={!isEditingDesc}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition disabled:bg-gray-100 resize-none"
            />
            {isEditingDesc && (
              <div className="mt-6 flex gap-4">
                <button 
                  onClick={() => { setIsEditingDesc(false); alert("Description saved!"); }} 
                  className="px-6 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition cursor-pointer"
                >
                  Save Description
                </button>
                <button 
                  onClick={() => setIsEditingDesc(false)} 
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Students */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1e40af]" /> Enrolled Students ({students.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                    <th className="pb-3 px-4">Name</th>
                    <th className="pb-3 px-4">Mobile</th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4 text-center">Assignments</th>
                    <th className="pb-3 px-4 text-center">Exams</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="py-4 px-4 font-medium text-gray-900">{s.name}</td>
                      <td className="py-4 px-4 text-gray-600">{s.mobile}</td>
                      <td className="py-4 px-4 text-gray-600">{s.email}</td>
                      <td className="py-4 px-4 text-center font-bold text-green-600">{s.assignments}/10</td>
                      <td className="py-4 px-4 text-center font-bold text-[#1e40af]">{s.exams}/3</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ADD SECTION MODAL - same style as FacultiesManagement modals */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Section</h2>
              <button onClick={() => setIsAddSectionModalOpen(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Section Name</label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={e => setNewSectionName(e.target.value)}
                  placeholder="e.g. Week 1: React Fundamentals"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Modules</h3>
                  <button onClick={addModule} className="text-[#1e40af] hover:bg-blue-50 px-4 py-2 rounded-md transition flex items-center gap-2 cursor-pointer">
                    <Plus className="w-4 h-4" /> Add Module
                  </button>
                </div>

                {modules.map((module, modIdx) => (
                  <div key={module.id} className="mb-6 p-5 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <input
                        type="text"
                        value={module.name}
                        onChange={e => updateModuleName(module.id, e.target.value)}
                        placeholder="Module Name (e.g. Hooks Deep Dive)"
                        className="text-lg font-medium px-3 py-2 border-b border-gray-300 bg-transparent outline-none w-full focus:ring-0"
                      />
                      {modules.length > 1 && (
                        <button onClick={() => removeModule(module.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-md transition cursor-pointer">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="ml-6 space-y-3">
                      <p className="text-sm font-medium text-gray-600 mb-2">Chapters:</p>
                      {module.chapters.map((chapter, chapIdx) => (
                        <div key={chapIdx} className="flex items-center gap-3">
                          <File className="w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={chapter}
                            onChange={e => updateChapter(module.id, chapIdx, e.target.value)}
                            placeholder="Chapter name..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition"
                          />
                          {module.chapters.length > 1 && (
                            <button onClick={() => removeChapter(module.id, chapIdx)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition cursor-pointer">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => addChapter(module.id)} className="text-sm text-[#1e40af] hover:underline flex items-center gap-1 cursor-pointer ">
                        <Plus className="w-4 h-4" /> Add Chapter
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setIsAddSectionModalOpen(false)} 
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveSection} 
                  className="px-8 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] shadow-md transition cursor-pointer"
                >
                  Save Section
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;