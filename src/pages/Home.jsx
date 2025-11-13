// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiConfig from '../config/apiConfig';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [ongoingBatches, setOngoingBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, popularRes, batchesRes] = await Promise.all([
          fetch(`${apiConfig.API_BASE_URL}/api/banners`),
          fetch(`${apiConfig.API_BASE_URL}/api/courses/popular`),
          fetch(`${apiConfig.API_BASE_URL}/api/batches/ongoing`),
        ]);

        const [bannersData, popularData, batchesData] = await Promise.all([
          bannersRes.json(),
          popularRes.json(),
          batchesRes.json(),
        ]);

        setBanners(bannersData);
        setPopularCourses(popularData);
        setOngoingBatches(batchesData);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-xl text-gray-700">Loading Cybernetics LMS...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Cybernetics LMS</h1>
          <nav className="space-x-4 md:space-x-6">
            <Link to="/login" className="text-sm md:text-base hover:underline">Login</Link>
            <Link
              to="/signup"
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm md:text-base hover:bg-gray-100"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Banner Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
            Featured Banners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {banners.length > 0 ? (
              banners.map((b) => (
                <div key={b.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                  <img src={b.image_url} alt={b.title} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800">{b.title}</h3>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No banners available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Ongoing Batches */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
            Ongoing Batches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ongoingBatches.length > 0 ? (
              ongoingBatches.map((batch) => (
                <div key={batch.id} className="border rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <h3 className="text-xl font-bold text-indigo-600">{batch.course_title}</h3>
                  <p className="text-sm text-gray-600 mt-2">Starts: {batch.start_date}</p>
                  <p className="text-sm text-gray-600">Time: {batch.start_time} - {batch.end_time}</p>
                  <Link
                    to={`/courses/${batch.course_id}`}
                    className="inline-block mt-4 text-blue-600 font-medium hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No ongoing batches.</p>
            )}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
            Popular Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {popularCourses.length > 0 ? (
              popularCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow hover:shadow-lg transition">
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-green-600 font-bold mt-1">₹{course.price}</p>
                    <Link
                      to={`/courses/${course.id}`}
                      className="block mt-3 text-blue-600 text-sm font-medium hover:underline"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No courses available.</p>
            )}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/courses"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700"
            >
              View All Courses
            </Link>
          </div> 
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-gray-800">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">Live</span>
              </div>
              <h3 className="text-lg font-semibold">Live Classes</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">Exam</span>
              </div>
              <h3 className="text-lg font-semibold">Assignments & Exams</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">Chart</span>
              </div>
              <h3 className="text-lg font-semibold">Progress Tracking</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 Cybernetics LMS by <strong>Codekart Solutions Pvt. Ltd.</strong>
          </p>
        </div>
      </footer>
    </>
  );
} 





