// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Button,
//   Card,
//   CardHeader,
//   CardContent,
//   Typography,
//   Box,
//   Avatar,
//   LinearProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   DialogActions,
// } from '@mui/material';
// import { LocationOn, Bloodtype, Person, AccessTime, LocalHospital, Phone } from '@mui/icons-material';
// import { format } from 'date-fns';
// import { getAllBloodNeedRequests } from '../services/BloodServices.jsx'; // Adjust path as needed

// const BloodRequestCard = ({ request }) => {
//   const urgency = Math.min((request.unitsNeeded / 5) * 100, 100); // Example urgency calculation

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Card className="w-[340px] bg-white/95 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
//         <CardHeader
//           avatar={<Avatar className="bg-red-500"><Bloodtype /></Avatar>}
//           title={<Typography variant="h6" className="font-bold text-gray-800">{request.location}</Typography>}
//           className="bg-gradient-to-r from-red-50 to-blue-50"
//         />
//         <CardContent className="p-6">
//           <Box className="flex items-center mb-3">
//             <Person className="text-blue-600 mr-2" />
//             <Typography variant="body2" className="text-gray-700">
//               {request.patientDetails}
//             </Typography>
//           </Box>
//           <Box className="flex items-center mb-3">
//             <Bloodtype className="text-red-600 mr-2" />
//             <Typography variant="body2" className="text-gray-700">
//               Blood Group: <span className="font-semibold">{request.bloodGroup}</span>
//             </Typography>
//           </Box>
//           <Box className="flex items-center mb-3">
//             <Bloodtype className="text-red-600 mr-2" />
//             <Typography variant="body2" className="text-gray-700">
//               Units Needed: <span className="font-semibold">{request.unitsNeeded}</span>
//             </Typography>
//           </Box>
//           <Box className="mb-3">
//             <Typography variant="caption" className="text-gray-500">Urgency</Typography>
//             <LinearProgress variant="determinate" value={urgency} className="h-2 rounded" color="error" />
//           </Box>
//           <Box className="flex items-center mb-4">
//             <AccessTime className="text-gray-500 mr-2" />
//             <Typography variant="caption" className="text-gray-500">
//               Posted: {request.postedDate}
//             </Typography>
//           </Box>
//           <Box className="flex items-center p-3 bg-red-100 rounded-lg">
//             <Phone className="text-red-600 mr-2" />
//             <Typography variant="body2" className="font-semibold text-red-700">
//               <a href={`tel:${request.phoneNumber}`} className="hover:underline">{request.phoneNumber}</a>
//             </Typography>
//           </Box>
//           <Button
//             variant="outlined"
//             color="error"
//             size="small"
//             className="mt-4 w-full border-red-600 text-red-600 hover:bg-red-50"
//             startIcon={<Phone />}
//             href={`tel:${request.phoneNumber}`}
//           >
//             Contact Now
//           </Button>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

// const BloodRequestsPage = () => {
//   const [requests, setRequests] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [newRequest, setNewRequest] = useState({
//     location: '',
//     patientDetails: '',
//     bloodGroup: '',
//     unitsNeeded: '',
//     phoneNumber: '',
//   });

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const data = await getAllBloodNeedRequests();
//         setRequests(
//           data.map((item) => ({
//             id: item.id,
//             location: item.location,
//             patientDetails: `${item.role_name.charAt(0).toUpperCase() + item.role_name.slice(1)} Patient`,
//             bloodGroup: item.blood_group,
//             unitsNeeded: item.blood_unit,
//             postedDate: format(new Date(item.created_at), 'MMMM d, yyyy, h:mm a'),
//             phoneNumber: item.contact_no,
//           }))
//         );
//       } catch (error) {
//         console.error('Error fetching requests:', error);
//       }
//     };
//     fetchRequests();
//   }, []);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRequest((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddRequest = () => {
//     if (
//       newRequest.location &&
//       newRequest.patientDetails &&
//       newRequest.bloodGroup &&
//       newRequest.unitsNeeded &&
//       newRequest.phoneNumber
//     ) {
//       setRequests((prev) => [
//         ...prev,
//         {
//           id: prev.length + 1,
//           ...newRequest,
//           postedDate: format(new Date(), 'MMMM d, yyyy, h:mm a'),
//         },
//       ]);
//       setNewRequest({
//         location: '',
//         patientDetails: '',
//         bloodGroup: '',
//         unitsNeeded: '',
//         phoneNumber: '',
//       });
//       handleClose();
//     } else {
//       alert('Please fill all fields.');
//     }
//   };

