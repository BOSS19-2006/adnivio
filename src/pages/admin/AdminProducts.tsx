import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Star,
  TrendingUp,
  MoreVertical
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: number;
  stock: number;
  status: 'approved' | 'pending' | 'rejected' | 'suspended';
  image: string;
  rating: number;
  reviews: number;
  sales: number;
  dateAdded: string;
  lastUpdated: string;
  flags: number;
}

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Mock products data
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      seller: 'TechHub Store',
      category: 'Electronics',
      price: 2999,
      stock: 25,
      status: 'approved',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 234,
      sales: 89,
      dateAdded: '2024-01-15',
      lastUpdated: '2024-01-15',
      flags: 0
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      seller: 'FitTech Solutions',
      category: 'Electronics',
      price: 3999,
      stock: 12,
      status: 'pending',
      image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      reviews: 156,
      sales: 45,
      dateAdded: '2024-01-14',
      lastUpdated: '2024-01-14',
      flags: 0
    },
    {
      id: '3',
      name: 'Cotton Casual T-Shirt',
      seller: 'FashionForward',
      category: 'Fashion',
      price: 599,
      stock: 0,
      status: 'approved',
      image: 'https://images.pexels.com/photos/1113554/pexels-photo-1113554.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      reviews: 567,
      sales: 234,
      dateAdded: '2024-01-10',
      lastUpdated: '2024-01-12',
      flags: 2
    },
    {
      id: '4',
      name: 'Organic Green Tea',
      seller: 'HealthyLife',
      category: 'Health',
      price: 299,
      stock: 150,
      status: 'approved',
      image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      reviews: 123,
      sales: 156,
      dateAdded: '2024-01-08',
      lastUpdated: '2024-01-10',
      flags: 0
    },
    {
      id: '5',
      name: 'Suspicious Product',
      seller: 'Unknown Seller',
      category: 'Electronics',
      price: 99999,
      stock: 1000,
      status: 'rejected',
      image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 2.1,
      reviews: 5,
      sales: 0,
      dateAdded: '2024-01-05',
      lastUpdated: '2024-01-06',
      flags: 15
    }
  ]);

  const categories = ['all', 'Electronics', 'Fashion', 'Health', 'Home'];
  const statuses = ['all', 'approved', 'pending', 'rejected', 'suspended'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleApproveProduct = (productId: string) => {
    // Handle product approval
    console.log('Approving product:', productId);
  };

  const handleRejectProduct = (productId: string) => {
    // Handle product rejection
    console.log('Rejecting product:', productId);
  };

  const productStats = {
    total: products.length,
    approved: products.filter(p => p.status === 'approved').length,
    pending: products.filter(p => p.status === 'pending').length,
    flagged: products.filter(p => p.flags > 0).length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">Review and manage product listings on the platform</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{productStats.total}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">{productStats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{productStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Flagged</p>
                <p className="text-2xl font-bold text-red-600">{productStats.flagged}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
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
                  placeholder="Search products or sellers..."
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
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">Stock: {product.stock}</div>
                          {product.flags > 0 && (
                            <div className="flex items-center text-xs text-red-600 mt-1">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {product.flags} flags
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.seller}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        <span className="ml-1">{product.status.charAt(0).toUpperCase() + product.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>{product.rating}</span>
                          <span className="text-gray-500 ml-1">({product.reviews})</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {product.sales} sales
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {product.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveProduct(product.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectProduct(product.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Product Detail Modal */}
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Product Review</h3>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedProduct.name}</h4>
                    <p className="text-gray-600 mb-4">by {selectedProduct.seller}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">₹{selectedProduct.price.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Price</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{selectedProduct.stock}</div>
                        <div className="text-sm text-gray-600">Stock</div>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                      <span className="text-lg font-medium">{selectedProduct.rating}</span>
                      <span className="text-gray-500 ml-2">({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Product Information</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium">{selectedProduct.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date Added:</span>
                            <span className="font-medium">{selectedProduct.dateAdded}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="font-medium">{selectedProduct.lastUpdated}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Sales:</span>
                            <span className="font-medium">{selectedProduct.sales}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Status</h5>
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedProduct.status)}`}>
                          {getStatusIcon(selectedProduct.status)}
                          <span className="ml-2">{selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1)}</span>
                        </span>
                      </div>

                      {selectedProduct.flags > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-3">Flags & Reports</h5>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                              <span className="text-red-800 font-medium">{selectedProduct.flags} reports</span>
                            </div>
                            <p className="text-red-700 text-sm mt-2">
                              This product has been flagged by users. Please review carefully.
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedProduct.status === 'pending' && (
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleApproveProduct(selectedProduct.id)}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Product
                          </button>
                          <button
                            onClick={() => handleRejectProduct(selectedProduct.id)}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject Product
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;