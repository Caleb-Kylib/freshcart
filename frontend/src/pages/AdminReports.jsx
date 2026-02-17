import React from 'react';
import {
    TrendingUp,
    DollarSign,
    ShoppingBag,
    Users,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const AdminReports = () => {
    // Mock Data for Reports
    const summaryStats = [
        {
            label: "Total Revenue",
            value: "KES 1,250,500",
            change: "+12.5%",
            trend: "up",
            icon: <DollarSign size={24} className="text-white" />,
            color: "bg-green-500"
        },
        {
            label: "Total Orders",
            value: "1,452",
            change: "+8.2%",
            trend: "up",
            icon: <ShoppingBag size={24} className="text-white" />,
            color: "bg-blue-500"
        },
        {
            label: "New Customers",
            value: "350",
            change: "-2.4%",
            trend: "down",
            icon: <Users size={24} className="text-white" />,
            color: "bg-purple-500"
        }
    ];

    const topProducts = [
        { name: "Fresh Mangoes (Ngowe)", sales: 120, revenue: "KES 18,000", percentage: 85 },
        { name: "Hass Avocados", sales: 95, revenue: "KES 7,600", percentage: 65 },
        { name: "Ripe Bananas", sales: 88, revenue: "KES 10,560", percentage: 60 },
        { name: "Fresh Spinach", sales: 76, revenue: "KES 3,800", percentage: 50 },
        { name: "Red Apples", sales: 65, revenue: "KES 22,750", percentage: 45 },
    ];

    const lowStockItems = [
        { name: "Strawberries", stock: 5, min: 20 },
        { name: "Fresh Mint", stock: 8, min: 15 },
        { name: "Carrots", stock: 12, min: 30 },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
                        <p className="text-gray-500 sm:mt-1">Overview of your store performance</p>
                    </div>
                    <div className="flex gap-2">
                        <select className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {summaryStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl shadow-sm ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className={`text-sm font-medium flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {stat.change}
                                </span>
                                <span className="text-gray-400 text-xs">vs last period</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Top Selling Products */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <TrendingUp size={20} className="text-green-600" />
                                Top Selling Products
                            </h2>
                        </div>
                        <div className="p-6 flex-1">
                            <div className="space-y-6">
                                {topProducts.map((product, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium text-gray-700">{product.name}</span>
                                            <span className="font-bold text-gray-900">{product.revenue}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div
                                                className="bg-green-500 h-2.5 rounded-full"
                                                style={{ width: `${product.percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500 text-right">{product.sales} units sold</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <AlertCircle size={20} className="text-orange-500" />
                                Low Stock Alerts
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {lowStockItems.map((item, index) => (
                                    <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg border border-red-100">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800">{item.name}</h4>
                                            <p className="text-xs text-red-600 mt-1">Only {item.stock} left in stock</p>
                                        </div>
                                        <div className="bg-white px-3 py-1 rounded text-xs font-bold text-red-600 border border-red-200 shadow-sm">
                                            Restock
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                View Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
