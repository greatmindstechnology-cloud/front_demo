import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Select, MenuItem, TextField, Alert, CircularProgress } from '@mui/material';

const ViewManageUploads = () => {
  const [projectsTasks, setProjectsTasks] = useState([]);
  const [filterCourse, setFilterCourse] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const trainerId = localStorage.getItem('trainerId') || '';

  useEffect(() => {
    const fetchProjectsTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/trainer_gmt/projects_tasks/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch projects/tasks');
        const data = await response.json();
        setProjectsTasks(data.results || data);
      } catch (err) {
        setError('Error fetching projects/tasks: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (trainerId) fetchProjectsTasks();
  }, [trainerId]);

  const handleEdit = (id) => navigate(`/dashboard/trainer/edit-project-task/${id}`);
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/trainer_gmt/projects_tasks/${id}/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to delete');
        setProjectsTasks(projectsTasks.filter(pt => pt.id !== id));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredItems = projectsTasks.filter(pt =>
    (!filterCourse || pt.batch_course === filterCourse) &&
    (!filterType || pt.type === filterType) &&
    (!filterDate || new Date(pt.due_date_time).toISOString().split('T')[0] === filterDate)
  );

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h4" gutterBottom>View & Manage Uploads</Typography>
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ mb: 2 }}>
        <TextField label="Course" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} sx={{ mr: 2 }} />
        <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={{ mr: 2 }}>
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Task">Task</MenuItem>
          <MenuItem value="Project">Project</MenuItem>
        </Select>
        <TextField type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} sx={{ mr: 2 }} />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredItems.map(pt => (
            <TableRow key={pt.id}>
              <TableCell>{pt.title}</TableCell>
              <TableCell>{pt.type}</TableCell>
              <TableCell>{pt.batch_course}</TableCell>
              <TableCell>{new Date(pt.due_date_time).toLocaleString()}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(pt.id)} sx={{ mr: 1 }}>Edit</Button>
                <Button onClick={() => handleDelete(pt.id)} color="error">Delete</Button>
                <Button onClick={() => navigate(`/dashboard/trainer/view-submissions/${pt.id}`)} sx={{ ml: 1 }}>View Submissions</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ViewManageUploads;