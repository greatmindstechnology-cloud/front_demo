import React from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { FaTrash } from 'react-icons/fa';
import { listInstitutions, updateInstitution, deleteInstitution } from '../../services/institutionsService';

const StyledWrapper = styled.div`
    .button {
        position: relative;
        width: 210px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        border: 1px solid #34974d;
        background-color: #3aa856;
    }
    .button, .button__icon, .button__text { transition: all 0.3s; }
    .button .button__text { transform: translateX(30px); color: #fff; font-weight: 600; }
    .button .button__icon {
        position: absolute;
        transform: translateX(10.5rem);
        height: 100%;
        width: 40px;
        background-color: #34974d;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .button .svg { width: 30px; stroke: #fff; }
    .button:hover { background: #34974d; }
    .button:hover .button__text { color: transparent; }
    .button:hover .button__icon { width: 180px; transform: translateX(0); }
    .button:active .button__icon { background-color: #2e8644; }
    .button:active { border: 1px solid #2e8644; }
`;

const DeleteButton = styled.button`
    margin-left: auto;
    padding: 8px;
    cursor: pointer;
    border-radius: 10px;
    background: linear-gradient(90deg, rgb(249, 249, 249) 0%, #f8fafd 100%);
    box-shadow: 0 2px 8px rgba(52, 151, 77, 0.08);
    border: 1.5px solid #3aa856;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, box-shadow 0.2s;
    color: #34974d;
    
    &:hover {
        background: linear-gradient(90deg, #c2f7d6 0%, #e6f7fa 100%);
        box-shadow: 0 4px 16px rgba(52, 151, 77, 0.16);
    }
    
    &:active {
        background: linear-gradient(90deg, #b0e5c4 0%, #d4e5e8 100%);
        box-shadow: 0 2px 8px rgba(52, 151, 77, 0.12);
    }
`;

