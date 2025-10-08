import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, TextField, Checkbox, FormControlLabel, Button, Alert } from '@mui/material';
import './CreateTopic.css';

const CreateTopic = () => {
  const [trainerId, setTrainerId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch trainer_id
  useEffect(() => {
    const id = localStorage.getItem('vendorId') || '5';
    console.log('Trainer ID:', id); // Debug
    if (!id) {
      setError('Trainer ID not found. Please log in.');
      navigate('/login', { replace: true });
    } else {
      setTrainerId(id);
    }
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validate required fields
    if (!formData.title) {
      setError('Title is required.');
      setIsLoading(false);
      return;
    }

    // Validate duration
    if (formData.duration && (isNaN(formData.duration) || formData.duration < 0)) {
      setError('Duration must be a non-negative number.');
      setIsLoading(false);
      return;
    }

    // Prepare data
    const data = {
      title: formData.title,
      description: formData.description,
      duration: formData.duration ? parseInt(formData.duration) : 0,
      is_active: formData.is_active,
    };

    // Debug: Log data
    console.log('Request Data:', data);

    try {
      const response = await fetch(`https://backend-demo-esqk.onrender.com/trainer_gmt/create/topic/?trainer_id=${trainerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Debug: Log raw response
      console.log('Create Topic Response Status:', response.status);
      const responseText = await response.text();
      console.log('Create Topic Raw Response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      console.log('Create Topic Parsed Response:', responseData); // Debug

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create topic.');
      }

      setSuccess(`Topic "${responseData.title}" created successfully! Topic ID: ${responseData.topic_id}`);
      setFormData({
        title: '',
        description: '',
        duration: '',
        is_active: true,
      });

      // Redirect to CreateQuizQuestion page with the new topic_id
      setTimeout(() => {
        navigate(`/dashboard/trainer/quiz-question-create/${responseData.topic_id}`);
      }, 1000); // Small delay to show success message
    } catch (err) {
      console.error('Create Topic API Error:', err.message); // Debug
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      className="create-topic-container"
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" className="create-topic-title">
        Create New Topic
      </Typography>

      {/* Error and Success Messages */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Topic Creation Form */}
      <Box className="form-card" sx={{ bgcolor: theme.palette.background.paper }}>
        <form onSubmit={handleSubmit} className="form-grid">
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            fullWidth
            inputProps={{ maxLength: 255 }}
            aria-label="Topic Title"
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            aria-label="Topic Description"
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <TextField
            label="Duration (minutes)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleInputChange}
            fullWidth
            inputProps={{ min: 0, step: 1 }}
            aria-label="Topic Duration"
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <FormControlLabel
            control={
              <Checkbox
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                aria-label="Publish Topic"
              />
            }
            label="Publish (uncheck to save as draft)"
            className="checkbox-group"
          />

          <Box className="form-actions">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/dashboard/trainer')}
              disabled={isLoading}
              className="btn-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              className="btn-submit"
            >
              {isLoading ? 'Creating Topic...' : 'Save Topic'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CreateTopic;