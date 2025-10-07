import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem, Checkbox, FormControl, InputLabel, Pagination, IconButton, Menu, Typography, CircularProgress, Alert } from '@mui/material';
import { Fullscreen, FullscreenExit, DensityMedium, DensitySmall, ViewColumn } from '@mui/icons-material';

const StudentCounselingRequests = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    student_name: true,
    domain: true,
    status: true,
    counselor_name: true,
    session_time: true,
    meet_link: true,
    description: true,
    created_at: true,
    updated_at: true,
    preferred_times: true,
    resume_url: true,
    meeting_id: true,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [density, setDensity] = useState('standard');
  const [anchorEl, setAnchorEl] = useState(null); // For column visibility dropdown

  useEffect(() => {
    const fetchCounselingRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const studentId = localStorage.getItem('vendorId');
        if (!studentId) {
          throw new Error('Student ID not found in localStorage');
        }

        const API_BASE_URL = 'http://localhost:8000';
        const queryParams = new URLSearchParams({ student_id: studentId });
        if (statusFilter) {
          queryParams.append('status', statusFilter);
        }
        const url = `${API_BASE_URL}/trainer_gmt/counseling/requests/?${queryParams.toString()}`;
        console.log('Fetching from:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Response body:', text);
          let errorMessage = `HTTP error! Status: ${response.status}`;
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage += `, Body: ${text.slice(0, 100)}...`;
          }
          throw new Error(errorMessage);
        }

        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Received non-JSON response from server');
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        const formattedData = data.map(req => ({
          id: req.id,
          student: req.student,
          student_name: req.student_name,
          counselor: req.counselor,
          counselor_name: req.counselor_name ? { user: { name: req.counselor_name } } : null,
          domain: req.domain,
          description: req.description,
          preferred_times: req.preferred_times ? JSON.stringify(req.preferred_times) : null,
          resume_url: req.resume_url,
          status: req.status,
          created_at: req.created_at,
          updated_at: req.updated_at,
          session_time: req.session_time,
          meet_link: req.meet_link,
          meeting_id: req.meeting_id,
        }));

        setRequests(formattedData);
        setFilteredRequests(formattedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounselingRequests();
  }, [statusFilter]);

  useEffect(() => {
    let filtered = requests;
    if (searchTerm) {
      filtered = filtered.filter(req =>
        Object.values(req).some(val =>
          val && typeof val === 'object' && val.user?.name
            ? val.user.name.toLowerCase().includes(searchTerm.toLowerCase())
            : String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredRequests(filtered);
  }, [requests, searchTerm]);

  const updateTable = () => {
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  };

  const sortRows = (columnIndex) => {
    const newSortDirection = sortColumn === columnIndex && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnIndex);
    setSortDirection(newSortDirection);

    const columnMap = [
      'id', 'student_name', 'domain', 'status', 'counselor_name', 'session_time',
      'meet_link', 'description', 'created_at', 'updated_at', 'preferred_times',
      'resume_url', 'meeting_id'
    ];
    const sortedRows = [...filteredRequests].sort((a, b) => {
      let aValue = a[columnMap[columnIndex]];
      let bValue = b[columnMap[columnIndex]];

      if (columnIndex === 0 || columnIndex === 3) {
        aValue = parseInt(aValue) || String(aValue || 'n/a').toLowerCase();
        bValue = parseInt(bValue) || String(bValue || 'n/a').toLowerCase();
      } else if (columnIndex === 4) {
        aValue = aValue?.user?.name?.toLowerCase() || 'not assigned';
        bValue = bValue?.user?.name?.toLowerCase() || 'not assigned';
      } else if (columnIndex === 5 || columnIndex === 8 || columnIndex === 9) {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      } else {
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

  const handleColumnMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: theme.spacing(3), bgcolor: theme.palette.background.default, minHeight: isFullScreen ? '100vh' : 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: theme.spacing(2) }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          My Counseling Requests
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            sx={{ width: 200 }}
          />
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Assigned">Assigned</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Box>
            <IconButton onClick={toggleFullScreen} title="Toggle Full Screen">
              {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
            <IconButton onClick={toggleDensity} title="Toggle Density">
              {density === 'standard' ? <DensitySmall /> : <DensityMedium />}
            </IconButton>
            <IconButton onClick={handleColumnMenuOpen} title="Toggle Columns">
              <ViewColumn />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleColumnMenuClose}
            >
              {Object.keys(visibleColumns).map(col => (
                <MenuItem key={col}>
                  <Checkbox
                    checked={visibleColumns[col]}
                    onChange={() => toggleColumnVisibility(col)}
                  />
                  <Typography sx={{ textTransform: 'capitalize' }}>{col.replace('_', ' ')}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: theme.spacing(3) }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: theme.spacing(2) }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <TableContainer component={Paper} sx={{ maxHeight: 420, bgcolor: theme.palette.background.paper }}>
          <Table size={density === 'standard' ? 'medium' : 'small'}>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.grey[200] }}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.length === updateTable().length && updateTable().length > 0}
                    onChange={toggleSelectAll}
                  />
                </TableCell>
                {visibleColumns.student_name && (
                  <TableCell onClick={() => sortRows(1)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Student Name {sortColumn === 1 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.domain && (
                  <TableCell onClick={() => sortRows(2)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Domain {sortColumn === 2 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell onClick={() => sortRows(3)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Status {sortColumn === 3 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.counselor_name && (
                  <TableCell onClick={() => sortRows(4)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Counselor {sortColumn === 4 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.session_time && (
                  <TableCell onClick={() => sortRows(5)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Session Time {sortColumn === 5 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.meet_link && (
                  <TableCell onClick={() => sortRows(6)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Meet Link {sortColumn === 6 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.description && (
                  <TableCell onClick={() => sortRows(7)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Description {sortColumn === 7 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.created_at && (
                  <TableCell onClick={() => sortRows(8)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Created At {sortColumn === 8 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.updated_at && (
                  <TableCell onClick={() => sortRows(9)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Updated At {sortColumn === 9 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.preferred_times && (
                  <TableCell onClick={() => sortRows(10)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Preferred Times {sortColumn === 10 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.resume_url && (
                  <TableCell onClick={() => sortRows(11)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Resume URL {sortColumn === 11 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
                {visibleColumns.meeting_id && (
                  <TableCell onClick={() => sortRows(12)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    Meeting ID {sortColumn === 12 && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={Object.keys(visibleColumns).length + 1} sx={{ textAlign: 'center' }}>
                    No counseling requests found
                  </TableCell>
                </TableRow>
              )}
              {updateTable().map(req => (
                <TableRow
                  key={req.id}
                  sx={{
                    bgcolor: selectedRows.includes(req) ? theme.palette.action.selected : 'inherit',
                    '&:hover': { bgcolor: theme.palette.action.hover },
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(req)}
                      onChange={() => toggleRowSelection(req)}
                    />
                  </TableCell>

                  {visibleColumns.student_name && <TableCell>{req.student_name || 'N/A'}</TableCell>}
                  {visibleColumns.domain && <TableCell>{req.domain || 'N/A'}</TableCell>}
                  {visibleColumns.status && <TableCell>{req.status || 'N/A'}</TableCell>}
                  {visibleColumns.counselor_name && <TableCell>{req.counselor_name?.user?.name || 'Not Assigned'}</TableCell>}
                  {visibleColumns.session_time && (
                    <TableCell>{req.session_time ? new Date(req.session_time).toLocaleString() : 'N/A'}</TableCell>
                  )}
                  {visibleColumns.meet_link && (
                    <TableCell>
                      {req.meet_link ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/dashboard/CounselorConductMeet/`)}
                        >
                          Join
                        </Button>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.description && <TableCell>{req.description || 'N/A'}</TableCell>}
                  {visibleColumns.created_at && (
                    <TableCell>{req.created_at ? new Date(req.created_at).toLocaleString() : 'N/A'}</TableCell>
                  )}
                  {visibleColumns.updated_at && (
                    <TableCell>{req.updated_at ? new Date(req.updated_at).toLocaleString() : 'N/A'}</TableCell>
                  )}
                  {visibleColumns.preferred_times && <TableCell>{req.preferred_times || 'N/A'}</TableCell>}
                  {visibleColumns.resume_url && (
                    <TableCell>
                      {req.resume_url ? (
                        <Button
                          variant="outlined"
                          size="small"
                          href={req.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </Button>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.meeting_id && <TableCell>{req.meeting_id || 'N/A'}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && !error && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: theme.spacing(2), flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
            {selectedRows.length > 0 && (
              <>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {`${selectedRows.length} of ${filteredRequests.length} row(s) selected`}
                </Typography>
                <Button variant="text" size="small" onClick={clearSelection}>
                  Clear selection
                </Button>
              </>
            )}
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredRequests.length)} of {filteredRequests.length} entries
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(2) }}>
            <FormControl size="small">
              <InputLabel>Rows per page</InputLabel>
              <Select
                value={pageSize}
                label="Rows per page"
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Pagination
              count={Math.ceil(filteredRequests.length / pageSize)}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StudentCounselingRequests;