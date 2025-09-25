import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  ShoppingCart, 
  Users, 
  Star,
  Calendar,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target,
  MapPin,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const SellerAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('sales');

  // Mock analytics data
  const salesData = [
    { date: '2024-01-01', sales: 4500, orders: 12, visitors: 450 },
    { date: '2024-01-02', sales: 3200, orders: 8, visitors: 380 },
    { date: '2024-01-03', sales: 5800, orders: 15, visitors: 520 },
    { date: '2024-01-04', sales: 4200, orders: 11, visitors: 410 },
    { date: '2024-01-05', sales: 6200, orders: 18, visitors: 580 },
    { date: '2024-01-06', sales: 3800, orders: 9, visitors: 360 },
    { date: '2024-01-07', sales: 7200, orders: 22, visitors: 640 },
    { date: '2024-01-08', sales: 5500, orders: 16, visitors: 490 },
    { date: '2024-01-09', sales: 4800, orders: 13, visitors: 430 },
    { date: '2024-01-10', sales: 6800, orders: 19, visitors: 610 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 45, sales: 125000, color: '#8B5CF6' },
    { name: 'Fashion', value: 30, sales: 85000, color: '#06B6D4' },
    { name: 'Health', value: 15, sales: 42000, color: '#10B981' },
    { name: 'Home', value: 10, sales: 28000, color: '#F59E0B' }
  ];

  const topProducts = [
    { name: 'Premium Wireless Headphones', sales: 89, revenue: 266911, views: 2340, rating: 4.8 },
    { name: 'Smart Fitness Watch', sales: 67, revenue: 267933, views: 1890, rating: 4.6 },
    { name: 'Cotton Casual T-Shirt', sales: 234, revenue: 140166, views: 3450, rating: 4.5 },
    { name: 'Organic Green Tea', sales: 156, revenue: 46644, views: 1230, rating: 4.7 },
    { name: 'Handcrafted Wooden Vase', sales: 23, revenue: 29877, views: 890, rating: 4.9 }
  ];

  const customerInsights = [
    { age: '18-25', percentage: 25, color: '#8B5CF6' },
    { age: '26-35', percentage: 40, color: '#06B6D4' },
    { age: '36-45', percentage: 20, color: '#10B981' },
    { age: '46+', percentage: 15, color: '#F59E0B' }
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: 2340, percentage: 45 },
    { source: 'Direct', visitors: 1560, percentage: 30 },
    { source: 'Social Media', visitors: 780, percentage: 15 },
    { source: 'Paid Ads', visitors: 520, percentage: 10 }
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,680',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Store Visitors',
      value: '12,456',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your store performance and customer insights</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="sales">Sales (₹)</option>
                <option value="orders">Orders</option>
                <option value="visitors">Visitors</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales by Category</h3>
            <div className="flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      ₹{category.sales.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">({category.value}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Product</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600">Sales</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600">Revenue</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600">Views</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4">
                        <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                      </td>
                      <td className="py-4 text-right text-sm text-gray-900">{product.sales}</td>
                      <td className="py-4 text-right text-sm font-medium text-gray-900">
                        ₹{product.revenue.toLocaleString()}
                      </td>
                      <td className="py-4 text-right text-sm text-gray-600">{product.views}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-900">{product.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Customer Demographics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Age Groups</h3>
            <div className="space-y-4">
              {customerInsights.map((insight, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{insight.age}</span>
                    <span className="font-medium text-gray-900">{insight.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${insight.percentage}%`,
                        backgroundColor: insight.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trafficSources.map((source, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {source.visitors.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mb-2">{source.source}</div>
                <div className="text-sm font-medium text-purple-600">{source.percentage}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerAnalytics;