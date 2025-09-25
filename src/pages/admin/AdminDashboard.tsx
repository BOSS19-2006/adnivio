import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  BarChart3,
  PieChart,
  Activity
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

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock admin dashboard data
  const platformStats = [
    {
      title: 'Total Users',
      value: '52,340',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Sellers',
      value: '8,450',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Platform Revenue',
      value: '₹12.5L',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Orders',
      value: '1,23,456',
      change: '+18.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 850000, orders: 12500, users: 45000 },
    { month: 'Feb', revenue: 920000, orders: 13200, users: 47000 },
    { month: 'Mar', revenue: 1100000, orders: 15800, users: 49500 },
    { month: 'Apr', revenue: 980000, orders: 14100, users: 51000 },
    { month: 'May', revenue: 1250000, orders: 17900, users: 52340 },
    { month: 'Jun', revenue: 1180000, orders: 16800, users: 53200 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#8B5CF6' },
    { name: 'Fashion', value: 25, color: '#06B6D4' },
    { name: 'Health', value: 20, color: '#10B981' },
    { name: 'Home', value: 15, color: '#F59E0B' },
    { name: 'Others', value: 5, color: '#EF4444' }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'user_registration',
      message: 'New seller registered: TechGadgets Store',
      time: '2 minutes ago',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: '2',
      type: 'product_approval',
      message: 'Product approved: Premium Headphones',
      time: '5 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: '3',
      type: 'transaction',
      message: 'High-value transaction: ₹25,000',
      time: '10 minutes ago',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      id: '4',
      type: 'alert',
      message: 'Suspicious activity detected on account #12345',
      time: '15 minutes ago',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      id: '5',
      type: 'campaign',
      message: 'New ad campaign launched by FashionHub',
      time: '20 minutes ago',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const pendingApprovals = [
    {
      id: '1',
      type: 'seller',
      title: 'ElectroWorld Store',
      description: 'New seller registration pending approval',
      priority: 'high',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'product',
      title: 'Smart Watch Pro',
      description: 'Product listing pending review',
      priority: 'medium',
      time: '4 hours ago'
    },
    {
      id: '3',
      type: 'dispute',
      title: 'Order #12345 Dispute',
      description: 'Customer complaint about product quality',
      priority: 'high',
      time: '6 hours ago'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor platform performance and manage operations</p>
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
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className="w-6 h-6 text-gray-700" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 mr-1" />
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
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Platform Revenue</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
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
                  <span className="text-sm font-medium text-gray-900">{category.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pending Approvals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {pendingApprovals.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.time}</span>
                    <div className="flex gap-2">
                      <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">
                        Approve
                      </button>
                      <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;