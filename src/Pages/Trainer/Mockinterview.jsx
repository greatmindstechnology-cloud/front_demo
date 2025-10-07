import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Button,
  Alert,
  CircularProgress,
  Collapse,
  IconButton,
  Grid,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TimelineIcon from '@mui/icons-material/Timeline';
 // Assume CSS for minor tweaks if needed

// Dummy request data, sorted by date
const dummyPendingRequests = [
  { id: 1, studentName: 'Alice Johnson', domain: 'Fitness', date: '2025-09-23', timeSlot: '10:00-11:00', status: 'pending' },
  { id: 2, studentName: 'Bob Smith', domain: 'Yoga', date: '2025-09-24', timeSlot: '11:00-12:00', status: 'pending' },
  { id: 3, studentName: 'Charlie Brown', domain: 'Coding', date: '2025-09-25', timeSlot: '14:00-15:00', status: 'pending' },
].sort((a, b) => new Date(a.date) - new Date(b.date));

const dummyAcceptedRequests = [
  { id: 4, studentName: 'David Lee', domain: 'Technical Training', date: '2025-09-23', timeSlot: '09:00-10:00', status: 'approved' },
  { id: 5, studentName: 'Emma Davis', domain: 'Fitness', date: '2025-09-24', timeSlot: '13:00-14:00', status: 'approved' },
].sort((a, b) => new Date(a.date) - new Date(b.date));

const Mockinterview = () => {
  const [tabValue, setTabValue] = useState(0); // 0: Pending, 1: Accepted
  const [pendingRequests, setPendingRequests] = useState(dummyPendingRequests);
  const [acceptedRequests, setAcceptedRequests] = useState(dummyAcceptedRequests);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const [trainerId, setTrainerId] = useState(() => {
    const storedTrainerId = localStorage.getItem('trainerId');
    return storedTrainerId || '';
  });

  useEffect(() => {
    const storedTrainerId = localStorage.getItem('trainerId');
    if (storedTrainerId && storedTrainerId !== trainerId) {
      setTrainerId(storedTrainerId);
    }
  }, [trainerId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setExpandedRequest(null);
  };

  const handleExpandClick = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const handleApprove = async (requestId) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      const request = pendingRequests.find((req) => req.id === requestId);
      setPendingRequests(pendingRequests.filter((req) => req.id !== requestId));
      setAcceptedRequests([...acceptedRequests, { ...request, status: 'approved' }].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setSuccess('Request approved successfully');
      setExpandedRequest(null);
    } catch (err) {
      setError('Failed to approve request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate API call
      setPendingRequests(pendingRequests.filter((req) => req.id !== requestId));
      setSuccess('Request rejected successfully');
      setExpandedRequest(null);
    } catch (err) {
      setError('Failed to reject request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSession = (requestId) => {
    alert(`Joining session for request ID: ${requestId}`);
    // navigate(`/meeting/${requestId}`);
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.grey[100],
        color: theme.palette.text.primary,
        p: { xs: 2, sm: 3 },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mb: 3,
            textAlign: 'center',
            letterSpacing: 0.5,
            fontSize: { xs: '2rem', sm: '2.5rem' },
          }}
        >
          Mock Interview Management
        </Typography>

        {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', mb: 2 }} />}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2, bgcolor: 'error.light', fontSize: '1rem' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2, bgcolor: 'success.light', fontSize: '1rem' }}>
            {success}
          </Alert>
        )}

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 1,
            mb: 3,
            '& .MuiTab-root': {
              fontWeight: '600',
              textTransform: 'none',
              fontSize: { xs: '1rem', sm: '1.2rem' },
              py: 2,
              color: theme.palette.text.secondary,
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
              bgcolor: theme.palette.grey[50],
            },
            '& .MuiTabs-indicator': {
              bgcolor: theme.palette.primary.main,
              height: 3,
            },
          }}
        >
          <Tab label="Pending Requests" />
          <Tab label="Accepted Requests" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            {pendingRequests.length === 0 ? (
              <Typography sx={{ textAlign: 'center', color: theme.palette.text.secondary, py: 3, fontSize: '1.1rem', fontStyle: 'italic' }}>
                No pending requests at this time.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {pendingRequests.map((req) => (
                  <Grid item xs={12} key={req.id}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: 3,
                        bgcolor: 'white',
                        minHeight: 120,
                        width: '100%',
                        transition: 'box-shadow 0.3s, transform 0.3s',
                        '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
                        overflow: 'hidden',
                      }}
                    >
                      <CardHeader
                        title={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                              {req.studentName} - {req.domain}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Chip
                                label="Pending"
                                color="warning"
                                size="small"
                                sx={{ fontWeight: 'medium', fontSize: '0.9rem' }}
                              />
                              <IconButton onClick={() => handleExpandClick(req.id)}>
                                {expandedRequest === req.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                            </Box>
                          </Box>
                        }
                        sx={{ bgcolor: theme.palette.grey[50], py: 2 }}
                      />
                      <Collapse in={expandedRequest === req.id}>
                        <CardContent sx={{ pt: 2, pb: 3, minHeight: 160 }}>
                          <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.secondary, fontSize: '1rem' }}>
                            <strong>Domain:</strong> {req.domain}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.secondary, fontSize: '1rem' }}>
                            <strong>Date:</strong> {req.date}
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2, color: theme.palette.text.secondary, fontSize: '1rem' }}>
                            <strong>Time Slot:</strong> {req.timeSlot}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleApprove(req.id)}
                              sx={{ borderRadius: 1, px: 3, textTransform: 'none', fontWeight: 'medium', fontSize: '1rem' }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleReject(req.id)}
                              sx={{ borderRadius: 1, px: 3, textTransform: 'none', fontWeight: 'medium', fontSize: '1rem' }}
                            >
                              Reject
                            </Button>
                          </Box>
                        </CardContent>
                      </Collapse>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ position: 'relative', pl: 4 }}>
            <Box
              sx={{
                position: 'absolute',
                left: 20,
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: theme.palette.primary.main,
                opacity: 0.3,
              }}
            />
            {acceptedRequests.length === 0 ? (
              <Typography sx={{ textAlign: 'center', color: theme.palette.text.secondary, py: 3, fontSize: '1.1rem', fontStyle: 'italic' }}>
                No accepted requests at this time.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {acceptedRequests.map((req) => (
                  <Grid item xs={12} key={req.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimelineIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 28 }} />
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: 3,
                          bgcolor: 'white',
                          width: '100%',
                          minHeight: 240,
                          transition: 'box-shadow 0.3s, transform 0.3s',
                          '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
                        }}
                      >
                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ fontWeight: 'medium', fontSize: '1.4rem' }}>
                              {req.studentName}
                            </Typography>
                            <Chip
                              label="Approved"
                              color="success"
                              size="small"
                              sx={{ fontWeight: 'medium', fontSize: '0.9rem' }}
                            />
                          </Box>
                          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: '1rem' }}>
                            <strong>Domain:</strong> {req.domain}
                          </Typography>
                          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: '1rem' }}>
                            <strong>Date:</strong> {req.date}
                          </Typography>
                          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: '1rem' }}>
                            <strong>Time:</strong> {req.timeSlot}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleJoinSession(req.id)}
                            sx={{ borderRadius: 1, mt: 2, textTransform: 'none', fontWeight: 'medium', fontSize: '1rem' }}
                          >
                            Join Session
                          </Button>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Mockinterview;