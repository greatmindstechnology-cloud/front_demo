import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse'; // Now resolved after installation
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import { vfs } from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = vfs;

const AdminCounselorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [density, setDensity] = useState('standard');
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    trainer_name: true,
    trainer_email: true,
    domains: true,
    why_interested: true,
    availability: true,
    uploaded_docs: true,
    status: true,
    admin_comments: true,
    actions: true,
  });
  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/trainer_gmt/admin/counselor/applications/`, {
        params: { status: statusFilter, domain: domainFilter },
      })
      .then((response) => {
        console.log('Response:', response.data);
        if (Array.isArray(response.data)) {
          const updatedData = response.data.map((app, idx) => ({
            id: app.id || idx,
            trainer_name: app.trainer_name || 'N/A',
            trainer_email: app.trainer_email || 'N/A',
            domains: Array.isArray(app.domains) ? app.domains.join(', ') : 'N/A',
            why_interested: app.why_interested || 'N/A',
            availability: app.availability
              ? Object.entries(app.availability)
                  .map(([day, times]) => `${day}: ${Array.isArray(times) ? times.join(', ') : String(times)}`)
                  .join('; ')
              : 'N/A',
            uploaded_docs: Array.isArray(app.uploaded_docs) ? app.uploaded_docs : [],
            status: app.status || 'Pending',
            admin_comments: app.admin_comments || 'None',
          }));
          setApplications(updatedData);
          setFilteredApplications(updatedData);
          setError(null);
        } else {
          setApplications([]);
          setFilteredApplications([]);
          setError('Unable to load counselor applications due to invalid server response');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(
          'Failed to load applications: ' +
            (err.response?.data?.error || err.message || 'Unknown error')
        );
        setApplications([]);
        setFilteredApplications([]);
      });
  }, [statusFilter, domainFilter]);

  useEffect(() => {
    const filtered = applications.filter((app) =>
      Object.values(app).some((cell) =>
        cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredApplications(filtered);
    setCurrentPage(1);
  }, [searchTerm, applications]);

  const handleUpdateStatus = (id, newStatus) => {
    const comments = prompt('Enter comments:');
    if (comments === null) return;
    axios
      .patch(`${BASE_URL}/trainer_gmt/admin/counselor/applications/${id}/`, {
        status: newStatus,
        comments,
      })
      .then(() => {
        alert('Status updated');
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: newStatus, admin_comments: comments } : app
          )
        );
        setFilteredApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: newStatus, admin_comments: comments } : app
          )
        );
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to update status');
      });
  };

  const exportToCsv = (data, filename) => {
    if (!data || data.length === 0) {
      console.error('No data to export');
      return;
    }
    const csv = Papa.unparse({
      fields: ['ID', 'Trainer Name', 'Email', 'Domains', 'Why Interested', 'Availability', 'Documents', 'Status', 'Admin Comments'],
      data: data.map(app => [
        app.id,
        app.trainer_name,
        app.trainer_email,
        app.domains,
        app.why_interested,
        app.availability,
        app.uploaded_docs.length > 0 ? app.uploaded_docs.join(', ') : 'None',
        app.status,
        app.admin_comments,
      ])
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportAllDataCsv = () => exportToCsv(applications, 'counselor_applications_all');
  const exportAllDataExcel = () => exportToExcel(applications, 'counselor_applications_all');

  const updateTable = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredApplications.slice(start, end);
  };

  const updatePagination = () => {
    const totalPages = Math.ceil(filteredApplications.length / pageSize);
    const paginationItems = [];

    paginationItems.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <a
          className="page-link"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) setCurrentPage(currentPage - 1);
          }}
        >
          Previous
        </a>
      </li>
    );

    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <a
            className="page-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
            }}
          >
            {i}
          </a>
        </li>
      );
    }

    paginationItems.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <a
          className="page-link"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
          }}
        >
          Next
        </a>
      </li>
    );

    return paginationItems;
  };

  const sortRows = (column) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    const sorted = [...filteredApplications].sort((a, b) => {
      const columnMap = ['id', 'trainer_name', 'trainer_email', 'domains', 'why_interested', 'availability', 'uploaded_docs', 'status', 'admin_comments'];
      const aValue = a[columnMap[column]];
      const bValue = b[columnMap[column]];
      if (aValue < bValue) return newDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredApplications(sorted);
  };

  const toggleRowSelection = (row) => {
    setSelectedRows((prev) =>
      prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row]
    );
  };

  const toggleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectedRows(isChecked ? updateTable() : []);
  };

  const clearSelection = () => {
    setSelectedRows([]);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const toggleDensity = () => {
    setDensity((prev) => (prev === 'standard' ? 'compact' : 'standard'));
  };

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'Pending':
        return 'status-waiting';
      case 'Rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  if (error) {
    return (
      <div className="container mt-5">
        <h2 className="h4 fw-bold text-dark">Admin: Counselor Applications</h2>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className={`container mt-5 ${isFullScreen ? 'fullscreen' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="h4 fw-bold text-dark me-3 mb-0">Counselor Approval</h2>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center me-3">
            <input
              type="text"
              className="form-control me-2"
              style={{ width: '200px' }}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              id="statusFilter"
              className="form-select me-2"
              style={{ width: '150px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <input
              id="domainFilter"
              className="form-control me-2"
              style={{ width: '150px' }}
              placeholder="Filter by Domain"
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
            />
          </div>
          <div className="btn-group me-2">
            <button className="btn btn-primary" onClick={exportAllDataCsv}>
              <i className="fas fa-file-csv me-2"></i>CSV
            </button>
            <button className="btn btn-success" onClick={exportAllDataExcel}>
              <i className="fas fa-file-excel me-2"></i>Excel
            </button>
          </div>
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-secondary me-2" onClick={toggleFullScreen} title="Toggle Full Screen">
              <i className={`fas ${isFullScreen ? 'fa-compress' : 'fa-expand'}`}></i>
            </button>
            <button className="btn btn-outline-secondary me-2" onClick={toggleDensity} title="Toggle Density">
              <i className={`fas ${density === 'standard' ? 'fa-compress-arrows-alt' : 'fa-expand-arrows-alt'}`}></i>
            </button>
            <div className="dropdown d-inline-block">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Show/Hide Columns"
              >
                <i className="fas fa-columns"></i>
              </button>
              <ul className="dropdown-menu">
                {['id', 'trainer_name', 'trainer_email', 'domains', 'why_interested', 'availability', 'uploaded_docs', 'status', 'admin_comments', 'actions'].map((col) => (
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

      <div className={`table-responsive border rounded-3 ${density}`} style={{ maxHeight: '420px', maxWidth: '1150px', overflowY: 'auto' }}>
        <table className="table table-hover mb-0">
          <thead className="table-light sticky-top">
            <tr>
              <th><input type="checkbox" checked={selectedRows.length === updateTable().length && updateTable().length > 0} onChange={toggleSelectAll} /></th>
              {visibleColumns.id && (
                <th className='text-truncate' onClick={() => sortRows(0)} style={{ cursor: 'pointer' }}>
                  ID <span className={`sort-icon ${sortColumn === 0 ? `sort-${sortDirection}` : ''}`}></span>
                </th>
              )}
              {visibleColumns.trainer_name && (
                <th className='text-truncate' onClick={() => sortRows(1)} style={{ cursor: 'pointer' }}>
                  Trainer Name <span className={`sort-icon ${sortColumn === 1 ? `sort-${sortDirection}` : ''}`}></span>
                </th>
              )}
              {visibleColumns.trainer_email && (
                <th className='text-truncate' onClick={() => sortRows(2)} style={{ cursor: 'pointer' }}>
                  Email <span className={`sort-icon ${sortColumn === 2 ? `sort-${sortDirection}` : ''}`}></span>
                </th>
              )}
              {visibleColumns.domains && (
                <th className='text-truncate' onClick={() => sortRows(3)} style={{ cursor: 'pointer' }}>
                  Domains <span className={`sort-icon ${sortColumn === 3 ? `sort-${sortDirection}` : ''}`}></span>
                </th>
              )}
              {visibleColumns.why_interested && (
                <th className='text-truncate' onClick={() => sortRows(4)} style={{ cursor: 'pointer' }}>
                  Why Interested <span className={`sort-icon ${sortColumn === 4 ? `sort-${sortDirection}` : ''}`}></span>
                </th>
              )}
              {visibleColumns.availability && (
                <th className='text-truncate' onClick={() => sortRows(5)} style={{ cursor: 'pointer' }}>
                  Availability <span className={`sort-icon ${sortColumn === 5 ? `sort-${sortDirection}` : ''}`}></span>
                </th>
              )}
              {visibleColumns.uploaded_docs && (
                <th className='text-truncate' onClick={() => sortRows(6)} style={{ cursor: 'pointer' }}>
                  Documents <span className={`sort-icon ${sortColumn === 6 ? `sort-${sortDirection}` : ''}`}></span>
                </th>
              )}
              {visibleColumns.status && (
                <th className='text-truncate' onClick={() => sortRows(7)} style={{ cursor: 'pointer' }}>
                  Status <span className={`sort-icon ${sortColumn === 7 ? `sort-${sortDirection}` : ''}`}></span>
                </th>
              )}
              {visibleColumns.admin_comments && (
                <th className='text-truncate' onClick={() => sortRows(8)} style={{ cursor: 'pointer' }}>
                  Admin Comments <span className={`sort-icon ${sortColumn === 8 ? `sort-${sortDirection}` : ''}`}></span>
                </th>
              )}
              {visibleColumns.actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {updateTable().map((app, index) => (
              <tr key={index} className={selectedRows.includes(app) ? 'table-selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(app)}
                    onChange={() => toggleRowSelection(app)}
                  />
                </td>
                {visibleColumns.id && <td>{app.id}</td>}
                {visibleColumns.trainer_name && <td>{app.trainer_name}</td>}
                {visibleColumns.trainer_email && <td>{app.trainer_email}</td>}
                {visibleColumns.domains && <td>{app.domains}</td>}
                {visibleColumns.why_interested && <td>{app.why_interested}</td>}
                {visibleColumns.availability && <td>{app.availability}</td>}
                {visibleColumns.uploaded_docs && (
                  <td>
                    {app.uploaded_docs.length > 0 ? (
                      app.uploaded_docs.map((doc, index) => (
                        <a key={index} href={doc} className="d-block text-decoration-none" target="_blank" rel="noopener noreferrer">
                          Download
                        </a>
                      ))
                    ) : (
                      'None'
                    )}
                  </td>
                )}
                {visibleColumns.status && (
                  <td className="text-truncate" style={{ minWidth: "150px" }}>
                    <select
                      className={`form-select bg-primary d-inline-block text-white ${getStatusClass(app.status)}`}
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    >
                      <option value="Approved" className="status-approved">Approved</option>
                      <option value="Pending" className="status-waiting">Pending</option>
                      <option value="Rejected" className="status-rejected">Rejected</option>
                    </select>
                  </td>
                )}
                {visibleColumns.admin_comments && <td>{app.admin_comments}</td>}
                {visibleColumns.actions && (
                  <td>
                    {app.status === 'Pending' && (
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdateStatus(app.id, 'Approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                        >
                          Reject
                        </button>
                      </div>
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
                        <span className="me-2">{`${selectedRows.length} of ${filteredApplications.length} row(s) selected`}</span>
                        <button className="btn btn-link btn-sm me-3" onClick={clearSelection}>
                          Clear selection
                        </button>
                      </>
                    )}
                    <span className="text-muted">
                      Showing {(currentPage - 1) * pageSize + 1} to{' '}
                      {Math.min(currentPage * pageSize, filteredApplications.length)} of {filteredApplications.length} entries
                    </span>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <label htmlFor="pageSize" className="me-2">Rows per page:</label>
                      <select
                        id="pageSize"
                        className="form-select form-select-sm"
                        value={pageSize}
                        onChange={handlePageSizeChange}
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
    </div>
  );
};

export default AdminCounselorApplications;