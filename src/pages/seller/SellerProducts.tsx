import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Package,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  image: string;
  views: number;
  sales: number;
  rating: number;
  dateAdded: string;
}

const SellerProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock products data
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 2999,
      stock: 25,
      category: 'Electronics',
      status: 'active',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 1234,
      sales: 89,
      rating: 4.8,
      dateAdded: '2024-01-15'
    },
    {
      id: '2',
      name: 'Cotton Casual T-Shirt',
      price: 599,
      stock: 0,
      category: 'Fashion',
      status: 'out_of_stock',
      image: 'https://images.pexels.com/photos/1113554/pexels-photo-1113554.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 567,
      sales: 234,
      rating: 4.5,
      dateAdded: '2024-01-10'
    },
    {
      id: '3',
      name: 'Organic Green Tea',
      price: 299,
      stock: 150,
      category: 'Health',
      status: 'active',
      image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 890,
      sales: 156,
      rating: 4.7,
      dateAdded: '2024-01-08'
    },
    {
      id: '4',
      name: 'Smart Fitness Watch',
      price: 3999,
      stock: 12,
      category: 'Electronics',
      status: 'active',
      image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 2345,
      sales: 67,
      rating: 4.6,
      dateAdded: '2024-01-05'
    },
    {
      id: '5',
      name: 'Handcrafted Wooden Vase',
      price: 1299,
      stock: 8,
      category: 'Home',
      status: 'inactive',
      image: 'https://images.pexels.com/photos/1092324/pexels-photo-1092324.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 345,
      sales: 23,
      rating: 4.9,
      dateAdded: '2024-01-03'
    }
  ]);

  const categories = ['all', 'Electronics', 'Fashion', 'Health', 'Home'];
  const statuses = ['all', 'active', 'inactive', 'out_of_stock'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'out_of_stock': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'out_of_stock': return 'Out of Stock';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Products</h1>
            <p className="text-gray-600">Manage your product listings and inventory</p>
          </div>
          <button className="mt-4 lg:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Products</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.status === 'out_of_stock').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-blue-600">
                  {products.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
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
                    {status === 'all' ? 'All Status' : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    <span className="ml-1">{getStatusText(product.status)}</span>
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-600">₹{product.price.toLocaleString()}</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <div>
                    <span className="block">Stock</span>
                    <span className="font-medium text-gray-900">{product.stock}</span>
                  </div>
                  <div>
                    <span className="block">Sales</span>
                    <span className="font-medium text-gray-900">{product.sales}</span>
                  </div>
                  <div>
                    <span className="block">Views</span>
                    <span className="font-medium text-gray-900">{product.views}</span>
                  </div>
                  <div>
                    <span className="block">Added</span>
                    <span className="font-medium text-gray-900">{product.dateAdded}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-100 text-purple-600 py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button className="bg-gray-100 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="bg-red-100 text-red-600 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center mx-auto">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;