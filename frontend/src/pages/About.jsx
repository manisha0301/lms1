import React, { useState, useEffect } from "react";
import { Users, Award, BookOpen, CheckCircle, ChevronDown } from "lucide-react";

const About = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    placements: 0,
    mentors: 0,
  });

  // Animated Counter Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        students: prev.students < 5000 ? prev.students + 100 : 5000,
        courses: prev.courses < 25 ? prev.courses + 1 : 25,
        placements: prev.placements < 1200 ? prev.placements + 25 : 1200,
        mentors: prev.mentors < 15 ? prev.mentors + 1 : 15,
      }));
    }, 50);

    setTimeout(() => clearInterval(interval), 2000);

    return () => clearInterval(interval);
  }, []);

  const faqs = [
    {
      question: "Do you provide placement support?",
      answer:
        "Yes, we provide 100% placement assistance including resume building, mock interviews, and company referrals.",
    },
    {
      question: "Are the classes live or recorded?",
      answer:
        "We provide live interactive sessions along with lifetime access to recorded content.",
    },
    {
      question: "Do I get certification after completion?",
      answer:
        "Yes, you will receive an industry-recognized certificate upon successful completion.",
    },
  ];

  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About Kristellar's LMS
        </h1>
        <p className="max-w-3xl mx-auto text-lg opacity-90">
          Empowering students with industry-ready skills through live training,
          real-world projects, and guaranteed placement support.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to bridge the gap between academic learning and
            industry expectations by providing practical, job-oriented
            training programs.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To become India’s most trusted LMS platform that transforms
            beginners into industry professionals through structured learning.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <Users className="mx-auto text-blue-600 mb-4" size={40} />
            <h3 className="text-3xl font-bold">{stats.students}+</h3>
            <p className="text-gray-600">Students Trained</p>
          </div>
          <div>
            <BookOpen className="mx-auto text-blue-600 mb-4" size={40} />
            <h3 className="text-3xl font-bold">{stats.courses}+</h3>
            <p className="text-gray-600">Professional Courses</p>
          </div>
          <div>
            <Award className="mx-auto text-blue-600 mb-4" size={40} />
            <h3 className="text-3xl font-bold">{stats.placements}+</h3>
            <p className="text-gray-600">Successful Placements</p>
          </div>
          <div>
            <CheckCircle className="mx-auto text-blue-600 mb-4" size={40} />
            <h3 className="text-3xl font-bold">{stats.mentors}+</h3>
            <p className="text-gray-600">Expert Mentors</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          Why Choose Kristellar's LMS?
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-3">Live Interactive Classes</h3>
            <p className="text-gray-600">
              Learn directly from industry experts with real-time doubt clearing.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-3">Real Projects</h3>
            <p className="text-gray-600">
              Work on real-world industry projects to gain hands-on experience.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-3">Career Support</h3>
            <p className="text-gray-600">
              Resume preparation, interview training, and company referrals.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">FAQs</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border rounded-lg">
              <button
                className="w-full flex justify-between items-center p-4 font-medium text-left"
                onClick={() =>
                  setOpenFAQ(openFAQ === index ? null : index)
                }
              >
                {faq.question}
                <ChevronDown
                  className={`transition-transform ${
                    openFAQ === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFAQ === index && (
                <div className="p-4 text-gray-600 border-t">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Start Your Career Journey?
        </h2>
        <p className="mb-8 opacity-90">
          Join thousands of students who transformed their careers with us.
        </p>
        <a
          href="/signup"
          className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Get Started Today
        </a>
      </section>

    </div>
  );
};

export default About;