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
    { name: 'Full Stack Web Dev', value: 892000, color: '#8b5cf6' },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="px-8 py-5 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Finance Dashboard
              </h1>
              <p className="text-sm text-gray-500">Revenue Analytics & Reports</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">CSV</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">PDF</span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Total Revenue Hero */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white rounded-3xl p-10 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full -mr-40 -mt-40"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <IndianRupee className="w-10 h-10" />
              <p className="text-green-100 text-lg font-medium">Total Platform Revenue</p>
            </div>
            <p className="text-6xl font-extrabold mb-4">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-green-100">
                <TrendingUp className="w-6 h-6" />
                <span className="text-2xl font-bold">{monthlyGrowth}</span>
                <span className="text-sm opacity-90">vs last month</span>
              </div>
            </div>
            <p className="text-green-100 mt-4 text-sm">Next payout scheduled: <strong>5 Dec 2025</strong></p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Trend */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revenue Trend</h3>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2"
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
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ fill: '#10b981', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Course-wise Revenue Pie */}
          <div className="bg-white rounded-2xl shadow-sm  border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 p-6">Revenue by Course</h3>
            <ResponsiveContainer width="100%" height={320}>
              <RechartsPieChart>
                <Pie
                  data={courseRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${(value / 1000).toFixed(0)}K`}
                  outerRadius={100}
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
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Academic Centre</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={centreRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="centre" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 Kristellar Solutions Pvt. Ltd. • All financial data is updated as of 27 Nov 2025</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;