// src/pages/student/CourseDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import {
    Play, FileText, Calendar, Clock, CheckCircle,
    Lock, CreditCard, Users, Video, BookOpen, Award,
    Download, X
} from 'lucide-react';
import { useState } from 'react';

// Import local thumbnails
import oip from '../../assets/OIP.jpg';
import node from '../../assets/node.webp';
import vue from '../../assets/vue.webp';
import python from '../../assets/python.webp';
import java from '../../assets/java.webp';
import ml from '../../assets/ml.webp';

const thumbnailMap = {
    'react-101': oip,
    'node-201': node,
    'vue-301': vue,
    'python-401': python,
    'java-501': java,
    'ml-601': ml
};

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // === NEW STATE FOR MODAL & SELECTIONS ===
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedOrgs, setSelectedOrgs] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);


    // Mock: Check if registered
    const isRegistered = id === 'react-101' || id === 'vue-301'; // Only these are registered

    // Mock Course Data
    const course = {
        id,
        title: {
            'react-101': 'React Masterclass',
            'node-201': 'Node.js Advanced',
            'vue-301': 'Vue.js Essentials',
            'python-401': 'Python for Data Science',
            'java-501': 'Java Spring Boot',
            'ml-601': 'Machine Learning A-Z'
        }[id] || 'Unknown Course',
        instructor: 'John Doe',
        duration: '3 Months',
        price: '₹12,999',
        thumbnail: thumbnailMap[id] || oip,
        rating: 4.8,
        students: 1234,
        description: 'Master modern web development with hands-on projects, real-world scenarios, and expert guidance.',
        modules: [
            {
                id: 1,
                title: 'Module 1: Fundamentals',
                chapters: [
                    { id: 1, title: 'Introduction to React', duration: '45 min', type: 'video', locked: !isRegistered },
                    { id: 2, title: 'JSX & Components', duration: '60 min', type: 'video', locked: !isRegistered },
                    { id: 3, title: 'State & Props', duration: '55 min', type: 'video', locked: !isRegistered },
                    { id: 4, title: 'Quiz: Basics', type: 'quiz', locked: !isRegistered }
                ]
            },
            {
                id: 2,
                title: 'Module 2: Advanced Concepts',
                chapters: [
                    { id: 5, title: 'Hooks Deep Dive', duration: '70 min', type: 'video', locked: !isRegistered },
                    { id: 6, title: 'Context API', duration: '50 min', type: 'video', locked: !isRegistered },
                    { id: 7, title: 'Assignment: Todo App', type: 'assignment', locked: !isRegistered }
                ]
            }
        ],
        liveClasses: [
            { date: '2025-11-20', time: '7:00 PM', topic: 'React Hooks Live', instructor: 'John Doe' },
            { date: '2025-11-27', time: '7:00 PM', topic: 'Performance Optimization', instructor: 'John Doe' }
        ],
        examLink: isRegistered ? 'https://exam.kristellar.com/react-final' : null,
        notes: isRegistered ? ['Module1.pdf', 'Hooks-Cheatsheet.pdf'] : []
    };
    // Add these new states near your existing useState declarations
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState(null);

    // New state for form inputs in modals
    const [newModuleTitle, setNewModuleTitle] = useState('');

    // For editing
    const [editModuleTitle, setEditModuleTitle] = useState('');
    const [newChapters, setNewChapters] = useState([]); // Array of { title, duration, type }
    const [editChapters, setEditChapters] = useState([]); // Array of { title, duration, type }

    // Since course.modules is currently static, we'll make it mutable
    // Replace the static modules with useState
    const [modules, setModules] = useState(course.modules);


    // Update the course object to use state
    const courseData = {
        ...course,
        modules // use state version
    };

    // Mock list of Educational Organizations
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

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Assigning course", course.title, "to organizations:", selectedOrgs);
        alert(`Course assigned successfully to ${selectedOrgs.length} organization(s)!`);

        setIsSubmitting(false);
        setIsAssignModalOpen(false);
        setSelectedOrgs([]);
    };

    // Handlers
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
            chapters: newChapters.length > 0
                ? newChapters.map((ch, idx) => ({
                    id: Date.now() + idx,
                    title: ch.title,
                    duration: ch.duration,
                    type: ch.type,
                    locked: !isRegistered
                }))
                : [{ id: Date.now(), title: 'Introduction', duration: '30 min', type: 'video', locked: !isRegistered }]
        };

        setModules(prev => [...prev, newModule]);
        setIsAddModalOpen(false);
        setNewModuleTitle('');
        setNewChapters([]);
    };

    const handleEditModule = () => {
        if (!editModuleTitle.trim()) {
            alert("Module title is required.");
            return;
        }
        if (editChapters.some(ch => !ch.title.trim())) {
            alert("All chapters must have a title.");
            return;
        }

        const updatedChapters = editChapters.map((ch, idx) => ({
            id: editingModule.chapters[idx]?.id || Date.now() + idx,
            title: ch.title,
            duration: ch.duration,
            type: ch.type,
            locked: !isRegistered
        }));

        setModules(prev => prev.map(m =>
            m.id === editingModule.id
                ? { ...m, title: editModuleTitle, chapters: updatedChapters }
                : m
        ));

        setIsEditModalOpen(false);
        setEditingModule(null);
        setEditModuleTitle('');
        setEditChapters([]);
    };

    const openEditModal = (module) => {
        setEditingModule(module);
        setEditModuleTitle(module.title);
        setEditChapters(module.chapters.map(ch => ({
            title: ch.title,
            duration: ch.duration || '45 min',
            type: ch.type || 'video'
        })));
        setIsEditModalOpen(true);
    };


    const handleDeleteModule = (moduleId) => {
        if (window.confirm("Are you sure you want to delete this module?")) {
            setModules(prev => prev.filter(m => m.id !== moduleId));
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-[#1e3a8a] text-white">
                <div className="mx-auto px-20 py-12">
                    <div className="grid md:grid-cols-3 gap-10 items-center">
                        <div className="md:col-span-2">
                            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-3xl">
                                {course.description}
                            </p>

                            {!isRegistered && (
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
                                            <p className="text-xl font-semibold">{course.rating} / 5.0</p>
                                        </div>
                                    </div>

                                    {/* ASSIGN COURSE BUTTON */}
                                    <button
                                        onClick={() => setIsAssignModalOpen(true)}
                                        className="bg-white hover:bg-gray-100 text-[#1e40af] px-8 py-3 rounded-md font-semibold transition-all hover:shadow-lg hover:-translate-y-1 flex items-center gap-2 cursor-pointer"
                                    >
                                        <Users className="w-5 h-5" />
                                        Assign Course
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center md:justify-end">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl -rotate-6 scale-95"></div>
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl border-4 border-white/30"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className=" mx-auto px-6 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Course Content */}
                        {/* Course Content */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-[#1e40af]" /> Course Content
                                </h2>

                                {/* Add Content Button */}
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition shadow-md cursor-pointer"
                                >
                                    <Play className="w-5 h-5" />
                                    Add Content
                                </button>
                            </div>

                            <div className="space-y-5">
                                {modules.map((module) => (
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
                                            {module.chapters.map((chapter) => (
                                                <div
                                                    key={chapter.id}
                                                    className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {chapter.type === 'video' && <Video className="w-5 h-5 text-[#1e40af]" />}
                                                        {chapter.type === 'quiz' && <Award className="w-5 h-5 text-green-600" />}
                                                        {chapter.type === 'assignment' && <FileText className="w-5 h-5 text-orange-600" />}
                                                        <div>
                                                            <p className="font-medium text-gray-900">{chapter.title}</p>
                                                            {chapter.duration && <p className="text-sm text-gray-500">{chapter.duration}</p>}
                                                        </div>
                                                    </div>
                                                    {chapter.locked && <Lock className="w-5 h-5 text-gray-400" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ASSIGN COURSE MODAL */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => !isSubmitting && setIsAssignModalOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Assign Course to Academic Partners
                            </h2>
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                disabled={isSubmitting}
                                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Select one or more educational institutions to assign <strong>{course.title}</strong>:
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
                                        disabled={isSubmitting}
                                        className="w-5 h-5 text-[#1e40af] rounded focus:ring-[#1e40af]"
                                    />
                                    <span className="text-gray-800 font-medium">{org.name}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignSubmit}
                                disabled={isSubmitting || selectedOrgs.length === 0}
                                className={`px-6 py-2.5 rounded-lg font-medium text-white flex items-center gap-2 transition cursor-pointer ${isSubmitting || selectedOrgs.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#1e40af] hover:bg-[#1e3a8a] shadow-md'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Assigning...
                                    </>
                                ) : (
                                    `Assign to ${selectedOrgs.length} Selected`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD CONTENT MODAL */}
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
                                disabled={!newModuleTitle.trim() || newChapters.some(ch => !ch.title.trim())}
                                className={`px-6 py-2.5 rounded-lg font-medium text-white transition cursor-pointer ${!newModuleTitle.trim() || newChapters.some(ch => !ch.title.trim())
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#1e40af] hover:bg-[#1e3a8a] shadow-md'
                                    }`}
                            >
                                Add Module
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT CONTENT MODAL */}
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
                                disabled={!editModuleTitle.trim() || editChapters.some(ch => !ch.title.trim())}
                                className={`px-6 py-2.5 rounded-lg font-medium text-white transition cursor-pointer ${!editModuleTitle.trim() || editChapters.some(ch => !ch.title.trim())
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#1e40af] hover:bg-[#1e3a8a] shadow-md'
                                    }`}
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