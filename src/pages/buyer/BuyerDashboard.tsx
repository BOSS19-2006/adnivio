import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  Clock, 
  Star, 
  Package, 
  Truck,
  Gift,
  CreditCard,
  MapPin,
  Bell,
  User,
  Settings,
  ArrowRight,
  TrendingUp,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BuyerDashboard = () => {
  // Mock data for buyer dashboard
  const recentOrders = [
    {
      id: 'ORD12345',
      product: 'Premium Wireless Headphones',
      seller: 'TechHub Store',
      amount: 2999,
      status: 'Delivered',
      date: '2024-01-15',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: null
    },
    {
      id: 'ORD12346',
      product: 'Cotton Casual T-Shirt',
      seller: 'FashionForward',
      amount: 599,
      status: 'Shipped',
      date: '2024-01-14',
      image: 'https://images.pexels.com/photos/1113554/pexels-photo-1113554.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: null
    },
    {
      id: 'ORD12347',
      product: 'Smart Fitness Watch',
      seller: 'FitTech Solutions',
      amount: 3999,
      status: 'Processing',
      date: '2024-01-13',
      image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: null
    }
  ];

  const wishlistItems = [
    {
      id: '1',
      name: 'Professional Camera Lens',
      price: 15999,
      originalPrice: 18999,
      image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'PhotoPro Equipment',
      inStock: true
    },
    {
      id: '2',
      name: 'Handcrafted Wooden Vase',
      price: 1299,
      image: 'https://images.pexels.com/photos/1092324/pexels-photo-1092324.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: 'ArtisanCraft',
      inStock: true
    }
  ];

  const recommendations = [
    {
      id: '1',
      name: 'Bluetooth Speaker',
      price: 1999,
      originalPrice: 2999,
      image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      reviews: 234
    },
    {
      id: '2',
      name: 'Yoga Mat Premium',
      price: 899,
      originalPrice: 1299,
      image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 156
    },
    {
      id: '3',
      name: 'Coffee Maker',
      price: 4999,
      originalPrice: 6999,
      image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      reviews: 89
    }
  ];

  const stats = [
    {
      title: 'Total Orders',
      value: '24',
      icon: ShoppingBag,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Wishlist Items',
      value: '12',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50'
    },
    {
      title: 'Loyalty Points',
      value: '2,450',
      icon: Gift,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Money Saved',
      value: '₹8,450',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <Package className="w-4 h-4 text-green-600" />;
      case 'Shipped': return <Truck className="w-4 h-4 text-blue-600" />;
      case 'Processing': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Here's what's happening with your orders and wishlist</p>
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
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className="w-6 h-6 text-gray-700" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link 
                to="/orders" 
                className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <img
                    src={order.image}
                    alt={order.product}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{order.product}</h4>
                    <p className="text-sm text-gray-600 mb-2">{order.seller}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-purple-600">₹{order.amount.toLocaleString()}</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-2">{order.date}</p>
                    {order.status === 'Delivered' && !order.rating && (
                      <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                        Rate Product
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link
                to="/orders"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Package className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Track Orders</h4>
                  <p className="text-sm text-gray-600">View order status</p>
                </div>
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <Heart className="w-6 h-6 text-pink-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Wishlist</h4>
                  <p className="text-sm text-gray-600">Saved items</p>
                </div>
              </Link>
              <Link
                to="/profile"
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <User className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Profile</h4>
                  <p className="text-sm text-gray-600">Manage account</p>
                </div>
              </Link>
              <Link
                to="/addresses"
                className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <MapPin className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Addresses</h4>
                  <p className="text-sm text-gray-600">Manage delivery</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wishlist Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
              <Link 
                to="/wishlist" 
                className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {wishlistItems.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.seller}</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-purple-600">₹{item.price.toLocaleString()}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
              <Link 
                to="/marketplace" 
                className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
              >
                View More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {recommendations.slice(0, 2).map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-purple-600">₹{product.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;