import React, { useState, useEffect } from 'react';

const AvailableCounselors = () => {
  const staticCounselors = [
    {
      id: 1,
      userName: 'Alice Johnson',
      approved_domains: ['Technical', 'Python'],
      availability: {
        Monday: ['10:00 AM - 12:00 PM'],
        Wednesday: ['2:00 PM - 4:00 PM'],
      },
      rating: 4.8,
      total_sessions: 25,
    },
    {
      id: 2,
      userName: 'Bob Smith',
      approved_domains: ['HR', 'Management'],
      availability: {
        Tuesday: ['11:00 AM - 1:00 PM'],
        Friday: ['3:00 PM - 5:00 PM'],
      },
      rating: 4.5,
      total_sessions: 18,
    },
    {
      id: 3,
      userName: 'Clara Lee',
      approved_domains: ['Machine Learning', 'Technical'],
      availability: {
        Monday: ['1:00 PM - 3:00 PM'],
        Thursday: ['10:00 AM - 12:00 PM'],
      },
      rating: 4.9,
      total_sessions: 30,
    },
  ];

  const domains = ['Technical', 'HR', 'Management', 'Python', 'Machine Learning'];

  const [counselors, setCounselors] = useState([]);
  const [filteredCounselors, setFilteredCounselors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domainFilter, setDomainFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    userName: true,
    approved_domains: true,
    availability: true,
    rating: true,
    total_sessions: true,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [density, setDensity] = useState('standard');

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        const filtered = domainFilter
          ? staticCounselors.filter(c => c.approved_domains.includes(domainFilter))
          : staticCounselors;
        setCounselors(filtered);
        setFilteredCounselors(filtered);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load counselors');
        setIsLoading(false);
      }
    }, 1000);
  }, [domainFilter]);

  useEffect(() => {
    const filtered = counselors.filter(row =>
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredCounselors(filtered);
    setCurrentPage(1);
  }, [searchTerm, counselors]);

  const updateTable = () => {
    const start = (currentPage - 1) * pageSize;
    return filteredCounselors.slice(start, start + pageSize);
  };

  const updatePagination = () => {
    const totalPages = Math.ceil(filteredCounselors.length / pageSize);
    return (
      <ul className="pagination mb-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Prev</button>
        </li>
        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</button>
        </li>
      </ul>
    );
  };

  const sortRows = (columnIndex) => {
    const newSortDirection = sortColumn === columnIndex && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnIndex);
    setSortDirection(newSortDirection);

    const columnMap = ['userName', 'approved_domains', 'availability', 'rating', 'total_sessions'];
    const sortedRows = [...filteredCounselors].sort((a, b) => {
      let aValue = a[columnMap[columnIndex]];
      let bValue = b[columnMap[columnIndex]];

      if (columnIndex === 3 || columnIndex === 4) {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (columnIndex === 2) {
        aValue = JSON.stringify(aValue);
        bValue = JSON.stringify(bValue);
      } else if (columnIndex === 1) {
        aValue = aValue.join(', ');
        bValue = bValue.join(', ');
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return newSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return newSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCounselors(sortedRows);
  };

  const toggleRowSelection = (row) => {
    setSelectedRows(prev => prev.includes(row) ? prev.filter(r => r !== row) : [...prev, row]);
  };

  const toggleSelectAll = (e) => {
    setSelectedRows(e.target.checked ? updateTable() : []);
  };

  const clearSelection = () => {
    setSelectedRows([]);
  };

  const toggleColumnVisibility = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error('Fullscreen error:', err));
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch(err => console.error('Exit fullscreen error:', err));
      setIsFullScreen(false);
    }
  };

  const toggleDensity = () => {
    setDensity(prev => prev === 'standard' ? 'compact' : 'standard');
  };

  return (
    <div className={`container mt-5 ${isFullScreen ? 'vh-100 d-flex flex-column' : ''}`}>
      <div className="d-flex justify-content-between align-items-end mb-2">
        <h2 className="h4 fw-bold text-dark mb-0">Available Counselors</h2>
        <div className="d-flex align-items-end">
          <div className="p-2 pb-0">
            <input
              type="text"
              className="form-control"
              style={{ width: '200px' }}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="p-2 pb-0">
            <button className="btn btn-outline-secondary me-2" onClick={toggleFullScreen} title="Toggle Full Screen">
              <i className={`fas ${isFullScreen ? 'fa-compress' : 'fa-expand'}`}></i>
            </button>
            <button className="btn btn-outline-secondary me-2" onClick={toggleDensity} title="Toggle Density">
              <i className={`fas ${density === 'standard' ? 'fa-compress-arrows-alt' : 'fa-expand-arrows-alt'}`}></i>
            </button>
            <div className="dropdown d-inline-block">
              <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-columns"></i>
              </button>
              <ul className="dropdown-menu" style={{ zIndex: '1111' }}>
                {Object.keys(visibleColumns).map(col => (
                  <li key={col}>
                    <div className="dropdown-item">
                      <input
                        type="checkbox"
                        checked={visibleColumns[col]}
                        onChange={() => toggleColumnVisibility(col)}
                      />
                      <span className="ms-2 text-capitalize">{col.replace('_', ' ')}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button className="btn btn-outline-light btn-sm" onClick={() => setDomainFilter('')}>
            Reset
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className={`table-responsive border rounded-3 ${density}`} style={{ maxHeight: '420px', overflowY: 'auto' }}>
          <table className="table table-hover mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === updateTable().length && updateTable().length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                {visibleColumns.userName && (
                  <th
                    onClick={() => sortRows(0)}
                    className={`sort-header ${sortColumn === 0 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    Name
                    <span className={`sort-icon ${sortColumn === 0 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
                {visibleColumns.approved_domains && (
                  <th
                    onClick={() => sortRows(1)}
                    className={`sort-header ${sortColumn === 1 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    Domains
                    <span className={`sort-icon ${sortColumn === 1 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
                {visibleColumns.availability && (
                  <th
                    onClick={() => sortRows(2)}
                    className={`sort-header ${sortColumn === 2 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    Availability
                    <span className={`sort-icon ${sortColumn === 2 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
                {visibleColumns.rating && (
                  <th
                    onClick={() => sortRows(3)}
                    className={`sort-header ${sortColumn === 3 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    Rating
                    <span className={`sort-icon ${sortColumn === 3 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
                {visibleColumns.total_sessions && (
                  <th
                    onClick={() => sortRows(4)}
                    className={`sort-header ${sortColumn === 4 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    Total Sessions
                    <span className={`sort-icon ${sortColumn === 4 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredCounselors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No counselors available.
                  </td>
                </tr>
              ) : (
                updateTable().map(counselor => (
                  <tr key={counselor.id} className={selectedRows.includes(counselor) ? 'table-selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(counselor)}
                        onChange={() => toggleRowSelection(counselor)}
                      />
                    </td>
                    {visibleColumns.userName && <td>{counselor.userName}</td>}
                    {visibleColumns.approved_domains && (
                      <td>{Array.isArray(counselor.approved_domains) ? counselor.approved_domains.join(', ') : 'N/A'}</td>
                    )}
                    {visibleColumns.availability && (
                      <td>
                        {counselor.availability
                          ? Object.entries(counselor.availability)
                              .map(([day, times]) => `${day}: ${times.length > 0 ? times.join(', ') : 'Not available'}`)
                              .join('; ')
                          : 'N/A'}
                      </td>
                    )}
                    {visibleColumns.rating && <td>{counselor.rating != null ? counselor.rating.toFixed(1) : 'N/A'}</td>}
                    {visibleColumns.total_sessions && <td>{counselor.total_sessions ?? '0'}</td>}
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="sticky-bottom table-light">
              <tr>
                <td colSpan="100%">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div className="d-flex align-items-center mb-2 mb-md-0">
                      {selectedRows.length > 0 && (
                        <>
                          <span className="me-2">{`${selectedRows.length} of ${filteredCounselors.length} row(s) selected`}</span>
                          <button className="btn btn-link btn-sm me-3" onClick={clearSelection}>
                            Clear selection
                          </button>
                        </>
                      )}
                      <span className="text-muted">
                        Showing {(currentPage - 1) * pageSize + 1} to{' '}
                        {Math.min(currentPage * pageSize, filteredCounselors.length)} of {filteredCounselors.length} entries
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <label htmlFor="pageSize" className="me-2">Rows per page:</label>
                        <select
                          id="pageSize"
                          className="form-select form-select-sm"
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          style={{ width: 'auto', display: 'inline-block' }}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                        </select>
                      </div>
                      <nav aria-label="Table pagination">
                        {updatePagination()}
                      </nav>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default AvailableCounselors;