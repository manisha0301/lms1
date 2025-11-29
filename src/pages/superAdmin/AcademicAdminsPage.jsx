import React, { useEffect, useState } from 'react';
import {
  Building2,
} from 'lucide-react';
import AdminDetailView from './AdminDetailView';
import { Link } from 'react-router-dom';

const AcademicAdminsPage = () => {
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  
  useEffect(() => {
    window.scrollTo(0, 0);
    }, []);

  const academicAdmins = [
    {
      id: 1,
      fullName: "Priya Sharma",
      email: "priya.sharma@kristellar.com",
      mobile: "+91 98765 43210",
      username: "priya.sharma",
      role: "Academic Admin",
      status: "Active",
      branch: "Bhubaneswar Main Campus",
      department: "Computer Science & Engineering",
      profilePic: "P",
      createdAt: "2023-06-15",
      lastLogin: "2025-11-27 09:45 AM",
      privileges: ["Manage Faculty", "Manage Students", "Manage Courses", "View Reports"],
      roleType: "Limited Access",
      stats: {
        facultiesManaged: 24,
        studentsManaged: 892,
        coursesAdministered: 18,
        notificationsSent: 342,
        batchesAssigned: 12,
      },
      twoFactor: true,
      emailVerified: true,
      recentActivities: [
        "Approved course 'Advanced React' for batch 2025",
        "Added 5 new faculty members",
        "Sent enrollment reminder to 120 students",
        "Updated timetable for CSE Semester 5",
      ],
    },
    {
      id: 2,
      fullName: "Rahul Verma",
      email: "rahul.verma@kristellar.com",
      mobile: "+91 87654 32109",
      username: "rahul.verma",
      role: "Branch Admin",
      status: "Active",
      branch: "Cuttack Extension Center",
      department: "Management Studies",
      profilePic: "R",
      createdAt: "2024-01-20",
      lastLogin: "2025-11-26 04:20 PM",
      privileges: ["Manage Students", "Finance Access", "Manage Batches"],
      roleType: "Custom Access",
      stats: {
        facultiesManaged: 12,
        studentsManaged: 456,
        coursesAdministered: 9,
        notificationsSent: 189,
        batchesAssigned: 8,
      },
      twoFactor: false,
      emailVerified: true,
      recentActivities: [
        "Processed fee payment for 45 students",
        "Created new batch MBA-2025-B",
        "Resolved attendance discrepancy",
      ],
    },
    {
      id: 3,
      fullName: "Anita Das",
      email: "anita.das@kristellar.com",
      mobile: "+91 76543 21098",
      username: "anita.das",
      role: "Course Admin",
      status: "Inactive",
      branch: "Online Division",
      department: "Data Science & AI/ML",
      profilePic: "A",
      createdAt: "2023-11-10",
      lastLogin: "2025-10-15 11:30 AM",
      privileges: ["Manage Courses", "Upload Content", "Grade Assignments"],
      roleType: "Limited Access",
      stats: {
        facultiesManaged: 8,
        studentsManaged: 234,
        coursesAdministered: 6,
        notificationsSent: 67,
        batchesAssigned: 4,
      },
      twoFactor: true,
      emailVerified: false,
      recentActivities: [
        "Uploaded Week 8 materials",
        "Graded final project submissions",
      ],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Inactive': return 'text-amber-600 bg-amber-50';
      case 'Suspended': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (selectedAdmin) {
    return <AdminDetailView admin={selectedAdmin} onBack={() => setSelectedAdmin(null)} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="px-8 py-4 flex justify-between items-center max-w-[1600px] mx-auto">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Academic Admins Management</h1>
                    <p className="text-xs text-gray-500 font-medium">Overview of all academic administrators</p>
                </div>
                <div>
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition shadow-md">
                        + Add New Academic Admin
                    </button>
                </div>
            </div>
      </header>
        
      

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academicAdmins.map((admin) => (
            <Link
              key={admin.id}
              onClick={() => setSelectedAdmin(admin)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 text-left hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {admin.profilePic}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                  {admin.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900">{admin.fullName}</h3>
              <p className="text-sm text-gray-600 mt-1">{admin.role}</p>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {admin.branch}
                </p>
                <p className="text-sm text-gray-700">{admin.email}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Students</span>
                  <span className="font-bold text-gray-900">{admin.stats.studentsManaged}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Courses</span>
                  <span className="font-bold text-gray-900">{admin.stats.coursesAdministered}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicAdminsPage;