// src/pages/PendingApprovals.jsx
import React, { useState } from 'react';
import {
    ArrowLeft, CheckCircle, XCircle, Mail, Phone, MapPin, Briefcase,
    GraduationCap, FileText, Link, UserCheck, Clock, Building2, X
} from 'lucide-react';

const PendingApprovals = () => {
    const [activeTab, setActiveTab] = useState('faculty'); // 'faculty' or 'exam'

    // Mock data for pending faculty signups
    const pendingFacultyRequests = [
        {
            id: 1,
            name: "Prof. Sneha Reddy",
            email: "sneha.reddy@gmail.com",
            phone: "+91 98765 54321",
            address: "Koramangala, Bangalore - 560034",
            employmentStatus: "freelancer",
            designation: "Senior Python & Django Trainer",
            qualification: "M.Tech Computer Science",
            cv: "Experienced full-stack developer with 8+ years in Python/Django and React. Trained 800+ students across 12 batches. Built 15+ production apps. Speaker at PyCon India 2024. Passionate about teaching clean code and scalable architecture.",
            profilePic: "https://randomuser.me/api/portraits/women/65.jpg",
            linkedin: "https://linkedin.com/in/snehareddy",
            instagram: "https://instagram.com/sneha.teaches",
            facebook: null,
            appliedOn: "2 hours ago"
        },
        {
            id: 2,
            name: "Mr. Vikram Singh",
            email: "vikram.singh@outlook.com",
            phone: "+91 87654 32109",
            address: "Sector 62, Noida - 201301",
            employmentStatus: "employed",
            designation: "Lead Data Scientist at TechCorp",
            qualification: "M.Sc. Data Science, IIT Delhi",
            cv: "Currently leading AI/ML team at TechCorp. 10+ years in Data Science & ML. Published 12 research papers. Expert in Python, TensorFlow, AWS. Looking to mentor aspiring data scientists part-time.",
            profilePic: "https://randomuser.me/api/portraits/men/86.jpg",
            linkedin: "https://linkedin.com/in/vikramsingh-ds",
            instagram: null,
            facebook: null,
            appliedOn: "5 hours ago"
        }
    ];

    // Mock data for pending exam link approvals
    const pendingExamRequests = [
        {
            id: 101,
            facultyName: "Dr. Priya Sharma",
            course: "Advanced React & Node.js",
            examName: "Final Capstone Project Evaluation",
            requestedLink: "https://meet.google.com/exm-abc-defg",
            requestedOn: "1 hour ago",
            message: "Please approve the exam link for final project submissions and viva."
        },
        {
            id: 102,
            facultyName: "Prof. Amit Kumar",
            course: "Full Stack MERN Bootcamp",
            examName: "Module 6 - Authentication & Security",
            requestedLink: "https://meet.google.com/exm-xyz-1234",
            requestedOn: "3 hours ago",
            message: "Need approval for live proctored exam on JWT, OAuth, and security best practices."
        }
    ];

    const approveFaculty = (id) => {
        alert(`Faculty request #${id} approved successfully! Welcome email sent.`);
    };

    const rejectFaculty = (id) => {
        if (window.confirm("Reject this faculty application?")) {
            alert(`Faculty request #${id} has been rejected.`);
        }
    };

    const approveExam = (id) => {
        alert(`Exam link approved! Faculty has been notified.`);
    };

    const rejectExam = (id) => {
        if (window.confirm("Reject this exam link request?")) {
            alert(`Exam link request rejected.`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="px-8 py-5 flex items-center justify-between max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Pending Approvals
                            </h1>
                            <p className="text-sm text-gray-500">Review and approve faculty applications & exam links</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-3xl font-bold text-orange-600">{pendingFacultyRequests.length + pendingExamRequests.length}</p>
                            <p className="text-sm text-gray-600">Total Pending</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="px-8 py-6 max-w-[1600px] mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex border border-gray-200">
                    <button
                        onClick={() => setActiveTab('faculty')}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${activeTab === 'faculty'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Faculty Applications ({pendingFacultyRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('exam')}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all ${activeTab === 'exam'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Exam Link Requests ({pendingExamRequests.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-12 max-w-[1600px] mx-auto">
                {activeTab === 'faculty' ? (
                    <div className="space-y-6">
                        {pendingFacultyRequests.map(faculty => (
                            <div key={faculty.id} className="bg-white rounded-2xl shadow=xl border-2 border-orange-200 p-8 hover:shadow-2xl transition-all">
                                <div className="flex gap-8">
                                    <div className="text-center">
                                        <img src={faculty.profilePic} alt={faculty.name} className="w-32 h-32 rounded-full object-cover ring-8 ring-orange-100 shadow-xl" />
                                        <p className="mt-4 text-sm font-medium text-orange-600">Applied {faculty.appliedOn}</p>
                                    </div>

                                    <div className="flex-1 space-y-5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">{faculty.name}</h3>
                                                <p className="text-lg text-indigo-600 font-medium">{faculty.designation}</p>
                                            </div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${faculty.employmentStatus === 'employed' ? 'bg-green-100 text-green-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                {faculty.employmentStatus.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 text-sm">
                                            <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-gray-500" /> <span>{faculty.email}</span></div>
                                            <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-gray-500" /> <span>{faculty.phone}</span></div>
                                            <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-gray-500" /> <span>{faculty.address}</span></div>
                                            <div className="flex items-center gap-3"><GraduationCap className="w-5 h-5 text-gray-500" /> <span>{faculty.qualification}</span>
                                            </div>

                                            <div className="pt-4 border-t border-gray-200">
                                                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                    <FileText className="w-5 h-5" /> Short CV (Summary)
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                                                    {faculty.cv}
                                                </p>
                                            </div>

                                            <div className="flex gap-3 height-10 items-center">
                                                {faculty.linkedin && (
                                                    <a href={faculty.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">LinkedIn</a>
                                                )}
                                                {faculty.instagram && (
                                                    <a href={faculty.instagram} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm">Instagram</a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-4">
                                    <button
                                        onClick={() => rejectFaculty(faculty.id)}
                                        className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold flex items-center gap-2 shadow-lg"
                                    >
                                        <XCircle className="w-5 h-5" /> Reject
                                    </button>
                                    <button
                                        onClick={() => approveFaculty(faculty.id)}
                                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold flex items-center gap-2 shadow-lg"
                                    >
                                        <CheckCircle className="w-5 h-5" /> Approve & Send Welcome
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pendingExamRequests.map(req => (
                            <div key={req.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{req.examName}</h3>
                                        <p className="text-gray-600">by <span className="font-medium">{req.facultyName}</span> • Course: {req.course}</p>
                                    </div>
                                    <span className="text-sm text-orange-600 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> {req.requestedOn}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl mb-4">
                                    <p className="text-gray-700 italic">"{req.message}"</p>
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    <span className="font-medium">Requested Link:</span>
                                    <a href={req.requestedLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">
                                        {req.requestedLink}
                                    </a>
                                </div>

                                <div className="mt-6 flex justify-end gap-4">
                                    <button
                                        onClick={() => rejectExam(req.id)}
                                        className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => approveExam(req.id)}
                                        className="px-8 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg"
                                    >
                                        Approve Link
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
};

export default PendingApprovals;