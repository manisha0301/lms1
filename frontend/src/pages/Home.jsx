// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Calendar, IndianRupee, ArrowRight, CheckCircle, BookOpen, Award } from "lucide-react";
import apiConfig from '../config/apiConfig'; // Ensure this file exists with API_BASE_URL

const Home = () => {
  // Professional Dummy Data (fallback if API fails or empty)
  const banners = [
    { id: 1, title: "Diwali Special Offer 2025", subtitle: "Flat 50% OFF on All Courses", image: "bg-gradient-to-r from-[#1e3a8a] to-green-600" },
    { id: 2, title: "New Batches Starting Jan 2026", subtitle: "Full Stack | Data Science | MERN", image: "bg-gradient-to-r from-green-600 to-teal-700" },
    { id: 3, title: "100% Placement Guarantee", subtitle: "Join & Get Hired in 6 Months", image: "bg-gradient-to-r from-[#1e3a8a] to-blue-700" },
  ];

  const fallbackPopularCourses = [
    { id: 1, title: "Full Stack Web Development", instructor: "Er. Rajesh Kumar", price: 24999, originalPrice: 49999, students: 2847, rating: 4.9 },
    { id: 2, title: "Data Science & ML", instructor: "Dr. Priya Sharma", price: 34999, originalPrice: 69999, students: 1892, rating: 4.8 },
    { id: 3, title: "MERN Stack Developer", instructor: "Aman Singh", price: 19999, originalPrice: 39999, students: 3201, rating: 5.0 },
    { id: 4, title: "Java Full Stack", instructor: "Neha Gupta", price: 29999, originalPrice: 59999, students: 987, rating: 4.7 },
  ];

  const ongoingBatches = [
    { id: 1, course: "Full Stack Web Development", startDate: "15 Jan 2026", time: "07:00 PM - 09:00 PM", instructor: "Er. Rajesh Kumar" },
    { id: 2, course: "MERN Stack Developer", startDate: "10 Jan 2026", time: "06:00 PM - 08:00 PM", instructor: "Aman Singh" },
    { id: 3, course: "Data Science & ML", startDate: "01 Feb 2026", time: "08:00 PM - 10:00 PM", instructor: "Dr. Priya Sharma" },
  ];

  // State for real top-rated courses (fallback to dummy if fetch fails)
  const [popularCourses, setPopularCourses] = useState(fallbackPopularCourses);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchTopRatedCourses = async () => {
      try {
        const response = await fetch(`${apiConfig.API_BASE_URL}/api/public/courses/top-rated`);
        const data = await response.json();

        console.log("API Response from /top-rated:", data); // Debug: open console to see this

        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          setPopularCourses(data.courses);
        }
        // If API fails or returns empty → keep fallback dummy data
      } catch (err) {
        console.error("Failed to load top rated courses:", err);
        // Keep fallback on error
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchTopRatedCourses();
  }, []);

  return (
    <>
      {/* Professional Header */}
      <header className="bg-[#1e3a8a] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold tracking-tight">Kristellar's LMS</div>
          </div>
          <nav className="flex items-center gap-8">
            <Link to="/login" className="text-sm font-medium hover:text-green-300 transition">Login</Link>
            <Link to="/signup" className="bg-white text-[#1e3a8a] px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition">
              Sign Up Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Learn Skills That Get You Hired
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-4xl mx-auto">
            India's Most Trusted Platform for Job-Oriented Technical Courses with Live Training & 100% Placement Support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses" className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
              Explore All Courses <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about" className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#1e3a8a] transition">
              Know More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Banners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Latest Offers & Announcements</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {banners.map((banner) => (
              <div key={banner.id} className={`${banner.image} rounded-xl p-8 text-white shadow-lg`}>
                <h3 className="text-2xl font-bold mb-3">{banner.title}</h3>
                <p className="text-lg opacity-90">{banner.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ongoing Batches */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Ongoing & Upcoming Batches</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {ongoingBatches.map((batch) => (
              <div key={batch.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1e40af]">{batch.course}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">LIVE</span>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" /> Starts: {batch.startDate}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4" /> {batch.time}
                </p>
                <p className="text-sm text-gray-700">Instructor: <strong>{batch.instructor}</strong></p>
                <Link to="/signup" className="mt-5 inline-block text-[#1e40af] font-medium hover:underline">
                  Enroll Now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Popular Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Most Popular Courses</h2>
            <Link to="/courses" className="text-[#1e40af] font-medium hover:underline flex items-center gap-2">
              View All Courses <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {popularCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition">
                <div className="h-40 bg-gray-200 border-b border-gray-200 relative">
                  <img
                    src={course.thumbnail ? `${apiConfig.API_BASE_URL}${course.thumbnail}` : 'https://via.placeholder.com/400x250?text=No+Image'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Image+Error'; }}
                  />
                  <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded">
                    {course.originalPrice > course.price && course.originalPrice > 0
                      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) + "% OFF"
                      : ""}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                  {/* <p className="text-xs text-gray-600 mt-2">by {course.instructor || "N/A"}</p> */}
                  <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {course.students?.toLocaleString() || "0"}+
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-500" /> {course.rating || "0.0"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-xl font-bold text-[#1e40af]">
                        <IndianRupee className="w-5 h-5" />
                        {course.price?.toLocaleString() || "0"}
                      </div>
                      {course.originalPrice > course.price && (
                        <del className="text-xs text-gray-500">₹{course.originalPrice?.toLocaleString() || "0"}</del>
                      )}
                    </div>
                    <Link to={`/courses/${course.id}/overview`} className="text-[#1e40af] font-medium text-sm hover:underline">
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Kristellar */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Why Students Choose Kristellar's LMS</h2>
          <div className="grid md:grid-cols-4 gap-10">
            {[
              { icon: BookOpen, title: "Live Interactive Classes", desc: "Daily doubt clearing sessions" },
              { icon: CheckCircle, title: "100% Placement Support", desc: "Resume building & mock interviews" },
              { icon: Users, title: "1:1 Mentorship", desc: "Personal guidance from industry experts" },
              { icon: Award, title: "Lifetime Access", desc: "Revisit courses anytime" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-[#1e40af] text-white w-16 h-16 rounded-full flex items-center justify-center mb-5">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a8a] text-white pb-4 pt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Kristellar Cyberspace Pvt. Ltd.</h2>
            <p className="text-sm opacity-80 mt-2">CIN: U62099OD2023PTC043827</p>
          </div>
          <p className="text-sm opacity-90">
            3rd Floor, The Utkal Chamber of Commerce and Industry Limited, Nayapalli, Bhubaneswar 751015
          </p>
          <p className="text-sm mt-4">
            Email: <a href="support@kristellar.com" className="underline">support@kristellar.com</a> | 
            Phone: <a href="tel:+919178518343" className="underline"> +91 6744085430</a>
          </p>
          <p className="text-xs mt-8 opacity-70">
            © 2026 Kristellar Cyberspace Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;