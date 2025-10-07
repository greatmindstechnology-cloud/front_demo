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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';

const columnHelper = createMRTColumnHelper();

const columns = [
  columnHelper.accessor('title', {
    header: 'Internship Title',
    size: 200,
  }),
  columnHelper.accessor('company_name', {
    header: 'Company Name',
    size: 200,
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    size: 150,
  }),
  columnHelper.accessor('mode', {
    header: 'Mode',
    size: 100,
  }),
  columnHelper.accessor('start_date', {
    header: 'Start Date',
    size: 120,
  }),
  columnHelper.accessor('application_deadline', {
    header: 'Application Deadline',
    size: 150,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 120,
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    size: 150,
  }),
  columnHelper.accessor('updated_at', {
    header: 'Updated At',
    size: 150,
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
    header: 'Update Status',
    size: 150,
    Cell: ({ row }) => (
      <select
        value={row.original.status || 'pending'}
        onChange={(event) => row.original.handleStatusChange(event, row.original.id)}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <option value="pending">Pending</option>
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

export default function Approvedinternship() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openFull, setOpenFull] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const BASE_URL = "https://backend-demo-esqk.onrender.com/";

  useEffect(() => {
    fetch(`https://backend-demo-esqk.onrender.com/vendor_gmt/vendor-internships/`)
      .then((res) => res.json())
      .then((result) => {
        const data = Array.isArray(result.internships) ? result.internships : [];
        const updatedData = data.map((row, idx) => ({
          id: row.id || idx,
          title: row.title || '',
          company_name: row.company_name || '',
          location: row.location || '',
          mode: row.mode || '',
          duration: row.duration || '',
          start_date: row.start_date || '',
          application_deadline: row.application_deadline || '',
          stipend: row.stipend || '',
          skills_required: row.skills_required || [],
          eligibility_criteria: row.eligibility_criteria || '',
          number_of_openings: row.number_of_openings || 0,
          contact_info: row.contact_info || '',
          category: row.category || '',
          application_process: row.application_process || '',
          status: row.status || 'pending',
          created_at: row.created_at || '',
          updated_at: row.updated_at || '',
          message: '',
          handleView: handleView,
          handleFullView: handleFullView,
          handleStatusChange: handleStatusChange,
          ...row,
        }));
        setRows(updatedData);
      })
      .catch((err) => {
        console.error('Error fetching internships:', err);
      });
  }, []);

  const handleApprove = async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('status', 'approved');

      const response = await fetch(`https://backend-demo-esqk.onrender.com/vendor_gmt/update-internship-status/`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === id
              ? { ...row, status: 'approved', message: 'Approved successfully ✅' }
              : row
          )
        );
      } else {
        console.error('Failed to approve internship.');
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
      formData.append('status', 'rejected');

      const response = await fetch(`https://backend-demo-esqk.onrender.com/vendor_gmt/update-internship-status/`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === id
              ? { ...row, status: 'rejected', message: 'Rejected successfully ❌' }
              : row
          )
        );
      } else {
        console.error('Failed to reject internship.');
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

      const response = await fetch(`https://backend-demo-esqk.onrender.com/vendor_gmt/update-internship-status/`, {
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
                    newStatus === 'approved' ? 'Approved successfully ✅' : newStatus === 'rejected' ? 'Rejected successfully ❌' : '',
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
      title: row.title,
      company_name: row.company_name,
      location: row.location,
      mode: row.mode,
      duration: row.duration,
      start_date: row.start_date,
      application_deadline: row.application_deadline,
      stipend: row.stipend,
      skills_required: row.skills_required.join(', '),
      eligibility_criteria: row.eligibility_criteria,
      number_of_openings: row.number_of_openings,
      contact_info: row.contact_info,
      category: row.category,
      application_process: row.application_process,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
      message: row.message,
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
        <DialogTitle>Internship Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography><strong>Internship ID:</strong> {selectedRow.id}</Typography>
                <Typography><strong>Title:</strong> {selectedRow.title}</Typography>
                <Typography><strong>Company Name:</strong> {selectedRow.company_name}</Typography>
                <Typography><strong>Location:</strong> {selectedRow.location}</Typography>
                <Typography><strong>Mode:</strong> {selectedRow.mode}</Typography>
                <Typography><strong>Start Date:</strong> {selectedRow.start_date}</Typography>
                <Typography><strong>Application Deadline:</strong> {selectedRow.application_deadline}</Typography>
                <Typography><strong>Status:</strong> {selectedRow.status}</Typography>
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
        <DialogTitle>Full Internship Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Grid container spacing={3} sx={{ p: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Typography><strong>Internship ID:</strong> {selectedRow.id}</Typography>
                <Typography><strong>Title:</strong> {selectedRow.title}</Typography>
                <Typography><strong>Company Name:</strong> {selectedRow.company_name}</Typography>
                <Typography><strong>Location:</strong> {selectedRow.location}</Typography>
                <Typography><strong>Mode:</strong> {selectedRow.mode}</Typography>
                <Typography><strong>Duration:</strong> {selectedRow.duration}</Typography>
                <Typography><strong>Start Date:</strong> {selectedRow.start_date}</Typography>
                <Typography><strong>Application Deadline:</strong> {selectedRow.application_deadline}</Typography>
                <Typography><strong>Stipend:</strong> {selectedRow.stipend}</Typography>
                <Typography><strong>Status:</strong> {selectedRow.status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Additional Details</Typography>
                <Typography><strong>Skills Required:</strong> {selectedRow.skills_required.join(', ')}</Typography>
                <Typography><strong>Eligibility Criteria:</strong> {selectedRow.eligibility_criteria}</Typography>
                <Typography><strong>Number of Openings:</strong> {selectedRow.number_of_openings}</Typography>
                <Typography><strong>Contact Info:</strong> {selectedRow.contact_info}</Typography>
                <Typography><strong>Category:</strong> {selectedRow.category}</Typography>
                <Typography><strong>Application Process:</strong> {selectedRow.application_process}</Typography>
                <Typography><strong>Created At:</strong> {selectedRow.created_at}</Typography>
                <Typography><strong>Updated At:</strong> {selectedRow.updated_at}</Typography>
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