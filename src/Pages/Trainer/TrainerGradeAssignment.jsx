import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Alert, CircularProgress } from '@mui/material';

const TrainerGradeAssignment = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const trainerId = localStorage.getItem('vendorId') || ''; // Fetch from localStorage

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/trainer_gmt/get_assignment-submissions/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }, // Removed Authorization header
        });
        if (!response.ok) throw new Error('Failed to fetch submissions');
        const data = await response.json();
        setSubmissions(data.results || data); // Adjust based on API response
      } catch (err) {
        setError('Error fetching submissions: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (trainerId) fetchSubmissions();
  }, [trainerId]);

  const handleGrade = async (studentId, assignmentId, marks) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const gradeData = {
      student_id: studentId,
      assignment_id: assignmentId,
      marks_obtained: marks,
    };

    try {
      const response = await fetch('http://localhost:8000/trainer_gmt/assignment/grade/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Removed Authorization header
        body: JSON.stringify(gradeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to grade assignment');
      }

      const data = await response.json();
      setSuccess(data.message);
      setSubmissions(submissions.map(sub => 
        sub.student_id === studentId && sub.assignment_id === assignmentId
          ? { ...sub, is_graded: true, marks_obtained: marks }
          : sub
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Grade Assignments
      </Typography>

      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Table>
        <TableHead>
          <TableRow>
            
            <TableCell>Assignment Title</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>Answer Text</TableCell>
            <TableCell>File</TableCell>
            <TableCell>Marks Obtained</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((sub) => (
            <TableRow key={`${sub.student_id}-${sub.assignment_id}`}>
              <TableCell>{sub.assignment_title}</TableCell>
              <TableCell>{sub.student_name}</TableCell>
              <TableCell>{sub.answer_text}</TableCell>
              <TableCell>{sub.uploaded_file || 'None'}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={sub.marks_obtained || ''}
                  onChange={(e) => {
                    setSubmissions(submissions.map(s =>
                      s.student_id === sub.student_id && s.assignment_id === sub.assignment_id
                        ? { ...s, marks_obtained: e.target.value }
                        : s
                    ));
                  }}
                  disabled={sub.is_graded}
                  inputProps={{ min: 0, max: sub.assignment_max_marks || 100 }}
                  sx={{ width: 100 }}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleGrade(sub.student_id, sub.assignment_id, sub.marks_obtained)}
                  disabled={sub.is_graded || !sub.marks_obtained}
                >
                  {sub.is_graded ? 'Graded' : 'Grade'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TrainerGradeAssignment;