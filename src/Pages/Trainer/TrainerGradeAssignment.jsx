import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  TableContainer,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link
} from '@mui/material';
import { Refresh as RefreshIcon, Download as DownloadIcon } from '@mui/icons-material';

const TrainerGradeAssignment = () => {
  const [submissions, setSubmissions] = useState([]);
  const [marksInput, setMarksInput] = useState({}); // Separate state for marks input
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const trainerId = localStorage.getItem('vendorId') || '';

  const fetchSubmissions = useCallback(async () => {
    if (!trainerId) {
      setError('Trainer ID not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/trainer_gmt/get_assignment-submissions/', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch submissions`);
      }

      const data = await response.json();
      const submissionsData = data.results || data || [];
      
      // Initialize marks_obtained for each submission if not present
      const initializedSubmissions = submissionsData.map(sub => ({
        ...sub,
        marks_obtained: sub.marks_obtained || '',
        assignment_max_marks: sub.assignment_max_marks || 100
      }));
      
      setSubmissions(initializedSubmissions);
      
      // Initialize marksInput state with existing marks
      const initialMarks = {};
      initializedSubmissions.forEach(sub => {
        const key = `${sub.student_id}-${sub.assignment_id}`;
        initialMarks[key] = sub.marks_obtained || '';
      });
      setMarksInput(initialMarks);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Error fetching submissions: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [trainerId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleGrade = async (studentId, assignmentId, maxMarks) => {
    const key = `${studentId}-${assignmentId}`;
    const marks = marksInput[key];
    
    // Validation
    if (!marks || marks === '') {
      setError('Please enter marks before grading');
      return;
    }

    const marksNum = parseFloat(marks);
    if (isNaN(marksNum) || marksNum < 0) {
      setError('Please enter a valid positive number for marks');
      return;
    }

    if (marksNum > maxMarks) {
      setError(`Marks cannot exceed maximum marks (${maxMarks})`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const gradeData = {
      student_id: studentId,
      assignment_id: assignmentId,
      marks_obtained: marksNum,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/trainer_gmt/assignment/grade/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(gradeData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to grade assignment');
      }

      const data = await response.json();
      setSuccess(data.message || 'Assignment graded successfully!');
      
      // Update the local state
      setSubmissions(prevSubmissions => 
        prevSubmissions.map(sub => 
          sub.student_id === studentId && sub.assignment_id === assignmentId
            ? { ...sub, is_graded: true, marks_obtained: marksNum }
            : sub
        )
      );

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('Grade error:', err);
      setError(`Error grading assignment: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarksChange = (studentId, assignmentId, value) => {
    const key = `${studentId}-${assignmentId}`;
    setMarksInput(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleViewFile = (fileUrl) => {
    if (fileUrl && fileUrl !== 'None') {
      setSelectedFile(fileUrl);
      setFileDialogOpen(true);
    }
  };

  const handleDownloadFile = (fileUrl, studentName, assignmentTitle) => {
    if (fileUrl && fileUrl !== 'None') {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${studentName}_${assignmentTitle}_submission`.replace(/\s+/g, '_');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!trainerId) {
    return (
      <Box sx={{ bgcolor: theme.palette.background.default, p: 3, textAlign: 'center' }}>
        <Alert severity="warning">
          Trainer ID not found. Please log in again.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')} 
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Grade Assignments
        </Typography>
        <Tooltip title="Refresh submissions">
          <IconButton 
            onClick={fetchSubmissions} 
            disabled={isLoading}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {isLoading && !submissions.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      ) : submissions.length === 0 ? (
        <Alert severity="info">
          No assignment submissions found.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100' }}>
                <TableCell><strong>Assignment Title</strong></TableCell>
                <TableCell><strong>Student Name</strong></TableCell>
                <TableCell><strong>Answer Text</strong></TableCell>
                <TableCell><strong>File</strong></TableCell>
                <TableCell><strong>Marks</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((sub) => {
                const key = `${sub.student_id}-${sub.assignment_id}`;
                return (
                  <TableRow 
                    key={key}
                    sx={{ 
                      '&:hover': { bgcolor: theme.palette.action.hover },
                      opacity: sub.is_graded ? 0.7 : 1
                    }}
                  >
                    <TableCell>{sub.assignment_title || 'N/A'}</TableCell>
                    <TableCell>{sub.student_name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 300, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {sub.answer_text || 'No text submitted'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {sub.uploaded_file && sub.uploaded_file !== 'None' ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleViewFile(sub.uploaded_file)}
                          >
                            View
                          </Button>
                          <Tooltip title="Download file">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadFile(sub.uploaded_file, sub.student_name, sub.assignment_title)}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No file
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          type="number"
                          value={marksInput[key] || ''}
                          onChange={(e) => handleMarksChange(sub.student_id, sub.assignment_id, e.target.value)}
                          disabled={sub.is_graded}
                          placeholder="0"
                          inputProps={{ 
                            min: 0, 
                            max: sub.assignment_max_marks,
                            step: 0.5
                          }}
                          size="small"
                          sx={{ width: 80 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          / {sub.assignment_max_marks}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {sub.is_graded ? (
                        <Chip label="Graded" color="success" size="small" />
                      ) : (
                        <Chip label="Pending" color="warning" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleGrade(
                          sub.student_id, 
                          sub.assignment_id, 
                          sub.assignment_max_marks
                        )}
                        disabled={sub.is_graded || !marksInput[key] || isLoading}
                      >
                        {sub.is_graded ? 'Graded' : 'Submit Grade'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* File View Dialog */}
      <Dialog 
        open={fileDialogOpen} 
        onClose={() => setFileDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Submitted File</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box sx={{ textAlign: 'center' }}>
              {selectedFile.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img 
                  src={selectedFile} 
                  alt="Submission" 
                  style={{ maxWidth: '100%', maxHeight: '70vh' }}
                />
              ) : (
                <Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Preview not available for this file type.
                  </Typography>
                  <Link href={selectedFile} target="_blank" rel="noopener noreferrer">
                    Open file in new tab
                  </Link>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFileDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerGradeAssignment;