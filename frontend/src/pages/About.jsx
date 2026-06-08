import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  CheckCircle,
  ShieldCheck,
  Users,
  Award,
} from "lucide-react";

const About = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [stats, setStats] = useState({
    panels: 0,
    workflows: 0,
    deliveryModes: 0,
    requirementPages: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        panels: prev.panels < 4 ? prev.panels + 1 : 4,
        workflows: prev.workflows < 6 ? prev.workflows + 1 : 6,
        deliveryModes: prev.deliveryModes < 3 ? prev.deliveryModes + 1 : 3,
        requirementPages:
          prev.requirementPages < 12 ? prev.requirementPages + 1 : 12,
      }));
    }, 120);

    const timeout = setTimeout(() => clearInterval(interval), 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const platformHighlights = [
    {
      title: "Role-Based Learning Ecosystem",
      description:
        "The LMS is designed around four operational panels: User, Faculty, Academic, and Admin. Each panel supports a distinct workflow while staying connected through a single platform.",
    },
    {
      title: "Cyber-Focused Course Delivery",
      description:
        "Learners can access structured modules, chapters, notes, live classes, assignments, and exam links inside one secure experience built for technical training.",
    },
    {
      title: "Operational Visibility",
      description:
        "Dashboards track batch schedules, course progress, pending assignments, exam status, notifications, center management, and faculty approvals in real time.",
    },
  ];

  const faqs = [
    {
      question: "What is the main purpose of this LMS?",
      answer:
        "It is a centralized platform for cyber-oriented learning and operations, covering onboarding, course delivery, live training, exams, assignments, payments, and administrative control.",
    },
    {
      question: "Who uses the platform?",
      answer:
        "The platform is built for students, faculty members, academic teams, and administrators, with separate dashboards and permissions for each role.",
    },
    {
      question: "What learning access does a registered learner get?",
      answer:
        "Registered learners can view course content by modules and chapters, attend live classes, access notes and videos, submit assignments, and use exam links from their dashboard.",
    },
  ];

  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-14 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Kristellar Cyberspace LMS
          </h1>
          <p className="max-w-4xl mx-auto text-lg opacity-90 leading-relaxed">
            Kristellar Cyberspace builds proactive cyber-defence solutions, and
            this LMS extends that mission into structured learning delivery. The
            platform is specified to support secure course management, live
            instruction, assessments, notifications, and multi-role academic
            operations in one integrated system.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To deliver a role-based digital learning environment that connects
            learners, faculty, academic coordinators, and administrators through
            reliable course delivery, practical assessments, and measurable
            progress tracking.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To become the operational learning backbone for cyber and technical
            education, combining Kristellar Cyberspace&apos;s security-first mindset
            with scalable training, governance, and academic oversight.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <Users className="mx-auto text-blue-600 mb-4" size={40} />
            <h3 className="text-3xl font-bold">{stats.panels}</h3>
            <p className="text-gray-600">Students Trained</p>
          </div>
          <div>
            <BookOpen className="mx-auto text-blue-600 mb-4" size={40} />
            <h3 className="text-3xl font-bold">{stats.workflows}</h3>
            <p className="text-gray-600">Professional Courses</p>
          </div>
          <div>
            <Award className="mx-auto text-blue-600 mb-4" size={40} />
            <h3 className="text-3xl font-bold">{stats.deliveryModes}</h3>
            <p className="text-gray-600">Successful Placements</p>
          </div>
          <div>
            <CheckCircle className="mx-auto text-blue-600 mb-4" size={40} />
            <h3 className="text-3xl font-bold">{stats.requirementPages}</h3>
            <p className="text-gray-600">Expert Mentors</p>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Platform Scope
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The functional scope defined for this LMS includes user
            authentication, course discovery, course registration, slot booking,
            Razorpay-based online payment, profile dashboards, live class access,
            exams, assignments, notifications, center administration, and
            faculty-course mapping. It is structured as an operational LMS
            rather than a static course catalog.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          {platformHighlights.map((item) => (
            <div
              key={item.title}
              className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-5">
              Built Around Cyber Operations
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Messaging on kristellarcyberspace.in positions the company around
              proactive cyber defence, threat detection, incident response, DFIR,
              adversary intelligence, application security, SOC operations, and
              future-ready research areas such as post-quantum cryptography.
            </p>
            <p className="text-gray-600 leading-relaxed">
              This LMS translates that positioning into a delivery system where
              cyber training can be scheduled, managed, assessed, and monitored
              with operational discipline.
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-5">What The Platform Enables</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <ShieldCheck className="text-cyan-400 shrink-0 mt-1" size={20} />
                <p className="text-slate-200">
                  Structured delivery for cybersecurity and technical programs
                  with chapters, modules, classes, and assessments.
                </p>
              </div>
              <div className="flex gap-3">
                <Briefcase className="text-cyan-400 shrink-0 mt-1" size={20} />
                <p className="text-slate-200">
                  Faculty and academic coordination for approvals, scheduling,
                  evaluation, and performance visibility.
                </p>
              </div>
              <div className="flex gap-3">
                <Users className="text-cyan-400 shrink-0 mt-1" size={20} />
                <p className="text-slate-200">
                  Centralized oversight for students, centers, courses, faculty,
                  notifications, and administrative settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">FAQs</h2>
          {faqs.map((faq, index) => (
            <div key={faq.question} className="mb-4 border rounded-lg">
              <button
                className="w-full flex justify-between items-center p-4 font-medium text-left"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                {faq.question}
                <ChevronDown
                  className={`transition-transform ${
                    openFAQ === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFAQ === index && (
                <div className="p-4 text-gray-600 border-t">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-10 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Train, Manage, and Scale From One Platform
        </h2>
        <p className="mb-8 opacity-90 max-w-3xl mx-auto px-6">
          From learner onboarding to live instruction, exams, assignments, and
          administrative control, the LMS is designed to operationalize
          Kristellar Cyberspace&apos;s training ecosystem end to end.
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