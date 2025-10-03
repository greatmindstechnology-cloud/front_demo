import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  CardActions,
  Modal,
  IconButton,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import './WorkshopInternshipListings.css';

const WorkshopInternshipListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [filterTags, setFilterTags] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('card');
  const [selectedListing, setSelectedListing] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const studentId = localStorage.getItem('vendorId') || ''; // Changed from vendorId to studentId

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        // Fetch events
        const eventsResponse = await fetch('http://localhost:8000/vendor_gmt/vendor-events/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!eventsResponse.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsResponse.json();
        console.log('Events Data:', eventsData); // Debug: Check the response
        const eventsRaw = Array.isArray(eventsData)
          ? eventsData
          : eventsData.events
            ? eventsData.events
            : eventsData.results
              ? eventsData.results
              : [];
        const events = Array.isArray(eventsRaw)
          ? eventsRaw.map(event => ({
              id: event.id,
              title: event.event_title || event.title || 'Untitled Event',
              description: event.description || '',
              dates: event.event_date_time || event.dates || '',
              trainer: event.contact_information || '',
              mode: event.event_link ? 'Online' : 'Offline',
              type: 'Event',
              tags: event.category ? [event.category] : [],
            }))
          : [];
        console.log('Processed Events:', events);

        // Fetch internships
        const internshipsResponse = await fetch('http://localhost:8000/vendor_gmt/vendor-internships/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!internshipsResponse.ok) throw new Error('Failed to fetch internships');
        const internshipsData = await internshipsResponse.json();
        console.log('Internships Data:', internshipsData); // Debug: Check the response
        const internshipsRaw = Array.isArray(internshipsData)
          ? internshipsData
          : internshipsData.internships
            ? internshipsData.internships
            : internshipsData.results
              ? internshipsData.results
              : [];
        const internships = Array.isArray(internshipsRaw)
          ? internshipsRaw.map(internship => ({
              id: internship.id,
              title: internship.internship_title || internship.title || 'Untitled Internship',
              description: internship.description || '',
              dates: internship.start_date || internship.dates || '',
              trainer: internship.contact_information || '',
              mode: internship.location ? 'Offline' : 'Online',
              type: 'Internship',
              tags: internship.category ? [internship.category] : [],
            }))
          : [];
        console.log('Processed Internships:', internships);

        // Combine and set listings
        const combinedListings = [...events, ...internships];
        console.log('Combined Listings:', combinedListings.length); // Debug: Check the combined data
        if (combinedListings.length === 0) {
          setError('No events or internships found.');
        }
        setListings(combinedListings);
        setFilteredListings(combinedListings); // Initial filter
      } catch (err) {
        setError('Error fetching listings: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    console.log('Student ID:', studentId); // Debug: Check if studentId is set
    if (studentId) fetchListings();
  }, [studentId]);

  useEffect(() => {
    let filtered = [...listings];
    if (filterType) filtered = filtered.filter(l => l.type === filterType);
    if (filterMode) filtered = filtered.filter(l => l.mode === filterMode);
    if (filterTags) filtered = filtered.filter(l => l.tags && l.tags.includes(filterTags));
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.dates) - new Date(b.dates));
    } else if (sortBy === 'relevance') {
      filtered.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
    }
    console.log('Filtered Listings:', filtered); // Debug: Check filtered data
    setFilteredListings(filtered);
  }, [filterType, filterMode, filterTags, sortBy, listings]);

  const handleRegister = (listingId) => {
    // Navigate to booking page instead of registering directly
    navigate(`/dashboard/booking/${listingId}`);
  };

  const handleViewDetails = (listing) => setSelectedListing(listing);
  const handleCloseModal = () => setSelectedListing(null);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3, minHeight: '80vh' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
        Workshop & Internship Listings
      </Typography>

      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Filter by Type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          select
          sx={{ minWidth: 150 }}
          variant="outlined"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
          <MenuItem value="Internship">Internship</MenuItem>
        </TextField>
        <TextField
          label="Filter by Mode"
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          select
          sx={{ minWidth: 150 }}
          variant="outlined"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Online">Online</MenuItem>
          <MenuItem value="Offline">Offline</MenuItem>
        </TextField>
        <TextField
          label="Filter by Tags"
          value={filterTags}
          onChange={(e) => setFilterTags(e.target.value)}
          sx={{ minWidth: 150}}
          variant="outlined"
        />
        <TextField
          label="Sort by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          select
          sx={{ minWidth: 150 }}
          variant="outlined"
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="relevance">Relevance</MenuItem>
        </TextField>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newView) => setViewMode(newView)}
          sx={{ height: '56px' }}
        >
          <ToggleButton value="card" sx={{ p: 1 }}>Card</ToggleButton>
          <ToggleButton value="list" sx={{ p: 1 }}>List</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {filteredListings.length > 0 ? (
          viewMode === 'card' ? (
            filteredListings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>{listing.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Dates: {new Date(listing.dates).toLocaleDateString()}</Typography>
                    <Typography variant="body2" color="text.secondary">Trainer: {listing.trainer || 'N/A'}</Typography>
                    <Typography variant="body2" color="text.secondary">Mode: {listing.mode}</Typography>
                    <Typography variant="body2" color="text.secondary">Type: {listing.type}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      onClick={() => handleViewDetails(listing)}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      Details
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleRegister(listing.id)}
                    >
                      Register
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{ width: '100%' }}>
              <Card>
                <CardContent>
                  {filteredListings.map((listing) => (
                    <Box key={listing.id} sx={{ mb: 2, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                      <Typography variant="h6">{listing.title}</Typography>
                      <Typography variant="body2" color="text.secondary">Dates: {new Date(listing.dates).toLocaleDateString()}</Typography>
                      <Typography variant="body2" color="text.secondary">Trainer: {listing.trainer || 'N/A'}</Typography>
                      <Typography variant="body2" color="text.secondary">Mode: {listing.mode}</Typography>
                      <Typography variant="body2" color="text.secondary">Type: {listing.type}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          onClick={() => handleViewDetails(listing)}
                          variant="outlined"
                          sx={{ mr: 1 }}
                        >
                          Details
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleRegister(listing.id)}
                        >
                          Register
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          )
        ) : (
          <Typography sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
            No workshops or internships available.
          </Typography>
        )}
      </Grid>

      <Modal open={!!selectedListing} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedListing && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>{selectedListing.title}</Typography>
              <Typography sx={{ mb: 1 }}>Dates: {new Date(selectedListing.dates).toLocaleDateString()}</Typography>
              <Typography sx={{ mb: 1 }}>Trainer: {selectedListing.trainer || 'N/A'}</Typography>
              <Typography sx={{ mb: 1 }}>Mode: {selectedListing.mode}</Typography>
              <Typography sx={{ mb: 1 }}>Type: {selectedListing.type}</Typography>
              <Typography sx={{ mb: 1 }}>Tags: {selectedListing.tags ? selectedListing.tags.join(', ') : 'N/A'}</Typography>
              <Typography sx={{ mb: 2 }}>Description: {selectedListing.description || 'No description available'}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRegister(selectedListing.id)}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default WorkshopInternshipListings;