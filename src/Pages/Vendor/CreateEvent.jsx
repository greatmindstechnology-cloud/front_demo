import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './createEvent.css';

const CreateEvent = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setApiError(null);
    setFieldErrors({});
    setIsLoading(true);

    // Fetch vendorId from localStorage
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      setApiError('Vendor ID not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    // Validate dates (current date is June 11, 2025)
    const today = new Date('2025-06-11T07:56:00+05:30'); // 07:56 AM IST
    const eventDateTime = new Date(data.eventDateTime);
    const registrationDeadline = new Date(data.registrationDeadline);

    if (eventDateTime < today) {
      setError('eventDateTime', { type: 'manual', message: 'Event date and time cannot be in the past.' });
      setIsLoading(false);
      return;
    }

    if (registrationDeadline < today) {
      setError('registrationDeadline', { type: 'manual', message: 'Registration deadline cannot be in the past.' });
      setIsLoading(false);
      return;
    }

    if (registrationDeadline >= eventDateTime) {
      setError('registrationDeadline', { type: 'manual', message: 'Registration deadline must be before the event date.' });
      setIsLoading(false);
      return;
    }

    // Format the event data for the API
    const eventData = {
      event_title: data.title,
      description: data.description,
      location: data.location,
      event_date_time: data.eventDateTime,
      duration: data.duration,
      event_type: data.eventType,
      target_audience: data.targetAudience,
      capacity: parseInt(data.capacity, 10),
      registration_deadline: data.registrationDeadline,
      registration_fee: data.registrationFee,
      contact_information: data.contact,
      category: data.category,
      event_link: data.eventLink || null, // Optional field
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/vendor_gmt/vendor-event/create/?vendor_id=${vendorId}`,
        eventData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        alert(`Event created successfully! Event ID: ${response.data.event_id}`);
        navigate('/dashboard/vendor/');
      } else {
        throw new Error('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      if (error.response) {
        const errorData = error.response.data;
        if (error.response.status === 400 || error.response.status === 404) {
          setApiError(errorData.error || 'Failed to create event. Please check your input.');
        } else if (typeof errorData === 'object' && !errorData.message) {
          const newFieldErrors = {};
          Object.keys(errorData).forEach((key) => {
            const field = key === 'event_title' ? 'title' :
                         key === 'event_date_time' ? 'eventDateTime' :
                         key === 'event_type' ? 'eventType' :
                         key === 'target_audience' ? 'targetAudience' :
                         key === 'registration_deadline' ? 'registrationDeadline' :
                         key === 'registration_fee' ? 'registrationFee' :
                         key === 'contact_information' ? 'contact' :
                         key;
            newFieldErrors[field] = errorData[key][0] || 'Invalid value';
            setError(field, { type: 'manual', message: newFieldErrors[field] });
          });
          setFieldErrors(newFieldErrors);
        } else {
          setApiError(errorData.message || errorData.error || 'Failed to create event. Please try again.');
        }
      } else if (error.request) {
        setApiError('No response from server. Please check your network connection.');
      } else {
        setApiError(error.message || 'An error occurred while creating the event.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create Event</h2>
      {apiError && <p className="error api-error">{apiError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="event-form">
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            {...register('title', { required: 'Event title is required' })}
            placeholder="e.g., Tech Workshop 2025"
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            placeholder="Describe the event, agenda, and what attendees can expect"
          />
          {errors.description && <p className="error">{errors.description.message}</p>}
        </div>

        <div className="form-group">
          <label>Organizer</label>
          <input
            type="text"
            {...register('organizer', { required: 'Organizer is required' })}
            defaultValue="Business Name"
            readOnly
          />
          {errors.organizer && <p className="error">{errors.organizer.message}</p>}
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            placeholder="e.g., Chennai, India or Virtual"
          />
          {errors.location && <p className="error">{errors.location.message}</p>}
        </div>

        <div className="form-group">
          <label>Event Date and Time</label>
          <input
            type="datetime-local"
            {...register('eventDateTime', { required: 'Event date and time are required' })}
          />
          {errors.eventDateTime && <p className="error">{errors.eventDateTime.message}</p>}
        </div>

        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            {...register('duration', { required: 'Duration is required' })}
            placeholder="e.g., 2 hours or 1 day"
          />
          {errors.duration && <p className="error">{errors.duration.message}</p>}
        </div>

        <div className="form-group">
          <label>Event Type</label>
          <select {...register('eventType', { required: 'Event type is required' })}>
            <option value="">Select Event Type</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Webinar">Webinar</option>
            <option value="Conference">Conference</option>
          </select>
          {errors.eventType && <p className="error">{errors.eventType.message}</p>}
        </div>

        <div className="form-group">
          <label>Target Audience</label>
          <input
            type="text"
            {...register('targetAudience', { required: 'Target audience is required' })}
            placeholder="e.g., College Students, Professionals"
          />
          {errors.targetAudience && <p className="error">{errors.targetAudience.message}</p>}
        </div>

        <div className="form-group">
          <label>Capacity</label>
          <input
            type="number"
            {...register('capacity', { required: 'Capacity is required', min: 1 })}
            placeholder="e.g., 50"
          />
          {errors.capacity && <p className="error">{errors.capacity.message}</p>}
        </div>

        <div className="form-group">
          <label>Registration Deadline</label>
          <input
            type="date"
            {...register('registrationDeadline', { required: 'Registration deadline is required' })}
          />
          {errors.registrationDeadline && <p className="error">{errors.registrationDeadline.message}</p>}
        </div>

        <div className="form-group">
          <label>Registration Fee</label>
          <input
            type="text"
            {...register('registrationFee', { required: 'Registration fee is required' })}
            placeholder="e.g., ₹500 or Free"
          />
          {errors.registrationFee && <p className="error">{errors.registrationFee.message}</p>}
        </div>

        <div className="form-group">
          <label>Contact Information</label>
          <input
            type="text"
            {...register('contact', { required: 'Contact information is required' })}
            placeholder="e.g., email@example.com or +91-1234567890"
          />
          {errors.contact && <p className="error">{errors.contact.message}</p>}
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            {...register('category', { required: 'Category is required' })}
            placeholder="e.g., Technology, Career Development"
          />
          {errors.category && <p className="error">{errors.category.message}</p>}
        </div>

        <div className="form-group">
          <label>Event Link (Optional)</label>
          <input
            type="text"
            {...register('eventLink')}
            placeholder="e.g., Zoom link or registration form URL"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Event'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/dashboard/vendor/')}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;