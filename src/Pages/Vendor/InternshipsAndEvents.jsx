
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './internshipsAndEvents.css';

const InternshipsAndEvents = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Helper function to parse duration and calculate end date
  const calculateEndDate = (startDate, duration) => {
    const start = new Date(startDate);
    const durationMatch = duration.match(/(\d+)\s*(hour|day|month|week)s?/i);
    
    if (!durationMatch) return null; 

    const [_, value, unit] = durationMatch;
    const numValue = parseInt(value, 10);

    if (unit.toLowerCase() === 'hour') {
      start.setHours(start.getHours() + numValue);
    } else if (unit.toLowerCase() === 'day') {
      start.setDate(start.getDate() + numValue);
    } else if (unit.toLowerCase() === 'week') {
      start.setDate(start.getDate() + numValue * 7);
    } else if (unit.toLowerCase() === 'month') {
      start.setMonth(start.getMonth() + numValue);
    }

    return start.toLocaleDateString('en-GB');
  };

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  useEffect(() => {
    const fetchData = async () => {
      
      const vendorId = localStorage.getItem('vendorId');
      if (!vendorId) {
        setError('Vendor ID not found. Please log in again.');
        return;
      }

      try {
       
        const internshipsResponse = await axios.get(
          `http://localhost:8000/vendor_gmt/vendor-internships/?vendor_id=${vendorId}`
        );
        const internships = internshipsResponse.data.internships || [];

        // Fetch events
        const eventsResponse = await axios.get(
          `http://localhost:8000/vendor_gmt/vendor-events/?vendor_id=${vendorId}`
        );
        const events = eventsResponse.data.events || [];

        // Map internships to table format
        const mappedInternships = internships.map((internship) => ({
          type: 'Internship',
          name: internship.title,
          status: internship.status.charAt(0).toUpperCase() + internship.status.slice(1), // Capitalize status
          startDate: formatDate(internship.start_date),
          endDate: calculateEndDate(internship.start_date, internship.duration),
        }));

        // Map events to table format
        const mappedEvents = events.map((event) => ({
          type: 'Event',
          name: event.event_title,
          status: event.status.charAt(0).toUpperCase() + event.status.slice(1), // Capitalize status
          startDate: formatDate(event.event_date_time),
          endDate: calculateEndDate(event.event_date_time, event.duration),
        }));

        // Combine and sort by start date
        const combinedData = [...mappedEvents, ...mappedInternships].sort((a, b) => {
          const dateA = new Date(a.startDate.split('/').reverse().join('-'));
          const dateB = new Date(b.startDate.split('/').reverse().join('-'));
          return dateA - dateB;
        });

        setData(combinedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch internships and events. Please try again.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="internships-events-container">
      <div className="header">
        <h2>Internships & Events</h2>
        <button className="create-button" onClick={() => navigate('/dashboard/vendor/create')}>
          + Create
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {data.length === 0 && !error ? (
        <p>No internships or events found.</p>
      ) : (
        <table className="internships-events-table">
          <thead>
            <tr>
              <th>Events/Internships</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.status}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InternshipsAndEvents;