//   return (
//     <Box className="min-h-screen bg-gradient-to-br from-red-200 via-white to-blue-200 py-16">
//       <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <Box className="flex justify-between items-center mb-16">
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.8, ease: 'easeOut' }}
//           >
//             <Typography
//               variant="h3"
//               className="text-left font-extrabold text-5xl sm:text-6xl text-red-700 tracking-tight"
//             >
//               Urgent Blood Need Requests
//             </Typography>
//           </motion.div>
//           <motion.div
//             animate={{
//               scale: [1, 1.05, 1],
//               transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
//             }}
//           >
//             <Button
//               variant="contained"
//               color="error"
//               onClick={handleOpen}
//               className="text-xl font-bold bg-red-600 hover:bg-red-700 rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
//               startIcon={<Bloodtype className="text-2xl" />}
//             >
//               Add Blood Request
//             </Button>
//           </motion.div>
//         </Box>
//         <hr className="border-t-2 border-gray-300 mb-10" />
//         <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//           {requests.map((request) => (
//             <BloodRequestCard key={request.id} request={request} />
//           ))}
//         </Box>
//       </Box>
//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <DialogTitle className="bg-red-50">
//           <Typography variant="h6" className="font-bold text-gray-800">
//             Add New Blood Request
//           </Typography>
//         </DialogTitle>
//         <DialogContent className="pt-4">
//           <TextField
//             fullWidth
//             label="Location (e.g., City Hospital, New York)"
//             name="location"
//             value={newRequest.location}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//           />
//           <TextField
//             fullWidth
//             label="Patient Details (e.g., John Doe, Age 45, Male)"
//             name="patientDetails"
//             value={newRequest.patientDetails}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//           />
//           <TextField
//             fullWidth
//             label="Blood Group (e.g., O+)"
//             name="bloodGroup"
//             value={newRequest.bloodGroup}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//           />
//           <TextField
//             fullWidth
//             label="Units Needed (e.g., 2)"
//             name="unitsNeeded"
//             type="number"
//             value={newRequest.unitsNeeded}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//           />
//           <TextField
//             fullWidth
//             label="Phone Number (e.g., +1 (555) 123-4567)"
//             name="phoneNumber"
//             value={newRequest.phoneNumber}
//             onChange={handleInputChange}
//             margin="normal"
//             variant="outlined"
//           />
//         </DialogContent>
//         <DialogActions className="p-4">
//           <Button onClick={handleClose} color="inherit">
//             Cancel
//           </Button>
//           <Button onClick={handleAddRequest} variant="contained" color="error">
//             Submit Request
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default BloodRequestsPage;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { LocationOn, Bloodtype, Person, AccessTime, LocalHospital, Phone } from '@mui/icons-material';
import { format } from 'date-fns';
import { getAllBloodNeedRequests, AddBloodRequest } from '../services/BloodServices.jsx'; // Adjust path as needed

