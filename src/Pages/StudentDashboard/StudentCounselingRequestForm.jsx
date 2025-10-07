import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Counselor() {
  const navigate = useNavigate();

  const studentId = localStorage.getItem('vendorId'); // Renamed for consistency
  const [domain, setDomain] = useState('');
  const [description, setDescription] = useState(''); // Changed from whyInterested
  const [preferredTimes, setPreferredTimes] = useState({}); // Changed to object for day-time slots
  const [resume, setResume] = useState(null); // Changed from docs to single file
  console.log('Student ID:', studentId);

  // Handle preferred times input (simplified example with day and time)
  const handlePreferredTimeChange = (e) => {
    const { name, value } = e.target;
    setPreferredTimes((prev) => ({
      ...prev,
      [name]: value.split(',').map(t => t.trim()), // Allows multiple times separated by comma
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('domain', domain);
    formData.append('description', description);
    formData.append('preferred_times', JSON.stringify(preferredTimes)); // Send as JSON string
    if (resume) formData.append('resume', resume);

    try {
      const response = await fetch('http://localhost:8000/trainer_gmt/counseling/request/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Application submitted successfully!');
        navigate('/dashboard/trainer');
      } else {
        alert(`Error: ${data.error || 'Submission failed'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Limit to single file
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Resume file size exceeds 5MB');
        setResume(null);
        return;
      }
      if (!file.name.toLowerCase().endswith(('.pdf', '.doc', '.docx'))) {
        alert('Resume must be a PDF, DOC, or DOCX file');
        setResume(null);
        return;
      }
      setResume(file);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-100 bg-light">
      <div className="card border border-0 shadow" style={{ width: "34rem" }}>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-4 p-4 d-flex justify-content-center">
            <div className="col-12">
              <h2 className="h4 fw-bold text-dark">Counseling Request</h2>
            </div>

            <div className="col-12">
              <label className="form-label">Domain <span className="text-danger">*</span></label>
              <select
                className="form-select"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              >
                <option value="" disabled>Select a domain</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Description <span className="text-danger">*</span></label>
              <textarea
                className="form-control"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="col-12">
              <label className="form-label">Preferred Times <span className="text-danger">*</span></label>
              <div>
                <select
                  className="form-select mb-2"
                  name="Monday" // Example day, can be dynamic
                  onChange={handlePreferredTimeChange}
                  value={preferredTimes.Monday ? preferredTimes.Monday.join(', ') : ''}
                >
                  <option value="" disabled>Select day</option>
                  <option value="10:00,11:00">Monday - 10:00, 11:00</option>
                  <option value="14:00,15:00">Monday - 14:00, 15:00</option>
                </select>
                {/* Add more days as needed */}
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Upload Resume (Optional)</label>
              <input
                className="form-control"
                type="file"
                onChange={handleFileChange}
              />
            </div>

            <div className="col-12 d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/trainer')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Submit All</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Counselor;