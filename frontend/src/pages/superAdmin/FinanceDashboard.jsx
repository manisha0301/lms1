// src/pages/FinanceDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  TrendingUp,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  ArrowLeft,
  FileText,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const FinanceDashboard = () => {
  const navigate = useNavigate();

  // Mock Data
  const totalRevenue = 2847500;
  const monthlyGrowth = '+12.5%';

  // Monthly Revenue Data (Last 12 months)
  const monthlyRevenueData = [
    { month: 'Dec 24', revenue: 182000 },
    { month: 'Jan 25', revenue: 195000 },
    { month: 'Feb 25', revenue: 210000 },
    { month: 'Mar 25', revenue: 228000 },
    { month: 'Apr 25', revenue: 245000 },
    { month: 'May 25', revenue: 268000 },
    { month: 'Jun 25', revenue: 292000 },
    { month: 'Jul 25', revenue: 310000 },
    { month: 'Aug 25', revenue: 335000 },
    { month: 'Sep 25', revenue: 358000 },
    { month: 'Oct 25', revenue: 382000 },
    { month: 'Nov 25', revenue: 428000 },
  ];

  // Course-wise Revenue
  const courseRevenueData = [
    { name: 'Full Stack Web Dev', value: 892000, color: '#1e3a8a' },
    { name: 'Data Science Pro', value: 678000, color: '#3b82f6' },
    { name: 'Digital Marketing', value: 512000, color: '#10b981' },
    { name: 'UI/UX Mastery', value: 398000, color: '#f59e0b' },
    { name: 'Python for Beginners', value: 247500, color: '#ef4444' },
    { name: 'Others', value: 120000, color: '#6b7280' },
  ];

  // Academic Centre-wise Revenue
  const centreRevenueData = [
    { centre: 'Bhubaneswar', revenue: 728000 },
    { centre: 'Cuttack', revenue: 612000 },
    { centre: 'Berhampur', revenue: 498000 },
    { centre: 'Rourkela', revenue: 385000 },
    { centre: 'Sambalpur', revenue: 312000 },
    { centre: 'Puri', revenue: 312000 },
  ];

  const [dateRange, setDateRange] = useState('last12months');

  const handleDownloadCSV = () => {
    alert('CSV Report Downloaded! (Implement actual export logic)');
  };

  const handleDownloadPDF = () => {
    alert('PDF Report Generated! (Implement actual export logic)');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="max-w-[1600px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Finance Dashboard</h1>
              <p className="opacity-90 mt-1">Revenue Analytics & Financial Reports</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-medium transition">
              <Filter className="w-5 h-5" />
              Filter
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold transition shadow-lg"
            >
              <Download className="w-5 h-5" />
              CSV
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-2xl font-bold transition shadow-lg"
            >
              <FileText className="w-5 h-5" />
              PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Total Revenue Hero Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-10 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                <IndianRupee className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Platform Revenue</p>
                <p className="text-5xl font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 justify-between">
              <div className="flex items-center gap-3 text-emerald-600">
                <TrendingUp className="w-8 h-8" />
                <span className="text-3xl font-bold">{monthlyGrowth}</span>
                <span className="text-lg">vs last month</span>
              </div>
              <div className="text-gray-600">
                <p className="text-sm">Next payout scheduled</p>
                <p className="font-bold text-[#1e3a8a]">5 Dec 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Trend */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revenue Trend</h3>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition"
              >
                <option value="last12months">Last 12 Months</option>
                <option value="2025">Year 2025</option>
                <option value="2024">Year 2024</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1e3a8a"
                  strokeWidth={5}
                  dot={{ fill: '#1e3a8a', r: 8 }}
                  activeDot={{ r: 10 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Course-wise Revenue Pie */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Course</h3>
            <ResponsiveContainer width="100%" height={320}>
              <RechartsPieChart>
                <Pie
                  data={courseRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${(value / 1000).toFixed(0)}K`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {courseRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Centre-wise Bar Chart */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Academic Centre</h3>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={centreRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="centre" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#1e3a8a" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-200">
          © 2025 Kristellar Solutions Pvt. Ltd. • All financial data is updated as of 27 Nov 2025
        </footer>
      </div>
    </div>
  );
};

export default FinanceDashboard;