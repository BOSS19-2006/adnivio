import React, { useState } from 'react';
import { Plus, Play, Pause, CreditCard as Edit, Trash2, Eye, Target, TrendingUp, DollarSign, Users, MousePointer, BarChart3, Zap, Brain, Image, Video, Type } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AdCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  adType: 'image' | 'video' | 'text' | 'carousel';
}

const SellerAds: React.FC = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock campaign data
  const campaigns: AdCampaign[] = [
    {
      id: 'AD001',
      name: 'Summer Electronics Sale',
      status: 'active',
      budget: 5000,
      spent: 3200,
      impressions: 45000,
      clicks: 1350,
      conversions: 89,
      ctr: 3.0,
      cpc: 2.37,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      targetAudience: 'Tech Enthusiasts, 25-45',
      adType: 'image'
    },
    {
      id: 'AD002',
      name: 'Wireless Headphones Promo',
      status: 'active',
      budget: 3000,
      spent: 1800,
      impressions: 28000,
      clicks: 840,
      conversions: 52,
      ctr: 3.0,
      cpc: 2.14,
      startDate: '2024-01-05',
      endDate: '2024-01-25',
      targetAudience: 'Music Lovers, 18-35',
      adType: 'video'
    },
    {
      id: 'AD003',
      name: 'Smart Watch Collection',
      status: 'paused',
      budget: 2500,
      spent: 1200,
      impressions: 18000,
      clicks: 540,
      conversions: 28,
      ctr: 3.0,
      cpc: 2.22,
      startDate: '2024-01-10',
      endDate: '2024-01-30',
      targetAudience: 'Fitness Enthusiasts, 20-40',
      adType: 'carousel'
    }
  ];

  // Mock performance data
  const performanceData = [
    { date: '2024-01-01', impressions: 2500, clicks: 75, conversions: 5 },
    { date: '2024-01-02', impressions: 3200, clicks: 96, conversions: 7 },
    { date: '2024-01-03', impressions: 2800, clicks: 84, conversions: 6 },
    { date: '2024-01-04', impressions: 3500, clicks: 105, conversions: 8 },
    { date: '2024-01-05', impressions: 4200, clicks: 126, conversions: 9 },
    { date: '2024-01-06', impressions: 3800, clicks: 114, conversions: 7 },
    { date: '2024-01-07', impressions: 4500, clicks: 135, conversions: 11 }
  ];

  const audienceData = [
    { name: '18-25', value: 25, color: '#8B5CF6' },
    { name: '26-35', value: 35, color: '#3B82F6' },
    { name: '36-45', value: 25, color: '#10B981' },
    { name: '46+', value: 15, color: '#F59E0B' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'carousel':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Image className="w-4 h-4" />;
    }
  };

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Ad Manager</h1>
            <p className="text-gray-600">Create, manage, and optimize your advertising campaigns with AI</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalBudget.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Spent: ₹{totalSpent.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% vs last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
                <p className="text-sm text-green-600">CTR: {avgCTR.toFixed(2)}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <MousePointer className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
                <p className="text-sm text-green-600">+8% vs last month</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'campaigns'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('ai-insights')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ai-insights'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                AI Insights
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'campaigns' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Campaign</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Budget</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {getAdTypeIcon(campaign.adType)}
                              <div>
                                <div className="font-medium text-gray-900">{campaign.name}</div>
                                <div className="text-sm text-gray-500">{campaign.targetAudience}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">₹{campaign.budget.toLocaleString()}</div>
                              <div className="text-gray-500">Spent: ₹{campaign.spent.toLocaleString()}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <div className="text-gray-900">{campaign.impressions.toLocaleString()} impressions</div>
                              <div className="text-gray-500">{campaign.clicks} clicks • {campaign.conversions} conversions</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="impressions" stroke="#8B5CF6" strokeWidth={2} />
                        <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} />
                        <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={audienceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {audienceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai-insights' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">Optimize Budget Allocation</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Your "Summer Electronics Sale" campaign is performing 23% better than average. 
                            Consider increasing its budget by ₹1,500 for maximum ROI.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">Audience Expansion</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            AI detected high engagement from 46+ age group. Consider creating a targeted 
                            campaign for this demographic with 15% higher conversion potential.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">Creative Optimization</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Video ads are showing 40% higher engagement. AI suggests creating video 
                            variants for your top-performing image campaigns.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Ad Creatives</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg h-32 mb-3 flex items-center justify-center">
                        <span className="text-white font-semibold">AI Generated Ad</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Summer Tech Sale</h4>
                      <p className="text-sm text-gray-600">AI-optimized for tech enthusiasts</p>
                      <button className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Use This Creative
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg h-32 mb-3 flex items-center justify-center">
                        <span className="text-white font-semibold">AI Generated Ad</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Wireless Freedom</h4>
                      <p className="text-sm text-gray-600">AI-optimized for music lovers</p>
                      <button className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Use This Creative
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg h-32 mb-3 flex items-center justify-center">
                        <span className="text-white font-semibold">AI Generated Ad</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Smart Living</h4>
                      <p className="text-sm text-gray-600">AI-optimized for fitness enthusiasts</p>
                      <button className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Use This Creative
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Campaign Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter campaign name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option>Image Ad</option>
                      <option>Video Ad</option>
                      <option>Text Ad</option>
                      <option>Carousel Ad</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Tech Enthusiasts, 25-45"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">AI Suggestions</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Based on your product data, AI recommends targeting "Tech Enthusiasts aged 25-45" 
                    with a budget of ₹3,500 for optimal performance.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAds;