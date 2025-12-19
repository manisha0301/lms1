// src/pages/admin/SettingsAdmin.jsx
import React, { useState } from "react";
import {
  User, Shield, Info, Image, Tag, Phone, FileText,
  Plus, Edit, Trash2, X, Save, Globe, Calendar, Percent
} from "lucide-react";

const SettingsAdmin = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  // Dummy Data for All Tabs
  const [aboutSections] = useState([
    { title: "Welcome to CodeKart LMS", content: "India's leading platform for job-oriented technical education with live classes, real projects and 100% placement support." },
    { title: "Our Mission", content: "To empower 1 Million+ students across India with industry-ready skills and guaranteed career growth." },
    { title: "Why Choose CodeKart?", content: "Live Interactive Classes • 1:1 Mentorship • Real-Time Projects • Placement Assistance • Lifetime Access • Certified Courses" }
  ]);

  const banners = [
    { id: 1, title: "Diwali Offer 2025", subtitle: "Flat 50% Off on All Courses", active: true, position: "Homepage Top" },
    { id: 2, title: "New Batch Starting", subtitle: "Full Stack Web Dev - Jan 2026", active: true, position: "Carousel" },
    { id: 3, title: "Refer & Earn ₹5000", subtitle: "Get rewarded for every successful referral", active: false, position: "Sidebar" }
  ];

  const coupons = [
    { code: "CODEKART50", discount: "50%", expiry: "2025-12-31", status: "Active", uses: 245 },
    { code: "WELCOME30", discount: "30%", expiry: "2025-11-30", status: "Active", uses: 189 },
    { code: "DIWALI2024", discount: "40%", expiry: "2024-11-15", status: "Expired", uses: 567 }
  ];

  const courseAdmins = [
    { name: "Priya Sharma", email: "priya@codekart.com", privileges: "Full Access", joined: "2024-06-15" },
    { name: "Rahul Verma", email: "rahul@codekart.com", privileges: "Courses + Faculty", joined: "2024-08-20" },
    { name: "Amit Kumar", email: "amit@codekart.com", privileges: "Read Only", joined: "2025-01-10" }
  ];

  const policies = [
    { name: "Privacy Policy", lastUpdated: "15 Oct 2025" },
    { name: "Terms & Conditions", lastUpdated: "10 Sep 2025" },
    { name: "Refund Policy", lastUpdated: "20 Aug 2025" },
    { name: "Services", lastUpdated: "05 Nov 2025" }
  ];

  const tabs = [
    { id: "profile", name: "Edit Profile", icon: User },
    { id: "privileges", name: "Manage Course Admin", icon: Shield },
    { id: "about", name: "About Us", icon: Info },
    { id: "banners", name: "Banners & Ads", icon: Image },
    { id: "coupons", name: "Coupons", icon: Tag },
    { id: "contact", name: "Contact Us", icon: Phone },
    { id: "policies", name: "Policies", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* LEFT SIDEBAR - CODEKART STYLE */}
      <div className="w-72 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white">
          <h1 className="text-2xl font-bold">CodeKart LMS</h1>
          <p className="text-sm opacity-90">Admin Settings</p>
        </div>
        <nav className="p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1e40af] text-white font-medium shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* 1. Edit Profile */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Edit Admin Profile</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Full Name" defaultValue="Dr. Rajesh Kumar" />
                <Input label="Email" defaultValue="admin@codekart.com" />
                <Input label="Username" defaultValue="admin_rajesh" />
                <Input label="Date of Birth" type="date" defaultValue="1980-05-15" />
                <Input label="Address" defaultValue="Plot No 504/2382/2701, First Floor, Kanan Vihar, Phase 2, Patia" />
                <Input label="City" defaultValue="Bhubaneswar" />
                <Input label="Postal Code" defaultValue="751024" />
                <Input label="Country" defaultValue="India" />
              </div>
              <div className="mt-8 text-right">
                <button className="px-8 py-3 bg-[#1e40af] text-white font-medium rounded-lg hover:bg-[#1e3a8a] transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* 2. Manage Course Admin */}
          {activeTab === "privileges" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Manage Course Admins</h2>
              <div className="space-y-4">
                {courseAdmins.map((admin) => (
                  <div key={admin.email} className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:border-[#1e40af] transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1e40af] to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {admin.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="font-semibold">{admin.name}</h4>
                        <p className="text-sm text-gray-600">{admin.email}</p>
                        <p className="text-xs text-gray-500">Joined: {admin.joined}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-[#1e40af]">{admin.privileges}</span>
                      <button className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. About Us */}
          {activeTab === "about" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">About Us Content</h2>
                <button onClick={() => setShowAboutModal(true)} className="px-5 py-2.5 bg-[#1e40af] text-white rounded-lg flex items-center gap-2 hover:bg-[#1e3a8a]">
                  <Plus className="w-4 h-4" /> Add Section
                </button>
              </div>
              <div className="space-y-6">
                {aboutSections.map((section, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-6 hover:border-[#1e40af] transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
                        <p className="text-gray-600 mt-2 leading-relaxed">{section.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingSection({ ...section, index: i }); setShowAboutModal(true); }} className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Banners & Ads */}
          {activeTab === "banners" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Banners & Carousel</h2>
                <button className="px-5 py-2.5 bg-[#1e40af] text-white rounded-lg flex items-center gap-2 hover:bg-[#1e3a8a]">
                  <Plus className="w-4 h-4" /> Add Banner
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                  <div key={banner.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-[#1e40af] to-green-600 flex items-center justify-center">
                      <Image className="w-16 h-16 text-white opacity-70" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold">{banner.title}</h4>
                      <p className="text-sm text-gray-600">{banner.subtitle}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className={`text-xs px-3 py-1 rounded-full ${banner.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                          {banner.active ? "Active" : "Inactive"}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-blue-600"><Edit className="w-4 h-4" /></button>
                          <button className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Coupons */}
          {activeTab === "coupons" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Discount Coupons</h2>
                <button className="px-5 py-2.5 bg-[#1e40af] text-white rounded-lg flex items-center gap-2 hover:bg-[#1e3a8a]">
                  <Plus className="w-4 h-4" /> Create Coupon
                </button>
              </div>
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-[#1e40af] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Code</th>
                    <th className="px-6 py-4 text-left">Discount</th>
                    <th className="px-6 py-4 text-left">Expiry</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Uses</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.code} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono font-bold text-[#1e40af]">{c.code}</td>
                      <td className="px-6 py-4">{c.discount}</td>
                      <td className="px-6 py-4">{c.expiry}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{c.uses}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-blue-600 mr-3"><Edit className="w-4 h-4 inline" /></button>
                        <button className="text-red-600"><Trash2 className="w-4 h-4 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 6. Contact Us */}
          {activeTab === "contact" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
                <Input label="Support Email" defaultValue="info@thecodekart.com" />
                <Input label="Phone" defaultValue="+91-9178518343" />
                <Input label="Address Line 1" defaultValue="Plot No 504/2382/2701, First Floor" />
                <Input label="Address Line 2" defaultValue="Kanan Vihar, Phase 2, Patia" />
                <Input label="City" defaultValue="Bhubaneswar" />
                <Input label="State" defaultValue="Odisha" />
                <Input label="PIN Code" defaultValue="751024" />
              </div>
              <div className="mt-8 text-right">
                <button className="px-8 py-3 bg-[#1e40af] text-white font-medium rounded-lg hover:bg-[#1e3a8a]">
                  Update Contact Info
                </button>
              </div>
            </div>
          )}

          {/* 7. Policies */}
          {activeTab === "policies" && (
            <div className="space-y-6">
              {policies.map((policy) => (
                <div key={policy.name} className="bg-white border border-gray-200 rounded-xl p-8 hover:border-[#1e40af] transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{policy.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Last updated: {policy.lastUpdated}</p>
                    </div>
                    <button className="text-[#1e40af] hover:bg-[#1e40af] hover:text-white px-4 py-2 rounded-lg border border-[#1e40af] flex items-center gap-2 transition">
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">{editingSection ? "Edit" : "Add New"} Section</h3>
              <button onClick={() => { setShowAboutModal(false); setEditingSection(null); }}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <input type="text" placeholder="Section Title" defaultValue={editingSection?.title || ""} className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#1e40af]" />
            <textarea rows="8" placeholder="Write content here..." defaultValue={editingSection?.content || ""} className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#1e40af]" />
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => { setShowAboutModal(false); setEditingSection(null); }} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button className="px-6 py-3 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a]">
                {editingSection ? "Update" : "Add"} Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e40af] focus:border-[#1e40af] transition" {...props} />
  </div>
);

export default SettingsAdmin;







// // src/pages/admin/SettingsAdmin.jsx
// import React, { useState } from "react";
// import {
//   User, Shield, Info, Image, Tag, Phone, FileText,
//   Plus, Edit, Trash2, X, Save, Globe, Calendar, Percent
// } from "lucide-react";

// const SettingsAdmin = () => {
//   const [activeTab, setActiveTab] = useState("profile");

//   const tabs = [
//     { id: "profile", name: "Edit Profile", icon: User },
//     { id: "privileges", name: "Manage Course Admin", icon: Shield },
//     { id: "about", name: "About Us", icon: Info },
//     { id: "banners", name: "Banners & Ads", icon: Image },
//     { id: "coupons", name: "Coupons", icon: Tag },
//     { id: "contact", name: "Contact Us", icon: Phone },
//     { id: "policies", name: "Policies", icon: FileText },
//   ];


//     const [showAboutModal, setShowAboutModal] = useState(false);
//     const [editingSection, setEditingSection] = useState(null);

//     const [aboutSections, setAboutSections] = useState([
//         {
//         title: "Welcome to Our Learning Platform",
//         content: "We are committed to delivering world-class education with experienced instructors and cutting-edge curriculum designed for the modern learner."
//         },
//         {
//         title: "Our Mission",
//         content: "To empower millions of students worldwide by providing accessible, affordable, and high-quality technical education that leads to real career growth."
//         },
//         {
//         title: "Why Choose Us?",
//         content: "Live classes • Industry projects • 1:1 mentorship • Job assistance • Lifetime access • Certified courses"
//         }
//     ]);





//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
//       <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="mb-10 text-center sm:text-left">
//           <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
//           <p className="mt-2 text-gray-600">Manage your platform configuration and content</p>
//         </div>

//         {/* Tabs */}
//         <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-200">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-3 px-6 py-4 font-semibold transition rounded-t-xl ${
//                   activeTab === tab.id
//                     ? "bg-white text-indigo-600 shadow-lg border-b-4 border-indigo-600"
//                     : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 {tab.name}
//               </button>
//             );
//           })}
//         </div>

//         {/* CONTENT */}

//         {/* 1. Edit Profile */}
//         {activeTab === "profile" && (
//           <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/60">
//             <h2 className="text-2xl font-bold text-gray-800 mb-8">Edit Admin Profile</h2>
//             <div className="grid md:grid-cols-2 gap-7 max-w-4xl">
//               <Input label="Full Name" defaultValue="Dr. Rajesh Kumar" />
//               <Input label="Email" type="email" defaultValue="admin@lms.com" />
//               <Input label="Username" defaultValue="admin_rajesh" />
//               <Input label="Date of Birth" type="date" defaultValue="1980-05-15" />
//               <Input label="New Password" type="password" placeholder="Leave blank to keep current" />
//               <Input label="Confirm Password" type="password" />
//               <Input label="Address" defaultValue="MG Road, Mumbai" />
//               <Input label="City" defaultValue="Mumbai" />
//               <Input label="Postal Code" defaultValue="400001" />
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">Country</label>
//                 <select className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
//                   <option>India</option>
//                   <option>United States</option>
//                   <option>United Kingdom</option>
//                 </select>
//               </div>
//             </div>
//             <div className="mt-10 text-center">
//               <button className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition">
//                 <Save className="inline w-5 h-5 mr-2" /> Save Changes
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 2. Manage Course Admin Privileges */}
//         {activeTab === "privileges" && (
//           <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/60">
//             <h2 className="text-2xl font-bold text-gray-800 mb-8">Course Admin Privileges</h2>
//             <div className="space-y-6">
//               {["Priya Sharma", "Rahul Verma", "Aisha Khan"].map((admin) => (
//                 <div key={admin} className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
//                   <div className="flex items-center gap-4">
//                     <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
//                       {admin.split(" ").map(n => n[0]).join("")}
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-gray-800">{admin}</h4>
//                       <p className="text-sm text-gray-600">course.admin@lms.com</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <label className="flex items-center gap-3 cursor-pointer">
//                       <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
//                       <span className="font-medium">Full Access</span>
//                     </label>
//                     <button className="text-red-600 hover:text-red-800">
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

        
//         {/* 3. About Us - Now with Add/Edit/Remove */}
//         {activeTab === "about" && (
//           <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/60">
//             <div className="flex justify-between items-center mb-10">
//               <h2 className="text-2xl font-bold text-gray-800">About Us Page Content</h2>
//               <button
//                 onClick={() => setShowAboutModal(true)}
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl flex items-center gap-3 transform hover:scale-105 transition"
//               >
//                 <Plus className="w-5 h-5" />
//                 Add New Section
//               </button>
//             </div>

//             <div className="space-y-8">
//               {aboutSections.map((section, index) => (
//                 <div
//                   key={index}
//                   className="group relative bg-gradient-to-r from-indigo-50/50 border border-indigo-200 rounded-2xl p-7 hover:shadow-xl transition-all duration-300"
//                 >
//                   {/* Action Buttons - Appear on hover */}
//                   <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
//                     <button
//                       onClick={() => {
//                         setEditingSection(section);
//                         setShowAboutModal(true);
//                       }}
//                       className="p-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
//                     >
//                       <Edit className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => {
//                         setAboutSections(aboutSections.filter((_, i) => i !== index));
//                       }}
//                       className="p-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </div>

//                   <h3 className="text-xl font-bold text-indigo-800 mb-4 pr-24">{section.title}</h3>
//                   <div className="prose prose-lg text-gray-700 leading-relaxed">
//                     {section.content}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {aboutSections.length === 0 && (
//               <div className="text-center py-20">
//                 <Info className="w-20 h-20 text-gray-300 mx-auto mb-6" />
//                 <p className="text-gray-500 text-lg">No content added yet. Click "Add New Section" to begin.</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* 4. Banners & Ads */}
//         {activeTab === "banners" && (
//           <div>
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-2xl font-bold text-gray-800">Banners & Carousel</h2>
//               <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center gap-2">
//                 <Plus className="w-5 h-5" /> Add New Banner
//               </button>
//             </div>
//             <div className="grid md:grid-cols-2 gap-8">
//               {[1, 2, 3, 4].map((i) => (
//                 <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
//                   <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
//                     <Image className="w-20 h-20 text-white/50" />
//                   </div>
//                   <div className="p-5 flex justify-between items-center">
//                     <div>
//                       <h4 className="font-bold">Summer Sale 2025</h4>
//                       <p className="text-sm text-gray-600">Active • Homepage Carousel</p>
//                     </div>
//                     <div className="flex gap-3">
//                       <button className="text-blue-600"><Edit className="w-5 h-5" /></button>
//                       <button className="text-red-600"><Trash2 className="w-5 h-5" /></button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* 5. Coupons */}
//         {activeTab === "coupons" && (
//           <div>
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-2xl font-bold text-gray-800">Discount Coupons</h2>
//               <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 flex items-center gap-2">
//                 <Plus className="w-5 h-5" /> Create Coupon
//               </button>
//             </div>
//             <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/60 overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
//                   <tr>
//                     <th className="px-6 py-5 text-left font-bold text-gray-800">Code</th>
//                     <th className="px-6 py-5 text-left font-bold text-gray-800">Discount</th>
//                     <th className="px-6 py-5 text-left font-bold text-gray-800">Expiry</th>
//                     <th className="px-6 py-5 text-left font-bold text-gray-800">Status</th>
//                     <th className="px-6 py-5 text-center font-bold text-gray-800">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[
//                     { code: "WELCOME50", discount: "50%", expiry: "2025-12-31", status: "Active" },
//                     { code: "DIWALI30", discount: "30%", expiry: "2025-11-15", status: "Active" },
//                     { code: "OLD2024", discount: "20%", expiry: "2024-12-31", status: "Expired" },
//                   ].map((c) => (
//                     <tr key={c.code} className="border-b hover:bg-gray-50">
//                       <td className="px-6 py-5 font-mono font-bold text-indigo-600">{c.code}</td>
//                       <td className="px-6 py-5">{c.discount}</td>
//                       <td className="px-6 py-5">{c.expiry}</td>
//                       <td className="px-6 py-5">
//                         <span className={`px-4 py-2 rounded-full text-sm font-bold ${
//                           c.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                         }`}>
//                           {c.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-5 text-center">
//                         <button className="text-blue-600 mr-4"><Edit className="w-5 h-5 inline" /></button>
//                         <button className="text-red-600"><Trash2 className="w-5 h-5 inline" /></button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* 6. Contact Us */}
//         {activeTab === "contact" && (
//           <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/60">
//             <h2 className="text-2xl font-bold text-gray-800 mb-8">Contact Information</h2>
//             <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
//               <Input label="Support Email" defaultValue="support@lms.com" />
//               <Input label="Phone" defaultValue="+91 98765 43210" />
//               <Input label="Address Line 1" defaultValue="123 Education Street" />
//               <Input label="Address Line 2" defaultValue="Near Tech Park" />
//               <Input label="City" defaultValue="Mumbai" />
//               <Input label="State" defaultValue="Maharashtra" />
//             </div>
//             <div className="mt-10 text-center">
//               <button className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition">
//                 Update Contact Info
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 7. Policies */}
//         {activeTab === "policies" && (
//           <div className="space-y-8">
//             {["Privacy Policy", "Terms & Conditions", "Refund Policy", "Services"].map((policy) => (
//               <div key={policy} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/60">
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-xl font-bold text-gray-800">{policy}</h3>
//                   <button className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2">
//                     <Edit className="w-5 h-5" /> Edit
//                   </button>
//                 </div>
//                 <p className="text-gray-600">Last updated: 15 March 2025</p>
//               </div>
//             ))}
//           </div>
//         )}



//         {/* ADD / EDIT ABOUT US SECTION MODAL */}
//         {showAboutModal && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
//             <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto border border-white/60">
//               <div className="p-8">
//                 <div className="flex justify-between items-center mb-8">
//                   <h3 className="text-2xl font-bold text-gray-800">
//                     {editingSection ? "Edit Section" : "Add New Section"}
//                   </h3>
//                   <button
//                     onClick={() => {
//                       setShowAboutModal(false);
//                       setEditingSection(null);
//                     }}
//                     className="p-3 hover:bg-gray-100 rounded-xl transition"
//                   >
//                     <X className="w-7 h-7 text-gray-600" />
//                   </button>
//                 </div>

//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">Section Title</label>
//                     <input
//                       type="text"
//                       defaultValue={editingSection?.title || ""}
//                       placeholder="e.g. Our Vision"
//                       className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">Content</label>
//                     <textarea
//                       rows="8"
//                       defaultValue={editingSection?.content || ""}
//                       placeholder="Write your amazing story here..."
//                       className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none transition"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-center gap-6 mt-10">
//                   <button
//                     onClick={() => {
//                       setShowAboutModal(false);
//                       setEditingSection(null);
//                     }}
//                     className="px-10 py-4 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => {
//                       // In real app: save to state or backend
//                       alert(editingSection ? "Section updated!" : "New section added!");
//                       setShowAboutModal(false);
//                       setEditingSection(null);
//                     }}
//                     className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition"
//                   >
//                     {editingSection ? "Update Section" : "Add Section"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}


//       </div>
//     </div>
//   );
// };

// const Input = ({ label, ...props }) => (
//   <div>
//     <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
//     <input
//       className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//       {...props}
//     />
//   </div>
// );

// export default SettingsAdmin;