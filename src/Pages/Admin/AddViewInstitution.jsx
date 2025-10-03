import React from 'react';
import AddInstitute from '../../components/Add-View-Edit Institutions/AddInstitute';
import EditInstitute from '../../components/Add-View-Edit Institutions/EditInstitute';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TextField from '@mui/material/TextField';
import { listInstitutions } from '../../services/institutionsService';

export default function AddViewInstitution() {
  const [institutions, setInstitutions] = React.useState([]);

  React.useEffect(() => {
    async function fetchInstitutions() {
      try {
        const data = await listInstitutions();
        setInstitutions(data);
      } catch (error) {
        console.error('Failed to fetch institutions:', error);
      }
    }
    fetchInstitutions();
  }, []);

  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState('name');
  const [sortOrder, setSortOrder] = React.useState('asc');

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredInstitutions = institutions
    .filter((inst) =>
      Object.values(inst)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div style={{ padding: '16px', position: 'relative', zIndex: 0 }}>
      <h1 style={{ color: '#2e8644', fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>
        Institutions
      </h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', zIndex: 0 }}>
        <AddInstitute />
        <EditInstitute />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <TextField
          label="Search Institutions"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          style={{ width: '25.5rem' }}
        />
      </div>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <TableContainer component={Paper} style={{ minWidth: 800, zIndex: 0 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  { label: 'Name', key: 'name' },
                  { label: 'Type', key: 'type' },
                  { label: 'City', key: 'city' },
                  { label: 'State', key: 'state' },
                  { label: 'Street', key: 'street' },
                  { label: 'Contact Number', key: 'contactNumber' },
                  { label: 'Contact Email', key: 'contactEmail' },
                ].map((col) => (
                  <TableCell
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{ cursor: 'pointer', fontWeight: sortBy === col.key ? 'bold' : 'normal', zIndex: 0 }}
                  >
                    {col.label}
                    {sortBy === col.key ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInstitutions.map((inst, idx) => (
                <TableRow key={idx}>
                  <TableCell>{inst.name}</TableCell>
                  <TableCell>{inst.type_of_institution}</TableCell>
                  <TableCell>{inst.city}</TableCell>
                  <TableCell>{inst.state}</TableCell>
                  <TableCell>{inst.street}</TableCell>
                  <TableCell>{inst.contact_number}</TableCell>
                  <TableCell>{inst.contact_email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}