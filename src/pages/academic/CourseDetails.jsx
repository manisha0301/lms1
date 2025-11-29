// src/pages/CourseDetails.jsx
import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Link2, Users, FileText, Plus, Trash2, 
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="px-8 py-5 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl transition-all">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {course.name}
              </h1>
              <p className="text-sm text-gray-500">Course ID: #{course.id} • {course.type.replace('-', ' ')} • {course.students} students</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8 py-8 max-w-[1600px] mx-auto space-y-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Batch Schedule */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Batch Schedule
            </h2>
            {!isEditingSchedule && (
              <button onClick={() => setIsEditingSchedule(true)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg">
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={!isEditingSchedule} className="mt-1 w-full px-4 py-2 border rounded-lg disabled:bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={!isEditingSchedule} className="mt-1 w-full px-4 py-2 border rounded-lg disabled:bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Start Time</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} disabled={!isEditingSchedule} className="mt-1 w-full px-4 py-2 border rounded-lg disabled:bg-gray-50" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">End Time</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} disabled={!isEditingSchedule} className="mt-1 w-full px-4 py-2 border rounded-lg disabled:bg-gray-50" />
            </div>
          </div>

          {isEditingSchedule && (
            <div className="mt-4 flex gap-3">
              <button onClick={() => { setIsEditingSchedule(false); alert("Schedule saved!"); }} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Schedule
              </button>
              <button onClick={() => setIsEditingSchedule(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Meeting Link */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-indigo-600" /> Class Meeting Link
            </h2>
            {!isEditingLink && (
              <button onClick={() => setIsEditingLink(true)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg">
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
          <input type="url" value={meetingLink} onChange={e => setMeetingLink(e.target.value)} disabled={!isEditingLink} className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50" />
          {isEditingLink && (
            <div className="mt-4 flex gap-3">
              <button onClick={() => { setIsEditingLink(false); alert("Link updated!"); }} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Save className="w-4 h-4" /> Update Link
              </button>
              <button onClick={() => setIsEditingLink(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          )}
        </div>

        </div>

        {/* Course Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Course Content
            </h2>
            <button onClick={() => setIsAddSectionModalOpen(true)} className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 shadow-lg">
              <Plus className="w-5 h-5" /> Add Section
            </button>
          </div>

          {sections.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No sections added yet. Click "Add Section" to create course structure.</p>
          ) : (
            <div className="space-y-6">
              {sections.map(section => (
                <div key={section.id} className="border-2 border-indigo-200 rounded-xl p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                    <FolderOpen className="w-6 h-6" /> {section.name}
                  </h3>
                  {section.modules.map(mod => (
                    <div key={mod.id} className="ml-8 mb-5 p-4 bg-white rounded-lg border border-indigo-100">
                      <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" /> {mod.name}
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {mod.chapters.map((chapter, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-700">
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
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Course Description</h2>
            {!isEditingDesc && (
              <button onClick={() => setIsEditingDesc(true)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg">
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
          <textarea
            rows={6}
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={!isEditingDesc}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none disabled:bg-gray-50"
          />
          {isEditingDesc && (
            <div className="mt-4 flex gap-3">
              <button onClick={() => { setIsEditingDesc(false); alert("Description saved!"); }} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Save Description
              </button>
              <button onClick={() => setIsEditingDesc(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Students */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Enrolled Students ({students.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-semibold text-gray-600 border-b">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Mobile</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3 text-center">Assignments</th>
                  <th className="pb-3 text-center">Exams</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 font-medium">{s.name}</td>
                    <td className="py-4 text-gray-600">{s.mobile}</td>
                    <td className="py-4 text-gray-600">{s.email}</td>
                    <td className="py-4 text-center font-bold text-green-600">{s.assignments}/10</td>
                    <td className="py-4 text-center font-bold text-indigo-600">{s.exams}/3</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD SECTION MODAL */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Section</h2>
              <button onClick={() => setIsAddSectionModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-6 h-6 text-gray-500" />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Modules</h3>
                  <button onClick={addModule} className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Module
                  </button>
                </div>

                {modules.map((module, modIdx) => (
                  <div key={module.id} className="mb-6 p-5 border border-indigo-200 rounded-xl bg-indigo-50/50">
                    <div className="flex justify-between items-center mb-3">
                      <input
                        type="text"
                        value={module.name}
                        onChange={e => updateModuleName(module.id, e.target.value)}
                        placeholder="Module Name (e.g. Hooks Deep Dive)"
                        className="text-lg font-medium px-3 py-2 border-b-2 border-indigo-300 bg-transparent outline-none w-full"
                      />
                      {modules.length > 1 && (
                        <button onClick={() => removeModule(module.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg">
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
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                          {module.chapters.length > 1 && (
                            <button onClick={() => removeChapter(module.id, chapIdx)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => addChapter(module.id)} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add Chapter
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <button onClick={() => setIsAddSectionModalOpen(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSaveSection} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg">
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