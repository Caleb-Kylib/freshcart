import { useState, useMemo } from "react";
import ManagerLayout from "../components/ManagerLayout";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  ChevronRight,
  BarChart3,
  Trash2,
  Eye,
  FileJson
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import {
  REPORT_TYPES,
  DATE_RANGES,
  formatDate,
  exportToCSV,
  exportToJSON,
  generateLast7DaysSalesData,
  getRecentReports,
  formatCurrency
} from "../utils/managerUtils";

const ManagerReports = () => {
  const { products } = useProducts();
  const { orders } = useOrders();

  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [recentReports, setRecentReports] = useState(getRecentReports());

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.filter(Boolean);
  }, [products]);

  // Generate report data based on type
  const generateReportData = () => {
    let data = [];

    switch (reportType) {
      case 'sales':
        // Generate daily sales report
        const salesByDay = {};
        orders.forEach(order => {
          const date = formatDate(order.createdAt);
          if (!salesByDay[date]) {
            salesByDay[date] = { date, orders: 0, revenue: 0, items: 0 };
          }
          salesByDay[date].orders += 1;
          salesByDay[date].revenue += order.totalAmount;
          salesByDay[date].items += order.items?.length || 0;
        });
        data = Object.values(salesByDay);
        break;

      case 'inventory':
        // Current inventory snapshot
        data = products.map(p => ({
          product: p.name,
          category: p.category,
          currentStock: p.stock,
          reorderLevel: p.reorderLevel || 10,
          price: formatCurrency(p.price),
          lastUpdated: formatDate(p.updatedAt)
        }));
        break;

      case 'low-stock':
        // Low stock items
        data = products
          .filter(p => p.stock < (p.reorderLevel || 10))
          .map(p => ({
            product: p.name,
            category: p.category,
            currentStock: p.stock,
            reorderLevel: p.reorderLevel || 10,
            unit: p.unit || 'units',
            status: p.stock === 0 ? 'Out of stock' : 'Low stock'
          }));
        break;

      case 'wastage':
        // Mock wastage data
        data = products
          .filter(p => Math.random() > 0.7)
          .map(p => ({
            product: p.name,
            category: p.category,
            unitsWasted: Math.floor(Math.random() * 20) + 1,
            reason: ['Expired', 'Damaged', 'Unsaleable'][Math.floor(Math.random() * 3)],
            date: formatDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000))
          }));
        break;

      case 'cashier-activity':
        // Mock cashier activity
        data = [
          { cashier: 'Cashier 1', ordersHandled: 45, stockEntries: 12, lastActive: 'Nov 10, 2:30 PM' },
          { cashier: 'Cashier 2', ordersHandled: 38, stockEntries: 8, lastActive: 'Nov 10, 3:15 PM' },
          { cashier: 'Cashier 3', ordersHandled: 52, stockEntries: 15, lastActive: 'Nov 10, 1:45 PM' }
        ];
        break;

      case 'payments-summary':
        // Payment methods summary
        const paymentMethods = {};
        orders.forEach(order => {
          const method = order.paymentMethod || 'Card';
          if (!paymentMethods[method]) {
            paymentMethods[method] = { method, count: 0, revenue: 0 };
          }
          paymentMethods[method].count += 1;
          paymentMethods[method].revenue += order.totalAmount;
        });
        data = Object.values(paymentMethods).map(p => ({
          ...p,
          revenue: formatCurrency(p.revenue)
        }));
        break;

      default:
        data = [];
    }

    return data;
  };

  const handleGenerateReport = () => {
    const data = generateReportData();
    setPreviewData(data);
    setShowPreview(true);

    // Add to recent reports
    const newReport = {
      id: Date.now(),
      name: `${REPORT_TYPES.find(t => t.value === reportType)?.label} Report - ${new Date().toLocaleDateString()}`,
      type: reportType,
      generatedAt: new Date().toISOString(),
      dateRange: dateRange === 'custom' ? `${startDate} to ${endDate}` : dateRange
    };
    setRecentReports([newReport, ...recentReports.slice(0, 4)]);
  };

  const handleExport = (format) => {
    const fileName = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'json'}`;

    if (format === 'csv') {
      exportToCSV(previewData, fileName);
    } else if (format === 'json') {
      exportToJSON(previewData, fileName);
    }
  };

  const reportData = generateReportData();

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1B2A1F] mb-2">Reports</h1>
        <p className="text-[#666] text-lg">Generate and manage business reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Builder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-[#E2E8E0] p-8">
            <h2 className="text-2xl font-bold text-[#1B2A1F] mb-6">Report Builder</h2>

            {/* Report Type */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#1B2A1F] mb-3">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-3 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
              >
                {REPORT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <p className="text-xs text-[#999] mt-2">
                {reportType === 'sales' && 'View daily sales performance and revenue trends'}
                {reportType === 'inventory' && 'Current inventory levels and stock status'}
                {reportType === 'low-stock' && 'Items below reorder level requiring attention'}
                {reportType === 'wastage' && 'Track expired, damaged, or unsaleable items'}
                {reportType === 'cashier-activity' && 'Individual cashier performance metrics'}
                {reportType === 'payments-summary' && 'Payment method breakdown and revenue'}
              </p>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#1B2A1F] mb-3">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-3 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
              >
                {DATE_RANGES.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1B2A1F] mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1B2A1F] mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
                  />
                </div>
              </div>
            )}

            {/* Additional Filters */}
            {(reportType === 'inventory' || reportType === 'low-stock') && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-[#1B2A1F] mb-3">Category Filter (Optional)</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2E8E0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A300]/20"
                >
                  <option>All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateReport}
              className="w-full px-6 py-3 bg-[#00A300] text-white font-bold rounded-lg hover:bg-[#087E08] transition-colors flex items-center justify-center gap-2"
            >
              <BarChart3 size={20} />
              Generate Report
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg border border-[#E2E8E0] p-8">
          <h2 className="text-xl font-bold text-[#1B2A1F] mb-6">Recent Reports</h2>

          {recentReports.length > 0 ? (
            <div className="space-y-3">
              {recentReports.map(report => (
                <div key={report.id} className="flex items-center gap-3 p-3 bg-[#F7FAF5] rounded-lg hover:bg-[#E8F5E9] transition-colors">
                  <FileText size={18} className="text-[#00A300] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1B2A1F] truncate">{report.name}</p>
                    <p className="text-xs text-[#999]">{formatDate(report.generatedAt)}</p>
                  </div>
                  <button className="p-2 hover:bg-[#E2E8E0] rounded transition-colors">
                    <Download size={16} className="text-[#00A300]" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#999] text-sm text-center py-6">No reports generated yet</p>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && previewData.length > 0 && (
        <div className="mt-8 bg-white rounded-lg border border-[#E2E8E0] p-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E2E8E0]">
            <h2 className="text-2xl font-bold text-[#1B2A1F]">
              {REPORT_TYPES.find(t => t.value === reportType)?.label} Report
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 bg-[#00A300] text-white font-semibold rounded-lg hover:bg-[#087E08] transition-colors text-sm flex items-center gap-2"
              >
                <Download size={16} />
                CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="px-4 py-2 bg-[#1976D2] text-white font-semibold rounded-lg hover:bg-[#1565C0] transition-colors text-sm flex items-center gap-2"
              >
                <Download size={16} />
                JSON
              </button>
            </div>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F7FAF5] border-b border-[#E2E8E0]">
                <tr>
                  {Object.keys(previewData[0]).map(key => (
                    <th key={key} className="text-left px-4 py-3 text-xs font-bold text-[#999] uppercase">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="border-b border-[#E2E8E0] hover:bg-[#F7FAF5]">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-4 py-3 text-[#1B2A1F]">
                        {typeof val === 'number' ? val.toLocaleString() : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <p className="text-xs text-[#999] mt-4">
                Showing 10 of {previewData.length} records
              </p>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#E2E8E0]">
            <div>
              <p className="text-xs text-[#999] font-semibold uppercase mb-2">Total Records</p>
              <p className="text-2xl font-bold text-[#1B2A1F]">{previewData.length}</p>
            </div>
            {reportType === 'sales' && (
              <div>
                <p className="text-xs text-[#999] font-semibold uppercase mb-2">Total Revenue</p>
                <p className="text-2xl font-bold text-[#00A300]">
                  {formatCurrency(previewData.reduce((sum, r) => sum + (r.revenue || 0), 0))}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!showPreview && (
        <div className="mt-8 bg-white rounded-lg border border-[#E2E8E0] p-12 text-center">
          <BarChart3 size={48} className="mx-auto text-[#E2E8E0] mb-4" />
          <p className="text-[#999] font-medium">Generate a report to view data and export options</p>
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerReports;
