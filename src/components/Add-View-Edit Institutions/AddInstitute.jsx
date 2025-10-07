import React from 'react';
import styled from 'styled-components';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { createInstitution } from '../../services/institutionsService';

const StyledWrapper = styled.div`
  .button {
    position: relative;
    width: 190px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 1px solid #34974d;
    background-color: #3aa856;
  }

  .button, .button__icon, .button__text {
    transition: all 0.3s;
  }

  .button .button__text {
    transform: translateX(30px);
    color: #fff;
    font-weight: 600;
  }

  .button .button__icon {
    position: absolute;
    transform: translateX(149px);
    height: 100%;
    width: 39px;
    background-color: #34974d;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button .svg {
    width: 30px;
    stroke: #fff;
  }

  .button:hover {
    background: #34974d;
  }

  .button:hover .button__text {
    color: transparent;
  }

  .button:hover .button__icon {
    width: 180px;
    transform: translateX(0);
  }

  .button:active .button__icon {
    background-color: #2e8644;
  }

  .button:active {
    border: 1px solid #2e8644;
  }
`;

export default function AddInstitute() {
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [addForm, setAddForm] = React.useState({
    name: '',
    type_of_institution: '',
    street: '',
    city: '',
    state: '',
    contact_number: '',
    contact_email: '',
  });

  React.useEffect(() => {
    console.log('showAddDialog state:', showAddDialog);
  }, [showAddDialog]);

  const handleAddInstitution = async (e) => {
    e.preventDefault();
    console.log('Adding institution with data:', addForm);
    try {
      const response = await createInstitution(addForm);
      console.log('Institution created:', response);
      setAddForm({
        name: '',
        type_of_institution: '',
        street: '',
        city: '',
        state: '',
        contact_number: '',
        contact_email: '',
      });
      alert('Institution added successfully!');
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error creating institution:', error);
    }
  };

  return (
    <div
      style={{
        color: '#34974d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
      }}
    >
      <StyledWrapper>
        <button
          type="button"
          className="button"
          onClick={() => {
            console.log('Opening dialog');
            setShowAddDialog(true);
          }}
        >
          <span className="button__text">Add Institution</span>
          <span className="button__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              stroke="currentColor"
              height={24}
              fill="none"
              className="svg"
            >
              <line y2={19} y1={5} x2={12} x1={12} />
              <line y2={12} y1={12} x2={19} x1={5} />
            </svg>
          </span>
        </button>
      </StyledWrapper>
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        sx={{
          '& .MuiDialog-paper': {
            minWidth: 360,
            maxWidth: 600,
            borderRadius: '8px',
            border: '1px solid #3aa856',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            background: 'rgba(255,255,255,0.95)',
          },
          zIndex: 1301, // Above AddViewInstitution (zIndex: 0)
        }}
      >
        <DialogTitle
          sx={{
            color: '#34974d',
            fontSize: 'x-large',
            fontWeight: 'bold',
            letterSpacing: 0.5,
            padding: '16px 24px',
          }}
        >
          Add Institution
        </DialogTitle>
        <DialogContent>
          <form
            id="add-institution-form"
            onSubmit={handleAddInstitution}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '16px',
            }}
          >
            <TextField
              required
              label="Institution Name"
              variant="outlined"
              value={addForm.name}
              onChange={(e) => {
                console.log('TextField changed:', e.target.value);
                setAddForm({ ...addForm, name: e.target.value });
              }}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              required
              select
              label="Type"
              value={addForm.type_of_institution}
              onChange={(e) => {
                console.log('Select changed:', e.target.value);
                setAddForm({ ...addForm, type_of_institution: e.target.value });
              }}
              variant="outlined"
              fullWidth
              margin="normal"
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  sx: { zIndex: 1302 }, // Above dialog
                },
              }}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Type
              </MenuItem>
              <MenuItem value="School">School</MenuItem>
              <MenuItem value="College">College</MenuItem>
            </TextField>
            <TextField
              required
              label="Street Name"
              variant="outlined"
              value={addForm.street}
              onChange={(e) => {
                console.log('TextField changed:', e.target.value);
                setAddForm({ ...addForm, street: e.target.value });
              }}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField
                required
                label="City"
                variant="outlined"
                value={addForm.city}
                onChange={(e) => {
                  console.log('TextField changed:', e.target.value);
                  setAddForm({ ...addForm, city: e.target.value });
                }}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                required
                label="State"
                variant="outlined"
                value={addForm.state}
                onChange={(e) => {
                  console.log('TextField changed:', e.target.value);
                  setAddForm({ ...addForm, state: e.target.value });
                }}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField
                required
                label="Contact Number"
                variant="outlined"
                value={addForm.contact_number}
                onChange={(e) => {
                  console.log('TextField changed:', e.target.value);
                  setAddForm({ ...addForm, contact_number: e.target.value });
                }}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                required
                label="Contact Email"
                type="email"
                variant="outlined"
                value={addForm.contact_email}
                onChange={(e) => {
                  console.log('TextField changed:', e.target.value);
                  setAddForm({ ...addForm, contact_email: e.target.value });
                }}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={() => setShowAddDialog(false)}
            sx={{
              padding: '10px 32px',
              background: '#f5f5f5',
              color: '#34974d',
              border: '1.5px solid #3aa856',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '16px',
              textTransform: 'none',
              '&:hover': {
                background: '#e0e0e0',
                color: '#2e8644',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-institution-form"
            sx={{
              padding: '10px 32px',
              background: 'linear-gradient(90deg, #34974d 60%, #3aa856 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '16px',
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(52, 151, 77, 0.10)',
              '&:hover': {
                background: 'linear-gradient(90deg, #2e8644 60%, #34974d 100%)',
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}