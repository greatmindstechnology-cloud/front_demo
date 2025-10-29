import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  Stack,
  FormHelperText,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
  AlertTitle,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Assignment as AssignmentIcon,
  CheckCircle,
  Error as ErrorIcon,
  Info,
  AttachFile,
} from '@mui/icons-material';

const API_BASE_URL = 'https://backend-demo-esqk.onrender.com';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const StudentAssignmentSubmissionPage = () => {
  // State management
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAssignments, setIsFetchingAssignments] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const theme = useTheme();

  const studentId = useMemo(() => localStorage.getItem('vendorId') || '', []);

  // Selected assignment details
  const selectedAssignment = useMemo(
    () => assignments.find(a => a.id === selectedAssignmentId),
    [assignments, selectedAssignmentId]
  );

  // Check if assignment is overdue
  const isOverdue = useMemo(() => {
    if (!selectedAssignment?.due_date) return false;
    return new Date(selectedAssignment.due_date) < new Date();
  }, [selectedAssignment]);

  // Fetch available assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!studentId) {
        setError('Please log in to view assignments');
        setIsFetchingAssignments(false);
        return;
      }

      setIsFetchingAssignments(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/trainer_gmt/get_assignments/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add auth token if needed: 'Authorization': `Bearer ${token}`,
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const assignmentsList = data.results || data || [];
        
        // Sort assignments by due date (upcoming first)
        const sortedAssignments = assignmentsList.sort((a, b) => 
          new Date(a.due_date) - new Date(b.due_date)
        );
        
        setAssignments(sortedAssignments);
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('Request timeout. Please check your connection and try again.');
        } else {
          setError(`Failed to fetch assignments: ${err.message}`);
        }
        console.error('Fetch assignments error:', err);
      } finally {
        setIsFetchingAssignments(false);
      }
    };

    fetchAssignments();
  }, [studentId]);

  // Validate file
  const validateFile = useCallback((file) => {
    if (!file) return null;

    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit';
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Invalid file type. Only PDF and Word documents are allowed';
    }

    return null;
  }, []);

  // Handle file selection
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (!file) {
      setUploadedFile(null);
      return;
    }

    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setUploadedFile(null);
      e.target.value = ''; // Clear input
      return;
    }

    setUploadedFile(file);
  }, [validateFile]);

  // Remove selected file
  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setFileError(null);
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const errors = {};

    if (!studentId) {
      errors.student = 'Student ID is required. Please log in.';
    }

    if (!selectedAssignmentId) {
      errors.assignment = 'Please select an assignment';
    }

    if (!answerText.trim() && !uploadedFile) {
      errors.submission = 'Please provide either an answer text or upload a file';
    }

    if (answerText.trim() && answerText.length < 10) {
      errors.answerText = 'Answer must be at least 10 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [studentId, selectedAssignmentId, answerText, uploadedFile]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('assignment_id', selectedAssignmentId);
    formData.append('answer_text', answerText.trim());
    
    if (uploadedFile) {
      formData.append('uploaded_file', uploadedFile);
    }

    try {
      // Simulate upload progress (in production, use XMLHttpRequest or axios for real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${API_BASE_URL}/trainer_gmt/assignment/submit/`, {
        method: 'POST',
        body: formData,
        // Note: Don't set Content-Type header when sending FormData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to submit assignment');
      }

      const data = await response.json();
      setSuccess(data.message || 'Assignment submitted successfully!');
      
      // Reset form
      setAnswerText('');
      setUploadedFile(null);
      setSelectedAssignmentId('');
      handleRemoveFile();
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/student/dashboard', { 
          state: { message: 'Assignment submitted successfully!' }
        });
      }, 2000);

    } catch (err) {
      console.error('Submit assignment error:', err);
      setError(err.message || 'An error occurred while submitting the assignment');
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  }, [studentId, selectedAssignmentId, answerText, uploadedFile, validateForm, navigate, handleRemoveFile]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day(s)`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} day(s) - ${date.toLocaleDateString()}`;
    }
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <AssignmentIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          <Box>
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Submit Assignment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete and submit your assignment below
            </Typography>
          </Box>
        </Stack>

        {/* Global Loading */}
        {isFetchingAssignments && (
          <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography color="text.secondary">Loading assignments...</Typography>
          </Paper>
        )}

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            icon={<ErrorIcon />}
            onClose={() => setError(null)}
          >
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            icon={<CheckCircle />}
          >
            <AlertTitle>Success</AlertTitle>
            {success}
          </Alert>
        )}

        {/* Main Form */}
        {!isFetchingAssignments && (
          <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>

                {/* Assignment Selection */}
                <FormControl 
                  fullWidth 
                  required 
                  error={!!validationErrors.assignment}
                  disabled={assignments.length === 0}
                >
                  <InputLabel>Select Assignment</InputLabel>
                  <Select
                    value={selectedAssignmentId}
                    onChange={(e) => setSelectedAssignmentId(e.target.value)}
                    label="Select Assignment"
                    renderValue={(selected) => {
                      const assignment = assignments.find(a => a.id === selected);
                      return assignment ? assignment.title : '';
                    }}
                  >
                    {assignments.length === 0 ? (
                      <MenuItem disabled>No assignments available</MenuItem>
                    ) : (
                      assignments.map((assignment) => (
                        <MenuItem key={assignment.id} value={assignment.id}>
                          <Box sx={{ width: '100%' }}>
                            <Typography variant="body1" fontWeight="medium">
                              {assignment.title}
                            </Typography>
                            <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                              <Chip
                                label={formatDate(assignment.due_date)}
                                size="small"
                                color={new Date(assignment.due_date) < new Date() ? 'error' : 'primary'}
                                variant="outlined"
                              />
                              {assignment.points && (
                                <Chip label={`${assignment.points} points`} size="small" variant="outlined" />
                              )}
                            </Stack>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {validationErrors.assignment && (
                    <FormHelperText>{validationErrors.assignment}</FormHelperText>
                  )}
                </FormControl>

                {/* Selected Assignment Details */}
                {selectedAssignment && (
                  <Card variant="outlined" sx={{ bgcolor: isOverdue ? 'error.light' : 'info.light', opacity: 0.9 }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Info fontSize="small" />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Assignment Details
                        </Typography>
                      </Stack>
                      <Typography variant="body2" paragraph>
                        <strong>Title:</strong> {selectedAssignment.title}
                      </Typography>
                      {selectedAssignment.description && (
                        <Typography variant="body2" paragraph>
                          <strong>Description:</strong> {selectedAssignment.description}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        <strong>Due Date:</strong> {formatDate(selectedAssignment.due_date)}
                      </Typography>
                      {isOverdue && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          This assignment is overdue. Late submissions may be penalized.
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Divider />

                {/* Answer Text */}
                <TextField
                  label="Your Answer"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Type your answer here..."
                  error={!!validationErrors.answerText}
                  helperText={
                    validationErrors.answerText || 
                    `${answerText.length} characters ${answerText.length > 0 ? `(min 10 required)` : ''}`
                  }
                  variant="outlined"
                />

                {/* File Upload */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight="medium">
                    Upload File (Optional)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                    Accepted formats: PDF, DOC, DOCX (Max size: 10MB)
                  </Typography>

                  {!uploadedFile ? (
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      Choose File
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                      />
                    </Button>
                  ) : (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <AttachFile color="primary" />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {uploadedFile.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(uploadedFile.size)}
                          </Typography>
                        </Box>
                        <Tooltip title="Remove file">
                          <IconButton onClick={handleRemoveFile} color="error" size="small">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Paper>
                  )}

                  {fileError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {fileError}
                    </Alert>
                  )}
                </Box>

                {/* Validation Error */}
                {validationErrors.submission && (
                  <Alert severity="warning">
                    {validationErrors.submission}
                  </Alert>
                )}

                {/* Upload Progress */}
                {isLoading && uploadProgress > 0 && (
                  <Box>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" color="text.secondary">
                        Uploading...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {uploadProgress}%
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isLoading || !studentId || !selectedAssignmentId || assignments.length === 0}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircle />}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  {isLoading ? 'Submitting...' : 'Submit Assignment'}
                </Button>

                {/* Cancel Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/student/dashboard')}
                  disabled={isLoading}
                  fullWidth
                >
                  Cancel
                </Button>
              </Stack>
            </form>
          </Paper>
        )}

        {/* Info Box */}
        <Alert severity="info" sx={{ mt: 3 }} icon={<Info />}>
          <AlertTitle>Submission Guidelines</AlertTitle>
          <Typography variant="body2" component="div">
            • Ensure your answer is complete and well-formatted
            <br />
            • Upload supporting documents if required
            <br />
            • Submit before the due date to avoid penalties
            <br />
            • You can provide text, file, or both
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default StudentAssignmentSubmissionPage;