function DialogOverlay({ onClose, children }) {
    const dialogRef = React.useRef(null);

    React.useEffect(() => {
        function handleClick(e) {
            if (dialogRef.current && !dialogRef.current.contains(e.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.18)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div ref={dialogRef}>
                {children}
            </div>
        </div>
    );
}

const dialogStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, #e0ffe9 0%, #f8fafd 100%)',
    padding: '32px 36px',
    borderRadius: '18px',
    boxShadow: '0 8px 32px rgba(52, 151, 77, 0.18), 0 1.5px 8px rgba(0,0,0,0.10)',
    zIndex: 1000,
    minWidth: 660,
    border: '1.5px solid #3aa856',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#222',
    transition: 'box-shadow 0.3s',
};

export default function AddViewInstitutions() {
    const [showListDialog, setShowListDialog] = React.useState(false);
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [editForm, setEditForm] = React.useState(null);
    const [institutions, setInstitutions] = React.useState([]);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        async function fetchInstitutions() {
            try {
                const data = await listInstitutions();
                setInstitutions(data);
            } catch (err) {
                console.error('Error fetching institutions:', err);
                setError('Failed to load institutions. Please try again.');
            }
        }
        fetchInstitutions();
    }, []);

    const handleEditInstitution = (inst) => {
        setEditForm({
            id: inst.id,
            name: inst.name || '',
            type_of_institution: inst.type_of_institution || 'School',
            street: inst.street || '',
            city: inst.city || '',
            state: inst.state || '',
            contact_number: inst.contact_number || '',
            contact_email: inst.contact_email || ''
        });
        setShowEditDialog(true);
        setError(null);
    };

    const handleDeleteInstitution = async (id, e) => {
        e.stopPropagation(); // Prevent triggering the edit action
        if (!window.confirm('Are you sure you want to delete this institution?')) {
            return;
        }
        try {
            await deleteInstitution(id);
            setInstitutions(institutions.filter(inst => inst.id !== id));
            setError(null);
        } catch (err) {
            console.error('Error deleting institution:', err);
            setError('Failed to delete institution. Please try again.');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!editForm.name || !editForm.type_of_institution || !editForm.street || 
                !editForm.city || !editForm.state || !editForm.contact_number || !editForm.contact_email) {
                setError('All fields are required.');
                return;
            }

            await updateInstitution(editForm.id, editForm);
            const data = await listInstitutions();
            setInstitutions(data);

            setShowEditDialog(false);
            setEditForm(null);
            setError(null);
        } catch (err) {
            console.error('Error updating institution:', err);
            setError('Failed to update institution. Please check your input and try again.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
            <StyledWrapper>
                <button type="button" className="button" onClick={() => setShowListDialog(true)}>
                    <span className="button__text">Edit Institutions</span>
                    <span className="button__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height={24} fill="none" className="svg">
                            <line y2={19} y1={5} x2={12} x1={12} />
                            <line y2={12} y1={12} x2={19} x1={5} />
                        </svg>
                    </span>
                </button>
            </StyledWrapper>
            {showListDialog && (
                <DialogOverlay onClose={() => setShowListDialog(false)}>
                    <div style={{ ...dialogStyle, maxHeight: 600, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ marginBottom: 24, color: '#34974d', letterSpacing: 0.5, fontSize: 'x-large', fontWeight: 'bolder' }}>Institutions</h1>
                        {error && (
                            <Alert severity="error" style={{ marginBottom: 16 }}>
                                {error}
                            </Alert>
                        )}
                        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginBottom: 24 }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {institutions.map(inst => (
                                    <li
                                        key={inst.id}
                                        style={{
                                            margin: '12px 0',
                                            cursor: 'pointer',
                                            borderRadius: 10,
                                            background: 'linear-gradient(90deg, rgb(249, 249, 249) 0%, #f8fafd 100%)',
                                            boxShadow: '0 2px 8px rgba(52, 151, 77, 0.08)',
                                            padding: '16px 20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            transition: 'background 0.2s, box-shadow 0.2s',
                                            fontWeight: 600,
                                            fontSize: '1.08rem',
                                            color: '#222',
                                            border: '1.5px solid #3aa856',
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.background = 'linear-gradient(90deg, #c2f7d6 0%, #e6f7fa 100%)';
                                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(52, 151, 77, 0.16)';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.background = 'linear-gradient(90deg, #e0ffe9 0%, #f8fafd 100%)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(52, 151, 77, 0.08)';
                                        }}
                                        onClick={() => { setShowListDialog(false); handleEditInstitution(inst); }}
                                    >
                                        <span style={{
                                            display: 'inline-block',
                                            background: '#3aa856',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            width: 36,
                                            height: 36,
                                            textAlign: 'center',
                                            lineHeight: '36px',
                                            fontWeight: 700,
                                            fontSize: '1.1rem',
                                            marginRight: 16,
                                            boxShadow: '0 1.5px 6px rgba(52, 151, 77, 0.10)'
                                        }}>
                                            {inst.name?.charAt(0) || '?'}
                                        </span>
                                        <span>
                                            <span style={{ color: '#34974d', fontWeight: 700, fontSize: '1.12rem', letterSpacing: 0.2 }}>{inst.name || 'Unnamed'}</span>
                                            <span style={{ color: '#888', fontWeight: 500, marginLeft: 10, fontSize: '0.98rem' }}>({inst.type_of_institution || 'N/A'})</span>
                                        </span>
                                        <DeleteButton
                                            onClick={(e) => handleDeleteInstitution(inst.id, e)}
                                            title="Delete Institution"
                                        >
                                            <FaTrash size={16} />
                                        </DeleteButton>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button variant="outlined" onClick={() => setShowListDialog(false)}>Close</Button>
                    </div>
                </DialogOverlay>
            )}

            {showEditDialog && editForm && (
                <DialogOverlay onClose={() => { setShowEditDialog(false); setEditForm(null); setError(null); }}>
                    <div style={dialogStyle}>
                        <h1 style={{ marginBottom: 24, color: '#34974d', letterSpacing: 0.5, fontSize: 'x-large', fontWeight: 'bolder' }}>Edit Institution</h1>
                        {error && (
                            <Alert severity="error" style={{ marginBottom: 16 }}>
                                {error}
                            </Alert>
                        )}
                        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <TextField
                                required
                                label="Institution Name"
                                value={editForm.name || ''}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                            />
                            <TextField
                                required
                                select
                                label="Type"
                                value={editForm.type_of_institution || 'School'}
                                onChange={e => setEditForm({ ...editForm, type_of_institution: e.target.value })}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                                SelectProps={{
                                    MenuProps: {
                                        onClick: e => e.stopPropagation(),
                                        onMouseDown: e => e.stopPropagation(),
                                    }
                                }}
                            >
                                <MenuItem value="School">School</MenuItem>
                                <MenuItem value="College">College</MenuItem>
                            </TextField>
                            <TextField
                                required
                                label="Street Name"
                                value={editForm.street || ''}
                                onChange={e => setEditForm({ ...editForm, street: e.target.value })}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                            />
                            <TextField
                                required
                                label="City"
                                value={editForm.city || ''}
                                onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                            />
                            <TextField
                                required
                                label="State"
                                value={editForm.state || ''}
                                onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                            />
                            <TextField
                                required
                                label="Contact Number"
                                value={editForm.contact_number || ''}
                                onChange={e => setEditForm({ ...editForm, contact_number: e.target.value })}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                            />
                            <TextField
                                required
                                label="Contact Email"
                                type="email"
                                value={editForm.contact_email || ''}
                                onChange={e => setEditForm({ ...editForm, contact_email: e.target.value })}
                                variant="outlined"
                                fullWidth
                                margin="dense"
                            />
                            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                                <Button type="submit" variant="contained" color="success">Save</Button>
                                <Button type="button" variant="outlined" color="inherit" onClick={() => { setShowEditDialog(false); setEditForm(null); setError(null); }}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </DialogOverlay>
            )}
        </div>
    );
}