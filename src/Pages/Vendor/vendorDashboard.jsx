
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './vendorDashboard.css';
// import { set } from 'date-fns';

const VendorDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    name: '',
    businessName: '',
    location: '',
    views: 0,
    approvedEvents: 0,
    appliedEvents: 0,
    profileImage: 'https://via.placeholder.com/60',
  });
  const [error, setError] = useState(null); // State to track API errors
  const navigate = useNavigate();
  const [approvedEventsCount, setApprovedEventsCounts] = useState(0);
  const [TotalEventsCount, setTotalEventsCounts] = useState(0);
  const fetchInternshData = async () => {
    try {
      const response = await fetch('http://localhost:8000/vendor_gmt/internship/status-counts/');
      const jsonData = await response.json();
      console.log(jsonData);
      setTotalEventsCounts(jsonData.data.waiting+jsonData.data.approved || 0);
      setApprovedEventsCounts(jsonData.data.approved || 0);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternshData();
    const loadData = async () => {
      try {
        // Retrieve email from localStorage
        const email = localStorage.getItem('userEmail');
        // If email is not found, redirect to login
        if (!email) {
          setError('Please log in to access the dashboard.');
          
          return;
        }

        // Make API request with the email
        const response = await axios.get(`http://localhost:8000/admin_gmt/vendor/?email=${email}`);

        if (response.data.status === 'success') {
          const vendorData = response.data.data;
          const fullName = `${vendorData.firstname} ${vendorData.lastname}`.trim();
          const businessName = vendorData.business_name || 'Business Name';
          const location = vendorData.city
            ? `${vendorData.city}, ${vendorData.state}, ${vendorData.country}`.trim() 
            : 'Location not specified';
          const profileImage = vendorData.profile_picture || 'https://via.placeholder.com/60';
          console.log(vendorData.profile_picture);
          setDashboardData({
            name: fullName || 'Vendor Name',
            businessName,
            location,
            views: 0, // Static as API doesn't provide this
            approvedEvents: 0, // Static as API doesn't provide this
            appliedEvents: 0, // Static as API doesn't provide this
            profileImage,
          });
        } else {
          setError('Failed to fetch vendor data.');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 404) {
          setError('Vendor not found. Please check your account or log in again.');
          
        } else {
          setError('An error occurred while fetching data. Please try again later.');
        }
      }
    };

    loadData();
  }, [navigate]);

  const { name, businessName, location, views, approvedEvents, appliedEvents, profileImage } = dashboardData;

  // Display error message if there's an error
  if (error) {
    return (
      <div className="container">
        <div className="content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content">
        {/* Profile Header */}
        <div className="header">
          <img src={"http://localhost:8000"+profileImage} alt="Profile" className="profileGo to next page to read more about this topic profile-image" />
          <div className="name-section">
            <h2>{name}</h2>
            <p>{businessName}</p>
            <p>📍 {location}</p>
          </div>
          <button onClick={() => navigate('/dashboard/vendor/VendorEditProfile')} className="edit-button">
            Edit Profile ✏️
          </button>
        </div>

        {/* Statistics */}
        <div className="stats-row">
          <InfoCard title="Views" value={views.toLocaleString('en-IN')} />
          <InfoCard title="Approved Events" value={approvedEventsCount} />
          <InfoCard title="Applied Events" value={TotalEventsCount} />
        </div>

        {/* Create Actions */}
        <div className="action-row">
          <button onClick={() => navigate('/dashboard/vendor/createInternship')} className="action-button">
            + CREATE INTERNSHIPS
          </button>
          <button onClick={() => navigate('/dashboard/vendor/createevent')} className="action-button">
            + CREATE EVENTS
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, value }) => (
  <div className="vendorcard">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

export default VendorDashboard;