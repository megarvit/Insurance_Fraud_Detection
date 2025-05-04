import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { BarChart3, AlertTriangle, CheckCircle, PlusCircle, Search, Download, FileText, IndianRupee, Trash2, Undo2 } from 'lucide-react';

interface Claim {
  id: string;
  policyholder: string;
  amount: number;
  date: string;
  claimsInPastYear: number;
  isFraudulent: boolean;
  fraudReason?: string;
  flaggedRules: string[];
  deletedAt?: string;
}

interface BackendClaim {
  id: number;
  claimId: string;
  policyholderName: string;
  amount: number;
  claimDate: string;
  claimsInPastYear: number;
  status: string;
  isFraudulent: boolean;
}

interface Stats {
  totalClaims: number;
  fraudulentClaims: number;
  totalAmount: number;
  fraudulentAmount: number;
  fraudPercentage: string;
}

const FRAUD_RULES = {
  HIGH_AMOUNT: {
    threshold: 100000,
    message: 'Claim amount exceeds ₹100,000'
  },
  FREQUENT_CLAIMS: {
    threshold: 3,
    message: 'More than 3 claims in the past year'
  }
} as const;

const initialClaims: Claim[] = [
  {
    id: 'C1',
    policyholder: 'Raj Kumar',
    amount: 125000,
    date: '2024-03-15',
    claimsInPastYear: 4,
    isFraudulent: true,
    fraudReason: 'High claim amount and frequency',
    flaggedRules: ['Claim amount exceeds ₹100,000', 'More than 3 claims in the past year']
  },
  {
    id: 'C2',
    policyholder: 'Priya Sharma',
    amount: 45000,
    date: '2024-03-10',
    claimsInPastYear: 1,
    isFraudulent: false,
    flaggedRules: []
  },
  {
    id: 'C3',
    policyholder: 'Amit Patel',
    amount: 150000,
    date: '2024-03-05',
    claimsInPastYear: 2,
    isFraudulent: true,
    fraudReason: 'High claim amount',
    flaggedRules: ['Claim amount exceeds ₹100,000']
  },
  {
    id: 'C4',
    policyholder: 'Sneha Gupta',
    amount: 75000,
    date: '2024-03-01',
    claimsInPastYear: 5,
    isFraudulent: true,
    fraudReason: 'Frequent claims',
    flaggedRules: ['More than 3 claims in the past year']
  }
];

const detectFraud = (claim: Omit<Claim, 'isFraudulent' | 'flaggedRules'>): Claim => {
  const flaggedRules: string[] = [];
  
  if (claim.amount > FRAUD_RULES.HIGH_AMOUNT.threshold) {
    flaggedRules.push(FRAUD_RULES.HIGH_AMOUNT.message);
  }
  
  if (claim.claimsInPastYear > FRAUD_RULES.FREQUENT_CLAIMS.threshold) {
    flaggedRules.push(FRAUD_RULES.FREQUENT_CLAIMS.message);
  }
  
  return {
    ...claim,
    isFraudulent: flaggedRules.length > 0,
    flaggedRules
  };
};

const formatAmount = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, '');
  return numericValue ? new Intl.NumberFormat('en-IN').format(parseInt(numericValue)) : '';
};

const ClaimStatus: React.FC<{ isFraudulent: boolean }> = React.memo(({ isFraudulent }) => (
  <div className="flex items-center">
    {isFraudulent ? (
      <>
        <AlertTriangle className="h-5 w-5 text-red-500 mr-1.5" />
        <span className="text-red-500 text-sm font-medium">Fraudulent</span>
      </>
    ) : (
      <>
        <CheckCircle className="h-5 w-5 text-green-500 mr-1.5" />
        <span className="text-green-500 text-sm font-medium">Legitimate</span>
      </>
    )}
  </div>
));

const StatsCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = React.memo(({ title, value, icon, color }) => (
  <div className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-200">
    <div className="p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 bg-${color}-100 p-3 rounded-lg`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
));

function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'fraudulent' | 'deleted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClaimForm, setShowNewClaimForm] = useState(false);
  const [newClaim, setNewClaim] = useState<Partial<Claim>>({
    id: '',
    policyholder: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    claimsInPastYear: 0
  });
  const [claims, setClaims] = useState<Claim[]>([]);
  const [deletedClaims, setDeletedClaims] = useState<Claim[]>([]);
  const [formattedAmount, setFormattedAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/claims');
        if (!response.ok) {
          throw new Error('Failed to fetch claims');
        }
        const data: BackendClaim[] = await response.json();
        const processedClaims = data.map(claim => detectFraud({
          id: claim.claimId,
          policyholder: claim.policyholderName,
          amount: claim.amount,
          date: claim.claimDate,
          claimsInPastYear: claim.claimsInPastYear || 0
        }));
        setClaims(processedClaims);
      } catch (error) {
        console.error('Error fetching claims:', error);
        console.log('Using fallback data due to backend connectivity issues');
        setClaims(initialClaims);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    
    setFormattedAmount(formatAmount(value));
    setNewClaim(prev => ({ ...prev, amount: numericValue ? parseInt(numericValue) : 0 }));
  }, []);

  const handleDeleteClaim = useCallback(async (claimId: string) => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/claims/${claimId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete claim');
        }

        const claimToDelete = claims.find(claim => claim.id === claimId);
        if (claimToDelete) {
          const updatedClaim = {
            ...claimToDelete,
            deletedAt: new Date().toISOString()
          };
          setDeletedClaims(prev => [...prev, updatedClaim]);
          setClaims(prev => prev.filter(claim => claim.id !== claimId));
        }
      } catch (error) {
        console.error('Error deleting claim:', error);
        // Delete claim locally when backend is not available
        const claimToDelete = claims.find(claim => claim.id === claimId);
        if (claimToDelete) {
          const updatedClaim = {
            ...claimToDelete,
            deletedAt: new Date().toISOString()
          };
          setDeletedClaims(prev => [...prev, updatedClaim]);
          setClaims(prev => prev.filter(claim => claim.id !== claimId));
        }
      }
    }
  }, [claims]);

  const handleRestoreClaim = useCallback(async (claimId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/claims/${claimId}/restore`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to restore claim');
      }

      const claimToRestore = deletedClaims.find(claim => claim.id === claimId);
      if (claimToRestore) {
        const { deletedAt, ...restoredClaim } = claimToRestore;
        setClaims(prev => [...prev, restoredClaim]);
        setDeletedClaims(prev => prev.filter(claim => claim.id !== claimId));
      }
    } catch (error) {
      console.error('Error restoring claim:', error);
      // Restore claim locally when backend is not available
      const claimToRestore = deletedClaims.find(claim => claim.id === claimId);
      if (claimToRestore) {
        const { deletedAt, ...restoredClaim } = claimToRestore;
        setClaims(prev => [...prev, restoredClaim]);
        setDeletedClaims(prev => prev.filter(claim => claim.id !== claimId));
      }
    }
  }, [deletedClaims]);

  const handleNewClaim = useCallback(async () => {
    if (!newClaim.id || !newClaim.policyholder || !newClaim.amount || !newClaim.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const claimToSend = {
        claimId: newClaim.id,
        policyholderName: newClaim.policyholder,
        amount: newClaim.amount,
        claimDate: newClaim.date,
        claimsInPastYear: newClaim.claimsInPastYear || 0,
        status: 'PENDING',
        isFraudulent: false
      };

      const response = await fetch('http://localhost:8080/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to create claim');
      }

      const savedClaim = await response.json();
      const processedClaim = detectFraud(savedClaim as Omit<Claim, 'isFraudulent' | 'flaggedRules'>);
      setClaims(prev => [...prev, processedClaim]);
    } catch (error) {
      console.error('Error creating claim:', error);
      // Add claim locally when backend is not available
      const newLocalClaim = detectFraud({
        id: newClaim.id,
        policyholder: newClaim.policyholder,
        amount: newClaim.amount,
        date: newClaim.date,
        claimsInPastYear: newClaim.claimsInPastYear || 0
      });
      setClaims(prev => [...prev, newLocalClaim]);
    } finally {
      setShowNewClaimForm(false);
      setNewClaim({
        id: '',
        policyholder: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        claimsInPastYear: 0
      });
      setFormattedAmount('');
    }
  }, [newClaim]);

  const filteredClaims = useMemo(() => claims.filter(claim => {
    const matchesSearch = claim.policyholder.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : 
                      activeTab === 'fraudulent' ? claim.isFraudulent : false;
    return matchesSearch && matchesTab;
  }), [claims, searchQuery, activeTab]);

  const filteredDeletedClaims = useMemo(() => deletedClaims.filter(claim => {
    return claim.policyholder.toLowerCase().includes(searchQuery.toLowerCase()) ||
           claim.id.toLowerCase().includes(searchQuery.toLowerCase());
  }), [deletedClaims, searchQuery]);

  const stats = useMemo<Stats>(() => ({
    totalClaims: claims.length,
    fraudulentClaims: claims.filter(c => c.isFraudulent).length,
    totalAmount: claims.reduce((sum, claim) => sum + claim.amount, 0),
    fraudulentAmount: claims.filter(c => c.isFraudulent)
      .reduce((sum, claim) => sum + claim.amount, 0),
    fraudPercentage: claims.length > 0 
      ? ((claims.filter(c => c.isFraudulent).length / claims.length) * 100).toFixed(2)
      : '0.00'
  }), [claims]);

  const exportToCSV = useCallback(() => {
    const headers = ['Claim ID', 'Policyholder', 'Amount', 'Date', 'Claims in Past Year', 'Status', 'Flagged Rules'];
    const csvContent = [
      headers.join(','),
      ...claims
        .filter(claim => claim.isFraudulent)
        .map(claim => [
          claim.id,
          claim.policyholder,
          claim.amount,
          claim.date,
          claim.claimsInPastYear,
          'Fraudulent',
          claim.flaggedRules.join('; ')
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fraudulent_claims.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [claims]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Insurance Fraud Detection
                </h1>
                <p className="text-sm text-gray-500">Monitor and analyze insurance claims</p>
              </div>
            </div>
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setShowNewClaimForm(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Claim
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
              <StatsCard title="Total Claims" value={stats.totalClaims} icon={<FileText className="h-6 w-6 text-blue-600" />} color="blue" />
              <StatsCard title="Fraudulent Claims" value={stats.fraudulentClaims} icon={<AlertTriangle className="h-6 w-6 text-red-600" />} color="red" />
              <StatsCard title="Total Amount" value={`₹${stats.totalAmount.toLocaleString()}`} icon={<IndianRupee className="h-6 w-6 text-green-600" />} color="green" />
              <StatsCard title="Fraudulent Amount" value={`₹${stats.fraudulentAmount.toLocaleString()}`} icon={<IndianRupee className="h-6 w-6 text-red-600" />} color="red" />
              <StatsCard title="Fraud Percentage" value={`${stats.fraudPercentage}%`} icon={<AlertTriangle className="h-6 w-6 text-yellow-600" />} color="yellow" />
            </div>

            {/* New Claim Form Modal */}
            {showNewClaimForm && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl transform transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">New Claim</h2>
                    <button
                      onClick={() => setShowNewClaimForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Claim ID</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        value={newClaim.id}
                        onChange={(e) => setNewClaim({ ...newClaim, id: e.target.value })}
                        placeholder="Enter claim ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Policyholder Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        value={newClaim.policyholder}
                        onChange={(e) => setNewClaim({ ...newClaim, policyholder: e.target.value })}
                        placeholder="Enter policyholder name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Claim Amount</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                        <input
                          type="text"
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                          value={formattedAmount}
                          onChange={handleAmountChange}
                          placeholder="Enter amount"
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Claims in Past Year</label>
                      <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        value={newClaim.claimsInPastYear}
                        onChange={(e) => setNewClaim({ ...newClaim, claimsInPastYear: Number(e.target.value) })}
                        placeholder="Enter number of claims"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        value={newClaim.date}
                        onChange={(e) => setNewClaim({ ...newClaim, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setShowNewClaimForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                      onClick={handleNewClaim}
                    >
                      Add Claim
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Claims Section */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Claims
                    </h2>
                  </div>
                  <div className="flex mt-4 sm:mt-0 space-x-4">
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2 sm:text-sm border-gray-300 rounded-lg transition-colors duration-200"
                        placeholder="Search claims..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setShowNewClaimForm(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Claim
                    </button>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      onClick={exportToCSV}
                    >
                      Export Fraudulent
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <nav className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeTab === 'all'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Claims
                    </button>
                    <button
                      onClick={() => setActiveTab('fraudulent')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeTab === 'fraudulent'
                          ? 'bg-red-100 text-red-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Fraudulent Claims
                    </button>
                    <button
                      onClick={() => setActiveTab('deleted')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeTab === 'deleted'
                          ? 'bg-gray-100 text-gray-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Deleted Claims ({deletedClaims.length})
                    </button>
                  </nav>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Claim ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Policyholder
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Claims in Past Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flagged Rules
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeTab === 'deleted' ? (
                      filteredDeletedClaims.map(claim => (
                        <tr key={claim.id} className="hover:bg-gray-50 transition-colors duration-200 bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {claim.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {claim.policyholder}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{claim.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {claim.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {claim.claimsInPastYear}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <ClaimStatus isFraudulent={claim.isFraudulent} />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {claim.flaggedRules.join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleRestoreClaim(claim.id)}
                              className="text-green-600 hover:text-green-900 transition-colors duration-200"
                              title="Restore claim"
                            >
                              <Undo2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      filteredClaims.map(claim => (
                        <tr key={claim.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {claim.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {claim.policyholder}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{claim.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {claim.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {claim.claimsInPastYear}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <ClaimStatus isFraudulent={claim.isFraudulent} />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {claim.flaggedRules.join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleDeleteClaim(claim.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
                              title="Delete claim"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;