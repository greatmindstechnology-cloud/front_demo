import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Alert, 
  CircularProgress, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider 
} from '@mui/material';
import './TrainerAssignment.css';

const TrainerAssignment = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch trainerId from localStorage on mount
  const [trainerId, setTrainerId] = useState(() => {
    const storedTrainerId = localStorage.getItem('vendorId'); // Corrected to trainerId
    return storedTrainerId || ''; // Default to empty if not found
  });

  // Fetch courseId from localStorage on mount
  const [courseId, setCourseId] = useState(() => {
    const storedCourseId = localStorage.getItem('courseId');
    return storedCourseId || ''; // Default to empty if not found
  });

  useEffect(() => {
    // Update trainerId if localStorage changes (e.g., after login)
    const storedTrainerId = localStorage.getItem('vendorId');
    if (storedTrainerId && storedTrainerId !== trainerId) {
      setTrainerId(storedTrainerId);
    }
  }, [trainerId]);

  useEffect(() => {
    // Update courseId if localStorage changes
    const storedCourseId = localStorage.getItem('courseId');
    if (storedCourseId && storedCourseId !== courseId) {
      setCourseId(storedCourseId);
    }
    if (!storedCourseId) {
      setError('Course ID not found.');
      navigate('/dashboard/trainer', { replace: true });
    }
  }, [courseId, navigate]);

  // Submit assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!trainerId) {
      setError('Trainer ID not found in localStorage. Please log in.');
      setIsLoading(false);
      return;
    }

    if (!courseId) {
      setError('Course ID not found.');
      setIsLoading(false);
      return;
    }

    const assignmentData = {
      trainer_id: trainerId,
      course_id: courseId,
      title,
      description,
      due_date: dueDate,
      max_marks: maxMarks || 100,
    };

    try {
      const response = await fetch('https://backend-demo-esqk.onrender.com/trainer_gmt/assignment/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create assignment');
      }

      const data = await response.json();
      setSuccess(data.message);
      setTimeout(() => navigate('/dashboard/trainer'), 2000); // Redirect after success
    } catch (err) {
      console.error('Create Assignment Error:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      className="trainer-assignment-container"
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        p: 3,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 600, boxShadow: 3, borderRadius: 2 }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              Create Assignment
            </Typography>
          }
          sx={{ backgroundColor: theme.palette.grey[100], pb: 1 }}
        />
        <CardContent>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
           
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 3 }}
              variant="outlined"
            />
            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              inputProps={{ min: new Date().toISOString().split('T')[0] }} // Restrict to future dates
              variant="outlined"
            />
            <TextField
              label="Max Marks"
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
              inputProps={{ min: 0 }}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading || !trainerId}
                sx={{ px: 3, py: 1 }}
              >
                Create Assignment
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/dashboard/trainer')}
                sx={{ px: 3, py: 1 }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TrainerAssignment;