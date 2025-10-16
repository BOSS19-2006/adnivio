import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Target,
  Star,
  ArrowRight,
  Sparkles,
  Bot,
  MapPin,
  Award
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: "Zero Commission",
      description: "Keep 100% of your profits. No hidden fees or commission charges.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Bot,
      title: "AI-Powered Ads",
      description: "Let AI create and optimize your advertising campaigns automatically.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Target,
      title: "Smart Targeting",
      description: "Reach the right customers with AI-driven audience targeting.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track performance with detailed analytics and insights.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: MapPin,
      title: "Hyperlocal Market",
      description: "Connect with nearby customers for instant delivery options.",
      color: "from-teal-500 to-green-600"
    },
    {
      icon: Award,
      title: "Premium Features",
      description: "Get verified badges, featured listings, and priority support.",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Sellers", icon: Users },
    { number: "1M+", label: "Happy Buyers", icon: Star },
    { number: "₹100Cr+", label: "GMV Processed", icon: TrendingUp },
    { number: "99.9%", label: "Uptime", icon: Shield }
  ];

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-cyan-500 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-teal-500 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Grow Your Business with
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Zero Commission
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
            >
              The AI-powered marketplace that helps SMEs sell without commission and advertise smarter. 
              Join thousands of businesses already growing with Adnivio.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/register"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center"
              >
                Start Selling Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/marketplace"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
              >
                Explore Marketplace
              </Link>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center text-white/80"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Trusted by 50,000+ sellers • No setup fees • Start in 5 minutes</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Everything You Need to
              <span className="block gradient-text">Grow Your Business</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              From zero-commission selling to AI-powered advertising, we provide all the tools 
              you need to scale your business efficiently.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 card-hover group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              How It Works
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Get started in three simple steps and start growing your business today.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                title: "Create Your Store",
                description: "Sign up and set up your digital storefront in minutes with our intuitive store builder.",
                color: "from-purple-500 to-indigo-500"
              },
              {
                step: "02", 
                title: "List Your Products",
                description: "Add unlimited products with AI-generated descriptions and optimized pricing suggestions.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "03",
                title: "Start Selling & Advertising",
                description: "Launch AI-powered ad campaigns and start receiving orders with zero commission fees.",
                color: "from-green-500 to-teal-500"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative text-center"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${step.color} rounded-full text-white font-bold text-2xl mb-6`}>
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <ArrowRight className="w-8 h-8 text-gray-300 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto"
            >
              Join thousands of successful sellers who have already made the switch to Adnivio. 
              Start your journey today with zero setup costs.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center"
              >
                Get Started Free
                <Zap className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/marketplace"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Explore Platform
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;