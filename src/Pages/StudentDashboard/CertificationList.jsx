import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

const mockData = [
  {
    id: 1,
    courseName: "React Basics",
    authorName: "John Doe",
    completionDate: "2024-10-12"
  },
  {
    id: 2,
    courseName: "Python Advanced",
    authorName: "Jane Smith",
    completionDate: "2024-11-05"
  },
  {
    id: 3,
    courseName: "Go Programming",
    authorName: "Alex Brown",
    completionDate: "2024-12-20"
  }
];

export default function CourseTable() {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
            <TableCell>S.No</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Author Name</TableCell>
            <TableCell>Completion Date</TableCell>
            <TableCell>Download</TableCell>
            <TableCell>View</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockData.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                '&:hover': {
                  backgroundColor: '#f1f1f1',
                },
              }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.courseName}</TableCell>
              <TableCell>{row.authorName}</TableCell>
              <TableCell>{row.completionDate}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => alert(`Downloading ${row.courseName}`)}>
                  <DownloadIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => alert(`Viewing ${row.courseName}`)}>
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
