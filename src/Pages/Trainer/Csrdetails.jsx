import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Csrdetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const event = location.state;

    if (!event) {
        return (
            <div className="container mt-5">
                <h4>No event data found.</h4>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
                    Back to Events
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">{event.title}</h2>

            <img
                src={event.image}
                alt={event.title}
                className="img-fluid mb-3"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
            />

            {/* Dynamic Event Details */}
            <p><strong>Organizer:</strong> {event.organizer}</p>
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p><strong>Registered Participants:</strong> {event.registered}</p>
            <p><strong>Maximum Allowed:</strong> {event.allowed}</p>

            <p><strong>Contact Number:</strong> {event.contactNumber}</p>
            <p><strong>Contact Email:</strong> {event.contactEmail}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Volunteer Requirements:</strong> {event.requirements}</p>
            <p><strong>What to Bring:</strong> {event.whatToBring}</p>
            <p><strong>Facilities Provided:</strong> {event.facilities}</p>
            <p><strong>Expected Duration:</strong> {event.duration}</p>
            <p><strong>Dress Code:</strong> {event.dressCode}</p>


            <div className='row'>
                <div className=' d-flex'>
                    <div className=' w-100'>
                        <button className="btn btn-secondary mb-2" onClick={() => navigate(-1)}>
                            Back
                        </button>
                    </div>
                    <div className='flex-shrink-1'>
                        <button className="btn btn-primary mb-2 " onClick={() => navigate(-1)}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Csrdetails;
