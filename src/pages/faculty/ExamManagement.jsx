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
  Clock
} from 'lucide-react';

export default function ExamManagement() {
  const [exams] = useState([
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Management</h1>
        <p className="text-gray-600">View exam details and student results</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
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
          <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition">
            <Plus className="w-5 h-5" />
            Add New Exam
          </button>
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid gap-6">
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
                  <p className="text-lg font-medium text-indigo-600 mb-4">{exam.course}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {exam.dateTimeSlots.map((slot, i) => (
                      <span key={i} className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        {slot}
                      </span>
                    ))}
                  </div>

                  {exam.link ? (
                    <a href={exam.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                      <Link2 className="w-4 h-4" />
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
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition"
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
            <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
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
            <div className="p-6 border-b bg-gray-50">
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
            <div className="flex-1 overflow-y-auto">
              {resultDeclared ? (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
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
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">
                              <Clock className="w-3 h-3" />
                              {student.slot}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg text-lg">
                              {student.marks}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-12">
                    <p className="text-2xl font-semibold text-gray-600">
                      Result Not Announced Yet
                    </p>
                    <p className="text-gray-500 mt-2">
                      The results for this exam will be published soon.
                    </p>
                  </div>
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
                <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  <Download className="w-4 h-4" />
                  Export Results
                </button>
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








// // src/pages/faculty/ExamManagement.jsx
// import { useState } from 'react';
// import { 
//   Plus, 
//   Search, 
//   Filter, 
//   Calendar, 
//   Link2, 
//   Users, 
//   CheckCircle, 
//   XCircle,
//   Clock,
//   Edit,
//   Eye,
//   Download,
//   ChevronDown
// } from 'lucide-react';

// export default function ExamManagement() {
//   // MOCK DATA
//   const [exams, setExams] = useState([
//     {
//       id: 1,
//       topic: "Mid-Term Examination",
//       course: "Advanced Node.js (CSE-405)",
//       link: "https://exam.cybernetics.com/midterm-cse405",
//       status: "Approved",
//       dateTimeSlots: [
//         "2025-11-25 09:00 AM - 11:00 AM",
//         "2025-11-25 02:00 PM - 04:00 PM"
//       ],
//       totalStudents: 48,
//       appeared: 45,
//       pending: 3
//     },
//     {
//       id: 2,
//       topic: "Quiz 2 - REST APIs",
//       course: "Advanced Node.js (CSE-405)",
//       link: "https://exam.cybernetics.com/quiz2-cse405",
//       status: "Pending",
//       dateTimeSlots: ["2025 Dec 2025, 10:00 AM"],
//       totalStudents: 48,
//       appeared: 31,
//       pending: 17
//     },
//     {
//       id: 3,
//       topic: "Final Project Viva",
//       course: "Machine Learning A-Z (CSE-601)",
//       link: null,
//       status: "Draft",
//       dateTimeSlots: ["15 Dec 2025 (Schedule Pending)"],
//       totalStudents: 36,
//       appeared: 0,
//       pending: 36
//     }
//   ]);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [showAddExam, setShowAddExam] = useState(false);
//   const [selectedExam, setSelectedExam] = useState(null);

//   // Form States for New Exam
//   const [newExam, setNewExam] = useState({
//     topic: '',
//     course: 'Advanced Node.js (CSE-405)',
//     link: '',
//     slots: ['']
//   });

//   const addSlot = () => {
//     setNewExam({ ...newExam, slots: [...newExam.slots, ''] });
//   };

//   const updateSlot = (index, value) => {
//     const updated = [...newExam.slots];
//     updated[index] = value;
//     setNewExam({ ...newExam, slots: updated });
//   };

//   const filteredExams = exams.filter(exam => {
//     const matchesSearch = exam.course.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter = filterStatus === 'all' || exam.status.toLowerCase() === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Exam Management</h1>
//         <p className="text-gray-600">Create, manage exams and view student submissions</p>
//       </div>

//       {/* Top Controls */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//           {/* Search & Filter */}
//           <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search exam topic..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:w-80"
//               />
//             </div>

//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="all">All Status</option>
//               <option value="approved">Approved</option>
//               <option value="pending">Pending</option>
//               <option value="draft">Draft</option>
//             </select>
//           </div>

//           {/* Add New Exam Button */}
//           <button
//             onClick={() => setShowAddExam(true)}
//             className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition"
//           >
//             <Plus className="w-5 h-5" />
//             Add New Exam
//           </button>
//         </div>
//       </div>

//       {/* Exams List */}
//       <div className="grid gap-6">
//         {filteredExams.map((exam) => (
//           <div key={exam.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             <div className="p-6">
//               <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-4">
//                     <h3 className="text-xl font-bold text-gray-800">{exam.topic}</h3>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       exam.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                       exam.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-gray-100 text-gray-600'
//                     }`}>
//                       {exam.status}
//                     </span>
//                   </div>
//                   <p className="text-gray-600 mt-1">{exam.course}</p>

//                   {/* Date & Time Slots */}
//                   <div className="mt-4 flex flex-wrap gap-2">
//                     {exam.dateTimeSlots.map((slot, i) => (
//                       <span key={i} className="flex items-center gap-2 text-sm bg-indigo-50 text-indigo-700 px-3 py-1 px-3 rounded-lg">
//                         <Calendar className="w-4 h-4" />
//                         {slot}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Exam Link */}
//                   {exam.link ? (
//                     <a
//                       href={exam.link}
//                       target="_blank"
//                       className="mt-3 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
//                     >
//                       <Link2 className="w-4 h-4" />
//                       Open Exam Link
//                     </a>
//                   ) : (
//                     <p className="mt-3 text-sm text-gray-500 italic">Link not set</p>
//                   )}
//                 </div>

//                 {/* Stats & Actions */}
//                 <div className="text-right">
//                   <div className="grid grid-cols-3 gap-4 text-center mb-4">
//                     <div>
//                       <p className="text-2xl font-bold text-gray-800">{exam.appeared}</p>
//                       <p className="text-xs text-gray-600">Appeared</p>
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-orange-600">{exam.pending}</p>
//                       <p className="text-xs text-gray-600">Pending</p>
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-gray-800">{exam.totalStudents}</p>
//                       <p className="text-xs text-gray-600">Total</p>
//                     </div>
//                   </div>

//                   <div className="flex gap-2 justify-end">
//                     <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-2">
//                       <Users className="w-4 h-4" />
//                       View Students
//                     </button>
//                     <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2">
//                       <Download className="w-4 h-4" />
//                       Results
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add New Exam Modal */}
//       {showAddExam && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
//             <div className="p-6 border-b">
//               <h2 className="text-2xl font-bold text-gray-800">Create New Exam</h2>
//             </div>

//             <div className="p-6 space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Exam Topic</label>
//                 <input
//                   type="text"
//                   value={newExam.topic}
//                   onChange={(e) => setNewExam({...newExam, topic: e.target.value})}
//                   placeholder="e.g., Mid-Term Examination"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
//                 <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
//                   <option>Advanced Node.js (CSE-405)</option>
//                   <option>Machine Learning A-Z (CSE-601)</option>
//                   <option>Data Structures (CSE-201)</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Exam Link (Optional for now)</label>
//                 <input
//                   type="url"
//                   value={newExam.link}
//                   onChange={(e) => setNewExam({...newExam, link: e.target.value})}
//                   placeholder="https://exam.platform.com/..."
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Date & Time Slots
//                 </label>
//                 {newExam.slots.map((slot, index) => (
//                   <div key={index} className="flex gap-2 mb-2">
//                     <input
//                       type="text"
//                       value={slot}
//                       onChange={(e) => updateSlot(index, e.target.value)}
//                       placeholder="e.g., 25 Nov 2025, 10:00 AM - 12:00 PM"
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
//                     />
//                     {index === newExam.slots.length - 1 && (
//                       <button
//                         onClick={addSlot}
//                         className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
//                       >
//                         <Plus className="w-5 h-5" />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="p-6 border-t flex justify-end gap-3">
//               <button
//                 onClick={() => setShowAddExam(false)}
//                 className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg">
//                 Submit for Approval
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="mt-12 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
//         © 2025 Cybernetics LMS • Faculty Portal
//       </footer>
//     </div>
//   );
// }