import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

const SubmitTask = () => {
  const [comments, setComments] = useState('');
  const [file, setFile] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { taskId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const studentId = localStorage.getItem('studentId') || '';
  const courseId = localStorage.getItem('courseId') || '';
  const storedTaskId = localStorage.getItem('taskId') || '';

  useEffect(() => {
    try {
      if (!courseId || !studentId || !taskId) {
        setError('Course ID, Student ID, or Task ID not found.');
        navigate('/dashboard/student', { replace: true });
        return;
      }

      // Validate taskId from URL matches stored taskId (optional, for consistency)
      if (taskId !== storedTaskId) {
        console.warn('Task ID mismatch between URL and localStorage');
      }

      // Retrieve tasks from localStorage and find the matching task by task_id
      const storedTasks = localStorage.getItem('courseTasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const task = tasks.find((t) => t.task_id === parseInt(taskId)); // Fixed: use task_id
        if (task) {
          setCurrentTask(task);
        } else {
          setError('Task not found. Please go back and select a task again.');
        }
      } else {
        setError('No task data available. Please refresh the tasks list.');
      }
    } catch (err) {
      console.error('Error in useEffect:', err);
      setError('An unexpected error occurred while loading the task.');
    }
  }, [courseId, studentId, taskId, storedTaskId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!studentId) {
      setError('Student ID not found. Please log in.');
      setIsLoading(false);
      return;
    }

    if (!file) {
      setError('Please upload a file.');
      setIsLoading(false);
      return;
    }

    if (!currentTask) {
      setError('Task details not loaded. Please try again.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('task', taskId);
    formData.append('student', studentId);
    formData.append('document', file);
    if (comments.trim()) formData.append('comments', comments);

    try {
      const response = await fetch('https://backend-demo-esqk.onrender.com/course_gmt/api/task-submit/', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      console.log('Raw Response:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(JSON.stringify(errorData.errors) || 'Failed to submit task');
        } catch (parseError) {
          throw new Error(`Server returned ${response.status}: ${responseText}`);
        }
      }

      const data = JSON.parse(responseText);
      setSuccess(data.message || 'Task submitted successfully');
      localStorage.removeItem('taskId');
      setTimeout(() => navigate('/dashboard/student'), 2000);
    } catch (err) {
      console.error('Submit Task Error:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // If an error occurs and no task is loaded, show error UI
  if (!currentTask && error) {
    return (
      <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
        <Typography variant="h4" gutterBottom>Submit Task</Typography>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard/student')}>
          Go Back to Tasks
        </Button>
      </Box>
    );
  }

  // If task is still loading or no error, show loading state
  if (!currentTask) {
    return (
      <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
        <Typography variant="h4" gutterBottom>Submit Task</Typography>
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h4" gutterBottom>Submit Task</Typography>
      <Typography variant="h6" gutterBottom>Task: {currentTask.task_title}</Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
        Description: {currentTask.task_description}
      </Typography>
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Comments (Optional)"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: '16px' }}
        />
        <Button type="submit" variant="contained" color="success">
          Submit Task
        </Button>
      </form>
    </Box>
  );
};

export default SubmitTask;