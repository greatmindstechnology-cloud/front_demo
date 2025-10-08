// src/components/CreateTask.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const trainerId = localStorage.getItem('vendorId') || ''; // Corrected to trainerId
  const courseId = localStorage.getItem('courseId') || '';

  useEffect(() => {
    if (!courseId) {
      setError('Course ID not found.');
      navigate('/dashboard/trainer', { replace: true });
    }
  }, [courseId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!trainerId) {
      setError('Trainer ID not found. Please log in.');
      setIsLoading(false);
      return;
    }

    if (!courseId) {
      setError('Course ID not found.');
      setIsLoading(false);
      return;
    }

    // Validate required fields
    if (!title.trim()) {
      setError('Title is required.');
      setIsLoading(false);
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('course', courseId); // Foreign key to CourseTable
    formData.append('trainer', trainerId); // Foreign key to TrainerData (assuming it's in the serializer)
    formData.append('task_title', title);
    formData.append('task_description', description);
    if (file) formData.append('task_pdf', file); // Matches task_pdf field

    try {
      const response = await fetch('https://backend-demo-esqk.onrender.com/course_gmt/api/tasks/', { // Updated endpoint
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      console.log('Raw Response:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(JSON.stringify(errorData) || 'Failed to create task');
        } catch (parseError) {
          throw new Error(`Server returned ${response.status}: ${responseText}`);
        }
      }

      const data = JSON.parse(responseText);
      setSuccess(data.message || 'Task created successfully');
      setTimeout(() => navigate('/dashboard/trainer'), 2000);
    } catch (err) {
      console.error('Create Task Error:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h4" gutterBottom>Create Task</Typography>
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{ mb: 2 }} required />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} sx={{ mb: 2 }} required />
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} style={{ mb: 2 }} />
        <Button variant="contained" color="primary" onClick={(e) => { setIsDraft(true); handleSubmit(e); }}>Save as Draft</Button>
        <Button type="submit" variant="contained" color="success" sx={{ ml: 2 }} onClick={() => setIsDraft(false)}>Publish</Button>
      </form>
    </Box>
  );
};

export default CreateTask;