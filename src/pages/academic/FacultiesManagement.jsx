// src/pages/FacultiesManagement.jsx
import React, { useState } from 'react';
import {
    ArrowLeft, Search, Filter, MapPin, Briefcase, GraduationCap,
    Trash2, Key, Calendar, CheckCircle, XCircle, Eye, X, Mail, Phone,
    Building2, Link as LinkIcon, Download, Users, Award
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
            email: "priya.sharma@kristellar.com",
            phone: "+91 98765 43210",
            address: "Flat 1203, Sky Towers, Hinjewadi Phase 2, Pune - 411057",
            employmentStatus: "Employed",
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
• Full Stack Trainer at Kristellar Academy (2020–Present)
• Frontend Lead at StartupXYZ (2018–2021)
`,
        },
        // ... (rest of the faculty data same as before)
        {
            id: 2,
            name: "Prof. Amit Kumar",
            email: "amit.k@kristellar.com",
            phone: "+91 87654 32109",
            address: "B-45, Andheri East, Mumbai - 400069",
            employmentStatus: "Employed",
            designation: "Lead Faculty - MERN Stack",
            qualification: "M.Tech AI/ML",
            profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
            linkedin: "https://linkedin.com/in/amitkumar",
            state: "Maharashtra",
            district: "Mumbai",
            courses: ["Full Stack MERN Bootcamp"],
            status: "active",
            today: true,
            attendance: "98%",
            cvDescription: `Professional Experience:
• Senior React Developer at TechSolutions Pvt Ltd (2021–Present)
• Full Stack Trainer at Kristellar Academy (2020–Present)
• Frontend Lead at StartupXYZ (2018–2021)
`,
        },
        {
            id: 3,
            name: "Ms. Sneha Patel",
            email: "sneha.patel@kristellar.com",
            phone: "+91 76543 21098",
            address: "Gandhi Road, Ahmedabad - 380001",
            employmentStatus: "Freelancer",
            designation: "Python & Django Faculty",
            qualification: "M.Sc. Computer Science",
            profilePic: "https://randomuser.me/api/portraits/women/68.jpg",
            linkedin: "https://linkedin.com/in/snehapatel",
            instagram: "https://instagram.com/sneha.codes",
            state: "Gujarat",
            district: "Ahmedabad",
            courses: ["Python Django Full Course"],
            status: "pending",
            today: false,
            attendance: "N/A",
            cvDescription: `Professional Experience:
• Senior React Developer at TechSolutions Pvt Ltd (2021–Present)
• Full Stack Trainer at Kristellar Academy (2020–Present)
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

    // Dummy actions
    const approveFaculty = (id) => alert(`Faculty ID ${id} approved!`);
    const rejectFaculty = (id) => window.confirm("Reject this faculty?") && alert("Rejected");
    const deleteFaculty = (id) => window.confirm("Delete permanently?") && alert("Deleted");
    const changePassword = () => {
        if (newPassword.length < 6) return alert("Password too short");
        alert(`Password changed for ${selectedFaculty.name}`);
        setIsChangePasswordOpen(false);
        setNewPassword("");
    };

    const openDetails = (faculty) => {
        setSelectedFaculty(faculty);
        setIsViewDetailsOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header - same style as AllCourses */}
            <div className="bg-[#1e3a8a] text-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center gap-6">
                        <div className='flex flex-row gap-6'>
                        <button onClick={() => window.history.back()} className="text-white hover:bg-white/10 p-2 rounded-lg transition cursor-pointer">
                            <ArrowLeft className="w-8 h-8" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-semibold">Faculty Management</h1>
                            <p className="mt-2 text-blue-100">Manage, approve, and track all faculty members</p>
                        </div>
                    </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
                        <p className="text-3xl font-bold text-gray-800">{faculties.length}</p>
                        <p className="text-sm text-gray-600 mt-1">Total Faculties</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
                        <p className="text-3xl font-bold text-green-600">+{todayCount}</p>
                        <p className="text-sm text-gray-600 mt-1">Joined Today</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-center">
                        <p className="text-3xl font-bold text-orange-600">{pendingRequests}</p>
                        <p className="text-sm text-gray-600 mt-1">Pending Requests</p>
                    </div>
                </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Filters - same style as AllCourses */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search faculty..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition"
                            />
                        </div>

                        <select
                            value={filterState}
                            onChange={e => { setFilterState(e.target.value); setFilterDistrict(""); }}
                            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition cursor-pointer"
                        >
                            <option value="">All States</option>
                            {Object.keys(indianStatesAndDistricts).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <select
                            value={filterDistrict}
                            onChange={e => setFilterDistrict(e.target.value)}
                            disabled={!filterState}
                            className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] disabled:bg-gray-100 focus:border-[#1e40af] transition cursor-pointer"
                        >
                            <option value="">All Districts</option>
                            {filterState && indianStatesAndDistricts[filterState]?.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => { setSearchTerm(""); setFilterState(""); setFilterDistrict(""); }}
                            className="bg-[#1e40af] text-white px-6 py-3 rounded-md hover:bg-[#1e3a8a] transition flex items-center justify-center gap-2 font-medium cursor-pointer hover:shadow-lg hover:scale-105"
                        >
                            <Filter className="w-4 h-4" /> Clear Filters
                        </button>
                    </div>
                </div>

                {/* Faculty Grid - same card style as AllCourses */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFaculties.map((faculty) => (
                        <div
                            key={faculty.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
                        >
                            <div className="h-48 bg-gray-200 border-b border-gray-200 relative">
                                <img
                                    src={faculty.profilePic}
                                    alt={faculty.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-medium px-3 py-1 rounded">
                                    {faculty.status === "pending" ? "PENDING" : "ACTIVE"}
                                </div>
                                {faculty.today && (
                                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded">
                                        NEW
                                    </div>
                                )}
                            </div>

                            <div className="p-5">
                                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{faculty.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{faculty.designation}</p>

                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{faculty.district}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{faculty.employmentStatus}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{faculty.attendance}</span>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openDetails(faculty)}
                                            className="bg-[#1e40af] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#1e3a8a] transition flex items-center gap-1 cursor-pointer"
                                        >
                                            <Eye className="w-4 h-4" /> Details
                                        </button>

                                        {faculty.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => approveFaculty(faculty.id)}
                                                    className="bg-green-600 text-white p-2.5 rounded-md hover:bg-green-700 transition cursor-pointer"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => rejectFaculty(faculty.id)}
                                                    className="bg-red-600 text-white p-2.5 rounded-md hover:bg-red-700 transition cursor-pointer"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => { setSelectedFaculty(faculty); setIsChangePasswordOpen(true); }}
                                                className="bg-gray-700 text-white p-2.5 rounded-md hover:bg-gray-800 transition cursor-pointer"
                                            >
                                                <Key className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => deleteFaculty(faculty.id)}
                                        className="text-red-600 hover:bg-red-50 p-2 rounded-md transition cursor-pointer"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredFaculties.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No faculties found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* View Details Modal - same style */}
            {isViewDetailsOpen && selectedFaculty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Faculty Details</h2>
                            <button onClick={() => setIsViewDetailsOpen(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <img
                                    src={selectedFaculty.profilePic}
                                    alt={selectedFaculty.name}
                                    className="w-40 h-40 rounded-full object-cover ring-8 ring-blue-100 mx-auto shadow-lg"
                                />
                                <h3 className="text-2xl font-bold mt-4">{selectedFaculty.name}</h3>
                                <p className="text-gray-600">{selectedFaculty.designation}</p>
                                <span className={`inline-block mt-3 px-5 py-2 rounded-full text-sm font-bold ${
                                    selectedFaculty.employmentStatus === 'employed'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-purple-100 text-purple-700'
                                }`}>
                                    {selectedFaculty.employmentStatus.toUpperCase()}
                                </span>
                            </div>

                            <div className="md:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-[#1e40af] mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{selectedFaculty.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-[#1e40af] mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium">{selectedFaculty.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-[#1e40af] mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600">Location</p>
                                            <p className="font-medium">{selectedFaculty.district}, {selectedFaculty.state}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="w-5 h-5 text-[#1e40af] mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600">Qualification</p>
                                            <p className="font-medium">{selectedFaculty.qualification}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    {selectedFaculty.linkedin && (
                                        <a
                                            href={selectedFaculty.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition flex items-center gap-2"
                                        >
                                            <LinkIcon className="w-4 h-4" /> LinkedIn
                                        </a>
                                    )}
                                    {selectedFaculty.instagram && (
                                        <a
                                            href={selectedFaculty.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md flex items-center gap-2"
                                        >
                                            Instagram
                                        </a>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-2">CV Description</h4>
                                    <p className="text-gray-700 whitespace-pre-line">{selectedFaculty.cvDescription || "N/A"}</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal - same style */}
            {isChangePasswordOpen && selectedFaculty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
                        <h3 className="text-xl font-bold mb-6">Change Password – {selectedFaculty.name}</h3>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Enter new password (min 6 characters)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] mb-6"
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => { setIsChangePasswordOpen(false); setNewPassword(""); }}
                                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={changePassword}
                                className="px-6 py-3 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition cursor-pointer"
                            >
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