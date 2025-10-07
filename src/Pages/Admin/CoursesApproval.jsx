


import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography, TextField
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FeedbackIcon from '@mui/icons-material/Feedback';

export default function CourseApproval() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedFeedbackRow, setSelectedFeedbackRow] = useState(null);

  useEffect(() => {
    fetch('https://backend-demo-esqk.onrender.com/course_gmt/courses/')
      .then((res) => res.json())
      
      .then((result) => {
        alert("data fetch successfully ", result)
        console.log('Fetched courses:', result.data);
        const data = Array.isArray(result.data) ? result.data : [];
        console.log(data);
        const updatedData = data.map((row, idx) => ({
          id: row.course_id || idx,
          course_title: (row.course_title || '').trim(),
          course_price: row.course_price || 0,
          course_description: (row.course_description || '').trim(),
          course_rating: row.course_rating || 0,
          status: row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : 'Waiting',
          message: '',
        }));
        setRows(updatedData);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
        setErrorMessage('Failed to load courses.');
      });
  }, []);

  const handleApprove = async (id) => {
    try {
      const formData = new FormData();
      formData.append('course_id', id);
      formData.append('status', 'approved');
      const response = await fetch('https://backend-demo-esqk.onrender.com/course_gmt/update-course-status/', {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, status: 'Approved', message: 'Approved successfully ✅' } : row
          )
        );
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to approve course.');
      }
    } catch (error) {
      setErrorMessage('Network error occurred.');
    }
    setOpen(false);
  };

  const handleReject = async (id) => {
    try {
      const formData = new FormData();
      formData.append('course_id', id);
      formData.append('status', 'rejected');
      const response = await fetch('https://backend-demo-esqk.onrender.com/course_gmt/update-course-status/', {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, status: 'Rejected', message: 'Rejected successfully ❌' } : row
          )
        );
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to reject course.');
      }
    } catch (error) {
      setErrorMessage('Network error occurred.');
    }
    setOpen(false);
  };

  const handleView = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleOpenFeedbackDialog = (row) => {
    setSelectedFeedbackRow(row);
    setFeedbackText('');
    setFeedbackDialogOpen(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      const response = await fetch('https://backend-demo-esqk.onrender.com/student_gmt/send-feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: selectedFeedbackRow.id, feedback: feedbackText }),
      });

      if (response.ok) {
        alert('Feedback sent successfully');
        setFeedbackDialogOpen(false);
      } else {
        const err = await response.json();
        alert('Failed: ' + (err.error || 'Feedback failed'));
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'View',
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleView(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
    { field: 'id', headerName: 'Course ID', width: 100 },
    { field: 'course_title', headerName: 'Course Title', width: 200 },
    {
      field: 'course_price',
      headerName: 'Price ($)',
      width: 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
    { field: 'course_description', headerName: 'Description', width: 250 },
    {
      field: 'course_rating',
      headerName: 'Rating',
      width: 120,
      renderCell: (params) => params.value.toFixed(1),
    },
    {
      field: 'status-update',
      headerName: 'Update Status',
      width: 250,
      renderCell: (params) => {
        const handleChange = async (event) => {
          const newStatus = event.target.value;
          try {
            const formData = new FormData();
            formData.append('course_id', params.row.id);
            formData.append('status', newStatus.toLowerCase());

            const response = await fetch('https://backend-demo-esqk.onrender.com/course_gmt/update-course-status/', {
              method: 'PUT',
              body: formData,
            });

            if (response.ok) {
              // setRows((prev) =>
              //   prev.map((row) =>
              //     row.id === params.row.id
              //       ? {
              //           ...row,
              //           status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
              //           message:
              //             newStatus === 'Approved'
              //               ? 'Approved successfully ✅'
              //               : newStatus === 'Rejected'
              //               ? 'Rejected successfully ❌'
              //               : '',
              //         }
              //       : row
              //   )
              // );
              setErrorMessage('');
            } else {
              const errorData = await response.json();
              setErrorMessage(errorData.error || 'Failed to update course status.');
            }
          } catch (error) {
            setErrorMessage('Network error occurred.');
          }
        };

        const status = params.row.status;
        let bgColor = '#90caf9'; // light blue default
        if (status === 'Approved') bgColor = '#66bb6a';
        else if (status === 'Rejected') bgColor = '#ef5350';

        return (
          <select
            value={status}
            onChange={handleChange}
            style={{
              backgroundColor: bgColor,
              color: 'white',
              padding: '6px 12px',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            <option value="Waiting">Waiting</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        );
      },
    },
    {
      field: 'feedback',
      headerName: 'Feedback',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          startIcon={<FeedbackIcon />}
          onClick={() => handleOpenFeedbackDialog(params.row)}
        >
          Feedback
        </Button>
      ),
    },
    // { field: 'message', headerName: 'Message', width: 200 },
  ];

  return (
    <Paper style={{ height: 500, width: '100%', padding: 16 }}>
      {errorMessage && (
        <Typography color="error" style={{ marginBottom: 16 }}>
          {errorMessage}
        </Typography>
      )}
      <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <>
              <Typography><strong>Course ID:</strong> {selectedRow.id}</Typography>
              <Typography><strong>Title:</strong> {selectedRow.course_title}</Typography>
              <Typography><strong>Price:</strong> ${selectedRow.course_price.toFixed(2)}</Typography>
              <Typography><strong>Description:</strong> {selectedRow.course_description}</Typography>
              <Typography><strong>Rating:</strong> {selectedRow.course_rating.toFixed(1)}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="success" variant="contained" startIcon={<CheckIcon />} onClick={() => handleApprove(selectedRow.id)}>Approve</Button>
          <Button color="error" variant="contained" startIcon={<CloseIcon />} onClick={() => handleReject(selectedRow.id)}>Reject</Button>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)}>
        <DialogTitle>Send Feedback to Trainer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Feedback"
            variant="outlined"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmitFeedback} variant="contained" color="primary">Submit</Button>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
