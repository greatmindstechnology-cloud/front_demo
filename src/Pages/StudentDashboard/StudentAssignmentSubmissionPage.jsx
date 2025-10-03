import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, Button, TextField, Alert, CircularProgress, MenuItem, Select } from '@mui/material';

const StudentAssignmentSubmissionPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const studentId = localStorage.getItem('vendorId') || ''; // Fetch from localStorage

  // Fetch available assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/trainer_gmt/get_assignments/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch assignments');
        const data = await response.json();
        setAssignments(data.results || data); // Adjust based on API response structure
      } catch (err) {
        setError('Error fetching assignments: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (studentId) fetchAssignments();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!studentId || !selectedAssignmentId) {
      setError('Student ID or Assignment not selected. Please log in or choose an assignment.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('assignment_id', selectedAssignmentId);
    formData.append('answer_text', answerText);
    if (uploadedFile) {
      formData.append('uploaded_file', uploadedFile);
    }

    try {
      const response = await fetch('http://localhost:8000/trainer_gmt/assignment/submit/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit assignment');
      }

      const data = await response.json();
      setSuccess(data.message);
      setTimeout(() => navigate('/student/dashboard'), 2000); // Redirect after success
    } catch (err) {
      console.error('Submit Assignment Error:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}
    >
      <Typography variant="h4" gutterBottom>
        Submit Assignment
      </Typography>

      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          label="Student ID"
          value={studentId}
          InputProps={{ readOnly: true }}
          fullWidth
          required
          sx={{ mb: 2 }}
          helperText={studentId ? '' : 'Not logged in'}
        />
        <Select
          value={selectedAssignmentId}
          onChange={(e) => setSelectedAssignmentId(e.target.value)}
          fullWidth
          displayEmpty
          required
          sx={{ mb: 2 }}
          renderValue={(selected) => {
            const assignment = assignments.find(a => a.id === selected);
            return assignment ? assignment.title : 'Select an Assignment';
          }}
        >
          {assignments.map((assignment) => (
            <MenuItem key={assignment.id} value={assignment.id}>
              {assignment.title} (Due: {new Date(assignment.due_date).toLocaleDateString()})
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Answer Text"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <input
          type="file"
          accept="application/pdf" // Restrict to PDF files
          onChange={(e) => setUploadedFile(e.target.files[0])}
          style={{ marginBottom: '16px' }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={isLoading || !studentId || !selectedAssignmentId}>
          Submit Assignment
        </Button>
      </form>
    </Box>
  );
};

export default StudentAssignmentSubmissionPage;