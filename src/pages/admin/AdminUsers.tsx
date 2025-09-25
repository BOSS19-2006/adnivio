import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Star,
  TrendingUp
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  location: string;
  avatar: string;
  verified: boolean;
  totalOrders?: number;
  totalSales?: number;
  rating?: number;
  lastActive: string;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Mock users data
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Arjun Sharma',
      email: 'arjun.sharma@email.com',
      phone: '+91 98765 43210',
      role: 'seller',
      status: 'active',
      joinDate: '2024-01-15',
      location: 'Mumbai, Maharashtra',
      avatar: 'https://ui-avatars.com/api/?name=Arjun+Sharma&background=random',
      verified: true,
      totalSales: 125000,
      rating: 4.8,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Priya Mehta',
      email: 'priya.mehta@email.com',
      phone: '+91 87654 32109',
      role: 'buyer',
      status: 'active',
      joinDate: '2024-01-10',
      location: 'Delhi, India',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Mehta&background=random',
      verified: true,
      totalOrders: 24,
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 76543 21098',
      role: 'seller',
      status: 'inactive',
      joinDate: '2024-01-08',
      location: 'Bangalore, Karnataka',
      avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=random',
      verified: false,
      totalSales: 45000,
      rating: 4.2,
      lastActive: '2 days ago'
    },
    {
      id: '4',
      name: 'Sneha Patel',
      email: 'sneha.patel@email.com',
      phone: '+91 65432 10987',
      role: 'buyer',
      status: 'active',
      joinDate: '2024-01-05',
      location: 'Ahmedabad, Gujarat',
      avatar: 'https://ui-avatars.com/api/?name=Sneha+Patel&background=random',
      verified: true,
      totalOrders: 18,
      lastActive: '30 minutes ago'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '+91 54321 09876',
      role: 'seller',
      status: 'suspended',
      joinDate: '2024-01-03',
      location: 'Jaipur, Rajasthan',
      avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=random',
      verified: false,
      totalSales: 15000,
      rating: 3.8,
      lastActive: '1 week ago'
    }
  ]);

  const roles = ['all', 'buyer', 'seller', 'admin'];
  const statuses = ['all', 'active', 'inactive', 'suspended'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'suspended': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'seller': return 'bg-blue-100 text-blue-800';
      case 'buyer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    sellers: users.filter(u => u.role === 'seller').length,
    buyers: users.filter(u => u.role === 'buyer').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage platform users, sellers, and administrators</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sellers</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.sellers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Buyers</p>
                <p className="text-2xl font-bold text-orange-600">{userStats.buyers}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            {user.verified && (
                              <Shield className="w-4 h-4 text-blue-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {user.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1">{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.role === 'seller' ? (
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">₹{user.totalSales?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            {user.rating}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium">{user.totalOrders} orders</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded">
                          <Ban className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* User Detail Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h4>
                      {selectedUser.verified && (
                        <Shield className="w-5 h-5 text-blue-500 ml-2" />
                      )}
                    </div>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Contact Information</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{selectedUser.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{selectedUser.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span>Joined {selectedUser.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Account Status</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                          {getStatusIcon(selectedUser.status)}
                          <span className="ml-1">{selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Verified:</span>
                        <span>{selectedUser.verified ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Active:</span>
                        <span>{selectedUser.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedUser.role === 'seller' && (
                  <div className="mt-6">
                    <h5 className="font-medium text-gray-900 mb-3">Seller Performance</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">₹{selectedUser.totalSales?.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Total Sales</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                          <span className="text-2xl font-bold text-gray-900">{selectedUser.rating}</span>
                        </div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.role === 'buyer' && (
                  <div className="mt-6">
                    <h5 className="font-medium text-gray-900 mb-3">Purchase History</h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedUser.totalOrders}</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;