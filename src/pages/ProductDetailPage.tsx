import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  MapPin, 
  Shield, 
  Truck, 
  RotateCcw,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  ThumbsUp,
  Clock
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviews: number;
  description: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    totalProducts: number;
    avatar: string;
    location: string;
  };
  features: string[];
  specifications: { [key: string]: string };
  category: string;
  tags: string[];
  inStock: number;
  discount?: number;
  isSponsored?: boolean;
}

interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'description' | 'reviews' | 'specifications'>('description');

  useEffect(() => {
    // Mock product data - in real app, fetch from API
    const mockProduct: Product = {
      id: id || '1',
      name: 'Premium Wireless Headphones with Active Noise Cancellation',
      price: 2999,
      originalPrice: 4999,
      images: [
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      rating: 4.8,
      reviews: 234,
      description: 'Experience exceptional sound quality with these premium wireless headphones. Featuring advanced active noise cancellation technology, premium leather padding, and up to 30 hours of battery life. Perfect for music lovers, professionals, and travelers.',
      seller: {
        id: 'tech-hub',
        name: 'TechHub Store',
        rating: 4.9,
        verified: true,
        totalProducts: 156,
        avatar: 'https://ui-avatars.com/api/?name=TechHub&background=7c3aed&color=fff',
        location: 'Mumbai, Maharashtra'
      },
      features: [
        'Active Noise Cancellation',
        '30-hour battery life',
        'Premium leather padding',
        'Wireless & Bluetooth 5.0',
        'Built-in microphone',
        'Foldable design'
      ],
      specifications: {
        'Brand': 'TechHub Premium',
        'Model': 'TH-WH3000',
        'Type': 'Over-ear Wireless',
        'Battery Life': '30 hours',
        'Charging Time': '2 hours',
        'Bluetooth Version': '5.0',
        'Weight': '280g',
        'Warranty': '2 years'
      },
      category: 'electronics',
      tags: ['wireless', 'bluetooth', 'premium', 'noise-cancelling'],
      inStock: 25,
      discount: 40,
      isSponsored: true
    };

    const mockReviews: Review[] = [
      {
        id: '1',
        user: 'Arjun Sharma',
        avatar: 'https://ui-avatars.com/api/?name=Arjun+Sharma&background=random',
        rating: 5,
        comment: 'Absolutely amazing headphones! The sound quality is incredible and the noise cancellation works perfectly. Worth every penny.',
        date: '2024-01-15',
        helpful: 23,
        images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400']
      },
      {
        id: '2',
        user: 'Priya Mehta',
        avatar: 'https://ui-avatars.com/api/?name=Priya+Mehta&background=random',
        rating: 4,
        comment: 'Great product! Battery life is excellent. Only wish the carrying case was a bit more compact.',
        date: '2024-01-10',
        helpful: 15
      },
      {
        id: '3',
        user: 'Rajesh Kumar',
        avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=random',
        rating: 5,
        comment: 'Perfect for my daily commute. The noise cancellation blocks out all the traffic noise. Highly recommended!',
        date: '2024-01-08',
        helpful: 31
      }
    ];

    setProduct(mockProduct);
    setReviews(mockReviews);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          sellerId: product.seller.id
        });
      }
      toast.success(`Added ${quantity} item(s) to cart!`);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {product.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </div>
              )}

              {product.isSponsored && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Sponsored
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-purple-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-medium text-gray-900 ml-2">{product.rating}</span>
                  <span className="text-gray-500 ml-2">({product.reviews} reviews)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFavorite}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                  <button
                    onClick={shareProduct}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Share2 className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-purple-600">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
                {product.discount && (
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                    Save ₹{(product.originalPrice! - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-6">
                {product.inStock > 0 ? (
                  <span className="text-green-600 font-medium">In Stock ({product.inStock} available)</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Sold by</h3>
              <div className="flex items-center gap-4">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{product.seller.name}</h4>
                    {product.seller.verified && (
                      <Award className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span>{product.seller.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{product.seller.totalProducts} products</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{product.seller.location}</span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/seller/${product.seller.id}`}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  View Store
                </Link>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    disabled={quantity >= product.inStock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.inStock === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Free Delivery</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <RotateCcw className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Easy Returns</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">2 Year Warranty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'reviews', label: `Reviews (${product.reviews})` },
                  { id: 'specifications', label: 'Specifications' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      selectedTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {selectedTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                </div>
              )}

              {selectedTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-900">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-purple-600">{product.rating}</div>
                      <div>
                        <div className="flex items-center mb-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-gray-600 text-sm">{product.reviews} reviews</div>
                      </div>
                    </div>
                    
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Write Review
                    </button>
                  </div>

                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.avatar}
                            alt={review.user}
                            className="w-10 h-10 rounded-full"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900">{review.user}</h4>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(review.date).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{review.comment}</p>
                            
                            {review.images && (
                              <div className="flex gap-2 mb-3">
                                {review.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Review image ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <button className="flex items-center hover:text-purple-600 transition-colors">
                                <ThumbsUp className="w-3 h-3 mr-1" />
                                Helpful ({review.helpful})
                              </button>
                              <button className="hover:text-purple-600 transition-colors">Reply</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;