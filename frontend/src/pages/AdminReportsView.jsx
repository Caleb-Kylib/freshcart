import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  Trash2,
  Users,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Search,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminReportsView = () => {
  const { managers } = useAuth();
  const [reports, setReports] = useState([
    // Mock data for demonstration
    {
      id: 1,
      title: "Daily Sales Report",
      type: "sales",
      manager: "John Manager",
      managerId: "mgr_001",
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      dateRange: "Nov 10, 2024",
      summary: {
        totalOrders: 45,
        totalRevenue: 125650,
        avgOrderValue: 2792
      },
      status: "completed"
    },
    {
      id: 2,
      title: "Low Stock Alert Report",
      type: "low-stock",
      manager: "Sarah Manager",
      managerId: "mgr_002",
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      dateRange: "Nov 10, 2024",
      summary: {
        totalItems: 12,
        criticalItems: 3,
        warnItems: 9
      },
      status: "completed"
    },
    {
      id: 3,
      title: "Inventory Report",
      type: "inventory",
      manager: "John Manager",
      managerId: "mgr_001",
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      dateRange: "Nov 09 - Nov 10, 2024",
      summary: {
        totalProducts: 145,
        totalValue: 2450000,
        avgStockLevel: 42
      },
      status: "completed"
    },
    {
      id: 4,
      title: "Payment Methods Summary",
      type: "payments-summary",
      manager: "Sarah Manager",
      managerId: "mgr_002",
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      dateRange: "Last 7 Days",
      summary: {
        totalTransactions: 234,
        mPesaTransactions: 156,
        cardTransactions: 78
      },
      status: "completed"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterManager, setFilterManager] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sortBy, setSortBy] = useState("recent");

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || report.type === filterType;
    const matchesManager = filterManager === "All" || report.managerId === filterManager;
    return matchesSearch && matchesType && matchesManager;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.generatedAt) - new Date(a.generatedAt);
    } else if (sortBy === "oldest") {
      return new Date(a.generatedAt) - new Date(b.generatedAt);
    } else if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowPreview(true);
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setReports(reports.filter(r => r.id !== reportId));
      setShowPreview(false);
    }
  };

  const handleExportReport = (report) => {
    // Mock export functionality
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.title}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const getReportIcon = (type) => {
    switch (type) {
      case 'sales':
        return <TrendingUp size={20} className="text-green-600" />;
      case 'low-stock':
        return <AlertCircle size={20} className="text-orange-600" />;
      case 'inventory':
        return <BarChart3 size={20} className="text-blue-600" />;
      case 'payments-summary':
        return <FileText size={20} className="text-purple-600" />;
      default:
        return <FileText size={20} className="text-gray-600" />;
    }
  };

  const getReportTypeLabel = (type) => {
    const labels = {
      sales: "Sales Report",
      "low-stock": "Low Stock Alert",
      inventory: "Inventory Report",
      "payments-summary": "Payment Summary",
      wastage: "Wastage Report",
      "cashier-activity": "Cashier Activity"
    };
    return labels[type] || type;
  };

  const formatTimeAgo = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
              <FileText size={28} />
            </div>
            Manager Reports
          </h1>
          <p className="text-gray-500 mt-1">View all reports generated by your managers</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{sortedReports.length}</p>
          <p className="text-gray-500 text-sm">Total Reports</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
              Total Managers
            </p>
            <p className="text-2xl font-extrabold text-gray-900">
              {managers.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users size={20} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
              Reports This Month
            </p>
            <p className="text-2xl font-extrabold text-gray-900">
              {reports.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <BarChart3 size={20} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">
              Avg Revenue (Last Report)
            </p>
            <p className="text-2xl font-extrabold text-gray-900">
              KES {reports[0]?.summary?.totalRevenue?.toLocaleString() || "0"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by report name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none font-medium"
            >
              <option value="All">All Report Types</option>
              <option value="sales">Sales</option>
              <option value="low-stock">Low Stock</option>
              <option value="inventory">Inventory</option>
              <option value="payments-summary">Payment Summary</option>
              <option value="wastage">Wastage</option>
              <option value="cashier-activity">Cashier Activity</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <select
              value={filterManager}
              onChange={(e) => setFilterManager(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none font-medium"
            >
              <option value="All">All Managers</option>
              {managers.map(manager => (
                <option key={manager._id} value={manager._id}>
                  {manager.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none font-medium"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-4">
        {sortedReports.length > 0 ? (
          sortedReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-gray-50 rounded-xl mt-1">
                    {getReportIcon(report.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{report.title}</h3>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                        {getReportTypeLabel(report.type)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span className="font-medium">{report.manager}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatTimeAgo(report.generatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">{report.dateRange}</span>
                      </div>
                    </div>

                    {/* Report Summary */}
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {Object.entries(report.summary).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-2">
                          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {typeof value === "number"
                              ? value.toLocaleString()
                              : value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewReport(report)}
                    className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                    title="View Report"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleExportReport(report)}
                    className="p-3 text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-all"
                    title="Export Report"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                    title="Delete Report"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-lg font-bold text-gray-500">No reports found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>

      {/* Report Preview Modal */}
      {showPreview && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                <p className="text-sm text-gray-500 mt-1">Generated by {selectedReport.manager} on {new Date(selectedReport.generatedAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Report Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedReport.summary).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {typeof value === "number" ? value.toLocaleString() : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Report Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Report Type:</span>
                      <span className="font-bold text-gray-900">{getReportTypeLabel(selectedReport.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Generated By:</span>
                      <span className="font-bold text-gray-900">{selectedReport.manager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date Range:</span>
                      <span className="font-bold text-gray-900">{selectedReport.dateRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Generated At:</span>
                      <span className="font-bold text-gray-900">{new Date(selectedReport.generatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleExportReport(selectedReport)}
                  className="flex-1 px-4 py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Export Report
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReportsView;
