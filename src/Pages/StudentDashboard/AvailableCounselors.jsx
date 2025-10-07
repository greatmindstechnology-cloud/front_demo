import React, { useState, useEffect, useCallback, useMemo } from 'react';

const AvailableCounselors = () => {
  const DOMAINS = ['Technical', 'HR', 'Management', 'Python', 'Machine Learning'];
  const API_BASE_URL = 'http://localhost:8000';

  // State management
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

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch counselors data
  const fetchCounselors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (domainFilter) queryParams.append('domain', domainFilter);
      
      const url = `${API_BASE_URL}/trainer_gmt/counseling/available-counselors/?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authentication if needed: 'Authorization': `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(10000), // 10s timeout
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

      const contentType = response.headers.get('Content-Type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response format: Expected JSON');
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
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [domainFilter]);

  useEffect(() => {
    fetchCounselors();
  }, [fetchCounselors]);

  // Filter counselors based on search
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

  // Sort counselors
  const sortedCounselors = useMemo(() => {
    if (!sortConfig.column) return filteredCounselors;

    return [...filteredCounselors].sort((a, b) => {
      let aVal = a[sortConfig.column];
      let bVal = b[sortConfig.column];

      // Handle different data types
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

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCounselors.slice(start, start + pageSize);
  }, [sortedCounselors, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedCounselors.length / pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, domainFilter]);

  // Handlers
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

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => 
        console.error('Fullscreen error:', err)
      );
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch(err => 
        console.error('Exit fullscreen error:', err)
      );
      setIsFullScreen(false);
    }
  }, []);

  const toggleDensity = useCallback(() => {
    setDensity(prev => prev === 'standard' ? 'compact' : 'standard');
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    fetchCounselors();
  }, [fetchCounselors]);

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
    <div className={`container mt-5 ${isFullScreen ? 'vh-100 d-flex flex-column' : ''}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h4 fw-bold text-dark mb-1">Available Counselors</h2>
          <p className="text-muted small mb-0">
            {sortedCounselors.length} counselor{sortedCounselors.length !== 1 ? 's' : ''} available
          </p>
        </div>
        
        {/* Toolbar */}
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ width: '200px' }}
            placeholder="Search counselors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          
          <select
            className="form-select form-select-sm"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            style={{ width: '180px' }}
            disabled={isLoading}
          >
            <option value="">All Domains</option>
            {DOMAINS.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>

          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={toggleFullScreen} 
            title="Toggle Fullscreen"
          >
            <i className={`fas fa-${isFullScreen ? 'compress' : 'expand'}`}></i>
          </button>
          
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={toggleDensity}
            title={`Switch to ${density === 'standard' ? 'compact' : 'standard'} view`}
          >
            <i className="fas fa-arrows-alt-v"></i>
          </button>
          
          <div className="dropdown">
            <button 
              className="btn btn-sm btn-outline-secondary dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
              title="Column visibility"
            >
              <i className="fas fa-columns"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {Object.keys(visibleColumns).map(col => (
                <li key={col}>
                  <label className="dropdown-item cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns[col]}
                      onChange={() => toggleColumnVisibility(col)}
                      className="me-2"
                    />
                    <span className="text-capitalize">{col.replace(/_/g, ' ')}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3 text-muted">Loading counselors...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <div>
            <i className="fas fa-exclamation-triangle me-2"></i>
            <strong>Error:</strong> {error}
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={handleRetry}>
            <i className="fas fa-redo me-1"></i> Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className={`table-responsive border rounded-3 shadow-sm ${isFullScreen ? 'flex-grow-1' : ''}`}>
          <div style={{ maxHeight: isFullScreen ? '100%' : '500px', overflowY: 'auto' }}>
            <table className={`table table-hover mb-0 ${density === 'compact' ? 'table-sm' : ''}`}>
              <thead className="table-light sticky-top">
                <tr>
                  <th style={{ width: '50px' }}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={input => input && (input.indeterminate = someSelected)}
                      onChange={toggleSelectAll}
                      title="Select all on this page"
                    />
                  </th>
                  {visibleColumns.user_name && (
                    <th 
                      onClick={() => handleSort('user_name')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      className="text-nowrap"
                    >
                      Name {sortConfig.column === 'user_name' && (
                        <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </th>
                  )}
                  {visibleColumns.approved_domains && (
                    <th 
                      onClick={() => handleSort('approved_domains')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      className="text-nowrap"
                    >
                      Domains {sortConfig.column === 'approved_domains' && (
                        <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </th>
                  )}
                  {visibleColumns.availability && (
                    <th 
                      onClick={() => handleSort('availability')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      className="text-nowrap"
                    >
                      Availability {sortConfig.column === 'availability' && (
                        <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </th>
                  )}
                  {visibleColumns.rating && (
                    <th 
                      onClick={() => handleSort('rating')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      className="text-nowrap"
                    >
                      Rating {sortConfig.column === 'rating' && (
                        <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </th>
                  )}
                  {visibleColumns.total_sessions && (
                    <th 
                      onClick={() => handleSort('total_sessions')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      className="text-nowrap"
                    >
                      Sessions {sortConfig.column === 'total_sessions' && (
                        <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedCounselors.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumnCount + 1} className="text-center py-5 text-muted">
                      <i className="fas fa-users fa-3x mb-3 d-block"></i>
                      No counselors found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map(counselor => (
                    <tr 
                      key={counselor.id} 
                      className={selectedRows.has(counselor.id) ? 'table-active' : ''}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.has(counselor.id)}
                          onChange={() => toggleRowSelection(counselor)}
                        />
                      </td>
                      {visibleColumns.user_name && (
                        <td className="fw-medium">{counselor.user_name}</td>
                      )}
                      {visibleColumns.approved_domains && (
                        <td>
                          {counselor.approved_domains.length > 0 ? (
                            <span className="text-muted">
                              {counselor.approved_domains.join(', ')}
                            </span>
                          ) : (
                            <span className="text-muted fst-italic">None</span>
                          )}
                        </td>
                      )}
                      {visibleColumns.availability && (
                        <td className="small">{formatAvailability(counselor.availability)}</td>
                      )}
                      {visibleColumns.rating && (
                        <td>
                          {counselor.rating != null ? (
                            <span className="badge bg-warning text-dark">
                              <i className="fas fa-star me-1"></i>
                              {counselor.rating.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted fst-italic">N/A</span>
                          )}
                        </td>
                      )}
                      {visibleColumns.total_sessions && (
                        <td>
                          <span className="badge bg-secondary">{counselor.total_sessions}</span>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="border-top bg-light p-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                {selectedRows.size > 0 && (
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary">{selectedRows.size} selected</span>
                    <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={clearSelection}>
                      Clear
                    </button>
                  </div>
                )}
                <span className="text-muted small">
                  Showing {sortedCounselors.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, sortedCounselors.length)} of {sortedCounselors.length}
                </span>
              </div>
              
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="pageSize" className="small text-muted mb-0">Rows:</label>
                  <select
                    id="pageSize"
                    className="form-select form-select-sm"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ width: '70px' }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
                
                <nav aria-label="Table pagination">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-angle-double-left"></i>
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(p => p - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-angle-left"></i>
                      </button>
                    </li>
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
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(pageNum)}>
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="fas fa-angle-right"></i>
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="fas fa-angle-double-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .table-active { background-color: rgba(13, 110, 253, 0.1) !important; }
        .sticky-top { position: sticky; top: 0; z-index: 10; }
        .sticky-bottom { position: sticky; bottom: 0; z-index: 10; }
        .table-hover tbody tr:hover { background-color: rgba(0, 0, 0, 0.02); }
        .dropdown-menu { max-height: 300px; overflow-y: auto; }
      `}</style>
    </div>
  );
};

export default AvailableCounselors;