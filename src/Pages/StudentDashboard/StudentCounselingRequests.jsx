import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  Typography, 
  Chip, 
  Button, 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  Avatar,
  Divider,
  Paper,
  Menu,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircle,
  Pending,
  Cancel,
  Assignment,
  Person,
  CalendarToday,
  Description,
  VideoCall,
  AttachFile,
  MoreVert,
  Refresh,
  ViewModule,
  ViewList,
  FilterList,
  Search,
  Download,
} from '@mui/icons-material';

// Status configuration
const STATUS_CONFIG = {
  Pending: { 
    color: '#ff9800', 
    bgColor: '#fff3e0',
    icon: Pending,
    label: 'Pending'
  },
  Assigned: { 
    color: '#2196f3', 
    bgColor: '#e3f2fd',
    icon: Assignment,
    label: 'Assigned'
  },
  Completed: { 
    color: '#4caf50', 
    bgColor: '#e8f5e9',
    icon: CheckCircle,
    label: 'Completed'
  },
  Cancelled: { 
    color: '#f44336', 
    bgColor: '#ffebee',
    icon: Cancel,
    label: 'Cancelled'
  },
};

const StudentCounselingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'compact'
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const studentId = localStorage.getItem('vendorId');
        if (!studentId) throw new Error('Student ID not found');

        const queryParams = new URLSearchParams({ student_id: studentId });
        if (statusFilter) queryParams.append('status', statusFilter);

        const response = await fetch(
          `https://backend-demo-esqk.onrender.com/trainer_gmt/counseling/requests/?${queryParams}`,
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();
        setRequests(data.map(req => ({
          id: req.id,
          student_name: req.student_name || 'Unknown',
          counselor_name: req.counselor_name,
          domain: req.domain || 'Not specified',
          description: req.description || '',
          preferred_times: req.preferred_times,
          resume_url: req.resume_url,
          status: req.status || 'Pending',
          created_at: req.created_at,
          updated_at: req.updated_at,
          session_time: req.session_time,
          meet_link: req.meet_link,
          meeting_id: req.meeting_id,
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter]);

  // Filter and sort
  const filteredRequests = useMemo(() => {
    let filtered = [...requests];

    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      filtered = filtered.filter(req =>
        req.student_name?.toLowerCase().includes(search) ||
        req.domain?.toLowerCase().includes(search) ||
        req.counselor_name?.toLowerCase().includes(search) ||
        req.status?.toLowerCase().includes(search)
      );
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy.includes('_at') || sortBy === 'session_time') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      return sortOrder === 'asc' 
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1);
    });

    return filtered;
  }, [requests, debouncedSearch, sortBy, sortOrder]);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleCardMenu = (event, card) => {
    setAnchorEl(event.currentTarget);
    setSelectedCard(card);
  };

  const handleViewDetails = () => {
    setDetailDialog(true);
    setAnchorEl(null);
  };

  const formatDate = (date) => {
    if (!date) return 'Not scheduled';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderCard = (req) => {
    const statusConfig = STATUS_CONFIG[req.status] || STATUS_CONFIG.Pending;
    const StatusIcon = statusConfig.icon;

    return (
      <Grid item xs={12} sm={6} md={4} key={req.id}>
        <Card 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            },
            borderTop: `4px solid ${statusConfig.color}`,
          }}
        >
          <CardContent sx={{ flexGrow: 1, pb: 1 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: statusConfig.color,
                    width: 48,
                    height: 48,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  {getInitials(req.student_name)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {req.student_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {req.id}
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small" onClick={(e) => handleCardMenu(e, req)}>
                <MoreVert />
              </IconButton>
            </Box>

            {/* Status */}
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={<StatusIcon sx={{ fontSize: 18 }} />}
                label={statusConfig.label}
                size="small"
                sx={{
                  bgcolor: statusConfig.bgColor,
                  color: statusConfig.color,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  '& .MuiChip-icon': { color: statusConfig.color }
                }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Domain:</strong> {req.domain}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Counselor:</strong> {req.counselor_name || 'Not assigned'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2">
                  <strong>Session:</strong> {formatDate(req.session_time)}
                </Typography>
              </Box>

              {req.description && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Description sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {req.description}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>

          <Divider />

          {/* Actions */}
          <CardActions sx={{ p: 2, pt: 1.5, gap: 1 }}>
            {req.meet_link && (
              <Button
                variant="contained"
                size="small"
                startIcon={<VideoCall />}
                fullWidth
                sx={{ flex: 1 }}
              >
                Join Meeting
              </Button>
            )}
            {req.resume_url && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AttachFile />}
                href={req.resume_url}
                target="_blank"
                sx={{ flex: 1 }}
              >
                Resume
              </Button>
            )}
            {!req.meet_link && !req.resume_url && (
              <Button
                variant="text"
                size="small"
                fullWidth
                onClick={() => {
                  setSelectedCard(req);
                  setDetailDialog(true);
                }}
              >
                View Details
              </Button>
            )}
          </CardActions>
        </Card>
      </Grid>
    );
  };

  const renderCompactCard = (req) => {
    const statusConfig = STATUS_CONFIG[req.status] || STATUS_CONFIG.Pending;
    const StatusIcon = statusConfig.icon;

    return (
      <Grid item xs={12} key={req.id}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            borderLeft: `4px solid ${statusConfig.color}`,
            '&:hover': {
              bgcolor: 'action.hover',
              boxShadow: 2,
            },
          }}
        >
          <Avatar sx={{ bgcolor: statusConfig.color }}>
            {getInitials(req.student_name)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {req.student_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {req.domain} • {req.counselor_name || 'Unassigned'}
            </Typography>
          </Box>

          <Chip
            icon={<StatusIcon sx={{ fontSize: 16 }} />}
            label={statusConfig.label}
            size="small"
            sx={{
              bgcolor: statusConfig.bgColor,
              color: statusConfig.color,
              fontWeight: 600,
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
            {formatDate(req.session_time)}
          </Typography>

          {req.meet_link && (
            <Button variant="contained" size="small" startIcon={<VideoCall />}>
              Join
            </Button>
          )}

          <IconButton size="small" onClick={(e) => handleCardMenu(e, req)}>
            <MoreVert />
          </IconButton>
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            My Counseling Requests
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={() => window.location.reload()}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title={viewMode === 'card' ? 'Compact View' : 'Card View'}>
              <IconButton onClick={() => setViewMode(v => v === 'card' ? 'compact' : 'card')}>
                {viewMode === 'card' ? <ViewList /> : <ViewModule />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, minWidth: 250 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Assigned">Assigned</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="created_at">Created Date</MenuItem>
              <MenuItem value="session_time">Session Time</MenuItem>
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="domain">Domain</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const count = requests.filter(r => r.status === status).length;
            return (
              <Paper key={status} sx={{ p: 2, flex: 1, borderLeft: `4px solid ${config.color}` }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: config.color }}>
                  {count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {config.label}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {filteredRequests.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No requests found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {debouncedSearch || statusFilter 
                  ? 'Try adjusting your filters'
                  : 'You haven\'t created any counseling requests yet'}
              </Typography>
            </Paper>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedRequests.map(req => 
                  viewMode === 'card' ? renderCard(req) : renderCompactCard(req)
                )}
              </Grid>

              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, filteredRequests.length)} of{' '}
                  {filteredRequests.length}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Per page</InputLabel>
                    <Select
                      value={pageSize}
                      label="Per page"
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={9}>9</MenuItem>
                      <MenuItem value={12}>12</MenuItem>
                      <MenuItem value={24}>24</MenuItem>
                    </Select>
                  </FormControl>
                  <Pagination
                    count={Math.ceil(filteredRequests.length / pageSize)}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              </Box>
            </>
          )}
        </>
      )}

      {/* Card Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleViewDetails}>View Details</MenuItem>
        {selectedCard?.resume_url && (
          <MenuItem onClick={() => window.open(selectedCard.resume_url, '_blank')}>
            View Resume
          </MenuItem>
        )}
        {selectedCard?.meet_link && (
          <MenuItem onClick={() => window.open(selectedCard.meet_link, '_blank')}>
            Join Meeting
          </MenuItem>
        )}
      </Menu>

      {/* Details Dialog */}
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedCard && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: STATUS_CONFIG[selectedCard.status]?.color }}>
                  {getInitials(selectedCard.student_name)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedCard.student_name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Request ID: {selectedCard.id}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      icon={React.createElement(STATUS_CONFIG[selectedCard.status]?.icon || Assignment)}
                      label={selectedCard.status}
                      size="small"
                      sx={{
                        bgcolor: STATUS_CONFIG[selectedCard.status]?.bgColor,
                        color: STATUS_CONFIG[selectedCard.status]?.color,
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Domain</Typography>
                  <Typography>{selectedCard.domain}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Counselor</Typography>
                  <Typography>{selectedCard.counselor_name || 'Not assigned'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Session Time</Typography>
                  <Typography>{formatDate(selectedCard.session_time)}</Typography>
                </Box>
                {selectedCard.description && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Description</Typography>
                    <Typography>{selectedCard.description}</Typography>
                  </Box>
                )}
                {selectedCard.meeting_id && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Meeting ID</Typography>
                    <Typography>{selectedCard.meeting_id}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" color="text.secondary">Created</Typography>
                  <Typography>{formatDate(selectedCard.created_at)}</Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialog(false)}>Close</Button>
              {selectedCard.meet_link && (
                <Button variant="contained" startIcon={<VideoCall />}>
                  Join Meeting
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default StudentCounselingRequests;