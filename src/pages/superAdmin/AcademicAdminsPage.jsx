import React, { useEffect, useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import AdminDetailView from './AdminDetailView';

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

  if (selectedAdmin) {
    return <AdminDetailView admin={selectedAdmin} onBack={() => setSelectedAdmin(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-8 py-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Admin Management</h1>
            <p className="opacity-90 mt-1">Overview of all academic administrators</p>
          </div>
          <button className="bg-white text-[#1e3a8a] px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition shadow-md mt-2">
            + Add New Academic Admin
          </button>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Admins List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {academicAdmins.map((admin) => (
            <div
              key={admin.id}
              // onClick={() => setSelectedAdmin(admin)}
              className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {admin.profilePic}
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    admin.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : admin.status === "Inactive"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {admin.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1e3a8a] transition">
                {admin.fullName}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{admin.role}</p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{admin.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{admin.mobile}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span>{admin.branch}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Students Managed</span>
                  <span className="font-bold text-gray-900">{admin.stats.studentsManaged}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Courses Administered</span>
                  <span className="font-bold text-gray-900">{admin.stats.coursesAdministered}</span>
                </div>
              </div>

              {/* <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-[#1e3a8a] font-bold">
                <span>View Full Profile</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition" />
              </div> */}
            </div>
          ))}
        </div>

        {academicAdmins.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No admins found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicAdminsPage;