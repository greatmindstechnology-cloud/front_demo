import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Search, Filter, Maximize2, Minimize2, LayoutGrid, Download, RefreshCw, Star, Calendar, Award, TrendingUp, Eye, EyeOff } from 'lucide-react';

const AvailableCounselors = () => {
  const DOMAINS = ['Technical', 'HR', 'Management', 'Python', 'Machine Learning'];
  const API_BASE_URL = 'https://backend-demo-esqk.onrender.com';

  const [counselors, setCounselors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domainFilter, setDomainFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState({
    user_name: true,
    approved_domains: true,
    availability: true,
    rating: true,
    total_sessions: true,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [density, setDensity] = useState('standard');
  const [viewMode, setViewMode] = useState('table');
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCounselors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (domainFilter) queryParams.append('domain', domainFilter);
      
      const url = `${API_BASE_URL}/trainer_gmt/counseling/available-counselors/?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = `${errorMessage} - ${text.slice(0, 100)}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      const formattedData = data.map(counselor => ({
        id: counselor.id,
        user_name: counselor.user_name || counselor.username || 'N/A',
        approved_domains: Array.isArray(counselor.approved_domains) ? counselor.approved_domains : [],
        availability: counselor.availability || {},
        rating: counselor.rating ?? null,
        total_sessions: counselor.total_sessions ?? 0,
      }));

      setCounselors(formattedData);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Please try again.');
      } else {
        setError(err.message || 'Failed to fetch counselors');
      }
    } finally {
      setIsLoading(false);
    }
  }, [domainFilter]);

  useEffect(() => {
    fetchCounselors();
  }, [fetchCounselors]);

  const filteredCounselors = useMemo(() => {
    if (!debouncedSearch) return counselors;
    
    const searchLower = debouncedSearch.toLowerCase();
    return counselors.filter(counselor => {
      return (
        counselor.user_name?.toLowerCase().includes(searchLower) ||
        counselor.approved_domains?.some(d => d.toLowerCase().includes(searchLower)) ||
        counselor.total_sessions?.toString().includes(searchLower) ||
        counselor.rating?.toString().includes(searchLower)
      );
    });
  }, [counselors, debouncedSearch]);

  const sortedCounselors = useMemo(() => {
    if (!sortConfig.column) return filteredCounselors;

    return [...filteredCounselors].sort((a, b) => {
      let aVal = a[sortConfig.column];
      let bVal = b[sortConfig.column];

      if (sortConfig.column === 'rating' || sortConfig.column === 'total_sessions') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else if (sortConfig.column === 'availability') {
        aVal = JSON.stringify(aVal);
        bVal = JSON.stringify(bVal);
      } else if (sortConfig.column === 'approved_domains') {
        aVal = Array.isArray(aVal) ? aVal.join(', ').toLowerCase() : '';
        bVal = Array.isArray(bVal) ? bVal.join(', ').toLowerCase() : '';
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCounselors, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCounselors.slice(start, start + pageSize);
  }, [sortedCounselors, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedCounselors.length / pageSize);

  const stats = useMemo(() => {
    const totalRatings = counselors.filter(c => c.rating != null).length;
    const avgRating = totalRatings > 0
      ? counselors.reduce((sum, c) => sum + (c.rating || 0), 0) / totalRatings
      : 0;
    const totalSessions = counselors.reduce((sum, c) => sum + c.total_sessions, 0);
    
    return {
      total: counselors.length,
      avgRating: avgRating.toFixed(1),
      totalSessions,
      highRated: counselors.filter(c => c.rating >= 4.5).length
    };
  }, [counselors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, domainFilter]);

  const handleSort = useCallback((column) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const toggleRowSelection = useCallback((counselor) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(counselor.id)) {
        newSet.delete(counselor.id);
      } else {
        newSet.add(counselor.id);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback((e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(paginatedData.map(c => c.id)));
    } else {
      setSelectedRows(new Set());
    }
  }, [paginatedData]);

  const clearSelection = useCallback(() => setSelectedRows(new Set()), []);

  const toggleColumnVisibility = useCallback((col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  }, []);

  const exportToCSV = useCallback(() => {
    const headers = Object.keys(visibleColumns).filter(k => visibleColumns[k]);
    const csvContent = [
      headers.map(h => h.replace(/_/g, ' ').toUpperCase()).join(','),
      ...sortedCounselors.map(c => 
        headers.map(h => {
          if (h === 'approved_domains') return `"${c[h].join(', ')}"`;
          if (h === 'availability') return `"${formatAvailability(c[h])}"`;
          return c[h];
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `counselors_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sortedCounselors, visibleColumns]);

  const formatAvailability = (availability) => {
    if (!availability || Object.keys(availability).length === 0) return 'N/A';
    
    return Object.entries(availability)
      .map(([day, times]) => {
        const timeStr = Array.isArray(times) && times.length > 0 
          ? times.join(', ') 
          : 'Not available';
        return `${day}: ${timeStr}`;
      })
      .join('; ');
  };

  const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length;
  const allSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < paginatedData.length;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${isFullScreen ? 'p-0' : 'p-6'}`}>
      <div className={`max-w-7xl mx-auto ${isFullScreen ? 'h-screen flex flex-col' : ''}`}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Available Counselors</h1>
                <p className="text-sm text-gray-600 mt-1">Manage and explore counselor profiles</p>
              </div>
            </div>
            
            <button
              onClick={fetchCounselors}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="font-medium">Refresh</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Counselors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">High Rated (4.5+)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.highRated}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search counselors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                disabled={isLoading}
              >
                <option value="">All Domains</option>
                {DOMAINS.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                title={`Switch to ${viewMode === 'table' ? 'grid' : 'table'} view`}
              >
                <LayoutGrid className="w-4 h-4 text-gray-600" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                  title="Column visibility"
                >
                  {showColumnMenu ? <EyeOff className="w-4 h-4 text-gray-600" /> : <Eye className="w-4 h-4 text-gray-600" />}
                </button>
                
                {showColumnMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Show Columns</p>
                      {Object.keys(visibleColumns).map(col => (
                        <label key={col} className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col]}
                            onChange={() => toggleColumnVisibility(col)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 capitalize">{col.replace(/_/g, ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={exportToCSV}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                title="Export to CSV"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>

              <button
                onClick={() => setDensity(density === 'standard' ? 'compact' : 'standard')}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                title={`${density === 'standard' ? 'Compact' : 'Standard'} view`}
              >
                <TrendingUp className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading counselors...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-xl">⚠</span>
                </div>
                <div>
                  <p className="font-semibold text-red-900">Error Loading Data</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchCounselors}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Table View */}
        {!isLoading && !error && viewMode === 'table' && (
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${isFullScreen ? 'flex-1 flex flex-col' : ''}`}>
            <div className={`overflow-auto ${isFullScreen ? 'flex-1' : ''}`} style={{ maxHeight: isFullScreen ? '100%' : '600px' }}>
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={input => input && (input.indeterminate = someSelected)}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </th>
                    {visibleColumns.user_name && (
                      <th
                        onClick={() => handleSort('user_name')}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          Name
                          {sortConfig.column === 'user_name' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    )}
                    {visibleColumns.approved_domains && (
                      <th
                        onClick={() => handleSort('approved_domains')}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          Domains
                          {sortConfig.column === 'approved_domains' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    )}
                    {visibleColumns.availability && (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Availability
                      </th>
                    )}
                    {visibleColumns.rating && (
                      <th
                        onClick={() => handleSort('rating')}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          Rating
                          {sortConfig.column === 'rating' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    )}
                    {visibleColumns.total_sessions && (
                      <th
                        onClick={() => handleSort('total_sessions')}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          Sessions
                          {sortConfig.column === 'total_sessions' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedCounselors.length === 0 ? (
                    <tr>
                      <td colSpan={visibleColumnCount + 1} className="px-4 py-16 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No counselors found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map(counselor => (
                      <tr
                        key={counselor.id}
                        className={`hover:bg-gray-50 transition-colors ${density === 'compact' ? 'h-12' : 'h-16'} ${
                          selectedRows.has(counselor.id) ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(counselor.id)}
                            onChange={() => toggleRowSelection(counselor)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        {visibleColumns.user_name && (
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {counselor.user_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">{counselor.user_name}</span>
                            </div>
                          </td>
                        )}
                        {visibleColumns.approved_domains && (
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {counselor.approved_domains.length > 0 ? (
                                counselor.approved_domains.map((domain, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                    {domain}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 text-sm italic">None</span>
                              )}
                            </div>
                          </td>
                        )}
                        {visibleColumns.availability && (
                          <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                            {formatAvailability(counselor.availability)}
                          </td>
                        )}
                        {visibleColumns.rating && (
                          <td className="px-4 py-3">
                            {counselor.rating != null ? (
                              <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full w-fit">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-sm font-semibold">{counselor.rating.toFixed(1)}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm italic">N/A</span>
                            )}
                          </td>
                        )}
                        {visibleColumns.total_sessions && (
                          <td className="px-4 py-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              {counselor.total_sessions}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  {selectedRows.size > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                        {selectedRows.size} selected
                      </span>
                      <button
                        onClick={clearSelection}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                  <span className="text-sm text-gray-600">
                    Showing {sortedCounselors.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                    {Math.min(currentPage * pageSize, sortedCounselors.length)} of {sortedCounselors.length}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Rows:</label>
                    <select
                      className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ««
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => p - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      «
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 border rounded-lg transition-all ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      »
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      »»
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid View */}
        {!isLoading && !error && viewMode === 'grid' && (
          <div className={`${isFullScreen ? 'flex-1 overflow-auto' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedCounselors.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                  <Users className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No counselors found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                paginatedData.map(counselor => (
                  <div
                    key={counselor.id}
                    className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer ${
                      selectedRows.has(counselor.id) ? 'ring-2 ring-blue-500 border-blue-500' : ''
                    }`}
                    onClick={() => toggleRowSelection(counselor)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {counselor.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{counselor.user_name}</h3>
                          <p className="text-xs text-gray-500">ID: {counselor.id}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(counselor.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleRowSelection(counselor);
                        }}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Domains</p>
                        <div className="flex flex-wrap gap-1">
                          {counselor.approved_domains.length > 0 ? (
                            counselor.approved_domains.map((domain, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                {domain}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm italic">None</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          {counselor.rating != null ? (
                            <>
                              <Star className="w-4 h-4 text-amber-500 fill-current" />
                              <span className="font-semibold text-gray-900">{counselor.rating.toFixed(1)}</span>
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm italic">No rating</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">{counselor.total_sessions} sessions</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Availability</p>
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {formatAvailability(counselor.availability)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Grid View Footer */}
            {sortedCounselors.length > 0 && (
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    {selectedRows.size > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                          {selectedRows.size} selected
                        </span>
                        <button
                          onClick={clearSelection}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      Showing {sortedCounselors.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                      {Math.min(currentPage * pageSize, sortedCounselors.length)} of {sortedCounselors.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Rows:</label>
                      <select
                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                      >
                        <option value="6">6</option>
                        <option value="9">9</option>
                        <option value="12">12</option>
                        <option value="18">18</option>
                        <option value="24">24</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        ««
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => p - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        «
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 border rounded-lg transition-all ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        »
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        »»
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableCounselors;