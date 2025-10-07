import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProjectSubmissionForm = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const studentId = location.state?.studentId;
  const [projectFile, setProjectFile] = useState(null);
  const [projectDocument, setProjectDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!studentId) {
      setError("No student ID found. Please log in.");
    }
    if (!projectId) {
      setError("No project ID found. Please try again.");
    }
  }, [studentId, projectId]);

  const handleFileChange = (setter) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectFile || !projectDocument) {
      setError('Please upload both the project file and document.');
      return;
    }

    const formData = new FormData();
    formData.append('project', projectId);
    formData.append('student', studentId);
    formData.append('project_file', projectFile);
    formData.append('project_document', projectDocument);

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/course_gmt/api/project_submit/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status) {
        setMessage(response.data.message);
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during submission. Please check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (error && !studentId) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
      }}>Submit Your Project</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            color: '#555',
          }}>Project File:</label>
          <input
            type="file"
            onChange={handleFileChange(setProjectFile)}
            accept=".pdf,.doc,.docx,.zip"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          {projectFile && <p style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>Selected: {projectFile.name}</p>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            color: '#555',
          }}>Project Document:</label>
          <input
            type="file"
            onChange={handleFileChange(setProjectDocument)}
            accept=".pdf,.doc,.docx"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          {projectDocument && <p style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>Selected: {projectDocument.name}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {loading ? 'Submitting...' : 'Submit Project'}
        </button>
      </form>
      {message && <p style={{
        textAlign: 'center',
        color: '#4CAF50',
        marginTop: '15px',
      }}>{message}</p>}
      {error && <p style={{
        textAlign: 'center',
        color: '#f44336',
        marginTop: '15px',
      }}>{error}</p>}
    </div>
  );
};

export default ProjectSubmissionForm;