import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, Alert, CircularProgress } from '@mui/material';

const ViewTasksProjects = () => {
  const [projectsTasks, setProjectsTasks] = useState({ upcoming: [], ongoing: [], completed: [] });
  const [tab, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const studentId = localStorage.getItem('studentId') || '';

  useEffect(() => {
    const fetchProjectsTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://backend-demo-esqk.onrender.com/student_gmt/projects_tasks/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch projects/tasks');
        const data = await response.json();
        const now = new Date();
        const categorized = data.results.reduce((acc, pt) => {
          const due = new Date(pt.due_date_time);
          if (due < now) acc.completed.push(pt);
          else if (pt.submissions && pt.submissions.length) acc.ongoing.push(pt);
          else acc.upcoming.push(pt);
          return acc;
        }, { upcoming: [], ongoing: [], completed: [] });
        setProjectsTasks(categorized);
      } catch (err) {
        setError('Error fetching projects/tasks: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (studentId) fetchProjectsTasks();
  }, [studentId]);

  const handleTabChange = (event, newValue) => setTab(newValue);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h4" gutterBottom>Tasks & Projects</Typography>
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Upcoming" />
        <Tab label="Ongoing" />
        <Tab label="Completed" />
      </Tabs>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tab === 0 && projectsTasks.upcoming.map(pt => (
            <TableRow key={pt.id}>
              <TableCell>{pt.title}</TableCell>
              <TableCell>{pt.type}</TableCell>
              <TableCell>{new Date(pt.due_date_time).toLocaleString()}</TableCell>
              <TableCell><Button onClick={() => navigate(`/submit-work/${pt.id}`)}>Submit</Button></TableCell>
            </TableRow>
          ))}
          {tab === 1 && projectsTasks.ongoing.map(pt => (
            <TableRow key={pt.id}>
              <TableCell>{pt.title}</TableCell>
              <TableCell>{pt.type}</TableCell>
              <TableCell>{new Date(pt.due_date_time).toLocaleString()}</TableCell>
              <TableCell><Button onClick={() => navigate(`/submit-work/${pt.id}`)}>Re-upload</Button></TableCell>
            </TableRow>
          ))}
          {tab === 2 && projectsTasks.completed.map(pt => (
            <TableRow key={pt.id}>
              <TableCell>{pt.title}</TableCell>
              <TableCell>{pt.type}</TableCell>
              <TableCell>{new Date(pt.due_date_time).toLocaleString()}</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ViewTasksProjects;