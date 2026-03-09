// src/pages/FinanceDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
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
import axios from 'axios';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import apiConfig from '../../config/apiConfig';

// Professional color palette for pie chart
const PIE_COLORS = [
  '#16a34a',
  '#f0bd5e',
  '#173a9a',
  '#14b8a6',
  '#2563eb',
  '#f97316',
  '#ec4899',
  '#ef4444',
  '#8b5cf6',
  '#0ea5e9'
];

const FinanceDashboard = () => {
  const navigate = useNavigate();

  // ────────────────────────────────────────────────
  // REFS FOR CHART CAPTURE (PDF) — kept for future use
  // ────────────────────────────────────────────────
  const trendRef = useRef(null);
  const pieRef = useRef(null);
  const centreRef = useRef(null);

  // ────────────────────────────────────────────────
  // STATES FOR REAL DATA FROM BACKEND
  // ────────────────────────────────────────────────
  const [revenueStats, setRevenueStats] = useState(null);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [courseRevenue, setCourseRevenue] = useState([]);
  const [centreRevenue, setCentreRevenue] = useState([]);
  const [dateRange, setDateRange] = useState('last12months');
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all revenue data on mount
  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        setError(null);
       
        const token = localStorage.getItem('superAdminToken');
        const headers = { Authorization: `Bearer ${token}` };

        const overviewRes = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/superadmin/revenue/overview`,
          { headers }
        );
        if (overviewRes.data.success) {
          setRevenueStats(overviewRes.data.data);
        }

        const monthlyRes = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/superadmin/revenue/monthly-trend`,
          { headers }
        );
        if (monthlyRes.data.success) {
          setMonthlyTrend(monthlyRes.data.data);
        }

        const courseRes = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/superadmin/revenue/by-course`,
          { headers }
        );
        if (courseRes.data.success) {
          const coloredCourses = courseRes.data.data.map((course, index) => ({
            ...course,
            color: PIE_COLORS[index % PIE_COLORS.length]
          }));
          setCourseRevenue(coloredCourses);
        }

        const centreRes = await axios.get(
          `${apiConfig.API_BASE_URL}/api/auth/superadmin/revenue/by-centre`,
          { headers }
        );
        if (centreRes.data.success) {
          setCentreRevenue(centreRes.data.data);
        }

      } catch (err) {
        console.error('Failed to fetch finance data:', err);
        setError('Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  // Csv download (unchanged)
  const handleDownloadCSV = async () => {
    if (loading || !revenueStats) {
      alert("Data is still loading or unavailable.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Finance Report");

    // PREMIUM HEADER
    worksheet.mergeCells("A1:F3");

    const headerCell = worksheet.getCell("A1");
    headerCell.value = "  FINANCE REPORT - KRISTELLAR iLMS";
    headerCell.font = {
      size: 22,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    headerCell.alignment = {
      horizontal: "left",
      vertical: "middle",
    };
    headerCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E3A8A" },
    };

    worksheet.getRow(1).height = 35;
    worksheet.getRow(2).height = 35;
    worksheet.getRow(3).height = 35;

    worksheet.addRow([]);
    worksheet.addRow(["Generated On", new Date().toLocaleString("en-IN")]);
    worksheet.addRow(["Date Range", dateRange]);
    worksheet.addRow([]);

    const createSectionHeadline = (text) => {
      worksheet.addRow([]);

      const rowNumber = worksheet.lastRow.number + 1;
      worksheet.mergeCells(`A${rowNumber}:F${rowNumber}`);

      const cell = worksheet.getCell(`A${rowNumber}`);
      cell.value = text;

      cell.font = {
        bold: true,
        size: 15,
        color: { argb: "FF1E3A8A" },
      };

      cell.alignment = {
        horizontal: "left",
        vertical: "middle",
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFEAF1FB" },
      };

      worksheet.getRow(rowNumber).height = 25;
    };

    createSectionHeadline("EXECUTIVE SUMMARY");

    const summaryHeader = worksheet.addRow(["Metric", "Value"]);
    summaryHeader.font = { bold: true };

    const summaryData = [
      ["Total Platform Revenue", revenueStats.totalRevenue],
      ["Revenue This Month", revenueStats.thisMonthRevenue],
      ["Growth (%)", revenueStats.percentageChange + "%"],
    ];

    summaryData.forEach((row, index) => {
      const newRow = worksheet.addRow(row);

      if (index % 2 === 0) {
        newRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9FAFB" },
        };
      }
    });

    worksheet.addRow([]);

    createSectionHeadline("MONTHLY REVENUE TREND");

    const trendHeader = worksheet.addRow(["Month", "Revenue (₹)"]);
    trendHeader.font = { bold: true };

    monthlyTrend.forEach((item, index) => {
      const row = worksheet.addRow([item.month, item.revenue]);
      if (index % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9FAFB" },
        };
      }
    });

    worksheet.addRow([]);

    createSectionHeadline("REVENUE BY COURSE");

    const courseHeader = worksheet.addRow(["Course Name", "Revenue (₹)"]);
    courseHeader.font = { bold: true };

    courseRevenue.forEach((item, index) => {
      const row = worksheet.addRow([item.name, item.value]);
      if (index % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9FAFB" },
        };
      }
    });

    worksheet.addRow([]);

    createSectionHeadline("REVENUE BY ACADEMIC CENTRE");

    const centreHeader = worksheet.addRow(["Centre Name", "Revenue (₹)"]);
    centreHeader.font = { bold: true };

    centreRevenue.forEach((item, index) => {
      const row = worksheet.addRow([item.centre, item.revenue]);
      if (index % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF9FAFB" },
        };
      }
    });

    worksheet.getColumn(2).numFmt = '₹#,##0';

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) maxLength = columnLength;
      });
      column.width = maxLength + 4;
    });

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        const skipHeadlines = [
          "EXECUTIVE SUMMARY",
          "MONTHLY REVENUE TREND",
          "REVENUE BY COURSE",
          "REVENUE BY ACADEMIC CENTRE"
        ];

        if (skipHeadlines.includes(cell.value)) return;

        if (row.number > 7) {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      blob,
      `Finance_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // ────────────────────────────────────────────────
  // IMPROVED PDF GENERATOR – better spacing & alignment
  // ────────────────────────────────────────────────
