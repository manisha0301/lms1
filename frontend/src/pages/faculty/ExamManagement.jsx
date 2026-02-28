// src/pages/faculty/ExamManagement.jsx
import { useState, useEffect } from 'react';
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
import axios from 'axios';
import apiConfig from '../../config/apiConfig';

export default function ExamManagement() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [isAddingResult, setIsAddingResult] = useState(false);
  const [editedResults, setEditedResults] = useState({});
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [addResultStudent, setAddResultStudent] = useState('');
  const [addResultMarks, setAddResultMarks] = useState('');
  const [addResultRemarks, setAddResultRemarks] = useState('');
  const [editMarks, setEditMarks] = useState('');
  const [newExamForm, setNewExamForm] = useState({
    topic: '',
    courseId: '',
    link: '',
    totalMarks: '',
    dateTimeSlots: [{ date: '', startTime: '', endTime: '' }]
  });
  const [submissions, setSubmissions] = useState([]); // ← full submissions data
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Fetch faculty's courses and exams on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const coursesRes = await axios.get(`${apiConfig.API_BASE_URL}/api/faculty/my-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (coursesRes.data.success) {
        setCourses(coursesRes.data.courses || []);
      }
      const examsRes = await axios.get(`${apiConfig.API_BASE_URL}/api/faculty/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (examsRes.data.success) {
        setExams(examsRes.data.exams || []);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
      setLoadingCourses(false);
    }
  };

  // Fetch real submissions when modal opens
  useEffect(() => {
    if (!selectedExam) {
      setSubmissions([]);
      return;
    }

    const fetchSubmittedStudents = async () => {
      setLoadingStudents(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${apiConfig.API_BASE_URL}/api/faculty/exams/${selectedExam}/submissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setSubmissions(res.data.submissions || []);
        }
      } catch (err) {
        console.error('Failed to load submissions:', err);
        setSubmissions([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchSubmittedStudents();
  }, [selectedExam]);

  // Save marks and remarks to DB
  const handleSaveEvaluation = async (submissionId, marks, remarks) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `${apiConfig.API_BASE_URL}/api/faculty/exams/submissions/${submissionId}`,
        { 
          marks: marks ? parseInt(marks) : null,
          remarks: remarks || null 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert('Evaluation saved successfully!');
        // Update local state
        setSubmissions(prev =>
          prev.map(sub =>
            sub.id === submissionId ? { ...sub, marks, remarks } : sub
          )
        );
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving evaluation');
      console.error(err);
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddResultClick = () => {
    setIsAddingResult(true);
  };

  const handleSaveAddResult = () => {
    if (!addResultStudent || addResultMarks === '' || isNaN(addResultMarks) || addResultMarks < 0 || addResultMarks > 100) {
      alert('Please select a student and enter valid marks between 0 and 100');
      return;
    }

    // You can add real save logic here later if needed
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

  const handleAddExamClick = () => {
    setIsAddingExam(true);
  };
  
  const handleExamFormChange = (field, value) => {
    setNewExamForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateTimeSlotChange = (index, field, value) => {
    const updatedSlots = [...newExamForm.dateTimeSlots];
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value
    };
    setNewExamForm(prev => ({
      ...prev,
      dateTimeSlots: updatedSlots
    }));
  };

  const handleAddDateTimeSlot = () => {
    setNewExamForm(prev => ({
      ...prev,
      dateTimeSlots: [...prev.dateTimeSlots, { date: '', startTime: '', endTime: '' }]
    }));
  };

  const handleRemoveDateTimeSlot = (index) => {
    setNewExamForm(prev => ({
      ...prev,
      dateTimeSlots: prev.dateTimeSlots.filter((_, i) => i !== index)
    }));
  };

  const handleSaveExam = async () => {
    if (!newExamForm.topic || !newExamForm.courseId || !newExamForm.link || !newExamForm.totalMarks) {
      alert('Please fill in all required fields: Topic, Course, Exam Link, and Total Marks');
      return;
    }

    if (isNaN(newExamForm.totalMarks) || newExamForm.totalMarks <= 0) {
      alert('Total marks must be a valid positive number');
      return;
    }

    if (newExamForm.dateTimeSlots.some(slot => !slot.date.trim() || !slot.startTime.trim() || !slot.endTime.trim())) {
      alert('Please fill in all date, start time, and end time fields or remove empty slots');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        topic: newExamForm.topic,
        courseId: newExamForm.courseId,
        examLink: newExamForm.link,
        totalMarks: parseInt(newExamForm.totalMarks),
        slots: newExamForm.dateTimeSlots
          .filter(s => s.date.trim() && s.startTime.trim() && s.endTime.trim())
          .map(s => ({
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime
          }))
      };

      const res = await axios.post(
        `${apiConfig.API_BASE_URL}/api/faculty/exams`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert('Exam added successfully!');
        setIsAddingExam(false);
        setNewExamForm({
          topic: '',
          courseId: '',
          link: '',
          totalMarks: '',
          dateTimeSlots: [{ date: '', startTime: '', endTime: '' }]
        });
        fetchAllData();
      }
    } catch (err) {
      alert('Failed to create exam');
      console.error(err);
    }
  };

  const handleCancelAddExam = () => {
    setIsAddingExam(false);
    setNewExamForm({
      topic: '',
      course: '',
      link: '',
      totalMarks: '',
      dateTimeSlots: [{ date: '', time: '' }]
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
          </div>
          <button onClick={() => setIsAddingExam(true)} className="flex items-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition">
            <Plus className="w-5 h-5" />
            Add New Exam
          </button>
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid gap-6 mx-8">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-12 text-gray-600 bg-white rounded-2xl shadow-lg">
            No exams created yet
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{exam.topic}</h3>
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

                    {exam.exam_link ? (
                      <a href={exam.exam_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#1e3a8a] hover:text-[#1e3a8a] font-medium text-sm">
                        Open Exam Link
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Link not provided</span>
                    )}
                  </div>

                  <div className="text-center lg:text-right">
                    <div className="grid grid-cols-3 gap-6 mb-5">
                      <div>
                        <p className="text-3xl font-bold text-green-600">{exam.appeared || 0}</p>
                        <p className="text-sm text-gray-600">Appeared</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-gray-800">{exam.totalStudents || 0}</p>
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
          ))
        )}
      </div>

      {/* Student Results Modal */}
      {selectedExam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b bg-[#1e3a8a] text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {exams.find(e => e.id === selectedExam)?.topic || 'Exam Submissions'}
                  </h2>
                  <p className="text-indigo-100">
                    {exams.find(e => e.id === selectedExam)?.course || 'Course'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedExam(null)}
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
            </div>

            {/* Results Table */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingStudents ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg">Loading submissions...</p>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-2xl font-semibold text-gray-600 mb-4">
                    No Submissions Yet
                  </p>
                  <p className="text-gray-500">
                    No students have submitted answers for this exam.
                  </p>
                </div>
              ) : (
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4">Student ID</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Answer PDF</th>
                      <th className="px-6 py-4">Full Marks</th>
                      <th className="px-6 py-4">Marks Obtained</th>
                      <th className="px-6 py-4">Remarks</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {submissions
                      .filter(sub => 
                        (sub.student_name?.toLowerCase() || '').includes(studentSearch.toLowerCase()) ||
                        (sub.student_code?.toLowerCase() || '').includes(studentSearch.toLowerCase())
                      )
                      .map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">{sub.student_code || 'N/A'}</td>
                          <td className="px-6 py-4">{sub.student_name || 'Unknown'}</td>
                          <td className="px-6 py-4">
                            {sub.answer_pdf_path ? (
                              <a
                                href={`http://localhost:5000/uploads/${sub.answer_pdf_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline flex items-center gap-2"
                              >
                                <Download className="w-4 h-4" />
                                View PDF
                              </a>
                            ) : (
                              <span className="text-gray-500">Not uploaded</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium">{sub.full_marks || '-'}</td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              max={sub.full_marks || 100}
                              value={sub.marks ?? ''}
                              onChange={(e) => {
                                const newMarks = e.target.value;
                                setSubmissions(prev =>
                                  prev.map(s =>
                                    s.id === sub.id ? { ...s, marks: newMarks } : s
                                  )
                                );
                              }}
                              className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-indigo-500 text-sm"
                              placeholder="Marks"
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
                              className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-indigo-500 text-sm"
                              placeholder="Remarks"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleSaveEvaluation(sub.id, sub.marks, sub.remarks)}
                              className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </p>
              <button className="flex items-center gap-2 px-6 py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e3a8a]">
                <Download className="w-4 h-4" />
                Export Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {isAddingExam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b bg-[#1e3a8a] text-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Exam</h2>
              <button
                onClick={handleCancelAddExam}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form className="space-y-6">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                  {loadingCourses ? (
                    <p className="text-gray-500">Loading your courses...</p>
                  ) : (
                    <select
                      value={newExamForm.courseId}
                      onChange={(e) => handleExamFormChange('courseId', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select a course...</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.name} ({course.type})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date/Time Slots *</label>
                  <div className="space-y-3">
                    {newExamForm.dateTimeSlots.map((slot, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="date"
                          value={slot.date}
                          onChange={(e) => handleDateTimeSlotChange(index, 'date', e.target.value)}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => handleDateTimeSlotChange(index, 'startTime', e.target.value)}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          placeholder="Start Time"
                        />
                        <span className="self-center">to</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => handleDateTimeSlotChange(index, 'endTime', e.target.value)}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                          placeholder="End Time"
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