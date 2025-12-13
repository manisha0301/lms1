// src/pages/student/CourseDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, FileText, Calendar, Clock, CheckCircle, 
  Lock, CreditCard, Users, Video, BookOpen, Award
} from 'lucide-react';
import { useState } from 'react';

// Import local thumbnails
import oip from '../../assets/OIP.jpg';
import node from '../../assets/node.webp';
import vue from '../../assets/vue.webp';
import python from '../../assets/python.webp';
import java from '../../assets/java.webp';
import ml from '../../assets/ml.webp';

const thumbnailMap = {
  'react-101': oip,
  'node-201': node,
  'vue-301': vue,
  'python-401': python,
  'java-501': java,
  'ml-601': ml
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock: Check if registered
  const isRegistered = id === 'react-101' || id === 'vue-301'; // Only these are registered

  // Mock Course Data
  const course = {
    id,
    title: {
      'react-101': 'React Masterclass',
      'node-201': 'Node.js Advanced',
      'vue-301': 'Vue.js Essentials',
      'python-401': 'Python for Data Science',
      'java-501': 'Java Spring Boot',
      'ml-601': 'Machine Learning A-Z'
    }[id] || 'Unknown Course',
    instructor: 'John Doe',
    duration: '3 Months',
    price: '₹12,999',
    thumbnail: thumbnailMap[id] || oip,
    rating: 4.8,
    students: 1234,
    description: 'Master modern web development with hands-on projects, real-world scenarios, and expert guidance.',
    modules: [
      {
        id: 1,
        title: 'Module 1: Fundamentals',
        chapters: [
          { id: 1, title: 'Introduction to React', duration: '45 min', type: 'video', locked: !isRegistered },
          { id: 2, title: 'JSX & Components', duration: '60 min', type: 'video', locked: !isRegistered },
          { id: 3, title: 'State & Props', duration: '55 min', type: 'video', locked: !isRegistered },
          { id: 4, title: 'Quiz: Basics', type: 'quiz', locked: !isRegistered }
        ]
      },
      {
        id: 2,
        title: 'Module 2: Advanced Concepts',
        chapters: [
          { id: 5, title: 'Hooks Deep Dive', duration: '70 min', type: 'video', locked: !isRegistered },
          { id: 6, title: 'Context API', duration: '50 min', type: 'video', locked: !isRegistered },
          { id: 7, title: 'Assignment: Todo App', type: 'assignment', locked: !isRegistered }
        ]
      }
    ],
    liveClasses: [
      { date: '2025-11-20', time: '7:00 PM', topic: 'React Hooks Live', instructor: 'John Doe' },
      { date: '2025-11-27', time: '7:00 PM', topic: 'Performance Optimization', instructor: 'John Doe' }
    ],
    examLink: isRegistered ? 'https://exam.kristellar.com/react-final' : null,
    notes: isRegistered ? ['Module1.pdf', 'Hooks-Cheatsheet.pdf'] : []
  };

  // Registration Flow States
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const availableSlots = [
    { date: '2025-12-01', time: '10:00 AM - 1:00 PM' },
    { date: '2025-12-01', time: '2:00 PM - 5:00 PM' },
    { date: '2025-12-02', time: '10:00 AM - 1:00 PM' }
  ];

  const handleRegister = () => {
    setShowSlotModal(true);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowSlotModal(false);
    setShowPayment(true);
  };

  const handlePayment = () => {
    alert('Payment Successful! You are now registered.');
    setShowPayment(false);
    // In real app: update registration status
    navigate(0); // Refresh to show registered view
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Course Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
          >
            Back to Courses
          </button>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.students} students</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {course.rating} Rating</span>
              </div>
            </div>
            <div className="flex justify-center">
              <img src={course.thumbnail} alt={course.title} className="w-full max-w-sm rounded-xl shadow-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Registration or Content */}
            {!isRegistered ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">Not Registered Yet</h2>
                <div className="space-y-4">
                  <button
                    onClick={handleRegister}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" /> Register Now - {course.price}
                  </button>
                  <p className="text-sm text-gray-600 text-center">
                    Choose your batch, slot, and complete payment to get full access.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Course Content */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" /> Course Content
                  </h2>
                  <div className="space-y-6">
                    {course.modules.map(module => (
                      <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 font-medium text-gray-700">
                          {module.title}
                        </div>
                        <div className="divide-y divide-gray-200">
                          {module.chapters.map(chapter => (
                            <div
                              key={chapter.id}
                              className={`px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition ${
                                chapter.locked ? 'opacity-60' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {chapter.type === 'video' && <Video className="w-5 h-5 text-blue-600" />}
                                {chapter.type === 'quiz' && <Award className="w-5 h-5 text-green-600" />}
                                {chapter.type === 'assignment' && <FileText className="w-5 h-5 text-orange-600" />}
                                <span className="font-medium">{chapter.title}</span>
                                {chapter.duration && <span className="text-sm text-gray-500">{chapter.duration}</span>}
                              </div>
                              {chapter.locked ? (
                                <Lock className="w-5 h-5 text-gray-400" />
                              ) : (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Classes */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-600" /> Live Classes
                  </h2>
                  <div className="space-y-3">
                    {course.liveClasses.map((cls, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium">{cls.topic}</p>
                          <p className="text-sm text-gray-600">{cls.instructor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{cls.date}</p>
                          <p className="text-xs text-gray-600">{cls.time}</p>
                        </div>
                        <button className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 transition">
                          Join Live
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exam & Assignments */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" /> Final Exam
                    </h3>
                    <a
                      href={course.examLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition"
                    >
                      Start Exam
                    </a>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-600" /> Assignments
                    </h3>
                    <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition">
                      View Assignments
                    </button>
                  </div>
                </div>

                {/* Notes */}
                {course.notes.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" /> Download Notes
                    </h3>
                    <div className="space-y-2">
                      {course.notes.map((note, i) => (
                        <a
                          key={i}
                          href="#"
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                        >
                          <span>{note}</span>
                          <Play className="w-4 h-4 text-gray-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Course Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Instructor</span>
                  <span className="font-medium">{course.instructor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium text-green-600">{course.price}</span>
                </div>
              </div>
            </div>

            {isRegistered && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
                <p className="font-semibold text-green-800">You are enrolled!</p>
                <p className="text-sm text-green-700 mt-1">Access all content below.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slot Selection Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Choose Your Batch Slot</h3>
            <div className="space-y-3 mb-6">
              {availableSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => handleSlotSelect(slot)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
                >
                  <p className="font-medium">{slot.date}</p>
                  <p className="text-sm text-gray-600">{slot.time}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSlotModal(false)}
              className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Course: <span className="font-medium">{course.title}</span></p>
              <p className="text-sm text-gray-600">Slot: <span className="font-medium">{selectedSlot.date} {selectedSlot.time}</span></p>
              <p className="text-lg font-bold text-green-600 mt-3">Total: {course.price}</p>
            </div>
            <button
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 transition"
            >
              Pay Now
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}