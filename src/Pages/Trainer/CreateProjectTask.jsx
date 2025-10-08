import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert, CircularProgress } from '@mui/material';

const CreateProjectTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [type, setType] = useState('Task');
  const [file, setFile] = useState(null);
  const [batchCourse, setBatchCourse] = useState('');
  const [dueDateTime, setDueDateTime] = useState('');
  const [gradingType, setGradingType] = useState('Manual');
  const [isDraft, setIsDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const trainerId = localStorage.getItem('trainerId') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('trainer_id', trainerId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('type', type);
    if (file) formData.append('file', file);
    formData.append('batch_course', batchCourse);
    formData.append('due_date_time', dueDateTime);
    formData.append('grading_type', gradingType);
    formData.append('is_draft', isDraft);

    try {
      const response = await fetch('https://backend-demo-esqk.onrender.com/trainer_gmt/create_project_task/', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create Project/Task');
      const data = await response.json();
      setSuccess(data.message);
      setTimeout(() => navigate('/dashboard/trainer'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h4" gutterBottom>Create Project/Task</Typography>
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{ mb: 2 }} required />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} sx={{ mb: 2 }} required />
        <TextField label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} fullWidth sx={{ mb: 2 }} />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)} required>
            <MenuItem value="Task">Task</MenuItem>
            <MenuItem value="Project">Project</MenuItem>
          </Select>
        </FormControl>
        <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={(e) => setFile(e.target.files[0])} style={{ mb: 2 }} />
        <TextField label="Batch/Course" value={batchCourse} onChange={(e) => setBatchCourse(e.target.value)} fullWidth sx={{ mb: 2 }} required />
        <TextField type="datetime-local" label="Due Date & Time" value={dueDateTime} onChange={(e) => setDueDateTime(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} required />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Grading Type</InputLabel>
          <Select value={gradingType} onChange={(e) => setGradingType(e.target.value)} required>
            <MenuItem value="Manual">Manual</MenuItem>
            <MenuItem value="Auto">Auto</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={() => setIsDraft(true) & handleSubmit(e)}>Save as Draft</Button>
        <Button type="submit" variant="contained" color="success" sx={{ ml: 2 }}>Publish</Button>
      </form>
    </Box>
  );
};

export default CreateProjectTask;