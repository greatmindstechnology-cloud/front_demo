import React, { useState } from 'react';
import { Tabs, Tab, TextField, Button, MenuItem, Grid, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ForestIcon from '@mui/icons-material/Forest';
import StarIcon from '@mui/icons-material/Star';
import MicIcon from '@mui/icons-material/Mic';

function SocialService() {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    topicType: '',
    customTopic: '',
    startDateTime: null,
    endDateTime: null,
    spotCount: '',
    agendaFile: null,
    videoFile: null
  });
  const [submissions, setSubmissions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const bloodDonationTopics = [
    'Blood Collection',
    'Donor Recruitment',
    'Health Screening',
    'Post-Donation Care',
    'Others'
  ];

  const greenBasedTopics = [
    'Tree Planting',
    'Waste Management',
    'Sustainable Energy',
    'Conservation Efforts',
    'Others'
  ];

  const motivationTopics = [
    'Leadership Development',
    'Team Building',
    'Personal Growth',
    'Career Inspiration',
    'Others'
  ];

  const speakingTopics = [
    'Public Speaking',
    'Storytelling',
    'Communication Skills',
    'Presentation Techniques',
    'Others'
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData({ topicType: '', customTopic: '', startDateTime: null, endDateTime: null, spotCount: '', agendaFile: null, videoFile: null });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleStartDateChange = (newValue) => {
    setFormData({ ...formData, startDateTime: newValue });
  };

  const handleEndDateChange = (newValue) => {
    setFormData({ ...formData, endDateTime: newValue });
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const getEventType = (type, topicType) => {
    if (topicType === 'Others') return 'other';
    switch (type) {
      case 'BloodDonation': return 'Blood Donation';
      case 'GreenBased': return 'Green Based Events';
      case 'Motivation': return 'Motivational Talk';
      case 'Speaking': return 'Awarness';
      default: return 'other';
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();

    if (!formData.topicType) {
      showSnackbar('Please select a topic', 'error');
      return;
    }
    if (formData.topicType === 'Others' && !formData.customTopic) {
      showSnackbar('Please specify the other topic', 'error');
      return;
    }
    if (!formData.startDateTime) {
      showSnackbar('Please select start date and time', 'error');
      return;
    }
    if (!formData.endDateTime) {
      showSnackbar('Please select end date and time', 'error');
      return;
    }
    if (formData.startDateTime >= formData.endDateTime) {
      showSnackbar('Start time must be before end time', 'error');
      return;
    }
    if (!formData.spotCount || parseInt(formData.spotCount) <= 0) {
      showSnackbar('Please enter a valid spot count greater than 0', 'error');
      return;
    }
    if (formData.agendaFile) {
      const ext = formData.agendaFile.name.split('.').pop().toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(ext)) {
        showSnackbar('Agenda file must be PDF, DOC, or DOCX', 'error');
        return;
      }
    }
    if (formData.videoFile) {
      const ext = formData.videoFile.name.split('.').pop().toLowerCase();
      if (!['mp4', 'mov', 'avi'].includes(ext)) {
        showSnackbar('Video file must be MP4, MOV, or AVI', 'error');
        return;
      }
    }

    const effectiveTopic = formData.topicType === 'Others' ? formData.customTopic : formData.topicType;

    const apiForm = new FormData();
    apiForm.append('event_type', getEventType(type, formData.topicType));
    apiForm.append('event_name', effectiveTopic);
    apiForm.append('start_datetime', formData.startDateTime.toISOString());
    apiForm.append('end_datetime', formData.endDateTime.toISOString());
    apiForm.append('no_of_slots', formData.spotCount);
    if (formData.agendaFile) apiForm.append('agenda_file', formData.agendaFile);
    if (formData.videoFile) apiForm.append('video', formData.videoFile);
    apiForm.append('vendor', '2');

    try {
      const response = await fetch('/api/csr-events', {
        method: 'POST',
        body: apiForm,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      showSnackbar(data.message, 'success');
      const newSubmission = {
        id: data.data.id,
        type: type,
        topic: effectiveTopic,
        startDateTime: new Date(data.data.start_datetime),
        endDateTime: new Date(data.data.end_datetime),
        spotCount: data.data.no_of_slots,
        agendaFile: data.data.agenda_file ? { name: data.data.agenda_file.split('/').pop() } : null,
        videoFile: data.data.video ? { name: data.data.video.split('/').pop() } : null,
        status: 'Created',
        submittedAt: new Date(data.data.created_at).toLocaleString()
      };
      setSubmissions([...submissions, newSubmission]);
      setFormData({ topicType: '', customTopic: '', startDateTime: null, endDateTime: null, spotCount: '', agendaFile: null, videoFile: null });
    } catch (error) {
      showSnackbar(error.message || 'Failed to create event. Check inputs and try again.', 'error');
    }
  };

  const renderForm = (type) => (
    <form onSubmit={(e) => handleSubmit(e, type)} className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Select Topic"
            name="topicType"
            value={formData.topicType}
            onChange={handleChange}
            required
            variant="outlined"
            className="bg-white"
            InputProps={{ className: 'text-gray-800 font-medium' }}
            error={!formData.topicType}
            helperText={!formData.topicType ? 'Please select a topic' : ''}
          >
            {type === 'BloodDonation' ? bloodDonationTopics.map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            )) : type === 'GreenBased' ? greenBasedTopics.map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            )) : type === 'Motivation' ? motivationTopics.map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            )) : speakingTopics.map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {formData.topicType === 'Others' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Specify Other Topic"
              name="customTopic"
              value={formData.customTopic}
              onChange={handleChange}
              required
              variant="outlined"
              className="bg-white"
              InputProps={{ className: 'text-gray-800 font-medium' }}
              error={!formData.customTopic}
              helperText={!formData.customTopic ? 'Please specify the topic' : ''}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Start Date & Time"
              value={formData.startDateTime}
              onChange={handleStartDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  variant="outlined"
                  className="bg-white"
                  InputProps={{ ...params.InputProps, className: 'text-gray-800 font-medium' }}
                  error={!formData.startDateTime}
                  helperText={!formData.startDateTime ? 'Please select start date and time' : ''}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="End Date & Time"
              value={formData.endDateTime}
              onChange={handleEndDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  variant="outlined"
                  className="bg-white"
                  InputProps={{ ...params.InputProps, className: 'text-gray-800 font-medium' }}
                  error={!formData.endDateTime}
                  helperText={!formData.endDateTime ? 'Please select end date and time' : ''}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Spot Count (Registrations)"
            name="spotCount"
            value={formData.spotCount}
            onChange={handleChange}
            required
            variant="outlined"
            inputProps={{ min: 1 }}
            className="bg-white"
            InputProps={{ className: 'text-gray-800 font-medium' }}
            error={!formData.spotCount || formData.spotCount <= 0}
            helperText={!formData.spotCount || formData.spotCount <= 0 ? 'Please enter spot count greater than 0' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Upload Agenda (PDF/DOC)
            <input
              type="file"
              name="agendaFile"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={handleChange}
            />
          </Button>
          {formData.agendaFile && (
            <Typography variant="body2" className="mt-2 text-gray-600 italic">
              Selected: {formData.agendaFile.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            className="border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Upload Video Explanation (MP4/MOV/AVI)
            <input
              type="file"
              name="videoFile"
              accept=".mp4,.mov,.avi"
              hidden
              onChange={handleChange}
            />
          </Button>
          {formData.videoFile && (
            <Typography variant="body2" className="mt-2 text-gray-600 italic">
              Selected: {formData.videoFile.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all"
          >
            Submit Request
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <Container maxWidth="lg" className="py-12 bg-gradient-to-b from-gray-50 to-white font-sans rounded-3xl shadow-xl my-8">
      <Typography variant="h3" className="text-center mb-8 text-blue-700 font-extrabold tracking-wide">
        Event Request Portal
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} centered className="mb-8 bg-white rounded-full shadow-md p-1">
        <Tab icon={<FavoriteIcon />} label="Blood Donation Drive" className="text-blue-600 font-semibold" />
        <Tab icon={<ForestIcon />} label="Green Based" className="text-blue-600 font-semibold" />
        <Tab icon={<StarIcon />} label="Motivation" className="text-blue-600 font-semibold" />
        <Tab icon={<MicIcon />} label="Speaking Event" className="text-blue-600 font-semibold" />
      </Tabs>

      {tabValue === 0 && (
        <div className="mt-6 px-4">
          <Typography variant="h5" className="mb-6 text-blue-700 font-bold text-center">
            Request a Blood Donation Drive Event
          </Typography>
          {renderForm('BloodDonation')}
        </div>
      )}

      {tabValue === 1 && (
        <div className="mt-6 px-4">
          <Typography variant="h5" className="mb-6 text-blue-700 font-bold text-center">
            Request a Green Based Event
          </Typography>
          {renderForm('GreenBased')}
        </div>
      )}

      {tabValue === 2 && (
        <div className="mt-6 px-4">
          <Typography variant="h5" className="mb-6 text-blue-700 font-bold text-center">
            Request a Motivation Event
          </Typography>
          {renderForm('Motivation')}
        </div>
      )}

      {tabValue === 3 && (
        <div className="mt-6 px-4">
          <Typography variant="h5" className="mb-6 text-blue-700 font-bold text-center">
            Request a Speaking Event
          </Typography>
          {renderForm('Speaking')}
        </div>
      )}

      <div className="mt-12 px-4">
        <Typography variant="h5" className="mb-6 text-blue-700 font-bold text-center">
          Status Tracking Panel
        </Typography>
        <TableContainer component={Paper} className="shadow-xl rounded-xl overflow-hidden">
          <Table>
            <TableHead>
              <TableRow className="bg-blue-200">
                <TableCell className="font-bold text-blue-800">ID</TableCell>
                <TableCell className="font-bold text-blue-800">Type</TableCell>
                <TableCell className="font-bold text-blue-800">Topic</TableCell>
                <TableCell className="font-bold text-blue-800">Start Date & Time</TableCell>
                <TableCell className="font-bold text-blue-800">End Date & Time</TableCell>
                <TableCell className="font-bold text-blue-800">Spot Count</TableCell>
                <TableCell className="font-bold text-blue-800">Agenda</TableCell>
                <TableCell className="font-bold text-blue-800">Video</TableCell>
                <TableCell className="font-bold text-blue-800">Status</TableCell>
                <TableCell className="font-bold text-blue-800">Submitted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-blue-50 transition-colors">
                  <TableCell>{submission.id}</TableCell>
                  <TableCell>{submission.type}</TableCell>
                  <TableCell>{submission.topic || 'N/A'}</TableCell>
                  <TableCell>{submission.startDateTime?.toLocaleString() || 'N/A'}</TableCell>
                  <TableCell>{submission.endDateTime?.toLocaleString() || 'N/A'}</TableCell>
                  <TableCell>{submission.spotCount || 'N/A'}</TableCell>
                  <TableCell>{submission.agendaFile?.name || 'None'}</TableCell>
                  <TableCell>{submission.videoFile?.name || 'None'}</TableCell>
                  <TableCell>{submission.status}</TableCell>
                  <TableCell>{submission.submittedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default SocialService;