const BloodRequestCard = ({ request }) => {
  const urgency = Math.min((request.unitsNeeded / 5) * 100, 100); // Example urgency calculation

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-[340px] bg-white/95 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardHeader
          avatar={<Avatar className="bg-red-500"><Bloodtype /></Avatar>}
          title={<Typography variant="h6" className="font-bold text-gray-800">{request.location}</Typography>}
          className="bg-gradient-to-r from-red-50 to-blue-50"
        />
        <CardContent className="p-6">
          <Box className="flex items-center mb-3">
            <Person className="text-blue-600 mr-2" />
            <Typography variant="body2" className="text-gray-700">
              {request.patientDetails}
            </Typography>
          </Box>
          <Box className="flex items-center mb-3">
            <Bloodtype className="text-red-600 mr-2" />
            <Typography variant="body2" className="text-gray-700">
              Blood Group: <span className="font-semibold">{request.bloodGroup}</span>
            </Typography>
          </Box>
          <Box className="flex items-center mb-3">
            <Bloodtype className="text-red-600 mr-2" />
            <Typography variant="body2" className="text-gray-700">
              Units Needed: <span className="font-semibold">{request.unitsNeeded}</span>
            </Typography>
          </Box>
          <Box className="mb-3">
            <Typography variant="caption" className="text-gray-500">Urgency</Typography>
            <LinearProgress variant="determinate" value={urgency} className="h-2 rounded" color="error" />
          </Box>
          <Box className="flex items-center mb-4">
            <AccessTime className="text-gray-500 mr-2" />
            <Typography variant="caption" className="text-gray-500">
              Posted: {request.postedDate}
            </Typography>
          </Box>
          <Box className="flex items-center p-3 bg-red-100 rounded-lg">
            <Phone className="text-red-600 mr-2" />
            <Typography variant="body2" className="font-semibold text-red-700">
              <a href={`tel:${request.phoneNumber}`} className="hover:underline">{request.phoneNumber}</a>
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            size="small"
            className="mt-4 w-full border-red-600 text-red-600 hover:bg-red-50"
            startIcon={<Phone />}
            href={`tel:${request.phoneNumber}`}
          >
            Contact Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const BloodRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    location: '',
    patientDetails: '',
    bloodGroup: '',
    unitsNeeded: '',
    phoneNumber: '',
  });

  const fetchRequests = async () => {
    try {
      const data = await getAllBloodNeedRequests();
      setRequests(
        data.map((item) => ({
          id: item.id,
          location: item.location,
          patientDetails: `${item.role_name.charAt(0).toUpperCase() + item.role_name.slice(1)} Patient`,
          bloodGroup: item.blood_group,
          unitsNeeded: item.blood_unit,
          postedDate: format(new Date(item.created_at), 'MMMM d, yyyy, h:mm a'),
          phoneNumber: item.contact_no,
        }))
      );
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRequest = async () => {
    if (
      newRequest.location &&
      newRequest.patientDetails &&
      newRequest.bloodGroup &&
      newRequest.unitsNeeded &&
      newRequest.phoneNumber
    ) {
      const role_name = localStorage.getItem("role");
      const request_id = localStorage.getItem("vendorId");
      
      const payload = {
        request_id,
        role_name,
        location: newRequest.location,
        blood_group: newRequest.bloodGroup,
        blood_unit: parseInt(newRequest.unitsNeeded),
        contact_no: newRequest.phoneNumber,
        request_status: "open",
      };

      try {
        await AddBloodRequest(payload);
        await fetchRequests(); // Refetch to update list
        setNewRequest({
          location: '',
          patientDetails: '',
          bloodGroup: '',
          unitsNeeded: '',
          phoneNumber: '',
        });
        handleClose();
      } catch (error) {
        console.error('Error adding request:', error);
        alert('Error adding request. Please try again.');
      }
    } else {
      alert('Please fill all fields.');
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-red-200 via-white to-blue-200 py-16">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Box className="flex justify-between items-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Typography
              variant="h3"
              className="text-left font-extrabold text-5xl sm:text-6xl text-red-700 tracking-tight"
            >
              Urgent Blood Need Requests
            </Typography>
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={handleOpen}
              className="text-xl font-bold bg-red-600 hover:bg-red-700 rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300"
              startIcon={<Bloodtype className="text-2xl" />}
            >
              Add Blood Request
            </Button>
          </motion.div>
        </Box>
        <hr className="border-t-2 border-gray-300 mb-10" />
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {requests.map((request) => (
            <BloodRequestCard key={request.id} request={request} />
          ))}
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-red-50">
          <Typography variant="h6" className="font-bold text-gray-800">
            Add New Blood Request
          </Typography>
        </DialogTitle>
        <DialogContent className="pt-4">
          <TextField
            fullWidth
            label="Location (e.g., City Hospital, New York)"
            name="location"
            value={newRequest.location}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Patient Details (e.g., John Doe, Age 45, Male)"
            name="patientDetails"
            value={newRequest.patientDetails}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Blood Group (e.g., O+)"
            name="bloodGroup"
            value={newRequest.bloodGroup}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Units Needed (e.g., 2)"
            name="unitsNeeded"
            type="number"
            value={newRequest.unitsNeeded}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Phone Number (e.g., +1 (555) 123-4567)"
            name="phoneNumber"
            value={newRequest.phoneNumber}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined" 
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleAddRequest} variant="contained" color="error">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BloodRequestsPage;