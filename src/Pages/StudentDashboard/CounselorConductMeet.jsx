import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CounselorConductMeet = ({ counselorId }) => {
  const { id } = useParams(); // Session ID from URL
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch session details using dynamic ID from URL
  const fetchSession = async () => {
    if (!id) {
      setError('Invalid session ID.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/trainer_gmt/counseling/session/${id}/`);
      console.log('Session response:', response.data);

      // Check if response data is valid
      if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
        // Verify counselor ID matches
        if (response.data.counselor && response.data.counselor.toString() !== counselorId.toString()) {
          setError('You are not authorized to view this session.');
          setSession(null);
        } else {
          setSession(response.data);
          setError(null);
        }
      } else {
        setError('No session details available from server.');
        setSession(null);
      }
    } catch (err) {
      console.error('Error fetching session:', err);
      setError(
        err.response?.status === 404
          ? 'Session not found. It may have been deleted or does not exist.'
          : err.response?.data?.error || err.message || 'Failed to load session details. Please try again later.'
      );
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && counselorId) {
      fetchSession();
    } else {
      setError('Invalid session ID or counselor ID.');
    }
  }, [id, counselorId]);

  const handleCompleteSession = async () => {
    if (!session || session.status !== 'Accepted') {
      alert('This session cannot be marked as completed. It must be in Accepted state.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.patch(`http://localhost:8000/trainer_gmt/counseling/requests/${id}/complete/`);
      alert(response.data.message);
      navigate('/dashboard/counselor');
    } catch (err) {
      console.error('Error completing session:', err);
      alert(
        err.response?.data?.error || err.message || 'Failed to mark session as completed.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 bg-light">
        <div className="card border border-0 shadow" style={{ width: '34rem' }}>
          <div className="card-body">
            <div className="row g-4 p-4 d-flex justify-content-center">
              <div className="col-12">
                <h2 className="h4 fw-bold text-dark">Counseling Session</h2>
              </div>
              <div className="col-12">
                <div className="alert alert-danger">{error}</div>
              </div>
              <div className="col-12 d-flex justify-content-between mt-4">
                <button
                  className="btn btn-primary"
                  onClick={fetchSession}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Loading...
                    </>
                  ) : (
                    'Retry'
                  )}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard/counselor')}
                  disabled={loading}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 bg-light">
        <div className="card border border-0 shadow" style={{ width: '34rem' }}>
          <div className="card-body">
            <div className="row g-4 p-4 d-flex justify-content-center">
              <div className="col-12">
                <h2 className="h4 fw-bold text-dark">Counseling Session</h2>
              </div>
              <div className="col-12 text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || Object.keys(session).length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 bg-light">
        <div className="card border border-0 shadow" style={{ width: '34rem' }}>
          <div className="card-body">
            <div className="row g-4 p-4 d-flex justify-content-center">
              <div className="col-12">
                <h2 className="h4 fw-bold text-dark">Counseling Session</h2>
              </div>
              <div className="col-12">
                <div className="alert alert-info">No session details available.</div>
              </div>
              <div className="col-12 d-flex justify-content-between mt-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard/counselor')}
                  disabled={loading}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-100 bg-light">
      <div className="card border border-0 shadow" style={{ width: '34rem' }}>
        <div className="card-body">
          <div className="row g-4 p-4 d-flex justify-content-center">
            <div className="col-12">
              <h2 className="h4 fw-bold text-dark">Counseling Session Details</h2>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Session ID</label>
              <p className="form-control-static">{session.id || 'N/A'}</p>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Student</label>
              <p className="form-control-static">{session.student_name || `Student ${session.student}` || 'N/A'}</p>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Counselor</label>
              <p className="form-control-static">{session.counselor_name || `Counselor ${session.counselor}` || 'N/A'}</p>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Domain</label>
              <p className="form-control-static">{session.domain || 'N/A'}</p>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Status</label>
              <p className="form-control-static">{session.status || 'N/A'}</p>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Session Time</label>
              <p className="form-control-static">
                {session.session_time
                  ? new Date(session.session_time).toLocaleString()
                  : 'Not Scheduled'}
              </p>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Meet Link</label>
              <p className="form-control-static">
                {session.meet_link ? (
                  <a
                    href={session.meet_link}
                    className="btn btn-primary btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start Meeting
                  </a>
                ) : (
                  'Not Available'
                )}
              </p>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Meeting ID</label>
              <p className="form-control-static">{session.meeting_id || 'N/A'}</p>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Description</label>
              <p className="form-control-static">{session.description || 'N/A'}</p>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Preferred Times</label>
              <p className="form-control-static">
                {session.preferred_times
                  ? Object.entries(session.preferred_times)
                      .map(([day, times]) => `${day}: ${times.join(', ')}`)
                      .join('; ')
                  : 'N/A'}
              </p>
            </div>
            {session.resume_url && (
              <div className="col-12">
                <label className="form-label fw-bold">Resume</label>
                <p className="form-control-static">
                  <a
                    href={session.resume_url}
                    className="btn btn-outline-primary btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                </p>
              </div>
            )}
            <div className="col-12 d-flex justify-content-between mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard/counselor')}
                disabled={loading}
              >
                Back
              </button>
              {session.status === 'Accepted' && (
                <button
                  className="btn btn-success"
                  onClick={handleCompleteSession}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Completing...
                    </>
                  ) : (
                    'Mark as Completed'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorConductMeet;