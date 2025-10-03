import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function StudentList() {
    const [rows, setRows] = useState([]);
    const[fulldetails, setFullDetails] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: '',
        full_name: '',
        email: '',
        contact_number: '',
        skills: '',
    });

    useEffect(() => {
        fetch('http://localhost:8000/admin_gmt/students/')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    setRows(data.data);
                } else if (Array.isArray(data)) {
                    setRows(data);
                } else {
                    setRows([]);
                }
            })
            .catch(error => console.error('Error fetching students:', error));
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 150 },
        { field: 'firstname', headerName: 'Name', width: 220 },
        { field: 'email', headerName: 'Email', width: 220 },
        { field: 'contact_number', headerName: 'Contact Number', width: 180 },
        { field: 'skills', headerName: 'Skills', width: 150 },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                    <EditIcon />
                </IconButton>
            ),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
        {
            field: 'actions',
            headerName: 'View',
            width: 140,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleView(params.row)}
                    size="small"
                >
                    View Details
                </Button>
            ),
        },
    ];

    const handleView = async (row) => {
        try {
            const response = await fetch(`http://localhost:8000/admin_gmt/student/?id=${row.id}`);
            if (response.ok) {
                const data = await response.json();
                const student = data.data ? data.data : data;
                // Ensure profile_picture is a string or provide a fallback
                console.log('Selected Student:', student);
                setSelectedRow(student);
                setOpenView(true);
            } else {
                console.error('Failed to fetch student details:', response.status);
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };

    const handleEdit = async (row) => {
        try {
            const response = await fetch(`http://localhost:8000/admin_gmt/student/?id=${row.id}`);
            if (response.ok) {
                const data = await response.json();
                const student = data.data ? data.data : data;
                setEditFormData(student);
                setSelectedRow(student);
                setOpenEdit(true);
            } else {
                console.error('Failed to fetch student details:', response.status);
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };

    const handleDelete = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const handleEditSubmit = async () => {
        try {
            const formData = new FormData();
            Object.entries(editFormData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            console.log('Submitting edit form data:', Object.fromEntries(formData.entries()));
            const response = await fetch(`http://localhost:8000/admin_gmt/update/student/?email=${encodeURIComponent(editFormData.email)}`, {
                method: 'PUT',
                body: formData,
            });
            
            if (response.ok) {
                setRows(rows.map(row => (row.id === editFormData.id ? { ...row, ...editFormData } : row)));
                setOpenEdit(false);
                setEditFormData({
                    id: '',
                    firstname: '',
                    lastname: '',
                    email: '',
                    date_of_birth: '',
                    gender: '',
                    contact_number: '',
                    alt_contact: '',
                    father_name: '',
                    mother_name: '',
                    address: '',
                    pincode: '',
                    description: '',
                    designation: '',
                    skills: '',
                    account_holder_name: '',
                    account_number: '',
                    bank_name: '',
                    bank_location: '',
                    branch_name: '',
                    ifsc_code: '',
                    institution_name: '',
                    location: '',
                    major_subject: '',
                    qualification: '',
                    cgpa: '',
                    passedout: '',
                    Nickname: ''
                });
            } else {
                console.error('Failed to update student');
            }
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Paper style={{ height: 600, width: '100%', padding: 16 }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableSelectionOnClick
            />

            {/* View Dialog */}
            <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Student Details</DialogTitle>
                <DialogContent dividers>
                    {selectedRow && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Profile Picture */}
                            <img
                                src={
                                    `http://localhost:8000${selectedRow.profile_picture}`
                                }
                                alt="Profile"
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginBottom: 24,
                                    border: '3px solid #1976d2'
                                }}
                            />
                            {/* Display all student details in filled TextFields */}
                            {Object.entries(selectedRow).map(([key, value]) =>
                                key !== 'profile_picture' ? (
                                    <TextField
                                        key={key}
                                        label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        value={String(value || '')}
                                        margin="dense"
                                        fullWidth
                                        variant="filled"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ marginBottom: 12 }}
                                    />
                                ) : null
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenView(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogContent dividers>
                    {selectedRow && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Profile Picture */}
                            <img
                                src={
                                    `http://localhost:8000${selectedRow.profile_picture}`
                                }
                                alt="Profile"
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginBottom: 24,
                                    border: '3px solid #1976d2'
                                }}
                            />
                            {/* Display all student details in filled TextFields */}
                            {Object.entries(selectedRow).map(([key, value]) =>
                                key !== 'profile_picture' ? (
                                    <TextField
                                        key={key}
                                        name={key}
                                        label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        value={editFormData[key] !== undefined ? editFormData[key] : ''}
                                        margin="dense"
                                        onChange={handleEditChange}
                                        fullWidth
                                        variant="filled"
                                        style={{ marginBottom: 12 }}
                                    />
                                ) : null
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button onClick={handleEditSubmit} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}