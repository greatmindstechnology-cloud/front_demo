import React, { useState } from 'react';
import { AlertCircle, Upload, X, Check, Clock, Calendar, FileText, User, Briefcase } from 'lucide-react';

function Counselor() {
  
 
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
  
  const DOMAINS = [
    { value: 'Technical', icon: '💻', description: 'Software development, coding, technical skills' },
    { value: 'HR', icon: '👥', description: 'Human resources, people management' },
    { value: 'Management', icon: '📊', description: 'Project management, leadership' },
    { value: 'Career', icon: '🎯', description: 'Career planning and guidance' },
    { value: 'Academic', icon: '📚', description: 'Academic guidance and support' }
  ];
  
  const studentId = localStorage.getItem('vendorId');
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
      const maxSize = 5 * 1024 * 1024;

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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const validTimes = preferredTimes.filter(pt => pt.day && pt.time);
    
    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('domain', domain);
    formData.append('description', description.trim());
    formData.append('preferred_times', JSON.stringify(validTimes));
    if (resume) formData.append('resume', resume);

    try {
      const response = await fetch('https://backend-demo-esqk.onrender.com/trainer_gmt/counseling/request/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          window.location.href = '/dashboard/trainer';
        }, 2000);
      } else {
        setErrors({ submit: data.error || 'Submission failed. Please try again.' });
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center">
          <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '120px', height: '120px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <Check size={64} className="text-success" strokeWidth={3} />
          </div>
          <h2 className="text-white fw-bold mb-3">Request Submitted Successfully!</h2>
          <p className="text-white opacity-75 fs-5">Our counseling team will review your request and get back to you soon.</p>
          <div className="mt-4">
            <div className="spinner-border text-white" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white mt-2 small">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="p-3 pb-0">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div>
                  <h1 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>Counseling Request</h1>
                  <p className="text-white opacity-75 mb-0 small">Get personalized guidance from our expert counselors</p>
                </div>
                <div className="bg-white bg-opacity-25 rounded-3 px-3 py-1">
                  <div className="d-flex align-items-center gap-2">
                    <User size={16} className="text-white" />
                    <span className="text-white fw-semibold small">{studentId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-3">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-0">
                {errors.submit && (
                  <div className="alert alert-danger m-4 mb-0 d-flex align-items-center rounded-3" role="alert">
                    <AlertCircle size={20} className="me-2 flex-shrink-0" />
                    <div>{errors.submit}</div>
                  </div>
                )}

                <div className="p-3 p-md-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                      <Briefcase size={16} className="text-primary" />
                      Select Domain <span className="text-danger">*</span>
                    </label>
                    <div className="row g-2">
                      {DOMAINS.map((item) => (
                        <div key={item.value} className="col-12 col-md-6">
                          <div
                            className={`card h-100 border-2 ${
                              domain === item.value
                                ? 'border-primary bg-primary bg-opacity-10'
                                : 'border-light'
                            } ${errors.domain ? 'border-danger' : ''}`}
                            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                            onClick={() => {
                              setDomain(item.value);
                              setErrors({ ...errors, domain: null });
                            }}
                          >
                            <div className="card-body p-2">
                              <div className="d-flex align-items-start gap-2">
                                <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                                <div className="flex-grow-1">
                                  <h6 className="fw-bold mb-0 small">{item.value}</h6>
                                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{item.description}</p>
                                </div>
                                {domain === item.value && (
                                  <Check size={16} className="text-primary flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.domain && (
                      <div className="text-danger small mt-1 ms-1">{errors.domain}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                      <FileText size={16} className="text-primary" />
                      Describe Your Needs <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control border-2 ${errors.description ? 'border-danger' : 'border-light'}`}
                      rows="3"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setErrors({ ...errors, description: null });
                      }}
                      placeholder="Tell us about your counseling needs, goals, and what you hope to achieve..."
                      disabled={isSubmitting}
                      style={{ resize: 'none', fontSize: '0.85rem' }}
                      maxLength={500}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>Minimum 20 characters</div>
                      <div className={`fw-semibold ${description.length >= 20 ? 'text-success' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                        {description.length}/500
                      </div>
                    </div>
                    {errors.description && (
                      <div className="text-danger small mt-1">{errors.description}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                      <Clock size={16} className="text-primary" />
                      Preferred Time Slots <span className="text-danger">*</span>
                    </label>
                    <p className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>Select your available time slots</p>
                    
                    {preferredTimes.length > 0 && (
                      <div className="mb-2" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                        {preferredTimes.map((slot, index) => (
                          <div key={index} className="card border-light mb-2">
                            <div className="card-body p-2">
                              <div className="row g-2 align-items-center">
                                <div className="col-12 col-sm-5">
                                  <div className="position-relative">
                                    <Calendar size={14} className="position-absolute text-muted" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    <select
                                      className="form-select form-select-sm border-light ps-4"
                                      value={slot.day}
                                      onChange={(e) => updatePreferredTime(index, 'day', e.target.value)}
                                      disabled={isSubmitting}
                                      style={{ fontSize: '0.8rem' }}
                                    >
                                      <option value="">Select day</option>
                                      {DAYS.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-12 col-sm-5">
                                  <div className="position-relative">
                                    <Clock size={14} className="position-absolute text-muted" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    <select
                                      className="form-select form-select-sm border-light ps-4"
                                      value={slot.time}
                                      onChange={(e) => updatePreferredTime(index, 'time', e.target.value)}
                                      disabled={isSubmitting}
                                      style={{ fontSize: '0.8rem' }}
                                    >
                                      <option value="">Select time</option>
                                      {TIME_SLOTS.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-12 col-sm-2">
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm w-100"
                                    onClick={() => removePreferredTime(index)}
                                    disabled={isSubmitting}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm w-100 w-sm-auto"
                      onClick={addPreferredTime}
                      disabled={isSubmitting}
                      style={{ fontSize: '0.8rem' }}
                    >
                      + Add Time Slot
                    </button>
                    
                    {errors.preferredTimes && (
                      <div className="text-danger small mt-1">{errors.preferredTimes}</div>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="form-label fw-bold mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.95rem' }}>
                      <Upload size={16} className="text-primary" />
                      Upload Resume <span className="text-muted fw-normal small">(Optional)</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-3 p-3 text-center ${errors.resume ? 'border-danger' : 'border-light'}`}>
                      <input
                        className="d-none"
                        type="file"
                        id="resumeUpload"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="resumeUpload" className="cursor-pointer w-100 m-0" style={{ cursor: 'pointer' }}>
                        {resume ? (
                          <div className="d-flex align-items-center justify-content-center gap-2 text-success">
                            <FileText size={20} />
                            <div className="text-start">
                              <div className="fw-semibold small">{resume.name}</div>
                              <div style={{ fontSize: '0.7rem' }} className="text-muted">{(resume.size / 1024).toFixed(1)} KB</div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Upload size={24} className="text-muted mb-1" />
                            <div className="fw-semibold mb-0 small">Click to upload resume</div>
                            <div style={{ fontSize: '0.7rem' }} className="text-muted">PDF, DOC, DOCX (Max 5MB)</div>
                          </div>
                        )}
                      </label>
                    </div>
                    {errors.resume && (
                      <div className="text-danger small mt-1">{errors.resume}</div>
                    )}
                  </div>
                </div>

                <div className="bg-light p-3 p-md-4 pt-3">
                  <div className="row g-2">
                    <div className="col-12 col-sm-6">
                      <button
                        type="button"
                        className="btn btn-outline-secondary w-100 py-2"
                        onClick={() => window.history.back()}
                        disabled={isSubmitting}
                        style={{ fontSize: '0.85rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="col-12 col-sm-6">
                      <button
                        type="button"
                        className="btn btn-primary w-100 py-2 fw-semibold"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', fontSize: '0.85rem' }}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-2">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="text-center text-white opacity-75" style={{ fontSize: '0.7rem' }}>
              <p className="mb-0">💡 Our counselors typically respond within 24-48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Counselor;