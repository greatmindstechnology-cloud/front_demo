import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { TextField, Button, MenuItem, Grid, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';

function Csreporting() {
  const [filter, setFilter] = useState({ date: null, driveType: '', region: '' });
  const [metrics, setMetrics] = useState({ totalEvents: 0, participation: 0, impactCount: 0 });

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);

  const bloodDrives = [
    { id: '1', date: '2025-08-15', location: 'Community Center', organizer: 'Red Cross', region: 'North', participants: 50, impact: 100 },
    { id: '2', date: '2025-08-20', location: 'City Hospital', organizer: 'Versiti', region: 'South', participants: 30, impact: 60 },
    { id: '3', date: '2025-08-25', location: 'Local Clinic', organizer: 'Vitalant', region: 'West', participants: 40, impact: 80 },
  ];

  const treeEvents = [
    { id: '1', date: '2025-08-15', location: 'Community Park', organizer: 'Green Volunteers', region: 'East', participants: 20, impact: 200 },
    { id: '2', date: '2025-08-20', location: 'City Forest', organizer: 'Eco Warriors', region: 'North', participants: 25, impact: 250 },
    { id: '3', date: '2025-08-25', location: 'Local Reserve', organizer: 'Tree Guardians', region: 'South', participants: 15, impact: 150 },
  ];

  const speakerSubmissions = [
    { id: 1, type: 'CSR', name: 'John Doe', topic: 'Community Health', dateTime: new Date('2025-08-15'), status: 'Pending', submittedAt: '2025-08-10', region: 'North', impact: 50 },
    { id: 2, type: 'Awareness', name: 'Jane Smith', topic: 'Environmental Awareness', dateTime: new Date('2025-08-20'), status: 'Approved', submittedAt: '2025-08-12', region: 'South', impact: 70 },
  ];

  const driveTypes = ['Blood Drive', 'Tree Planting', 'Speaker Request'];
  const regions = ['North', 'South', 'East', 'West'];

  useEffect(() => {
    const allEvents = [...bloodDrives, ...treeEvents, ...speakerSubmissions];
    const filteredEvents = allEvents.filter(
      (event) =>
        (!filter.date || new Date(event.date || event.dateTime).toDateString() === filter.date?.toDateString()) &&
        (!filter.driveType || (event.type || (bloodDrives.includes(event) ? 'Blood Drive' : 'Tree Planting')) === filter.driveType) &&
        (!filter.region || event.region === filter.region)
    );

    const totalEvents = filteredEvents.length;
    const participation = filteredEvents.reduce((sum, event) => sum + (event.participants || 0), 0);
    const impactCount = filteredEvents.reduce((sum, event) => sum + (event.impact || 0), 0);

    setMetrics({ totalEvents, participation, impactCount });

    const ctxBar = document.getElementById('barChart')?.getContext('2d');
    const ctxPie = document.getElementById('pieChart')?.getContext('2d');
    const ctxLine = document.getElementById('lineChart')?.getContext('2d');

    if (barChartRef.current) {
      barChartRef.current.destroy();
      barChartRef.current = null;
    }
    if (pieChartRef.current) {
      pieChartRef.current.destroy();
      pieChartRef.current = null;
    }
    if (lineChartRef.current) {
      lineChartRef.current.destroy();
      lineChartRef.current = null;
    }

    if (ctxBar) {
      barChartRef.current = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: filteredEvents.map((e) => e.date || e.dateTime.toLocaleDateString()),
          datasets: [
            {
              label: 'Participants',
              data: filteredEvents.map((e) => e.participants || 0),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
        },
      });
    }

    if (ctxPie) {
      pieChartRef.current = new Chart(ctxPie, {
        type: 'pie',
        data: {
          labels: driveTypes,
          datasets: [
            {
              data: driveTypes.map((type) => filteredEvents.filter((e) => (e.type || (bloodDrives.includes(e) ? 'Blood Drive' : 'Tree Planting')) === type).length),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    if (ctxLine) {
      lineChartRef.current = new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: filteredEvents.map((e) => e.date || e.dateTime.toLocaleDateString()),
          datasets: [
            {
              label: 'Impact Count',
              data: filteredEvents.map((e) => e.impact || 0),
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
        },
      });
    }

    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
        barChartRef.current = null;
      }
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
        pieChartRef.current = null;
      }
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
        lineChartRef.current = null;
      }
    };
  }, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleDateChange = (newValue) => {
    setFilter({ ...filter, date: newValue });
  };

  const downloadExcel = () => {
    const allEvents = [...bloodDrives, ...treeEvents, ...speakerSubmissions];
    const data = allEvents.map((event) => ({
      ID: event.id,
      Type: event.type || (bloodDrives.includes(event) ? 'Blood Drive' : 'Tree Planting'),
      Date: event.date || event.dateTime?.toLocaleDateString(),
      Location: event.location || 'N/A',
      Organizer: event.organizer || 'N/A',
      Region: event.region,
      Participants: event.participants || 0,
      Impact: event.impact || 0,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CSR Report');
    XLSX.write(wb, 'CSR_Report.xlsx');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('CSR Report', 10, 10);
    doc.autoTable({
      head: [['ID', 'Type', 'Date', 'Location', 'Organizer', 'Region', 'Participants', 'Impact']],
      body: [...bloodDrives, ...treeEvents, ...speakerSubmissions].map((event) => [
        event.id,
        event.type || (bloodDrives.includes(event) ? 'Blood Drive' : 'Tree Planting'),
        event.date || event.dateTime?.toLocaleDateString(),
        event.location || 'N/A',
        event.organizer || 'N/A',
        event.region,
        event.participants || 0,
        event.impact || 0,
      ]),
    });
    doc.save('CSR_Report.pdf');
  };

  return (
    <Container maxWidth="lg" className="py-8 bg-gray-100 font-sans">
      <Typography variant="h4" className="text-center mb-6 text-blue-600 font-bold">
        CSR Reporting Dashboard
      </Typography>

      <Grid container spacing={2} className="mb-6 mt-4">
        <Grid xs={12} sm={4}>
          <Paper className="p-4 ms-3 me-3 text-center">
            <Typography variant="h6">Total Events</Typography>
            <Typography variant="h4">{metrics.totalEvents}</Typography>
          </Paper>
        </Grid>
        <Grid xs={12} sm={4} >
          <Paper className="p-4 ms-3 me-3 text-center">
            <Typography variant="h6">Participation</Typography>
            <Typography variant="h4">{metrics.participation}</Typography>
          </Paper>
        </Grid>
        <Grid xs={12} sm={4}>
          <Paper className="p-4  text-center">
            <Typography variant="h6">Impact Count</Typography>
            <Typography variant="h4">{metrics.impactCount}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} className="mb-6">
        <Grid xs={12} md={4} >
          <Paper className="p-5 ms-3 me-3" style={{ height: '400px' }} >
            <Typography variant="h6" className="mb-2">Participants by Event</Typography>
            <canvas id="barChart" style={{ height: '350px' }}></canvas>
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <Paper className="p-5 ms-3 me-3" style={{ height: '400px' }}>
            <Typography variant="h6" className="mb-2">Event Type Distribution</Typography>
            <canvas id="pieChart" style={{ height: '350px' }}></canvas>
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <Paper className="p-5" style={{ height: '400px' }}>
            <Typography variant="h6" className="mb-2">Impact Over Time</Typography>
            <canvas id="lineChart" style={{ height: '350px' }}></canvas>
          </Paper>
        </Grid>
      </Grid>

      {/* <Grid container spacing={2} className="mb-6">
        <Grid xs={12} sm={6}>
          <Button fullWidth variant="contained" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={downloadExcel}>
            Download Excel
          </Button>
        </Grid>
        <Grid xs={12} sm={6}>
          <Button fullWidth variant="contained" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={downloadPDF}>
            Download PDF
          </Button>
        </Grid>
      </Grid> */}

  
    </Container>
  );
}

export default Csreporting;



    {/* <TableContainer component={Paper} className="shadow-lg mb-6">
        <Typography variant="h6" className="p-4">Blood Drives</Typography>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-100">
              <TableCell className="font-semibold">Date</TableCell>
              <TableCell className="font-semibold">Location</TableCell>
              <TableCell className="font-semibold">Organizer</TableCell>
              <TableCell className="font-semibold">Region</TableCell>
              <TableCell className="font-semibold">Participants</TableCell>
              <TableCell className="font-semibold">Impact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bloodDrives.map((drive) => (
              <TableRow key={drive.id} className="hover:bg-gray-50">
                <TableCell>{drive.date}</TableCell>
                <TableCell>{drive.location}</TableCell>
                <TableCell>{drive.organizer}</TableCell>
                <TableCell>{drive.region}</TableCell>
                <TableCell>{drive.participants}</TableCell>
                <TableCell>{drive.impact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} className="shadow-lg mb-6">
        <Typography variant="h6" className="p-4">Tree Planting Events</Typography>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-100">
              <TableCell className="font-semibold">Date</TableCell>
              <TableCell className="font-semibold">Location</TableCell>
              <TableCell className="font-semibold">Organizer</TableCell>
              <TableCell className="font-semibold">Region</TableCell>
              <TableCell className="font-semibold">Participants</TableCell>
              <TableCell className="font-semibold">Impact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {treeEvents.map((event) => (
              <TableRow key={event.id} className="hover:bg-gray-50">
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.organizer}</TableCell>
                <TableCell>{event.region}</TableCell>
                <TableCell>{event.participants}</TableCell>
                <TableCell>{event.impact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper} className="shadow-lg">
        <Typography variant="h6" className="p-4">Speaker Submissions</Typography>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-100">
              <TableCell className="font-semibold">ID</TableCell>
              <TableCell className="font-semibold">Type</TableCell>
              <TableCell className="font-semibold">Name</TableCell>
              <TableCell className="font-semibold">Topic</TableCell>
              <TableCell className="font-semibold">Date & Time</TableCell>
              <TableCell className="font-semibold">Region</TableCell>
              <TableCell className="font-semibold">Impact</TableCell>
              <TableCell className="font-semibold">Status</TableCell>
              <TableCell className="font-semibold">Submitted At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {speakerSubmissions.map((submission) => (
              <TableRow key={submission.id} className="hover:bg-gray-50">
                <TableCell>{submission.id}</TableCell>
                <TableCell>{submission.type}</TableCell>
                <TableCell>{submission.name}</TableCell>
                <TableCell>{submission.topic}</TableCell>
                <TableCell>{submission.dateTime.toLocaleString()}</TableCell>
                <TableCell>{submission.region}</TableCell>
                <TableCell>{submission.impact}</TableCell>
                <TableCell>{submission.status}</TableCell>
                <TableCell>{submission.submittedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}