import React, { useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InfoIcon from '@mui/icons-material/Info';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';

const columnHelper = createMRTColumnHelper();

const columns = [
  columnHelper.accessor('contact_email', {
    header: 'Email',
    size: 120,
  }),
  columnHelper.accessor('firstname', {
    header: 'First Name',
    size: 200,
  }),
  columnHelper.accessor('business_name', {
    header: 'Business Name',
    size: 220,
  }),
  columnHelper.accessor('contact_phone', {
    header: 'Contact Number',
    size: 160,
  }),
  columnHelper.accessor('gst_number', {
    header: 'GST Number',
    size: 160,
  }),
  columnHelper.accessor('status', {
    header: 'Status of Request',
    size: 160,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'View',
    size: 100,
    Cell: ({ row }) => (
      <IconButton
        aria-label="view"
        color="primary"
        onClick={() => row.original.handleView(row.original)}
      >
        <VisibilityIcon />
      </IconButton>
    ),
  }),
  columnHelper.display({
    id: 'status-update',
    header: 'Status',
    size: 250,
    Cell: ({ row }) => (
      <select
        value={row.original.status || 'waiting'}
        onChange={(event) => row.original.handleStatusChange(event, row.original.id)}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <option value="waiting">Waiting</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    ),
  }),
  columnHelper.display({
    id: 'full-details',
    header: 'Full Details',
    size: 120,
    Cell: ({ row }) => (
      <Button
        variant="contained"
        color="primary"
        
        
        onClick={() => row.original.handleFullView(row.original)}
      >
        View All
      </Button>
    ),
  }),
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

export default function VendorApproval() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openFull, setOpenFull] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    fetch('http://localhost:8000/admin_gmt/vendors/')
      .then((res) => res.json())
      .then((result) => {
        const data = Array.isArray(result.data) ? result.data : [];
        const updatedData = data.map((row, idx) => ({
          id: row.id || idx,
          firstname: row.firstname || '',
          business_name: row.business_name || '',
          contact_email: row.contact_email || '',
          contact_phone: row.contact_phone || '',
          gst_number: row.gst_number || '',
          gst_certificate: row.gst_certificate ? { name: row.gst_certificate_name, url: `${BASE_URL}${row.gst_certificate}` } : null,
          pan_card: row.pan_card ? { name: row.pan_card_name, url: `${BASE_URL}${row.pan_card}` } : null,
          business_license: row.business_license ? { name: row.business_license_name, url: `${BASE_URL}${row.business_license}` } : null,
          status: row.status || 'Pending',
          message: '',
          handleView: handleView,
          handleFullView: handleFullView,
          handleStatusChange: handleStatusChange,
          ...row,
        }));
        setRows(updatedData);
      })
      .catch((err) => {
        console.error('Error fetching vendors:', err);
      });
  }, []);

  const handleApprove = async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('status', 'Approved');

      const response = await fetch('http://localhost:8000/admin_gmt/update-vendor-status/', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === id
              ? { ...row, status: 'Approved', message: 'Approved successfully ✅' }
              : row
          )
        );
      } else {
        console.error('Failed to approve vendor.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    setOpen(false);
    setOpenFull(false);
  };

  const handleReject = async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('status', 'Rejected');

      const response = await fetch('http://localhost:8000/admin_gmt/update-vendor-status/', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === id
              ? { ...row, status: 'Rejected', message: 'Rejected successfully ❌' }
              : row
          )
        );
      } else {
        console.error('Failed to reject vendor.');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
    setOpen(false);
    setOpenFull(false);
  };

  const handleView = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleFullView = (row) => {
    setSelectedRow(row);
    setOpenFull(true);
  };

  const handleStatusChange = async (event, id) => {
    const newStatus = event.target.value;
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('status', newStatus);

      const response = await fetch('http://localhost:8000/admin_gmt/update-vendor-status/', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === id
              ? {
                  ...row,
                  status: newStatus,
                  message:
                    newStatus === 'Approved' ? 'Approved successfully ✅' : newStatus === 'Rejected' ? 'Rejected successfully ❌' : '',
                }
              : row
          )
        );
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const cleanDataForCSV = (data) => {
    return data.map((row) => ({
      id: row.id,
      firstname: row.firstname,
      business_name: row.business_name,
      contact_email: row.contact_email,
      contact_phone: row.contact_phone,
      gst_number: row.gst_number,
      status: row.status,
      message: row.message,
      gst_certificate: row.gst_certificate ? row.gst_certificate.url : '',
      pan_card: row.pan_card ? row.pan_card.url : '',
      business_license: row.business_license ? row.business_license.url : '',
    }));
  };

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const cleanedData = cleanDataForCSV(rowData);
    const csv = generateCsv(csvConfig)(cleanedData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const cleanedData = cleanDataForCSV(rows);
    const csv = generateCsv(csvConfig)(cleanedData);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Vendor Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography><strong>Vendor ID:</strong> {selectedRow.id}</Typography>
                <Typography><strong>Name:</strong> {selectedRow.firstname}</Typography>
                <Typography><strong>Email:</strong> {selectedRow.contact_email}</Typography>
                <Typography><strong>Business Name:</strong> {selectedRow.business_name}</Typography>
                <Typography><strong>Contact Phone:</strong> {selectedRow.contact_phone}</Typography>
                <Typography><strong>GST Number:</strong> {selectedRow.gst_number}</Typography>
                <Typography><strong>Status:</strong> {selectedRow.status}</Typography>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  GST Certificate (PDF/Image)
                </Typography>
                <Typography sx={{ mb: 1, color: selectedRow.gst_certificate ? 'green' : 'red' }}>
                  Status: {selectedRow.gst_certificate ? 'Approved' : 'Not Approved'}
                </Typography>
                {selectedRow.gst_certificate && (
                  <Typography sx={{ mb: 1 }}>
                    Current File:{" "}
                    <a
                      href={selectedRow.gst_certificate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedRow.gst_certificate.name || "View GST Certificate"}
                    </a>
                  </Typography>
                )}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Business License/Registration Certificate (PDF/Image)
                </Typography>
                <Typography sx={{ mb: 1, color: selectedRow.business_license ? 'green' : 'red' }}>
                  Status: {selectedRow.business_license ? 'Approved' : 'Not Approved'}
                </Typography>
                {selectedRow.business_license && (
                  <Typography sx={{ mb: 1 }}>
                    Current File:{" "}
                    <a
                      href={selectedRow.business_license.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedRow.business_license.name || "View Business License"}
                    </a>
                  </Typography>
                )}
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  PAN Card (PDF/Image)
                </Typography>
                <Typography sx={{ mb: 1, color: selectedRow.pan_card ? 'green' : 'red' }}>
                  Status: {selectedRow.pan_card ? 'Approved' : 'Not Approved'}
                </Typography>
                {selectedRow.pan_card && (
                  <Typography sx={{ mb: 1 }}>
                    Current File:{" "}
                    <a
                      href={selectedRow.pan_card.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedRow.pan_card.name || "View PAN Card"}
                    </a>
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={() => handleApprove(selectedRow.id)}
          >
            Approve
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<CloseIcon />}
            onClick={() => handleReject(selectedRow.id)}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openFull} onClose={() => setOpenFull(false)} maxWidth="lg" fullScreen>
        <DialogTitle>Full Vendor Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Grid container spacing={3} sx={{ p: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Typography><strong>Vendor ID:</strong> {selectedRow.id}</Typography>
                <Typography><strong>Name:</strong> {selectedRow.firstname}</Typography>
                <Typography><strong>Email:</strong> {selectedRow.contact_email}</Typography>
                <Typography><strong>Business Name:</strong> {selectedRow.business_name}</Typography>
                <Typography><strong>Contact Phone:</strong> {selectedRow.contact_phone}</Typography>
                <Typography><strong>GST Number:</strong> {selectedRow.gst_number}</Typography>
                <Typography><strong>Status:</strong> {selectedRow.status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Documents</Typography>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  GST Certificate (PDF/Image)
                </Typography>
                <Typography sx={{ mb: 1, color: selectedRow.gst_certificate ? 'green' : 'red' }}>
                  Status: {selectedRow.gst_certificate ? 'Approved' : 'Not Approved'}
                </Typography>
                {selectedRow.gst_certificate && (
                  <Typography sx={{ mb: 2 }}>
                    Current File:{" "}
                    <a
                      href={selectedRow.gst_certificate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedRow.gst_certificate.name || "View GST Certificate"}
                    </a>
                  </Typography>
                )}
                <Typography variant="subtitle1">
                  Business License/Registration Certificate (PDF/Image)
                </Typography>
                <Typography sx={{ mb: 1, color: selectedRow.business_license ? 'green' : 'red' }}>
                  Status: {selectedRow.business_license ? 'Approved' : 'Not Approved'}
                </Typography>
                {selectedRow.business_license && (
                  <Typography sx={{ mb: 2 }}>
                    Current File:{" "}
                    <a
                      href={selectedRow.business_license.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedRow.business_license.name || "View Business License"}
                    </a>
                  </Typography>
                )}
                <Typography variant="subtitle1">
                  PAN Card (PDF/Image)
                </Typography>
                <Typography sx={{ mb: 1, color: selectedRow.pan_card ? 'green' : 'red' }}>
                  Status: {selectedRow.pan_card ? 'Approved' : 'Not Approved'}
                </Typography>
                {selectedRow.pan_card && (
                  <Typography sx={{ mb: 2 }}>
                    Current File:{" "}
                    <a
                      href={selectedRow.pan_card.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedRow.pan_card.name || "View PAN Card"}
                    </a>
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={() => handleApprove(selectedRow.id)}
          >
            Approve
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<CloseIcon />}
            onClick={() => handleReject(selectedRow.id)}
          >
            Reject
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenFull(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}