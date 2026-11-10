// Manager Dashboard Utility Functions
// Color scheme and formatting utilities

export const STATUS_COLORS = {
  // Order statuses
  New: { bg: '#E8F5E9', text: '#0B5D1E', label: 'New' },
  Packing: { bg: '#FFF3E0', text: '#F9A825', label: 'Packing' },
  'Out for delivery': { bg: '#E3F2FD', text: '#1976D2', label: 'Out for delivery' },
  Delivered: { bg: '#E8F5E9', text: '#2E7D32', label: 'Delivered' },
  Cancelled: { bg: '#FFEBEE', text: '#D32F2F', label: 'Cancelled' },
  
  // Payment statuses
  Pending: { bg: '#FFF3E0', text: '#F9A825', label: 'Pending' },
  Paid: { bg: '#E8F5E9', text: '#2E7D32', label: 'Paid' },
  Failed: { bg: '#FFEBEE', text: '#D32F2F', label: 'Failed' },
  
  // Stock statuses
  'In stock': { bg: '#E8F5E9', text: '#2E7D32', label: 'In stock' },
  Low: { bg: '#FFF3E0', text: '#F9A825', label: 'Low' },
  'Out of stock': { bg: '#FFEBEE', text: '#D32F2F', label: 'Out of stock' },
  'Expiring soon': { bg: '#FFE0B2', text: '#EF6C00', label: 'Expiring soon' }
};

export const PAYMENT_METHODS = {
  'M-Pesa': 'M-Pesa',
  Card: 'Card',
  Cash: 'Cash'
};

export const REPORT_TYPES = [
  { value: 'sales', label: 'Sales' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'wastage', label: 'Wastage' },
  { value: 'cashier-activity', label: 'Cashier Activity' },
  { value: 'payments-summary', label: 'Payments Summary' }
];

export const DATE_RANGES = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 days' },
  { value: '30days', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom' }
];

/**
 * Get status color configuration
 */
export const getStatusColor = (status, type = 'order') => {
  return STATUS_COLORS[status] || STATUS_COLORS.Pending;
};

/**
 * Format currency to KES
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Format date to readable format
 */
export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get stock status based on current stock and reorder level
 */
export const getStockStatus = (currentStock, reorderLevel, expiryDate) => {
  if (expiryDate) {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 3) return 'Expiring soon';
  }
  
  if (currentStock === 0) return 'Out of stock';
  if (currentStock < reorderLevel) return 'Low';
  return 'In stock';
};

/**
 * Calculate summary statistics
 */
export const calculateStats = (orders, products, cashiers = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });
  
  const todaysSales = todaysOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const lowStockItems = products.filter(p => p.stock < (p.reorderLevel || 10)).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'New' || o.orderStatus === 'Packing').length;
  
  return {
    todayOrders: todaysOrders.length,
    todaysSales,
    lowStockItems,
    outOfStock,
    pendingOrders,
    totalCashiers: cashiers.length
  };
};

/**
 * Generate 7-day sales chart data
 */
export const generateLast7DaysSalesData = (orders) => {
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const dayName = date.toLocaleDateString('en-KE', { weekday: 'short' });
    const dateStr = date.toISOString().split('T')[0];
    
    const daySales = orders
      .filter(order => order.createdAt.split('T')[0] === dateStr)
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    data.push({
      date: dayName,
      sales: daySales,
      fullDate: dateStr
    });
  }
  
  return data;
};

/**
 * Get orders needing attention
 */
export const getOrdersNeedingAttention = (orders) => {
  return orders.filter(order => {
    // Late orders (created more than 24 hours ago, still pending)
    const isLate = new Date() - new Date(order.createdAt) > 24 * 60 * 60 * 1000 &&
                   (order.orderStatus === 'New' || order.orderStatus === 'Packing');
    
    // Unpaid orders
    const isUnpaid = order.paymentStatus === 'Pending';
    
    // Cancelled orders (for review)
    const isCancelled = order.orderStatus === 'Cancelled';
    
    return isLate || isUnpaid || isCancelled;
  }).slice(0, 10);
};

/**
 * Get recently generated reports (mock data - would come from backend)
 */
export const getRecentReports = () => {
  return [
    {
      id: 1,
      name: 'Daily Sales Report - Nov 10',
      type: 'sales',
      generatedAt: new Date().toISOString(),
      dateRange: 'Nov 10, 2026'
    },
    {
      id: 2,
      name: 'Weekly Inventory Summary',
      type: 'inventory',
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dateRange: 'Nov 3 - Nov 10, 2026'
    },
    {
      id: 3,
      name: 'Low Stock Items Alert',
      type: 'low-stock',
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      dateRange: 'Nov 5 - Nov 10, 2026'
    }
  ];
};

/**
 * Filter data by date range
 */
export const filterByDateRange = (data, dateRange, dateField = 'createdAt') => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(today);
  
  switch (dateRange) {
    case 'today':
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate.getTime() === today.getTime();
      });
    case '7days':
      startDate.setDate(startDate.getDate() - 7);
      return data.filter(item => new Date(item[dateField]) >= startDate);
    case '30days':
      startDate.setDate(startDate.getDate() - 30);
      return data.filter(item => new Date(item[dateField]) >= startDate);
    default:
      return data;
  }
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data, fileName = 'export.csv') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  downloadFile(blob, fileName);
};

/**
 * Export data to JSON
 */
export const exportToJSON = (data, fileName = 'export.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadFile(blob, fileName);
};

/**
 * Helper to download file
 */
const downloadFile = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Generate mock cashier activity data
 */
export const generateCashierActivityLog = (cashiers = [], orders = []) => {
  return cashiers.map(cashier => ({
    id: cashier.id,
    name: cashier.name,
    ordersHandled: orders.filter(o => o.cashierId === cashier.id).length,
    stockEntries: Math.floor(Math.random() * 20),
    lastActive: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000).toISOString(),
    status: Math.random() > 0.5 ? 'Active' : 'Idle'
  }));
};
