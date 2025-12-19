// src/pages/PendingApprovals.jsx
import React, { useState } from 'react';
import {
    ArrowLeft, CheckCircle, XCircle, Mail, Phone, MapPin, Briefcase,
    GraduationCap, FileText, Link, Clock, X
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

    const totalPending = pendingFacultyRequests.length + pendingExamRequests.length;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Blue Header - Same as FacultiesManagement */}
            <div className="bg-[#1e3a8a] text-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <button onClick={() => window.history.back()} className="text-white hover:bg-white/10 p-2 rounded-lg transition cursor-pointer">
                                <ArrowLeft className="w-8 h-8" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-semibold">Pending Approvals</h1>
                                <p className="mt-2 text-blue-100">Review and approve faculty applications & exam links</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                                <p className="text-3xl font-bold text-orange-600">{totalPending}</p>
                                <p className="text-sm text-gray-600 mt-1">Total Pending</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                                <p className="text-3xl font-bold text-purple-600">{pendingFacultyRequests.length}</p>
                                <p className="text-sm text-gray-600 mt-1">Faculty Requests</p>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                                <p className="text-3xl font-bold text-indigo-600">{pendingExamRequests.length}</p>
                                <p className="text-sm text-gray-600 mt-1">Exam Links</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs - Clean style matching other pages */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 inline-flex mb-8">
                    <button
                        onClick={() => setActiveTab('faculty')}
                        className={`px-8 py-3 rounded-md font-semibold transition-all cursor-pointer ${activeTab === 'faculty'
                            ? 'bg-[#1e40af] text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Faculty Applications ({pendingFacultyRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('exam')}
                        className={`px-8 py-3 rounded-md font-semibold transition-all ml-2 cursor-pointer ${activeTab === 'exam'
                            ? 'bg-[#1e40af] text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Exam Link Requests ({pendingExamRequests.length})
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'faculty' ? (
                    <div className="space-y-6">
                        {pendingFacultyRequests.map(faculty => (
                            <div key={faculty.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="p-6">
                                    <div className="flex gap-8">
                                        <div className="text-center">
                                            <img
                                                src={faculty.profilePic}
                                                alt={faculty.name}
                                                className="w-32 h-32 rounded-full object-cover ring-8 ring-blue-100 shadow-lg"
                                            />
                                            <p className="mt-4 text-sm font-medium text-orange-600 flex items-center gap-1 justify-center">
                                                <Clock className="w-4 h-4" /> {faculty.appliedOn}
                                            </p>
                                        </div>

                                        <div className="flex-1 space-y-5">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900">{faculty.name}</h3>
                                                    <p className="text-lg text-[#1e40af] font-medium">{faculty.designation}</p>
                                                </div>
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${faculty.employmentStatus === 'employed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {faculty.employmentStatus.toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-5 h-5 text-[#1e40af]" />
                                                    <span>{faculty.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-5 h-5 text-[#1e40af]" />
                                                    <span>{faculty.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="w-5 h-5 text-[#1e40af]" />
                                                    <span>{faculty.address}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <GraduationCap className="w-5 h-5 text-[#1e40af]" />
                                                    <span>{faculty.qualification}</span>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-gray-200">
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                    <FileText className="w-5 h-5" /> Short CV Summary
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                                    {faculty.cv}
                                                </p>
                                            </div>

                                            <div className="flex gap-3">
                                                {faculty.linkedin && (
                                                    <a href={faculty.linkedin} target="_blank" rel="noopener noreferrer"
                                                        className="px-5 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition flex items-center gap-2 cursor-pointer">
                                                        <Link className="w-4 h-4" /> LinkedIn
                                                    </a>
                                                )}
                                                {faculty.instagram && (
                                                    <a href={faculty.instagram} target="_blank" rel="noopener noreferrer"
                                                        className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md flex items-center gap-2 cursor-pointer">
                                                        Instagram
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-4 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => rejectFaculty(faculty.id)}
                                            className="px-6 py-3 border border-red-300 text-red-700 rounded-md hover:bg-red-50 font-medium transition cursor-pointer"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => approveFaculty(faculty.id)}
                                            className="px-8 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] font-semibold shadow-md transition cursor-pointer"
                                        >
                                            Approve & Send Welcome
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pendingExamRequests.map(req => (
                            <div key={req.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{req.examName}</h3>
                                            <p className="text-gray-600">
                                                by <span className="font-medium">{req.facultyName}</span> • Course: {req.course}
                                            </p>
                                        </div>
                                        <span className="text-sm text-orange-600 flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> {req.requestedOn}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <p className="text-gray-700 italic">"{req.message}"</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm mb-6">
                                        <span className="font-medium">Requested Link:</span>
                                        <a href={req.requestedLink} target="_blank" rel="noopener noreferrer"
                                            className="text-[#1e40af] hover:underline break-all">
                                            {req.requestedLink}
                                        </a>
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <button
                                            onClick={() => rejectExam(req.id)}
                                            className="px-6 py-3 border border-red-300 text-red-700 rounded-md hover:bg-red-50 font-medium transition cursor-pointer"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => approveExam(req.id)}
                                            className="px-8 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] font-semibold shadow-md transition cursor-pointer"
                                        >
                                            Approve Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {(activeTab === 'faculty' && pendingFacultyRequests.length === 0) ||
                    (activeTab === 'exam' && pendingExamRequests.length === 0) ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No pending requests in this category.</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default PendingApprovals;