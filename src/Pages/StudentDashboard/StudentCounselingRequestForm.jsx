import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Upload, X, Check } from 'lucide-react';

function Counselor() {
  const navigate = useNavigate();
  const studentId = localStorage.getItem('vendorId');
  
  const [domain, setDomain] = useState('');
  const [description, setDescription] = useState('');
  const [preferredTimes, setPreferredTimes] = useState([]);
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  useEffect(() => {
    if (!studentId) {
      alert('Session expired. Please login again.');
      navigate('/login');
    }
  }, [studentId, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!domain) newErrors.domain = 'Please select a domain';
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    if (preferredTimes.length === 0) {
      newErrors.preferredTimes = 'Please select at least one preferred time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addPreferredTime = () => {
    setPreferredTimes([...preferredTimes, { day: '', time: '' }]);
  };

  const updatePreferredTime = (index, field, value) => {
    const updated = [...preferredTimes];
    updated[index][field] = value;
    setPreferredTimes(updated);
    
    // Clear error when user starts selecting
    if (errors.preferredTimes) {
      setErrors({ ...errors, preferredTimes: null });
    }
  };

  const removePreferredTime = (index) => {
    setPreferredTimes(preferredTimes.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, resume: 'Resume must be a PDF, DOC, or DOCX file' });
        setResume(null);
        e.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        setErrors({ ...errors, resume: 'Resume file size must not exceed 5MB' });
        setResume(null);
        e.target.value = '';
        return;
      }

      setResume(file);
      setErrors({ ...errors, resume: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Filter out incomplete time slots
    const validTimes = preferredTimes.filter(pt => pt.day && pt.time);
    
    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('domain', domain);
    formData.append('description', description.trim());
    formData.append('preferred_times', JSON.stringify(validTimes));
    if (resume) formData.append('resume', resume);

    try {
      const response = await fetch('http://localhost:8000/trainer_gmt/counseling/request/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/trainer');
        }, 2000);
      } else {
        setErrors({ submit: data.error || 'Submission failed. Please try again.' });
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 bg-light">
        <div className="card border-0 shadow text-center p-5">
          <Check size={64} className="text-success mx-auto mb-3" />
          <h3 className="text-success mb-2">Success!</h3>
          <p className="text-muted">Your counseling request has been submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-5">
      <div className="card border-0 shadow" style={{ width: '100%', maxWidth: '42rem' }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="h3 fw-bold text-dark mb-4">Counseling Request</h2>
          
          {errors.submit && (
            <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
              <AlertCircle size={20} className="me-2" />
              <div>{errors.submit}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Domain Selection */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Domain <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.domain ? 'is-invalid' : ''}`}
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setErrors({ ...errors, domain: null });
                }}
                disabled={isSubmitting}
              >
                <option value="">Select a domain</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Management">Management</option>
                <option value="Career">Career Guidance</option>
                <option value="Academic">Academic</option>
              </select>
              {errors.domain && (
                <div className="invalid-feedback">{errors.domain}</div>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                rows="4"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors({ ...errors, description: null });
                }}
                placeholder="Please describe your counseling needs and what you hope to achieve..."
                disabled={isSubmitting}
              />
              <div className="form-text">
                {description.length}/500 characters (minimum 20)
              </div>
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            {/* Preferred Times */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Preferred Times <span className="text-danger">*</span>
              </label>
              
              {preferredTimes.map((slot, index) => (
                <div key={index} className="row g-2 mb-2">
                  <div className="col-5">
                    <select
                      className="form-select form-select-sm"
                      value={slot.day}
                      onChange={(e) => updatePreferredTime(index, 'day', e.target.value)}
                      disabled={isSubmitting}
                    >
                      <option value="">Select day</option>
                      {DAYS.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-5">
                    <select
                      className="form-select form-select-sm"
                      value={slot.time}
                      onChange={(e) => updatePreferredTime(index, 'time', e.target.value)}
                      disabled={isSubmitting}
                    >
                      <option value="">Select time</option>
                      {TIME_SLOTS.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => removePreferredTime(index)}
                      disabled={isSubmitting}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={addPreferredTime}
                disabled={isSubmitting}
              >
                + Add Time Slot
              </button>
              
              {errors.preferredTimes && (
                <div className="text-danger small mt-2">{errors.preferredTimes}</div>
              )}
            </div>

            {/* Resume Upload */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Upload Resume <span className="text-muted">(Optional)</span>
              </label>
              <input
                className={`form-control ${errors.resume ? 'is-invalid' : ''}`}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                disabled={isSubmitting}
              />
              {resume && (
                <div className="mt-2 d-flex align-items-center text-success small">
                  <Upload size={16} className="me-2" />
                  {resume.name} ({(resume.size / 1024).toFixed(1)} KB)
                </div>
              )}
              {errors.resume && (
                <div className="invalid-feedback">{errors.resume}</div>
              )}
              <div className="form-text">
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mt-5">
              <button
                type="button"
                className="btn btn-outline-secondary flex-fill"
                onClick={() => navigate('/dashboard/trainer')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-fill"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Counselor;