import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function AdminList() {
    const [rows, setRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
    });

    useEffect(() => {
        fetch('http://localhost:8000/super_admin_gmt/admins/')
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
            .catch(error => console.error('Error fetching admins:', error));
    }, []);

    const columns = [
        { field: 'first_name', headerName: 'Admin First Name', width: 180 },
        { field: 'last_name', headerName: 'Last Name', width: 180 },
        { field: 'email', headerName: 'Email', width: 220 },
        { field: 'phone_number', headerName: 'Phone Number', width: 180 },
    ];

    const handleView = async (row) => {
        try {
            const response = await fetch(`http://localhost:8000/admin_gmt/admin/?id=${row.id}`);
            if (response.ok) {
                const data = await response.json();
                const admin = data.data ? data.data : data;
                setSelectedRow(admin);
                setOpenView(true);
            } else {
                console.error('Failed to fetch admin details:', response.status);
            }
        } catch (error) {
            console.error('Error fetching admin details:', error);
        }
    };

    const handleEdit = async (row) => {
        try {
            const response = await fetch(`http://localhost:8000/admin_gmt/admin/?id=${row.id}`);
            if (response.ok) {
                const data = await response.json();
                const admin = data.data ? data.data : data;
                setEditFormData(admin);
                setSelectedRow(admin);
                setOpenEdit(true);
            } else {
                console.error('Failed to fetch admin details:', response.status);
            }
        } catch (error) {
            console.error('Error fetching admin details:', error);
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
            const response = await fetch(`http://localhost:8000/admin_gmt/update/admin/?email=${encodeURIComponent(editFormData.email)}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                setRows(rows.map(row => (row.id === editFormData.id ? { ...row, ...editFormData } : row)));
                setOpenEdit(false);
                setEditFormData({
                    id: '',
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: '',
                });
            } else {
                console.error('Failed to update admin');
            }
        } catch (error) {
            console.error('Error updating admin:', error);
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