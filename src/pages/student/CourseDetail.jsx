// src/pages/student/CourseDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, FileText, Calendar, Clock, CheckCircle, 
  Lock, CreditCard, Users, Video, BookOpen, Award,
  Download
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
    <div className="min-h-screen bg-white">
      {/* Course Header */}
      <div className="bg-[#1e3a8a] text-white">
        <div className="mx-auto px-20 py-12">
          <div className="grid md:grid-cols-3 gap-10 items-center">
            {/* Left: Title & Details */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              
              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-3xl">
                {course.description}
              </p>

              {/* Course Meta Info */}
              {!isRegistered && (
              <div className="flex flex-wrap gap-8 text-blue-50">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-80">Enrolled Students</p>
                    <p className="text-xl font-semibold">{course.students}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-80">Duration</p>
                    <p className="text-xl font-semibold">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-80">Rating</p>
                    <p className="text-xl font-semibold">{course.rating} / 5.0</p>
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Right: Course Thumbnail */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl -rotate-6 scale-95"></div>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl border-4 border-white/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* Main Content Area */}
  <div className=" mx-auto px-6 py-10">
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Registration Banner */}
        {!isRegistered ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Complete Registration to Unlock Full Access</h2>
            <button
              onClick={handleRegister}
              className="w-full max-w-sm mx-auto bg-[#1e40af] hover:bg-[#1e3a8a] text-white py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-3 shadow-lg cursor-pointer"
            >
              Register Now — {course.price}
            </button>
            <p className="mt-4 text-amber-700">
              Select your preferred batch & complete payment to start learning
            </p>
          </div>
        ) : (
          <>
            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#1e40af]" /> Course Content
              </h2>
              <div className="space-y-5">
                {course.modules.map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                    <div className="bg-gray-50 px-5 py-3 font-semibold text-gray-800">
                      {module.title}
                    </div>
                    <div className="divide-y divide-gray-200">
                      {module.chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className={`px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition ${
                            chapter.locked ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {chapter.type === 'video' && <Video className="w-5 h-5 text-[#1e40af]" />}
                            {chapter.type === 'quiz' && <Award className="w-5 h-5 text-green-600" />}
                            {chapter.type === 'assignment' && <FileText className="w-5 h-5 text-orange-600" />}
                            <div>
                              <p className="font-medium text-gray-900">{chapter.title}</p>
                              {chapter.duration && <p className="text-sm text-gray-500">{chapter.duration}</p>}
                            </div>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#1e40af]" /> Live Classes Schedule
              </h2>
              <div className="space-y-4">
                {course.liveClasses.map((cls, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-blue-50 rounded-lg border border-blue-100">
                    <div>
                      <p className="font-semibold text-gray-900">{cls.topic}</p>
                      <p className="text-sm text-gray-600">with {cls.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{cls.date}</p>
                      <p className="text-sm text-gray-600">{cls.time}</p>
                    </div>
                    <button className="ml-6 px-5 py-2 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition text-sm font-medium cursor-pointer">
                      Join Live
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {course.notes.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#1e40af]" /> Downloadable Notes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.notes.map((note, i) => (
                    <a
                      key={i}
                      href="#"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                    >
                      <span className="font-medium text-gray-800">{note}</span>
                      <Download className="w-5 h-5 text-[#1e40af] group-hover:translate-x-1 transition" />
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Course Details</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Instructor</span>
              <span className="font-semibold text-gray-900">{course.instructor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold text-gray-900">{course.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price</span>
              <span className="text-xl font-bold text-green-600">{course.price}</span>
            </div>
          </div>
        </div>

        {/* Exam & Assignments */}
        {isRegistered && 
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-4">Final Exam</h3>
                <a
                  href={course.examLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Start Exam
                </a>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-4">Assignments</h3>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition cursor-pointer">
                  View Assignments
                </button>
              </div>
            </div>
        }

        {isRegistered && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <p className="font-bold text-emerald-800 text-lg">You are enrolled</p>
            <p className="text-emerald-700 mt-1">Enjoy your learning journey!</p>
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
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left cursor-pointer"
                >
                  <p className="font-medium">{slot.date}</p>
                  <p className="text-sm text-gray-600">{slot.time}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSlotModal(false)}
              className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
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
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 transition cursor-pointer"
            >
              Pay Now
            </button>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}