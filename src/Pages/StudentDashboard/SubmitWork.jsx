import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

const SubmitWork = () => {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const studentId = localStorage.getItem('vendorId') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('project_task_id', id);
    if (file) formData.append('file', file);
    formData.append('comment', comment);

    try {
      const response = await fetch('https://backend-demo-esqk.onrender.com/student_gmt/submit_work/', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to submit work');
      const data = await response.json();
      setSuccess(data.message);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h4" gutterBottom>Submit Work for Project/Task {id}</Typography>
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={(e) => setFile(e.target.files[0])} style={{ mb: 2 }} />
        <TextField label="Optional Comment" value={comment} onChange={(e) => setComment(e.target.value)} fullWidth multiline rows={3} sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" color="primary">Submit</Button>
        <Button onClick={() => navigate(`/submit-work/${id}`)} variant="contained" color="secondary" sx={{ ml: 2 }}>Re-upload</Button>
      </form>
    </Box>
  );
};

export default SubmitWork;