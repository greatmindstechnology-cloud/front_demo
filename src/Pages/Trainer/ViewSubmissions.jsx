import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Alert, CircularProgress } from '@mui/material';

const ViewSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/trainer_gmt/submissions/${id}/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch submissions');
        const data = await response.json();
        setSubmissions(data.results || data);
      } catch (err) {
        setError('Error fetching submissions: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [id]);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h4" gutterBottom>Submissions for Project/Task {id}</Typography>
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student ID</TableCell>
            <TableCell>Answer Text</TableCell>
            <TableCell>File</TableCell>
            <TableCell>Marks Obtained</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map(sub => (
            <TableRow key={sub.id}>
              <TableCell>{sub.student_id}</TableCell>
              <TableCell>{sub.answer_text}</TableCell>
              <TableCell>{sub.uploaded_file || 'None'}</TableCell>
              <TableCell>{sub.marks_obtained || 'Not Graded'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ViewSubmissions;