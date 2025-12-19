// src/pages/faculty/AssignmentManagement.jsx
import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Upload, 
  Download, 
  Eye, 
  Users, 
  Calendar,
  FileText,
  CheckCircle,
  X,
  Filter
} from 'lucide-react';

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      topic: "Build REST API with Node.js",
      course: "Advanced Node.js (CSE-405)",
      description: "Create a complete RESTful API using Express and MongoDB with authentication.",
      uploadedAt: "2025-11-10",
      fileName: "Assignment-1-REST-API.pdf",
      totalAssigned: 48,
      submitted: 42,
      pending: 6
    },
    {
      id: 2,
      topic: "Machine Learning Model Deployment",
      course: "Machine Learning A-Z (CSE-601)",
      description: "Deploy a trained ML model using Flask or FastAPI.",
      uploadedAt: "2025-11-05",
      fileName: "ML-Deployment-Task.pdf",
      totalAssigned: 36,
      submitted: 29,
      pending: 7
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [searchStudent, setSearchStudent] = useState('');

  // Form state
  const [newAssignment, setNewAssignment] = useState({
    topic: '',
    course: 'Advanced Node.js (CSE-405)',
    description: '',
    file: null
  });

  // Mock students
  const allStudents = [
    { id: "STU21001", name: "Aarav Sharma", selected: false },
    { id: "STU21002", name: "Diya Patel", selected: false },
    { id: "STU21003", name: "Rohan Verma", selected: false },
    { id: "STU21004", name: "Priya Singh", selected: false },
    { id: "STU21005", name: "Vikram Kumar", selected: false },
    // ... more students
  ];

  const [students, setStudents] = useState(allStudents);

  const toggleStudent = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    s.id.toLowerCase().includes(searchStudent.toLowerCase())
  );

  // Mock submissions for details modal
  const submissions = {
    1: [
      { id: "STU21001", name: "Aarav Sharma", submittedAt: "2025-11-15", file: "aarav-rest-api.zip", marks: 88, remarks: "Excellent implementation" },
      { id: "STU21002", name: "Diya Patel", submittedAt: "2025-11-14", file: "diya-api-project.zip", marks: 92, remarks: "Outstanding work" },
      { id: "STU21003", name: "Rohan Verma", submittedAt: null, file: null, marks: null, remarks: null },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Assignment Management</h1>
        <p className="text-gray-600">Create, assign, and evaluate student assignments</p>
      </div>

      {/* Add New Assignment Button */}
      <div className="mb-8 text-right">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add New Assignment
        </button>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <FileText className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{assignment.topic}</h3>
                    <p className="text-indigo-600 font-medium mt-1">{assignment.course}</p>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{assignment.description}</p>
                    
                    <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Uploaded: {assignment.uploadedAt}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {assignment.submitted}/{assignment.totalAssigned} Submitted
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => setShowDetailsModal(assignment.id)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Create New Assignment</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Topic</label>
                <input
                  type="text"
                  value={newAssignment.topic}
                  onChange={(e) => setNewAssignment({...newAssignment, topic: e.target.value})}
                  placeholder="e.g., Build a REST API"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option>Advanced Node.js (CSE-405)</option>
                  <option>Machine Learning A-Z (CSE-601)</option>
                  <option>Data Structures (CSE-201)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows="4"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  placeholder="Provide detailed instructions..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Assignment File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 transition">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <input type="file" className="mt-4" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Assign to Students</label>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredStudents.map((student) => (
                    <label key={student.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                      <input
                        type="checkbox"
                        checked={student.selected}
                        onChange={() => toggleStudent(student.id)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.id}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {students.filter(s => s.selected).length} students selected
                </p>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg">
                Assign to Selected Students
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Assignment Details & Submissions</h2>
                <button onClick={() => setShowDetailsModal(null)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {assignments.find(a => a.id === showDetailsModal)?.topic}
              </h3>
              <p className="text-gray-600 mb-6">
                {assignments.find(a => a.id === showDetailsModal)?.description}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Submitted On</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {submissions[showDetailsModal]?.map((sub, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{sub.name}</p>
                            <p className="text-xs text-gray-500">{sub.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {sub.submittedAt || <span className="text-red-600">Not Submitted</span>}
                        </td>
                        <td className="px-6 py-4">
                          {sub.file ? (
                            <a href="#" className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {sub.file}
                            </a>
                          ) : "-"}
                        </td>
                        <td className="px-6 py-4">
                          {sub.marks !== null ? (
                            <span className="font-bold text-green-600">{sub.marks}/100</span>
                          ) : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm">{sub.remarks || "-"}</td>
                        <td className="px-6 py-4">
                          <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                            Evaluate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © 2025 Cybernetics LMS • Faculty Portal
      </footer>
    </div>
  );
}