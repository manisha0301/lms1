// src/pages/FacultiesManagement.jsx
import React, { useState } from 'react';
import {
    ArrowLeft, Search, Filter, MapPin, Briefcase, GraduationCap,
    Trash2, Key, Calendar, CheckCircle, XCircle, Eye, Edit2, X, Mail, Phone,
    Building2, UserCheck, Link as LinkIcon, FileText, Download
} from 'lucide-react';

const FacultiesManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterState, setFilterState] = useState("");
    const [filterDistrict, setFilterDistrict] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    const todayCount = 2;
    const pendingRequests = 3;

    const faculties = [
        {
            id: 1,
            name: "Dr. Priya Sharma",
            email: "priya.sharma@codekart.com",
            phone: "+91 98765 43210",
            address: "Flat 1203, Sky Towers, Hinjewadi Phase 2, Pune - 411057",
            employmentStatus: "employed",
            designation: "Senior Faculty - React & Node.js",
            qualification: "PhD Computer Science",
            profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
            cv: "https://example.com/cv/priya-sharma.pdf",
            linkedin: "https://linkedin.com/in/priyasharma",
            instagram: "https://instagram.com/priya.teaches",
            facebook: "https://facebook.com/priya.sharma",
            state: "Maharashtra",
            district: "Pune",
            courses: ["Advanced React & Node.js", "React Native Mastery"],
            status: "active",
            today: true,
            attendance: "95%",
            cvDescription: `Professional Experience:
• Senior React Developer at TechSolutions Pvt Ltd (2021–Present)
• Full Stack Trainer at CodeKart Academy (2020–Present)
• Frontend Lead at StartupXYZ (2018–2021)
`,
        },
        {
            id: 2,
            name: "Prof. Amit Kumar",
            email: "amit.k@codekart.com",
            phone: "+91 87654 32109",
            address: "B-45, Andheri East, Mumbai - 400069",
            employmentStatus: "employed",
            designation: "Lead Faculty - MERN Stack",
            qualification: "M.Tech AI/ML",
            profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
            cv: "https://example.com/cv/amit-kumar.pdf",
            linkedin: "https://linkedin.com/in/amitkumar",
            instagram: null,
            facebook: null,
            state: "Maharashtra",
            district: "Mumbai",
            courses: ["Full Stack MERN Bootcamp"],
            status: "active",
            today: true,
            attendance: "98%",
            cvDescription: `Professional Experience:
• Senior React Developer at TechSolutions Pvt Ltd (2021–Present)
• Full Stack Trainer at CodeKart Academy (2020–Present)
• Frontend Lead at StartupXYZ (2018–2021)
`,
        },
        {
            id: 3,
            name: "Ms. Sneha Patel",
            email: "sneha.patel@codekart.com",
            phone: "+91 76543 21098",
            address: "Gandhi Road, Ahmedabad - 380001",
            employmentStatus: "freelancer",
            designation: "Python & Django Faculty",
            qualification: "M.Sc. Computer Science",
            profilePic: "https://randomuser.me/api/portraits/women/68.jpg",
            cv: "https://example.com/cv/sneha-patel.pdf",
            linkedin: "https://linkedin.com/in/snehapatel",
            instagram: "https://instagram.com/sneha.codes",
            facebook: null,
            state: "Gujarat",
            district: "Ahmedabad",
            courses: ["Python Django Full Course"],
            status: "pending",
            today: false,
            attendance: "N/A",
            cvDescription: `Professional Experience:
• Senior React Developer at TechSolutions Pvt Ltd (2021–Present)
• Full Stack Trainer at CodeKart Academy (2020–Present)
• Frontend Lead at StartupXYZ (2018–2021)`,
        },
    ];

    const indianStatesAndDistricts = {
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
        "Delhi": ["New Delhi"],
        "Tamil Nadu": ["Chennai", "Coimbatore"],
    };

    const filteredFaculties = faculties.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesState = !filterState || f.state === filterState;
        const matchesDistrict = !filterDistrict || f.district === filterDistrict;
        return matchesSearch && matchesState && matchesDistrict;
    });

    const approveFaculty = (id) => {
        alert(`Faculty approved successfully!`);
    };

    const rejectFaculty = (id) => {
        if (window.confirm("Reject this faculty request?")) {
            alert("Faculty request rejected.");
        }
    };

    const deleteFaculty = (id) => {
        if (window.confirm("Are you sure you want to remove this faculty permanently?")) {
            alert("Faculty removed.");
        }
    };

    const changePassword = () => {
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }
        alert(`Password changed successfully for ${selectedFaculty.name}!`);
        setIsChangePasswordOpen(false);
        setNewPassword("");
    };

    const openDetails = (faculty) => {
        setSelectedFaculty(faculty);
        setIsViewDetailsOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="px-8 py-5 flex items-center justify-between max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-110">
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Faculty Management
                            </h1>
                            <p className="text-sm text-gray-500">Manage, approve, and track all faculty members</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-3xl font-bold text-gray-900">{faculties.length}</p>
                            <p className="text-sm text-gray-600">Total Faculties</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-green-600">+{todayCount}</p>
                            <p className="text-sm text-gray-600">Joined Today</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-orange-600">{pendingRequests}</p>
                            <p className="text-sm text-gray-600">Pending Approval</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="px-8 py-6 max-w-[1600px] mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <select value={filterState} onChange={e => { setFilterState(e.target.value); setFilterDistrict(""); }}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="">All States</option>
                            {Object.keys(indianStatesAndDistricts).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} disabled={!filterState}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50">
                            <option value="">All Districts</option>
                            {filterState && indianStatesAndDistricts[filterState]?.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        {/* <button onClick={() => { setSearchTerm(""); setFilterState(""); setFilterDistrict(""); }}
                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium flex items-center justify-center gap-2">
                            <Filter className="w-4 h-4" /> Clear
                        </button> */}

                        {(() => {
                            const isAnyFilterActive = searchTerm || filterState || filterDistrict;
                            return (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilterState("");
                                        setFilterDistrict("");
                                    }}
                                    className={`px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isAnyFilterActive
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    <Filter className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Faculty Cards */}
            <div className="px-8 pb-12 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFaculties.map(faculty => (
                        <div key={faculty.id} className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all hover:shadow-2xl hover:scale-[1.02] ${faculty.status === 'pending' ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-100'
                            } ${faculty.today ? 'ring-2 ring-green-100 border-green-300' : ''}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden ring-4 ring-indigo-100">
                                        <img src={faculty.profilePic} alt={faculty.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{faculty.name}</h3>
                                        <p className="text-sm text-gray-600">{faculty.designation}</p>
                                        {faculty.today && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">NEW TODAY</span>}
                                        {faculty.status === 'pending' && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">PENDING</span>}
                                    </div>
                                </div>
                                <button onClick={() => deleteFaculty(faculty.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {faculty.email}</div>
                                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {faculty.phone}</div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {faculty.district}, {faculty.state}</div>
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Attendance: <span className="font-bold text-indigo-600">{faculty.attendance}</span></div>
                            </div>

                            <div className="mt-5 flex gap-2">
                                <button onClick={() => openDetails(faculty)} className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium flex items-center justify-center gap-2">
                                    <Eye className="w-4 h-4" /> View Details
                                </button>

                                {faculty.status === 'pending' ? (
                                    <>
                                        <button onClick={() => approveFaculty(faculty.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => rejectFaculty(faculty.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                            <XCircle className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => { setSelectedFaculty(faculty); setIsChangePasswordOpen(true); }}
                                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 flex items-center gap-1">
                                        <Key className="w-4 h-4" /> Change
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Faculty Details Modal */}
            {isViewDetailsOpen && selectedFaculty && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 max-h-[95vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-3xl">
                            <h2 className="text-2xl font-bold text-gray-900">Faculty Profile</h2>
                            <button onClick={() => setIsViewDetailsOpen(false)} className="p-3 hover:bg-gray-100 rounded-xl transition-all">
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 mb-8">
                                <div className="text-center">
                                    <img src={selectedFaculty.profilePic} alt={selectedFaculty.name} className="w-40 h-40 rounded-full object-cover ring-8 ring-indigo-100 shadow-2xl mx-auto" />
                                    <h3 className="text-2xl font-bold mt-4">{selectedFaculty.name}</h3>
                                    <p className="text-gray-600">{selectedFaculty.designation}</p>
                                    <span className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-bold ${selectedFaculty.employmentStatus === 'employed' ? 'bg-green-100 text-green-700' :
                                        selectedFaculty.employmentStatus === 'freelancer' ? 'bg-purple-100 text-purple-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {selectedFaculty.employmentStatus.toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-indigo-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-medium">{selectedFaculty.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-indigo-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="font-medium">{selectedFaculty.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Building2 className="w-5 h-5 text-indigo-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-600">Address</p>
                                                <p className="font-medium">{selectedFaculty.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <GraduationCap className="w-5 h-5 text-indigo-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-600">Qualification</p>
                                                <p className="font-medium">{selectedFaculty.qualification}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <LinkIcon className="w-5 h-5" /> Social Links
                                        </h4>
                                        <div className="flex gap-4">
                                            {selectedFaculty.linkedin && (
                                                <a href={selectedFaculty.linkedin} target="_blank" rel="noopener noreferrer"
                                                    className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2">
                                                    <span>LinkedIn</span>
                                                </a>
                                            )}
                                            {selectedFaculty.instagram && (
                                                <a href={selectedFaculty.instagram} target="_blank" rel="noopener noreferrer"
                                                    className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 flex items-center gap-2">
                                                    <span>Instagram</span>
                                                </a>
                                            )}
                                            {selectedFaculty.facebook && (
                                                <a href={selectedFaculty.facebook} target="_blank" rel="noopener noreferrer"
                                                    className="px-5 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 flex items-center gap-2">
                                                    <span>Facebook</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5" /> Experience & Education (CV Summary)
                                        </h4>
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                                            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                                                {selectedFaculty.cvDescription}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {isChangePasswordOpen && selectedFaculty && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Change Password - {selectedFaculty.name}</h3>
                            <button onClick={() => { setIsChangePasswordOpen(false); setNewPassword(""); }} className="p-2 hover:bg-gray-100 rounded-xl">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsChangePasswordOpen(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={changePassword} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultiesManagement;