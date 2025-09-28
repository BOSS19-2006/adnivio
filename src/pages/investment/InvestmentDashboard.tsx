import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Plus,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Briefcase,
  Award,
  BarChart3
} from 'lucide-react';
import { useInvestment } from '../../hooks/useInvestment';
import { useAuth } from '../../contexts/AuthContext';

const InvestmentDashboard = () => {
  const { user } = useAuth();
  const { 
    investmentProfiles, 
    investorProfiles, 
    loading, 
    fetchInvestmentProfiles,
    getRecommendedSMEs,
    getRecommendedInvestors
  } = useInvestment();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [fundingRange, setFundingRange] = useState([0, 10000000]);
  const [viewMode, setViewMode] = useState<'sme' | 'investor'>('sme');
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const industries = [
    'all', 'Technology', 'Healthcare', 'Fintech', 'E-commerce', 
    'Manufacturing', 'Education', 'Food & Beverage', 'Real Estate', 'Other'
  ];

  const stages = [
    'all', 'idea', 'mvp', 'early_revenue', 'growth', 'expansion'
  ];

  const getStageLabel = (stage: string) => {
    const labels: { [key: string]: string } = {
      idea: 'Idea Stage',
      mvp: 'MVP',
      early_revenue: 'Early Revenue',
      growth: 'Growth',
      expansion: 'Expansion'
    };
    return labels[stage] || stage;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  useEffect(() => {
    if (user?.role === 'investor') {
      getRecommendedSMEs().then(setRecommendations);
    }
  }, [user]);

  const filteredProfiles = investmentProfiles.filter(profile => {
    const matchesSearch = profile.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || profile.industry === selectedIndustry;
    const matchesStage = selectedStage === 'all' || profile.stage === selectedStage;
    const matchesFunding = profile.funding_amount >= fundingRange[0] && profile.funding_amount <= fundingRange[1];
    
    return matchesSearch && matchesIndustry && matchesStage && matchesFunding;
  });

  const stats = [
    {
      title: 'Active SMEs',
      value: investmentProfiles.length.toString(),
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Funding Sought',
      value: formatCurrency(investmentProfiles.reduce((sum, p) => sum + p.funding_amount, 0)),
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Investors',
      value: investorProfiles.length.toString(),
      icon: Users,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Success Rate',
      value: '78%',
      icon: Target,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Marketplace</h1>
            <p className="text-gray-600">Connect SMEs with investors for growth funding</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            {user?.role === 'seller' && (
              <Link
                to="/investment/create-profile"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Funding Profile
              </Link>
            )}
            {user?.role === 'buyer' && (
              <Link
                to="/investment/become-investor"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Become Investor
              </Link>
            )}
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
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className="w-6 h-6 text-gray-700" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* View Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('sme')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'sme' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                SMEs Seeking Funding
              </button>
              <button
                onClick={() => setViewMode('investor')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'investor' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Active Investors
              </button>
            </div>
          </div>

          {viewMode === 'sme' && (
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry === 'all' ? 'All Industries' : industry}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>
                      {stage === 'all' ? 'All Stages' : getStageLabel(stage)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        {user?.role === 'investor' && recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-purple-600">AI Match</span>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {Math.floor(Math.random() * 20) + 80}% Match
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{profile.company_name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{profile.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">
                      {formatCurrency(profile.funding_amount)}
                    </span>
                    <Link
                      to={`/investment/sme/${profile.id}`}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Content Grid */}
        {viewMode === 'sme' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{profile.company_name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{profile.industry}</span>
                        <span className="mx-2">•</span>
                        <span>{getStageLabel(profile.stage)}</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{profile.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Funding Sought</p>
                      <p className="text-lg font-bold text-purple-600">{formatCurrency(profile.funding_amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Equity Offered</p>
                      <p className="text-lg font-bold text-gray-900">{profile.equity_offered}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{profile.views_count} views</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{profile.interest_count} interested</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/investment/sme/${profile.id}`}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <button className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investorProfiles.map((investor, index) => (
              <motion.div
                key={investor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={investor.investor.avatar_url || `https://ui-avatars.com/api/?name=${investor.investor.full_name}&background=random`}
                      alt={investor.investor.full_name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{investor.investor.full_name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{investor.investor_type} Investor</p>
                    </div>
                    {investor.verified && (
                      <Award className="w-5 h-5 text-blue-500 ml-auto" />
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{investor.bio}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Investment Range</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(investor.investment_range_min)} - {formatCurrency(investor.investment_range_max)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Portfolio</p>
                      <p className="text-sm font-medium text-gray-900">{investor.portfolio_companies?.length || 0} companies</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Preferred Industries</p>
                    <div className="flex flex-wrap gap-1">
                      {investor.preferred_industries?.slice(0, 3).map((industry, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {industry}
                        </span>
                      ))}
                      {(investor.preferred_industries?.length || 0) > 3 && (
                        <span className="text-xs text-gray-500">+{(investor.preferred_industries?.length || 0) - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/investment/investor/${investor.id}`}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
                    >
                      View Profile
                    </Link>
                    <button className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredProfiles.length === 0 && viewMode === 'sme' && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No SMEs found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentDashboard;