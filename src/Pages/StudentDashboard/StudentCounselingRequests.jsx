import React, { useState, useEffect } from 'react';

const StudentCounselingRequests = ({ studentId }) => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    domain: true,
    status: true,
    counselor: true,
    session_time: true,
    meet_link: true,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [density, setDensity] = useState('standard');

  // Static counseling requests data
  const staticData = [
    {
      id: 1,
      domain: 'Career Guidance',
      status: 'Pending',
      counselor: null,
      session_time: null,
      meet_link: null,
    },
    {
      id: 2,
      domain: 'Mental Health',
      status: 'Assigned',
      counselor: { user: { name: 'Dr. Smith' } },
      session_time: '2025-09-05T15:00:00Z',
      meet_link: 'https://meet.google.com/example1',
    },
    {
      id: 3,
      domain: 'Academic Stress',
      status: 'Completed',
      counselor: { user: { name: 'Dr. Jane Doe' } },
      session_time: '2025-08-30T10:00:00Z',
      meet_link: 'https://meet.google.com/example2',
    },
    {
      id: 4,
      domain: 'Time Management',
      status: 'Accepted',
      counselor: { user: { name: 'Mr. John' } },
      session_time: '2025-09-10T12:00:00Z',
      meet_link: 'https://meet.google.com/example3',
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      let filtered = staticData;
      if (statusFilter) {
        filtered = filtered.filter(req => req.status === statusFilter);
      }
      if (searchTerm) {
        filtered = filtered.filter(req =>
          Object.values(req).some(val =>
            val && typeof val === 'object'
              ? val.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
              : String(val).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
      setRequests(filtered);
      setFilteredRequests(filtered);
      setLoading(false);
    }, 500);
  }, [statusFilter, searchTerm]);

  const updateTable = () => {
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  };

  const updatePagination = () => {
    const totalPages = Math.ceil(filteredRequests.length / pageSize);
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

    const columnMap = ['id', 'domain', 'status', 'counselor', 'session_time', 'meet_link'];
    const sortedRows = [...filteredRequests].sort((a, b) => {
      let aValue = a[columnMap[columnIndex]];
      let bValue = b[columnMap[columnIndex]];

      if (columnIndex === 0) { // id (number)
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else if (columnIndex === 3) { // counselor (object)
        aValue = aValue?.user?.name?.toLowerCase() || 'not assigned';
        bValue = bValue?.user?.name?.toLowerCase() || 'not assigned';
      } else if (columnIndex === 4) { // session_time (date)
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      } else { // domain, status, meet_link (string)
        aValue = String(aValue || 'n/a').toLowerCase();
        bValue = String(bValue || 'n/a').toLowerCase();
      }

      if (aValue < bValue) return newSortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return newSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRequests(sortedRows);
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
        <h2 className="h4 fw-bold text-dark mb-0">My Counseling Requests</h2>
        <div className="d-flex align-items-end">
          <div className="p-2 pb-0">
            <input
              type="text"
              className="form-control"
              style={{ width: '200px' }}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
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

      {loading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
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
                {visibleColumns.id && (
                  <th
                    onClick={() => sortRows(0)}
                    className={`sort-header ${sortColumn === 0 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    ID
                    <span className={`sort-icon ${sortColumn === 0 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
                {visibleColumns.domain && (
                  <th
                    onClick={() => sortRows(1)}
                    className={`sort-header ${sortColumn === 1 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    Domain
                    <span className={`sort-icon ${sortColumn === 1 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
                {visibleColumns.status && (
                  <th
                    onClick={() => sortRows(2)}
                    className={`sort-header ${sortColumn === 2 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    Status
                    <span className={`sort-icon ${sortColumn === 2 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
                {visibleColumns.counselor && (
                  <th
                    onClick={() => sortRows(3)}
                    className={`sort-header ${sortColumn === 3 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    Counselor
                    <span className={`sort-icon ${sortColumn === 3 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
                {visibleColumns.session_time && (
                  <th
                    onClick={() => sortRows(4)}
                    className={`sort-header ${sortColumn === 4 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    Session Time
                    <span className={`sort-icon ${sortColumn === 4 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
                {visibleColumns.meet_link && (
                  <th
                    onClick={() => sortRows(5)}
                    className={`sort-header ${sortColumn === 5 ? `sort-${sortDirection}` : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    Meet Link
                    <span className={`sort-icon ${sortColumn === 5 ? `sort-${sortDirection}` : ''}`}></span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No counseling requests found
                  </td>
                </tr>
              )}
              {updateTable().map(req => (
                <tr key={req.id} className={selectedRows.includes(req) ? 'table-selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(req)}
                      onChange={() => toggleRowSelection(req)}
                    />
                  </td>
                  {visibleColumns.id && <td>{req.id}</td>}
                  {visibleColumns.domain && <td>{req.domain || 'N/A'}</td>}
                  {visibleColumns.status && <td>{req.status || 'N/A'}</td>}
                  {visibleColumns.counselor && <td>{req.counselor?.user?.name || 'Not Assigned'}</td>}
                  {visibleColumns.session_time && (
                    <td>{req.session_time ? new Date(req.session_time).toLocaleString() : 'N/A'}</td>
                  )}
                  {visibleColumns.meet_link && (
                    <td>
                      {req.meet_link ? (
                        <a
                          href={req.meet_link}
                          className="btn btn-sm btn-primary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot className="sticky-bottom table-light">
              <tr>
                <td colSpan="100%">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div className="d-flex align-items-center mb-2 mb-md-0">
                      {selectedRows.length > 0 && (
                        <>
                          <span className="me-2">{`${selectedRows.length} of ${filteredRequests.length} row(s) selected`}</span>
                          <button className="btn btn-link btn-sm me-3" onClick={clearSelection}>
                            Clear selection
                          </button>
                        </>
                      )}
                      <span className="text-muted">
                        Showing {(currentPage - 1) * pageSize + 1} to{' '}
                        {Math.min(currentPage * pageSize, filteredRequests.length)} of {filteredRequests.length} entries
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
                        <ul className="pagination justify-content-end mb-0">{updatePagination()}</ul>
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

export default StudentCounselingRequests;