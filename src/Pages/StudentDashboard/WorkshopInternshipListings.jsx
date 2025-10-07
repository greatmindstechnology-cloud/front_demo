import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import {
  Box,
  Typography,
  Button,
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
  Chip,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { Close as CloseIcon, SentimentDissatisfied as EmptyIcon, Info as InfoIcon } from '@mui/icons-material';
import './WorkshopInternshipListings.css';

const CARD_HEIGHT = 320; // Adjust card height as needed
const CARD_CONTENT_HEIGHT = 210; // Adjust content height for better layout

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
  const [search, setSearch] = useState('');
  const [allTags, setAllTags] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  const studentId = localStorage.getItem('vendorId') || '';

  // Fetch listings and extract all unique tags
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const eventsResponse = await fetch('http://localhost:8000/vendor_gmt/vendor-events/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!eventsResponse.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsResponse.json();
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
              tags: event.category
                ? Array.isArray(event.category)
                  ? event.category
                  : [event.category]
                : [],
            }))
          : [];

        const internshipsResponse = await fetch('http://localhost:8000/vendor_gmt/vendor-internships/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!internshipsResponse.ok) throw new Error('Failed to fetch internships');
        const internshipsData = await internshipsResponse.json();
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
              tags: internship.category
                ? Array.isArray(internship.category)
                  ? internship.category
                  : [internship.category]
                : [],
            }))
          : [];

        const combinedListings = [...events, ...internships];
        if (combinedListings.length === 0) {
          setError('No events or internships found.');
        }
        setListings(combinedListings);
        setFilteredListings(combinedListings);

        // Extract all unique tags for filter dropdown
        const tagsSet = new Set();
        combinedListings.forEach(l => l.tags && l.tags.forEach(tag => tagsSet.add(tag)));
        setAllTags(Array.from(tagsSet));
      } catch (err) {
        setError('Error fetching listings: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (studentId) fetchListings();
  }, [studentId]);

  // Filtering, sorting, searching
  useEffect(() => {
    let filtered = [...listings];
    if (filterType) filtered = filtered.filter(l => l.type === filterType);
    if (filterMode) filtered = filtered.filter(l => l.mode === filterMode);
    if (filterTags) filtered = filtered.filter(l => l.tags && l.tags.includes(filterTags));
    if (search)
      filtered = filtered.filter(
        l =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.description.toLowerCase().includes(search.toLowerCase())
      );
    if (sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.dates);
        const dateB = new Date(b.dates);
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateA - dateB;
      });
    } else if (sortBy === 'relevance') {
      filtered.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
    }
    setFilteredListings(filtered);
  }, [filterType, filterMode, filterTags, sortBy, listings, search]);

  const handleRegister = (listingId) => {
    navigate(`/dashboard/booking/${listingId}`);
  };

  const handleViewDetails = (listing) => setSelectedListing(listing);
  const handleCloseModal = () => setSelectedListing(null);

  // Helper for date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 3, minHeight: '80vh' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
        Workshop & Internship Listings
      </Typography>

      {isLoading && (
        <Grid container spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Grid item xs={12} sm={6} md={2} key={i}>
              <Skeleton variant="rectangular" height={CARD_HEIGHT} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}
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
          select
          sx={{ minWidth: 150 }}
          variant="outlined"
        >
          <MenuItem value="">All</MenuItem>
          {allTags.map(tag => (
            <MenuItem key={tag} value={tag}>{tag}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
          variant="outlined"
          placeholder="Title or description"
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
        {!isLoading && filteredListings.length > 0 ? (
          viewMode === 'card' ? (
            filteredListings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <Card
                  sx={{
                    height: `${CARD_HEIGHT}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: 6 },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, minHeight: `${CARD_CONTENT_HEIGHT}px`, overflow: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1.1rem', fontWeight: 600 }}>{listing.title}</Typography>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewDetails(listing)}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Dates: {formatDate(listing.dates)}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Trainer: {listing.trainer || 'N/A'}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Mode: {listing.mode}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Type: {listing.type}</Typography>
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {listing.tags && listing.tags.length > 0
                        ? listing.tags.map((tag, i) => (
                            <Chip key={i} label={tag} size="small" color="secondary" />
                          ))
                        : <Chip label="No Tags" size="small" />}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', mt: 'auto', pb: 2 }}>
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
                    <Box key={listing.id} sx={{ mb: 2, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>{listing.title}</Typography>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewDetails(listing)}>
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="body2" color="text.secondary">Dates: {formatDate(listing.dates)}</Typography>
                      <Typography variant="body2" color="text.secondary">Trainer: {listing.trainer || 'N/A'}</Typography>
                      <Typography variant="body2" color="text.secondary">Mode: {listing.mode}</Typography>
                      <Typography variant="body2" color="text.secondary">Type: {listing.type}</Typography>
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {listing.tags && listing.tags.length > 0
                          ? listing.tags.map((tag, i) => (
                              <Chip key={i} label={tag} size="small" color="secondary" />
                            ))
                          : <Chip label="No Tags" size="small" />}
                      </Box>
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
          !isLoading && (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 6 }}>
              <EmptyIcon sx={{ fontSize: 64, color: theme.palette.text.disabled }} />
              <Typography sx={{ color: theme.palette.text.secondary, mt: 2 }}>
                No workshops or internships available.
              </Typography>
            </Box>
          )
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
              <Typography sx={{ mb: 1 }}>Dates: {formatDate(selectedListing.dates)}</Typography>
              <Typography sx={{ mb: 1 }}>Trainer: {selectedListing.trainer || 'N/A'}</Typography>
              <Typography sx={{ mb: 1 }}>Mode: {selectedListing.mode}</Typography>
              <Typography sx={{ mb: 1 }}>Type: {selectedListing.type}</Typography>
              <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedListing.tags && selectedListing.tags.length > 0
                  ? selectedListing.tags.map((tag, i) => (
                      <Chip key={i} label={tag} size="small" color="secondary" />
                    ))
                  : <Chip label="No Tags" size="small" />}
              </Box>
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