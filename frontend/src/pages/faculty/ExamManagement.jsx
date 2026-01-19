// src/pages/faculty/ExamManagement.jsx
import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Link2, 
  Users, 
  Download,
  X,
  Clock,
  Edit2,
  Check,
  X as XIcon,
  Trash2
} from 'lucide-react';

export default function ExamManagement() {
  const [exams, setExams] = useState([
    {
      id: 1,
      topic: "Mid-Term Examination",
      course: ".Advanced Node.js (CSE-405)",
      link: "https://exam.cybernetics.com/midterm-cse405",
      status: "Approved",
      dateTimeSlots: [
        "2025-11-25 09:00 AM - 11:00 AM",
        "2025-11-25 02:00 PM - 04:00 PM"
      ],
      totalStudents: 48,
      appeared: 45,
      pending: 3,
      resultDeclared: true
    },
    {
      id: 2,
      topic: "Quiz 2 - REST APIs",
      course: "Advanced Node.js (CSE-405)",
      link: "https://exam.cybernetics.com/quiz2-cse405",
      status: "Approved",
      dateTimeSlots: ["05 Dec 2025, 10:00 AM"],
      totalStudents: 48,
      appeared: 31,
      pending: 17,
      resultDeclared: false
    },
    {
      id: 3,
      topic: "Final Project Viva",
      course: "Machine Learning A-Z (CSE-601)",
      link: null,
      status: "Approved",
      dateTimeSlots: ["15 Dec 2025, 10:00 AM"],
      totalStudents: 36,
      appeared: 36,
      pending: 0,
      resultDeclared: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedExam, setSelectedExam] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editMarks, setEditMarks] = useState('');
  const [editedResults, setEditedResults] = useState({});
  const [isAddingResult, setIsAddingResult] = useState(false);
  const [addResultStudent, setAddResultStudent] = useState('');
  const [addResultMarks, setAddResultMarks] = useState('');
  const [addResultRemarks, setAddResultRemarks] = useState('');
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [newExamForm, setNewExamForm] = useState({
    topic: '',
    course: '',
    link: '',
    totalMarks: '',
    dateTimeSlots: ['']
  });

  const availableCourses = [
    'Advanced Node.js (CSE-405)',
    'Machine Learning A-Z (CSE-601)',
    'Web Development Basics (CSE-101)',
    'Database Design (CSE-201)',
    'Cloud Computing (CSE-501)'
  ];

  // Mock student results
  const examResults = {
    1: [
      { id: "STU21001", name: "Aarav Sharma", slot: "2025-11-25 09:00 AM - 11:00 AM", marks: 78 },
      { id: "STU21002", name: "Diya Patel", slot: "2025-11-25 09:00 AM - 11:00 AM", marks: 85 },
      { id: "STU21003", name: "Rohan Verma", slot: "2025-11-25 02:00 PM - 04:00 PM", marks: 62 },
      { id: "STU21004", name: "Priya Singh", slot: "2025-11-25 09:00 AM - 11:00 AM", marks: 90 },
      { id: "STU21005", name: "Vikram Kumar", slot: "2025-11-25 02:00 PM - 04:00 PM", marks: 88 }
    ],
    2: null, // Result not declared
    3: null  // Result not declared
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || exam.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const currentStudents = selectedExam ? examResults[selectedExam] || [] : [];
  const resultDeclared = selectedExam ? exams.find(e => e.id === selectedExam)?.resultDeclared : false;

  const filteredStudents = currentStudents.filter(student =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleEditClick = (student) => {
    setEditingStudentId(student.id);
    setEditMarks(editedResults[student.id]?.marks || student.marks || '');
  };

  const handleSaveMarks = (studentId) => {
    if (editMarks === '' || isNaN(editMarks) || editMarks < 0 || editMarks > 100) {
      alert('Please enter valid marks between 0 and 100');
      return;
    }
    setEditedResults(prev => ({
      ...prev,
      [studentId]: {
        marks: parseInt(editMarks),
        remarks: editedResults[studentId]?.remarks || ''
      }
    }));
    setEditingStudentId(null);
    setEditMarks('');
  };

  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setEditMarks('');
  };

  const getDisplayMarks = (student) => {
    return editedResults[student.id]?.marks !== undefined 
      ? editedResults[student.id].marks 
      : student.marks;
  };

  const getAllStudents = () => {
    const allStudents = [];
    Object.values(examResults).forEach(students => {
      if (students) {
        allStudents.push(...students);
      }
    });
    return allStudents;
  };

  const getAvailableStudents = () => {
    const currentExamStudents = currentStudents.map(s => s.id);
    const allStudents = getAllStudents();
    return allStudents.filter(s => !currentExamStudents.includes(s.id));
  };

  const handleAddResultClick = () => {
    setIsAddingResult(true);
  };

  const handleSaveAddResult = () => {
    if (!addResultStudent || addResultMarks === '' || isNaN(addResultMarks) || addResultMarks < 0 || addResultMarks > 100) {
      alert('Please select a student and enter valid marks between 0 and 100');
      return;
    }

    const selectedStudent = getAllStudents().find(s => s.id === addResultStudent);
    if (selectedStudent) {
      setEditedResults(prev => ({
        ...prev,
        [addResultStudent]: {
          marks: parseInt(addResultMarks),
          remarks: addResultRemarks
        }
      }));
    }

    setIsAddingResult(false);
    setAddResultStudent('');
    setAddResultMarks('');
    setAddResultRemarks('');
  };

  const handleCancelAddResult = () => {
    setIsAddingResult(false);
    setAddResultStudent('');
    setAddResultMarks('');
    setAddResultRemarks('');
  };

  const areAllResultsAnnounced = () => {
    if (!selectedExam) return false;
    const examStudents = currentStudents || [];
    return examStudents.length > 0 && getAvailableStudents().length === 0;
  };

  const handleAddExamClick = () => {
    setIsAddingExam(true);
  };

  const handleExamFormChange = (field, value) => {
    setNewExamForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateTimeSlotChange = (index, value) => {
    const updatedSlots = [...newExamForm.dateTimeSlots];
    updatedSlots[index] = value;
    setNewExamForm(prev => ({
      ...prev,
      dateTimeSlots: updatedSlots
    }));
  };

  const handleAddDateTimeSlot = () => {
    setNewExamForm(prev => ({
      ...prev,
      dateTimeSlots: [...prev.dateTimeSlots, '']
    }));
  };

  const handleRemoveDateTimeSlot = (index) => {
    setNewExamForm(prev => ({
      ...prev,
      dateTimeSlots: prev.dateTimeSlots.filter((_, i) => i !== index)
    }));
  };

  const handleSaveExam = () => {
    if (!newExamForm.topic || !newExamForm.course || !newExamForm.link || !newExamForm.totalMarks) {
      alert('Please fill in all required fields: Topic, Course, Exam Link, and Total Marks');
      return;
    }

    if (isNaN(newExamForm.totalMarks) || newExamForm.totalMarks <= 0) {
      alert('Total marks must be a valid positive number');
      return;
    }

    if (newExamForm.dateTimeSlots.some(slot => !slot.trim())) {
      alert('Please fill in all date/time slots or remove empty ones');
      return;
    }

    const newExam = {
      id: Math.max(...exams.map(e => e.id), 0) + 1,
      topic: newExamForm.topic,
      course: newExamForm.course,
      link: newExamForm.link,
      status: 'Approved',
      dateTimeSlots: newExamForm.dateTimeSlots.filter(s => s.trim()),
      totalMarks: parseInt(newExamForm.totalMarks),
      totalStudents: 0,
      appeared: 0,
      pending: 0,
      resultDeclared: false
    };

    setExams([...exams, newExam]);
    setIsAddingExam(false);
    setNewExamForm({
      topic: '',
      course: '',
      link: '',
      totalMarks: '',
      dateTimeSlots: ['']
    });
    alert('Exam added successfully!');
  };

  const handleCancelAddExam = () => {
    setIsAddingExam(false);
    setNewExamForm({
      topic: '',
      course: '',
      link: '',
      totalMarks: '',
      dateTimeSlots: ['']
    });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-[#1e3a8a] text-white p-8 mb-8 mx-auto">
        <h1 className="text-3xl font-bold text-white">Exam Management</h1>
        <p className="text-white mt-1 opacity-90">View exam details and student results</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 mx-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by course name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:w-96"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <button onClick={handleAddExamClick} className="flex items-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition">
            <Plus className="w-5 h-5" />
            Add New Exam
          </button>
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid gap-6 mx-8">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{exam.topic}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      exam.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      exam.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {exam.status}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-[#1e3a8a] mb-4">{exam.course}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {exam.dateTimeSlots.map((slot, i) => (
                      <span key={i} className="flex items-center gap-1 text-sm bg-indigo-50 text-[#1e3a8a] px-3 py-1.5 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        {slot}
                      </span>
                    ))}
                  </div>

                  {exam.link ? (
                    <a href={exam.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#1e3a8a] hover:text-[#1e3a8a] font-medium text-sm">
                      {/* <Link2 className="w-4 h-4" /> */}
                      Open Exam Link
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500 italic">Link not provided</span>
                  )}
                </div>

                <div className="text-center lg:text-right">
                  <div className="grid grid-cols-3 gap-6 mb-5">
                    <div>
                      <p className="text-3xl font-bold text-green-600">{exam.appeared}</p>
                      <p className="text-sm text-gray-600">Appeared</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-orange-600">{exam.pending}</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-800">{exam.totalStudents}</p>
                      <p className="text-sm text-gray-600">Enrolled</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedExam(exam.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1e3a8a] text-white rounded-lg text-sm font-medium transition hover:shadow-lg"
                  >
                    <Users className="w-4 h-4" />
                    View Students
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student Results Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b bg-[#1e3a8a] text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {exams.find(e => e.id === selectedExam)?.topic}
                  </h2>
                  <p className="text-indigo-100">
                    {exams.find(e => e.id === selectedExam)?.course}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedExam(null);
                    setStudentSearch('');
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-6 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or student ID..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                        onClick={handleAddResultClick}
                        disabled={areAllResultsAnnounced()}
                        title={areAllResultsAnnounced() ? "All student results have been added" : "Add a new student result"}
                        className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition ${
                          areAllResultsAnnounced()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#1e3a8a] text-white hover:shadow-lg'
                        }`}
                      >
                        <Plus className="w-5 h-5" />
                        Add Result
                      </button>
            </div>

            {/* Results Table */}
            <div className="flex-1 overflow-y-auto">
              {resultDeclared ? (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentStudents
                      .filter(s => 
                        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        s.id.toLowerCase().includes(studentSearch.toLowerCase())
                      )
                      .map((student, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                          <td className="px-6 py-4">
                            {editingStudentId === student.id ? (
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={editMarks}
                                onChange={(e) => setEditMarks(e.target.value)}
                                className="w-24 px-3 py-2 border border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                autoFocus
                              />
                            ) : (
                              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg text-lg">
                                {getDisplayMarks(student)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingStudentId === student.id ? (
                              <input
                                type="text"
                                value={editedResults[student.id]?.remarks || ''}
                                onChange={(e) => setEditedResults(prev => ({
                                  ...prev,
                                  [student.id]: {
                                    ...prev[student.id],
                                    remarks: e.target.value
                                  }
                                }))}
                                placeholder="Enter remarks..."
                                className="w-full px-3 py-2 border border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                              />
                            ) : (
                              <span className="text-sm text-gray-600">
                                {editedResults[student.id]?.remarks || '-'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingStudentId === student.id ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveMarks(student.id)}
                                  className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                  title="Save"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                  title="Cancel"
                                >
                                  <XIcon className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEditClick(student)}
                                className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                                title="Edit marks"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                  {isAddingResult ? (
                    <div className="bg-gray-50 border-2 border-indigo-300 rounded-xl p-12 max-w-md mx-auto">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Add Student Result</h3>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                        <select
                          value={addResultStudent}
                          onChange={(e) => setAddResultStudent(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Choose a student...</option>
                          {getAvailableStudents().map(student => (
                            <option key={student.id} value={student.id}>
                              {student.name} ({student.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter Marks Obtained</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          value={addResultMarks}
                          onChange={(e) => setAddResultMarks(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (Optional)</label>
                        <textarea
                          placeholder="Add any remarks or comments..."
                          value={addResultRemarks}
                          onChange={(e) => setAddResultRemarks(e.target.value)}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveAddResult}
                          className="flex-1 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Save Result
                        </button>
                        <button
                          onClick={handleCancelAddResult}
                          className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition flex items-center justify-center gap-2"
                        >
                          <XIcon className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-12">
                      <p className="text-2xl font-semibold text-gray-600 mb-6">
                        Result Not Announced Yet
                      </p>
                      <p className="text-gray-500">
                        The results for this exam will be published soon.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {resultDeclared 
                  ? `Showing ${filteredStudents.length} students with declared results`
                  : "Results are being processed"
                }
              </p>
              {resultDeclared && (
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e3a8a]">
                  <Download className="w-4 h-4" />
                  Export Results
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {isAddingExam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b bg-[#1e3a8a] text-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Exam</h2>
              <button
                onClick={handleCancelAddExam}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form className="space-y-6">
                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
                  <input
                    type="text"
                    value={newExamForm.topic}
                    onChange={(e) => handleExamFormChange('topic', e.target.value)}
                    placeholder="e.g., Mid-Term Examination"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                  <select
                    value={newExamForm.course}
                    onChange={(e) => handleExamFormChange('course', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select a course...</option>
                    {availableCourses.map(course => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Link *</label>
                  <input
                    type="url"
                    value={newExamForm.link}
                    onChange={(e) => handleExamFormChange('link', e.target.value)}
                    placeholder="https://exam.example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Total Marks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks *</label>
                  <input
                    type="number"
                    value={newExamForm.totalMarks}
                    onChange={(e) => handleExamFormChange('totalMarks', e.target.value)}
                    placeholder="e.g., 100"
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Date/Time Slots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date/Time Slots *</label>
                  <div className="space-y-3">
                    {newExamForm.dateTimeSlots.map((slot, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={slot}
                          onChange={(e) => handleDateTimeSlotChange(index, e.target.value)}
                          placeholder="e.g., 2025-12-15 10:00 AM - 12:00 PM"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                        {newExamForm.dateTimeSlots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDateTimeSlot(index)}
                            className="p-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                            title="Remove slot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddDateTimeSlot}
                      className="text-sm px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium"
                    >
                      + Add Another Slot
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={handleCancelAddExam}
                className="px-6 py-2.5 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExam}
                className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Exam
              </button>
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
