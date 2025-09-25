import React, { useState } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, Building, Eye, EyeOff, TrendingUp, DollarSign, Wallet, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  category: 'sale' | 'ad_spend' | 'withdrawal' | 'refund' | 'deposit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod?: string;
}

const SellerWallet: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Mock wallet data
  const walletBalance = 45750;
  const adBalance = 12500;
  const pendingAmount = 3200;
  const totalEarnings = 125000;

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: 'TXN001',
      type: 'credit',
      category: 'sale',
      amount: 2499,
      description: 'Sale: Wireless Headphones',
      date: '2024-01-15T10:30:00Z',
      status: 'completed',
      paymentMethod: 'UPI'
    },
    {
      id: 'TXN002',
      type: 'debit',
      category: 'ad_spend',
      amount: 500,
      description: 'Ad Campaign: Summer Electronics',
      date: '2024-01-15T09:15:00Z',
      status: 'completed',
      paymentMethod: 'Wallet'
    },
    {
      id: 'TXN003',
      type: 'debit',
      category: 'withdrawal',
      amount: 15000,
      description: 'Bank Transfer to SBI ***1234',
      date: '2024-01-14T16:45:00Z',
      status: 'pending',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'TXN004',
      type: 'credit',
      category: 'deposit',
      amount: 5000,
      description: 'Funds Added via UPI',
      date: '2024-01-14T14:20:00Z',
      status: 'completed',
      paymentMethod: 'UPI'
    },
    {
      id: 'TXN005',
      type: 'credit',
      category: 'refund',
      amount: 1299,
      description: 'Refund: Cancelled Order #ORD123',
      date: '2024-01-13T11:10:00Z',
      status: 'completed',
      paymentMethod: 'Original Method'
    }
  ];

  // Mock chart data
  const balanceHistory = [
    { date: '2024-01-01', balance: 35000 },
    { date: '2024-01-03', balance: 38500 },
    { date: '2024-01-05', balance: 42000 },
    { date: '2024-01-07', balance: 39500 },
    { date: '2024-01-09', balance: 43200 },
    { date: '2024-01-11', balance: 46800 },
    { date: '2024-01-13', balance: 44500 },
    { date: '2024-01-15', balance: 45750 }
  ];

  const monthlyEarnings = [
    { month: 'Aug', earnings: 18500 },
    { month: 'Sep', earnings: 22000 },
    { month: 'Oct', earnings: 19800 },
    { month: 'Nov', earnings: 25500 },
    { month: 'Dec', earnings: 28200 },
    { month: 'Jan', earnings: 31000 }
  ];

  const getTransactionIcon = (category: string, type: string) => {
    if (type === 'credit') {
      return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
    } else {
      return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet & Payments</h1>
            <p className="text-gray-600">Manage your funds, track earnings, and handle withdrawals</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddFunds(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Funds
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              <ArrowUpRight className="w-5 h-5" />
              Withdraw
            </button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <Wallet className="w-6 h-6" />
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div>
              <p className="text-purple-100 text-sm font-medium">Main Balance</p>
              <p className="text-2xl font-bold">
                {showBalance ? formatAmount(walletBalance) : '₹ ••••••'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ad Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {showBalance ? formatAmount(adBalance) : '₹ ••••••'}
                </p>
                <p className="text-sm text-blue-600">Available for ads</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {showBalance ? formatAmount(pendingAmount) : '₹ ••••••'}
                </p>
                <p className="text-sm text-yellow-600">Processing</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {showBalance ? formatAmount(totalEarnings) : '₹ ••••••'}
                </p>
                <p className="text-sm text-green-600">+15% this month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Transactions
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
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance History</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={balanceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatAmount(value as number)} />
                        <Line type="monotone" dataKey="balance" stroke="#8B5CF6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowAddFunds(true)}
                          className="w-full flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
                        >
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Plus className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">Add Funds</div>
                            <div className="text-sm text-gray-500">Top up your wallet balance</div>
                          </div>
                        </button>

                        <button
                          onClick={() => setShowWithdraw(true)}
                          className="w-full flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                        >
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <ArrowUpRight className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">Withdraw Funds</div>
                            <div className="text-sm text-gray-500">Transfer to your bank account</div>
                          </div>
                        </button>

                        <button className="w-full flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">Transfer to Ad Balance</div>
                            <div className="text-sm text-gray-500">Move funds for advertising</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Transaction</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {getTransactionIcon(transaction.category, transaction.type)}
                              <div>
                                <div className="font-medium text-gray-900">{transaction.description}</div>
                                <div className="text-sm text-gray-500 capitalize">{transaction.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className={`font-medium ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-900">{formatDate(transaction.date)}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-500">{transaction.paymentMethod}</div>
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
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings Trend</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatAmount(value as number)} />
                      <Bar dataKey="earnings" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Funds Modal */}
        {showAddFunds && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Funds</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="payment" className="text-green-600" />
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">UPI</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="payment" className="text-green-600" />
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="payment" className="text-green-600" />
                      <Building className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Net Banking</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddFunds(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Withdraw Funds</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter amount"
                    max={walletBalance}
                  />
                  <p className="text-sm text-gray-500 mt-1">Available: {formatAmount(walletBalance)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>SBI Account ***1234</option>
                    <option>HDFC Account ***5678</option>
                    <option>Add New Account</option>
                  </select>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Withdrawals typically take 1-3 business days to process. 
                    A processing fee of ₹10 will be deducted.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerWallet;