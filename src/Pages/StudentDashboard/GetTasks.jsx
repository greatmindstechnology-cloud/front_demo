import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, Card, CardContent, CardActions, Alert, CircularProgress, Button, Modal, TextField, Link } from '@mui/material';

const GetTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [comments, setComments] = useState('');
  const [file, setFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const courseId = localStorage.getItem('courseId') || '';
  const studentId = localStorage.getItem('vendorId') || '';

  useEffect(() => {
    if (!courseId) {
      setError('Course ID not found.');
      navigate('/dashboard/student', { replace: true });
      return;
    }

    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8000/course_gmt/get/tasks/${courseId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseText = await response.text();
        console.log('Raw Response:', responseText);

        if (!response.ok) {
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || 'Failed to fetch tasks');
          } catch (parseError) {
            throw new Error(`Server returned ${response.status}: ${responseText}`);
          }
        }

        const data = JSON.parse(responseText);
        if (data.status) {
          setTasks(data.data);
          localStorage.setItem('courseTasks', JSON.stringify(data.data));
        } else {
          setError(data.message || 'No tasks found for this course');
        }
      } catch (err) {
        console.error('Fetch Tasks Error:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [courseId, navigate]);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setComments('');
    setFile(null);
    setSubmitError(null);
    setSubmitSuccess(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
    setComments('');
    setFile(null);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!studentId) {
      setSubmitError('Student ID not found. Please log in.');
      setSubmitLoading(false);
      return;
    }

    if (!file) {
      setSubmitError('Please upload a file.');
      setSubmitLoading(false);
      return;
    }

    if (!selectedTask) {
      setSubmitError('Task details not loaded. Please try again.');
      setSubmitLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('task', selectedTask.task_id);
    formData.append('student', studentId);
    formData.append('document', file);
    if (comments.trim()) formData.append('comments', comments);

    try {
      const response = await fetch('http://localhost:8000/course_gmt/api/task-submit/', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();
      console.log('Submit Raw Response:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(JSON.stringify(errorData.errors) || 'Failed to submit task');
        } catch (parseError) {
          throw new Error(`Server returned ${response.status}: ${responseText}`);
        }
      }

      const data = JSON.parse(responseText);
      setSubmitSuccess(data.message || 'Task submitted successfully');
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err) {
      console.error('Submit Task Error:', err.message);
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Tasks for Course
      </Typography>
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {tasks.length === 0 && !isLoading && !error && (
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          No tasks available for this course.
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {tasks.map((task) => (
          <Card
            key={task.task_id}
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {task.task_title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Description:</strong> {task.task_description}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Created At:</strong> {formatDate(task.created_at)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Updated At:</strong> {formatDate(task.updated_at)}
              </Typography>
              {task.task_pdf && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Task PDF:</strong>{' '}
                  <Link href={task.task_pdf} target="_blank" rel="noopener noreferrer" underline="hover">
                    Download PDF
                  </Link>
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal(task)}
              >
                Submit Task
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Submission Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="submit-task-modal"
        aria-describedby="submit-task-form"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            bgcolor: theme.palette.background.paper,
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {selectedTask && (
            <>
              <Typography id="submit-task-modal" variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                Submit Task: {selectedTask.task_title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                {selectedTask.task_description}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Created At:</strong> {formatDate(selectedTask.created_at)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Updated At:</strong> {formatDate(selectedTask.updated_at)}
              </Typography>
              {selectedTask.task_pdf && (
                <Typography variant="body2" sx={{ mb: 3 }}>
                  <strong>Task PDF:</strong>{' '}
                  <Link href={selectedTask.task_pdf} target="_blank" rel="noopener noreferrer" underline="hover">
                    Download PDF
                  </Link>
                </Typography>
              )}
            </>
          )}
          {submitLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
          {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
          {submitSuccess && <Alert severity="success" sx={{ mb: 2 }}>{submitSuccess}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Comments (Optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
              variant="outlined"
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Upload Document:
              </Typography>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ width: '100%' }}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal}
                disabled={submitLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitLoading}
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default GetTasks;