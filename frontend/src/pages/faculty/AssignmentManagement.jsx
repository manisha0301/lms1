// src/pages/faculty/AssignmentManagement.jsx
import { useState, useEffect } from 'react';
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
  Filter,
  Save
} from 'lucide-react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New assignment form state
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    courseId: '',
    description: '',
    totalMarks: '',
    dueDate: '',
    file: null
  });

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('facultyToken');
        const response = await axios.get(
          `${apiConfig.API_BASE_URL}/api/faculty/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success && response.data.dashboard.recentCourses) {
          const courseList = response.data.dashboard.recentCourses;
          setCourses(courseList);
          if (courseList.length > 0) {
            const firstCourseId = courseList[0].id;
            setSelectedCourseId(firstCourseId);
            setNewAssignment(prev => ({ ...prev, courseId: firstCourseId }));
            fetchAssignments(firstCourseId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setError('Failed to load courses');
      }
    };

    fetchCourses();
  }, []);

  // Fetch assignments when course changes
  const fetchAssignments = async (courseId) => {
    if (!courseId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('facultyToken');
      const response = await axios.get(
        `${apiConfig.API_BASE_URL}/api/faculty/courses/${courseId}/assessments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setAssignments(response.data.assessments || []);
        setShowDetailsModal(null); // Close modal if open
        setSubmissions([]); // Clear previous submissions
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch real submissions when details modal opens
  useEffect(() => {
    if (!showDetailsModal) {
      setSubmissions([]);
      return;
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('facultyToken');
        const response = await axios.get(
          `${apiConfig.API_BASE_URL}/api/faculty/assignments/${showDetailsModal}/submissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setSubmissions(response.data.submissions || []);
        } else {
          setError(response.data.error || 'Failed to load submissions');
        }
      } catch (err) {
        console.error('Fetch submissions error:', err);
        setError('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [showDetailsModal]);

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    setNewAssignment(prev => ({ ...prev, courseId }));
    fetchAssignments(courseId);
  };

  const handleFileChange = (e) => {
    setNewAssignment({ ...newAssignment, file: e.target.files[0] });
  };

  const handleSubmitAssignment = async () => {
    try {
      if (!newAssignment.title || !newAssignment.courseId || !newAssignment.totalMarks || !newAssignment.dueDate) {
        alert('Please fill in all required fields');
        return;
      }

      const marks = parseInt(newAssignment.totalMarks, 10);
      if (isNaN(marks) || marks <= 0) {
        alert('Total marks must be a positive number');
        return;
      }

      setLoading(true);
      const token = localStorage.getItem('facultyToken');

      const formData = new FormData();
      formData.append('title', newAssignment.title.trim());
      formData.append('description', newAssignment.description.trim() || '');
      formData.append('totalMarks', marks.toString());
      formData.append('dueDate', newAssignment.dueDate);

      if (newAssignment.file) {
        formData.append('assessmentPdf', newAssignment.file);
      }

      const response = await axios.post(
        `${apiConfig.API_BASE_URL}/api/faculty/courses/${newAssignment.courseId}/assessments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        alert('Assignment created successfully!');
        setShowAddModal(false);
        setNewAssignment({
          title: '',
          courseId: selectedCourseId,
          description: '',
          totalMarks: '',
          dueDate: '',
          file: null
        });
        fetchAssignments(selectedCourseId);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert(error.response?.data?.error || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  // Save marks & remarks for a submission
  const handleSaveEvaluation = async (submissionId, marks, remarks) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('facultyToken');

      const response = await axios.patch(
        `${apiConfig.API_BASE_URL}/api/faculty/submissions/${submissionId}`,
        { 
          marks: marks !== '' && marks !== null ? parseInt(marks, 10) : null,
          remarks: remarks || null 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Evaluation saved!');
        // Refresh submissions
        setSubmissions(prev => 
          prev.map(s => 
            s.id === submissionId 
              ? { 
                  ...s, 
                  marks: marks !== '' && marks !== null ? parseInt(marks, 10) : null,
                  remarks 
                } 
              : s
          )
        );
      }
    } catch (error) {
      console.error('Save evaluation error:', error);
      alert(error.response?.data?.error || 'Failed to save evaluation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-[#1e3a8a] text-white p-8 mb-8 mx-auto">
        <h1 className="text-3xl font-bold text-white">Assignment Management</h1>
        <p className="text-white mt-1 opacity-90">Create, assign, and evaluate student assignments</p>
      </div>

      {/* Course Selector */}
      <div className="mb-6 px-4 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
          <select
            value={selectedCourseId}
            onChange={handleCourseChange}
            className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Select Course --</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title || course.name}
              </option>
            ))}
          </select>
        </div>
        {/* Add New Assignment Button */}
        {selectedCourseId && (
          <div className="text-right">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add New Assignment
            </button>
          </div>
        )}
      </div>

      {/* Assignments List */}
      {selectedCourseId ? (
        <div className="grid gap-6 px-4 md:px-8 mb-12">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No assignments created for this course yet.
            </p>
          ) : (
            assignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6 cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-100 rounded-xl">
                        <FileText className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
                        <p className="text-indigo-600 font-medium mt-1">Course ID: {assignment.course_id}</p>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {assignment.description || 'No description provided'}
                        </p>
                        
                        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Due: {assignment.due_date}
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Marks: {assignment.total_marks}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {assignment.pdf_path && (
                      <a
                        href={`http://localhost:5000/uploads/${assignment.pdf_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    )}
                    <button
                      onClick={() => setShowDetailsModal(assignment.id)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">Please select a course to view or create assignments</p>
      )}

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
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title *</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  placeholder="e.g., Week-1 Test"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                <select 
                  value={newAssignment.courseId}
                  onChange={(e) => setNewAssignment({...newAssignment, courseId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name || course.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks *</label>
                  <input
                    type="number"
                    value={newAssignment.totalMarks}
                    onChange={(e) => setNewAssignment({...newAssignment, totalMarks: e.target.value})}
                    placeholder="e.g., 100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Assessment PDF</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 transition">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="mt-4"
                  />
                  {newAssignment.file && <p className="text-green-600 mt-2">File: {newAssignment.file.name}</p>}
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button 
                onClick={handleSubmitAssignment}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Details & Submissions Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b bg-[#1e3a8a] text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Assignment Details & Submissions</h2>
                <button onClick={() => setShowDetailsModal(null)} className="p-2 hover:bg-white/20 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {assignments.find(a => a.id === showDetailsModal)?.title || 'Assignment'}
              </h3>
              <p className="text-gray-600 mb-6">
                {assignments.find(a => a.id === showDetailsModal)?.description || 'No description'}
              </p>

              {loading ? (
                <p className="text-center text-gray-500 py-10">Loading submissions...</p>
              ) : submissions.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No submissions received yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
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
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">{sub.student_name || 'Unknown Student'}</p>
                              {/* <p className="text-xs text-gray-500">{sub.student_id || 'N/A'}</p> */}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {sub.submitted_at 
                              ? new Date(sub.submitted_at).toLocaleString('en-IN', { 
                                  dateStyle: 'medium', 
                                  timeStyle: 'short' 
                                }) 
                              : 'Not Submitted'}
                          </td>
                          <td className="px-6 py-4">
                            {sub.answer_pdf_path ? (
                              <a
                                href={`http://localhost:5000/uploads/${sub.answer_pdf_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                              >
                                <Download className="w-4 h-4" />
                                View PDF
                              </a>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              max={assignments.find(a => a.id === showDetailsModal)?.total_marks || 100}
                              value={sub.marks ?? ''}
                              onChange={(e) => {
                                const newMarks = e.target.value;
                                setSubmissions(prev => 
                                  prev.map(s => 
                                    s.id === sub.id ? { ...s, marks: newMarks } : s
                                  )
                                );
                              }}
                              className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter marks"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={sub.remarks || ''}
                              onChange={(e) => {
                                const newRemarks = e.target.value;
                                setSubmissions(prev => 
                                  prev.map(s => 
                                    s.id === sub.id ? { ...s, remarks: newRemarks } : s
                                  )
                                );
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Add remarks"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleSaveEvaluation(sub.id, sub.marks, sub.remarks)}
                              disabled={loading}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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