const handleDownloadPDF = async () => {
  if (loading || !revenueStats) {
    alert("Data is still loading.");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // ALWAYS reset spacing
  doc.setCharSpace(0);
  doc.setR2L(false);

  // Safe currency formatter (NO spacing issue)
  const formatCurrency = (num) => {
    return `Rs. ${Number(num).toLocaleString("en-IN")}`;
  };

  // =========================
  // HEADER
  // =========================
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255);
  doc.text("Finance Dashboard Report", 14, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `Generated: ${new Date().toLocaleString("en-IN")}`,
    14,
    24
  );

  let y = 38;

  // =========================
  // KPI SECTION
  // =========================
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Key Financial Highlights", 14, y);

  y += 10;

  const drawKpiCard = (x, title, value, color) => {
    doc.setFillColor(...color);
    doc.roundedRect(x, y, 58, 26, 4, 4, "F");

    doc.setTextColor(255);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(title, x + 6, y + 9);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    // Important: ensure clean text rendering
    doc.text(String(value), x + 6, y + 20);
  };

  drawKpiCard(
    14,
    "Total Revenue",
    formatCurrency(revenueStats.totalRevenue),
    [30, 58, 138]
  );

  drawKpiCard(
    78,
    "This Month",
    formatCurrency(revenueStats.thisMonthRevenue),
    [22, 163, 74]
  );

  const growthColor =
    revenueStats.percentageChange >= 0
      ? [22, 163, 74]
      : [220, 38, 38];

  drawKpiCard(
    142,
    "Growth",
    `${revenueStats.changeSign}${revenueStats.percentageChange}%`,
    growthColor
  );

  y += 42;

  // =========================
  // MONTHLY TREND TABLE
  // =========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Monthly Revenue Trend", 14, y);

  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Month", "Revenue"]],
    body: monthlyTrend.map(item => [
      item.month,
      formatCurrency(item.revenue)
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 5,
      overflow: "hidden" // prevents letter breaking
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontStyle: "bold"
    },
    columnStyles: {
      0: { cellWidth: 70, halign: "left" },
      1: { cellWidth: 100, halign: "right" }
    },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 12;

  // =========================
  // COURSE TABLE
  // =========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Revenue by Course", 14, y);

  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Course Name", "Revenue"]],
    body: courseRevenue.map(item => [
      item.name,
      formatCurrency(item.value)
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 5,
      overflow: "linebreak"
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontStyle: "bold"
    },
    columnStyles: {
      0: { cellWidth: 100, halign: "left" },
      1: { cellWidth: 70, halign: "right" }
    },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 12;

  // =========================
  // CENTRE TABLE
  // =========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Revenue by Academic Centre", 14, y);

  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Centre Name", "Revenue"]],
    body: centreRevenue.map(item => [
      item.centre,
      formatCurrency(item.revenue)
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 5,
      overflow: "linebreak"
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontStyle: "bold"
    },
    columnStyles: {
      0: { cellWidth: 100, halign: "left" },
      1: { cellWidth: 70, halign: "right" }
    },
    margin: { left: 14, right: 14 }
  });

  // =========================
  // FOOTER
  // =========================
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "© 2025 Kristellar Solutions Pvt. Ltd. | Confidential",
    14,
    290
  );

  doc.save(
    `Finance_Report_${new Date().toISOString().split("T")[0]}.pdf`
  );
};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1e3a8a] text-white shadow-lg">
        <div className="mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Finance Dashboard</h1>
              <p className="opacity-90 mt-1">Revenue Analytics & Financial Reports</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
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

      <div className="mx-auto px-8 py-8">
        {/* Total Revenue Hero Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-10 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/10 to-transparent"></div>
          <div className="relative z-10">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-16 w-64 bg-gray-200 rounded mb-6"></div>
                <div className="h-6 w-72 bg-gray-200 rounded"></div>
              </div>
            ) : error ? (
              <div className="text-red-600">
                <p className="text-xl font-bold">Error loading data</p>
                <p>{error}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                    <IndianRupee className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Platform Revenue</p>
                    <p className="text-5xl font-bold text-gray-900">
                      {revenueStats?.formattedTotal || '₹0'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 justify-between">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <TrendingUp className="w-8 h-8" />
                    <span className="text-3xl font-bold">
                      {revenueStats?.changeSign || '+'}
                      {revenueStats?.formattedThisMonth || '₹0'} this month
                    </span>
                    <span className="text-lg">
                      ({revenueStats?.changeSign || '+'}{revenueStats?.percentageChange || '0.0'}%)
                    </span>
                  </div>
                </div>
              </>
            )}
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
            {loading ? (
              <div className="h-80 bg-gray-100 animate-pulse rounded"></div>
            ) : monthlyTrend.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No monthly data available
              </div>
            ) : (
              <div ref={trendRef}>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
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
            )}
          </div>

          {/* Course-wise Revenue Pie */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Course</h3>
            {loading ? (
              <div className="h-80 bg-gray-100 animate-pulse rounded"></div>
            ) : courseRevenue.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No course data available
              </div>
            ) : (
              <div ref={pieRef}>
                <ResponsiveContainer width="100%" height={320}>
                  <RechartsPieChart>
                    <Pie
                      data={courseRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ₹${(value / 1000).toFixed(0)}K`}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {courseRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Centre-wise Bar Chart */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Academic Centre</h3>
          {loading ? (
            <div className="h-96 bg-gray-100 animate-pulse rounded"></div>
          ) : centreRevenue.length === 0 ? (
            <div className="h-96 flex items-center justify-center text-gray-500">
              No centre data available
            </div>
          ) : (
            <div ref={centreRef}>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={centreRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="centre" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Bar dataKey="revenue" fill="#1e3a8a" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
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