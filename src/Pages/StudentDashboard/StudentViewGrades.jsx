import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Alert, CircularProgress } from '@mui/material';

const StudentViewGrades = () => {
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const studentId = localStorage.getItem('vendorId') || '';

  useEffect(() => {
    const fetchGrades = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/trainer_gmt/assignment-results/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch grades');
        const data = await response.json();
        setGrades(data.results.filter(g => g.student === studentId) || []); // Filter by studentId
      } catch (err) {
        setError('Error fetching grades: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (studentId) fetchGrades();
  }, [studentId]);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Grades
      </Typography>

      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Assignment ID</TableCell>
            <TableCell>Marks Obtained</TableCell>
            <TableCell>Total Marks</TableCell>
            <TableCell>Percentage</TableCell>
            <TableCell>Grade</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grades.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell>{grade.assignment}</TableCell>
              <TableCell>{grade.marks_obtained}</TableCell>
              <TableCell>{grade.total_possible_marks}</TableCell>
              <TableCell>{grade.percentage}%</TableCell>
              <TableCell>{grade.grade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default StudentViewGrades;