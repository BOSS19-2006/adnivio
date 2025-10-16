import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Heart, 
  ShoppingCart, 
  MapPin, 
  Zap,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  category: string;
  tags: string[];
  isSponsored?: boolean;
  discount?: number;
}

const MarketplacePage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Mock product data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 2999,
        originalPrice: 4999,
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        reviews: 234,
        seller: 'TechHub Store',
        location: 'Mumbai, Maharashtra',
        category: 'electronics',
        tags: ['wireless', 'bluetooth', 'premium'],
        isSponsored: true,
        discount: 40
      },
      {
        id: '2',
        name: 'Cotton Casual T-Shirt',
        price: 599,
        originalPrice: 899,
        image: 'https://images.pexels.com/photos/1113554/pexels-photo-1113554.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.5,
        reviews: 567,
        seller: 'FashionForward',
        location: 'Delhi, India',
        category: 'fashion',
        tags: ['cotton', 'casual', 'comfortable'],
        discount: 33
      },
      {
        id: '3',
        name: 'Organic Green Tea (250g)',
        price: 299,
        image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.7,
        reviews: 123,
        seller: 'HealthyLife',
        location: 'Bangalore, Karnataka',
        category: 'health',
        tags: ['organic', 'tea', 'healthy']
      },
      {
        id: '4',
        name: 'Smart Fitness Watch',
        price: 3999,
        originalPrice: 5999,
        image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.6,
        reviews: 456,
        seller: 'FitTech Solutions',
        location: 'Pune, Maharashtra',
        category: 'electronics',
        tags: ['fitness', 'smart', 'health'],
        isSponsored: true,
        discount: 33
      },
      {
        id: '5',
        name: 'Handcrafted Wooden Vase',
        price: 1299,
        image: 'https://images.pexels.com/photos/1092324/pexels-photo-1092324.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.9,
        reviews: 89,
        seller: 'ArtisanCraft',
        location: 'Jaipur, Rajasthan',
        category: 'home',
        tags: ['handmade', 'wooden', 'decor']
      },
      {
        id: '6',
        name: 'Professional Camera Lens',
        price: 15999,
        originalPrice: 18999,
        image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        reviews: 167,
        seller: 'PhotoPro Equipment',
        location: 'Chennai, Tamil Nadu',
        category: 'electronics',
        tags: ['photography', 'professional', 'lens'],
        discount: 16
      },
      {
        id: '7',
        name: 'Running Shoes - Sports Edition',
        price: 2499,
        originalPrice: 3499,
        image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.7,
        reviews: 890,
        seller: 'SportZone',
        location: 'Hyderabad, Telangana',
        category: 'fashion',
        tags: ['sports', 'running', 'shoes'],
        discount: 29
      },
      {
        id: '8',
        name: 'Bluetooth Speaker - Waterproof',
        price: 1899,
        originalPrice: 2999,
        image: 'https://images.pexels.com/photos/1279093/pexels-photo-1279093.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.6,
        reviews: 345,
        seller: 'AudioMaster',
        location: 'Kolkata, West Bengal',
        category: 'electronics',
        tags: ['bluetooth', 'waterproof', 'portable'],
        isSponsored: true,
        discount: 37
      },
      {
        id: '9',
        name: 'Yoga Mat - Premium Quality',
        price: 899,
        image: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        reviews: 234,
        seller: 'FitLife Store',
        location: 'Ahmedabad, Gujarat',
        category: 'health',
        tags: ['yoga', 'fitness', 'exercise']
      },
      {
        id: '10',
        name: 'Ceramic Coffee Mug Set',
        price: 599,
        image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.5,
        reviews: 156,
        seller: 'HomeEssentials',
        location: 'Surat, Gujarat',
        category: 'home',
        tags: ['ceramic', 'kitchen', 'coffee']
      },
      {
        id: '11',
        name: 'Laptop Backpack - Anti-Theft',
        price: 1799,
        originalPrice: 2499,
        image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.7,
        reviews: 678,
        seller: 'TravelGear Pro',
        location: 'Lucknow, Uttar Pradesh',
        category: 'fashion',
        tags: ['backpack', 'laptop', 'travel'],
        discount: 28
      },
      {
        id: '12',
        name: 'LED Desk Lamp - Adjustable',
        price: 1299,
        image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.6,
        reviews: 189,
        seller: 'BrightHome',
        location: 'Indore, Madhya Pradesh',
        category: 'home',
        tags: ['led', 'lamp', 'desk']
      },
      {
        id: '13',
        name: 'Protein Powder - Chocolate Flavor',
        price: 2299,
        originalPrice: 2799,
        image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.7,
        reviews: 567,
        seller: 'NutriZone',
        location: 'Chandigarh, India',
        category: 'health',
        tags: ['protein', 'nutrition', 'fitness'],
        discount: 18
      },
      {
        id: '14',
        name: 'Wireless Gaming Mouse',
        price: 2799,
        originalPrice: 3999,
        image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        reviews: 432,
        seller: 'GamePro Accessories',
        location: 'Coimbatore, Tamil Nadu',
        category: 'electronics',
        tags: ['gaming', 'wireless', 'mouse'],
        isSponsored: true,
        discount: 30
      },
      {
        id: '15',
        name: 'Canvas Wall Art - Abstract',
        price: 1599,
        image: 'https://images.pexels.com/photos/1579708/pexels-photo-1579708.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.9,
        reviews: 145,
        seller: 'ArtHub Gallery',
        location: 'Kochi, Kerala',
        category: 'home',
        tags: ['art', 'canvas', 'decor']
      }
    ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    }, 800);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories', count: products.length },
    { id: 'electronics', name: 'Electronics', count: products.filter(p => p.category === 'electronics').length },
    { id: 'fashion', name: 'Fashion', count: products.filter(p => p.category === 'fashion').length },
    { id: 'health', name: 'Health & Wellness', count: products.filter(p => p.category === 'health').length },
    { id: 'home', name: 'Home & Decor', count: products.filter(p => p.category === 'home').length }
  ];

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default: // featured
        filtered.sort((a, b) => (b.isSponsored ? 1 : 0) - (a.isSponsored ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      sellerId: product.seller
    });
    toast.success(`${product.name} added to cart!`);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast.success('Removed from wishlist');
      } else {
        newFavorites.add(productId);
        toast.success('Added to wishlist');
      }
      return newFavorites;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600 mt-1">Discover amazing products from verified sellers</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1 lg:flex-initial lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, sellers, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
              
              {/* Categories */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Categories</h4>
                <div className="space-y-3">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {category.name} ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Price Range</h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Products */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}
                >
                  {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === 'list' ? 'h-48' : 'h-48'
                        }`}
                      />
                    </Link>
                    
                    {product.isSponsored && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        Sponsored
                      </div>
                    )}
                    
                    {product.discount && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        {product.discount}% OFF
                      </div>
                    )}
                    
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                        }`} 
                      />
                    </button>
                  </div>
                  
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'flex justify-between' : ''}`}>
                      <div className={viewMode === 'list' ? 'flex-1' : ''}>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {product.rating} ({product.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{product.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-blue-600">
                                ₹{product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{product.seller}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={viewMode === 'list' ? 'flex flex-col justify-end ml-6' : ''}>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                  ))}
                </motion.div>

                {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
              )}
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;