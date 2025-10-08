import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import {
  Box, Typography, Button, TextField, Alert, CircularProgress, Modal, Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import './BookingInterface.css';

const BookingInterface = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({ notes: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadComments, setUploadComments] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const studentId = localStorage.getItem('vendorId') || ''; // Using vendorId as studentId
  const studentName = localStorage.getItem('studentName') || '';
  const email = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    // Save studentName to localStorage whenever it changes
    if (studentName) {
      localStorage.setItem('studentName', studentName);
    }
  }, [studentName]);

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://backend-demo-esqk.onrender.com/vendor_gmt/api/internship/${id}/`);
        if (!response.ok) throw new Error('Failed to fetch listing');
        const data = await response.json();
        console.log('Fetched Listing Data:', data);
        const tags = Array.isArray(data.skills_required) 
          ? data.skills_required 
          : (data.skills_required ? data.skills_required.split(',') : []);
        setListing({
          id: data.id,
          title: data.title,
          dates: data.start_date,
          trainer: data.contact_info,
          mode: data.mode,
          type: 'Internship',
          tags: tags.map(tag => tag.trim()),
          description: data.description,
          booking_id: null,
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching listing:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  useEffect(() => {
    console.log('Checking cancellation eligibility, listing:', listing);
    const checkCancellation = async () => {
      if (listing?.booking_id) {
        const response = await fetch(`https://backend-demo-esqk.onrender.com/student_gmt/booking/${listing.booking_id}/cancellation_eligible`);
        if (!response.ok) {
          console.error('Failed to check cancellation eligibility:', response.statusText);
          return;
        }
        const data = await response.json();
        console.log('Cancellation Eligibility Response:', data);
        setCanCancel(data.eligible === true); // Ensure boolean conversion
      } else {
        setCanCancel(false); // Reset if no booking_id
      }
    };
    checkCancellation();
  }, [listing]);

  const handleBookAndUpload = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('student', studentId);
    formDataToSend.append('additional_notes', formData.notes || '');
    formDataToSend.append('type', 'Internship');
    uploadFiles.forEach((file) => formDataToSend.append('pdf', file));
    if (uploadComments) formDataToSend.append('comments', uploadComments);
    console.log('Form Data to Send:', formDataToSend);

    try {
      const response = await fetch('https://backend-demo-esqk.onrender.com/student_gmt/api/student-booking/', {
        method: 'POST',
        body: formDataToSend,
      });
      if (!response.ok) throw new Error('Booking and upload failed');
      const data = await response.json();
      console.log('Booking and Upload Response:', data);
      await fetch('https://backend-demo-esqk.onrender.com/student_gmt/send_booking_email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: data.id, email, title: listing.title, dates: listing.dates, mode: listing.mode }),
      });
      setSuccess({ booking_id: data.booking_id });
      setShowModal(true);
      setListing((prev) => ({ ...prev, booking_id: data.booking_id })); // Ensure state update
      setCanCancel(true); // Force canCancel to true after booking
      setUploadFiles([]); // Clear files after successful submission
      setUploadComments(''); // Clear comments after successful submission
    } catch (err) {
      setError(err.message);
      console.error('Booking and Upload Error Details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Import axios at the top of your file:
  // import axios from 'axios';

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      // Use axios for the DELETE request
      const response = await axios.delete(
        `https://backend-demo-esqk.onrender.com/student_gmt/api/student-booking/delete-by-student/${studentId}/`,
        {
          // Add withCredentials if your backend uses cookies for auth
          // withCredentials: true,
          headers: {
            // You can set headers if needed, but don't set 'Access-Control-Allow-Origin' here
            // 'Content-Type': 'application/json',
          },
        }
      );
      const data = response.data;
      console.log('Cancellation Response:', data);
      setSuccess(data.message || 'Booking(s) cancelled successfully');
      setListing((prev) => ({ ...prev, booking_id: null }));
      setCanCancel(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Cancellation Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    setUploadFiles(Array.from(event.target.files));
  };

  if (!listing) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />;

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, p: 3, minHeight: '80vh' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
        Booking Interface
      </Typography>

      <Grid container spacing={3}>
        {/* Left Panel - Details */}
        <Grid item xs={12} md={4}>
          <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, boxShadow: 2 }}>
            <Typography variant="h6">{listing.title}</Typography>
            <Typography>Dates: {new Date(listing.dates).toLocaleDateString()}</Typography>
            <Typography>Trainer: {listing.trainer}</Typography>
            <Typography>Mode: {listing.mode}</Typography>
            <Typography>Type: {listing.type}</Typography>
            <Typography>Tags: {listing.tags.join(', ')}</Typography>
            <Typography>Description: {listing.description || 'No description'}</Typography>
          </Box>
        </Grid>

        {/* Right Panel - Combined Booking and Upload Form */}
        <Grid item xs={12} md={8}>
          <Box
            component="form"
            onSubmit={handleBookAndUpload}
            sx={{ bgcolor: 'white', p: 2, borderRadius: 1, boxShadow: 1 }}
          >
            {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && typeof success === 'string' && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Typography variant="h6" sx={{ mb: 2 }}>Booking and Resume Upload</Typography>
            <TextField label="Email" value={email} InputProps={{ readOnly: true }} fullWidth sx={{ mb: 2 }} />
            <TextField
              label="Additional Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Upload Resume</Typography>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              style={{ marginBottom: '1rem', width: '100%' }}
              required // Ensure at least one file is selected
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<CloudUploadIcon />}
              disabled={isLoading || uploadFiles.length === 0}
            >
              Book and Upload Resume
            </Button>
            {canCancel && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                disabled={isLoading}
                sx={{ ml: 2 }}
              >
                Cancel Booking
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Modal for Booking Confirmation */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>Booking Confirmed!</Typography>
          <Typography>Booking ID: {success.booking_id || 'N/A'}</Typography>
          <Button variant="contained" color="primary" onClick={() => setShowModal(false)} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default BookingInterface;