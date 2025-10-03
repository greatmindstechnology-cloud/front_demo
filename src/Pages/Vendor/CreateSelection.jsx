import React from 'react';
import { useNavigate } from 'react-router-dom';
import './createSelection.css';

const CreateSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="create-selection-container">
      <h2>Create New</h2>
      <div className="selection-buttons">
        <button onClick={() => navigate('/dashboard/vendor/createInternship')} className="selection-button">
          Create Internship
        </button>
        <button onClick={() => navigate('/dashboard/vendor/createevent')} className="selection-button">
          Create Event
        </button>
      </div>
      <button onClick={() => navigate('/dashboard/vendor/internships-and-events')} className="cancel-button">
        Cancel
      </button>
    </div>
  );
};

export default CreateSelection;