import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import adminAdd from '../../assets/AdminAdd.png';
import studentAdd from '../../assets/StudentAdd.png';
import trainerAdd from '../../assets/TrainerAdd.png';
import vendorAdd from '../../assets/VendorAdd.png';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';

const SuperAdminDashboard = () => {
  // State for counts
  const [counts, setCounts] = useState({
    students: 0,
    trainers: 0,
    vendors: 0,
  });
  const [adminCounts, setAdminCounts] = useState({
    admin: 0, 
  });
  
  const[adminForm, setAdminForm] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
  });

  const [studentForm, setStudentForm] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
    dob:'',
  });
  const [trainerForm, setTrainerForm] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
    total_experience_years: '',
  });
  const [vendorForm, setVendorForm] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
  });
  // Modal state for adding trainer
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  // Loading and error states for adding trainer
  const [trainerLoading, setTrainerLoading] = useState(false);
  const [trainerError, setTrainerError] = useState('');
  const [trainerSuccess, setTrainerSuccess] = useState(false);
  // Modal state for adding vendor
  const [showVendorModal, setShowVendorModal] = useState(false);
  // Loading and error states for adding vendor
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorError, setVendorError] = useState('');
  const [vendorSuccess, setVendorSuccess] = useState(false);

  // Modal state for adding student
  const [showStudentModal, setShowStudentModal] = useState(false);
  // Loading and error states for adding student
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState('');
  const [studentSuccess, setStudentSuccess] = useState(false);

  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState(false);
  // Modal state
  const [showAdminModal, setShowAdminModal] = useState(false);

  const [trainerCounts, setTrainerCounts] = useState({
    approved: 0,
    rejected: 0,
    waiting: 0,
  });

  const [vendorCounts, setVendorCounts] = useState({
    approved: 0,
    rejected: 0,
    waiting: 0,
  });

  // Chart refs
  const barChartRef = useRef(null);
  const trainerDoughnutRef = useRef(null);
  const vendorDoughnutRef = useRef(null);

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', adminForm.username);
    formData.append('email', adminForm.email);
    formData.append('password', adminForm.password);
    formData.append('phone_number', adminForm.mobile);

    setAdminLoading(true);
    setAdminError('');
    setAdminSuccess(false);

    fetch('https://backend-demo-esqk.onrender.com/super_admin_gmt/add/admin/', {
      method: 'POST',
      body: formData,
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Failed to add admin');
        }
        return res.json();
      })
      .then(() => {
        setAdminSuccess(true);
        setAdminForm({ username: '', email: '', password: '', mobile: '' });
        setTimeout(() => {
          setShowAdminModal(false);
          setAdminSuccess(false);
        }, 1500);
      })
      .catch(err => {
        setAdminError(err.message);
      })
      .finally(() => setAdminLoading(false));
  }
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', studentForm.username);
    formData.append('email', studentForm.email);
    formData.append('password', studentForm.password);
    formData.append('phone_number', studentForm.mobile);
    formData.append('date_of_birth', studentForm.dob);
    setStudentLoading(true);
    setStudentError('');
    setStudentSuccess(false);
    fetch('https://backend-demo-esqk.onrender.com/super_admin_gmt/add/student/', {
      method: 'POST',
      body: formData,
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Failed to add student');
        }
        return res.json();
      })
      .then(() => {
        setStudentSuccess(true);
        setStudentForm({ username: '', email: '', password: '', mobile: '', dob: '' });
        setTimeout(() => {
          setShowStudentModal(false);
          setStudentSuccess(false);
        }, 1500);
      })
      .catch(err => {
        setStudentError(err.message);
      })
      .finally(() => setStudentLoading(false));
  };
  const handleTrainerSubmit = (e) => {
    e.preventDefault(); 
    const formData = new FormData();
    formData.append('username', trainerForm.username);
    formData.append('email', trainerForm.email);
    formData.append('password', trainerForm.password);
    formData.append('phone_number', trainerForm.mobile);
    formData.append('total_experience_years', trainerForm.total_experience_years);
    setTrainerLoading(true);
    setTrainerError('');
    setTrainerSuccess(false);
    fetch('https://backend-demo-esqk.onrender.com/super_admin_gmt/add/trainer/', {
      method: 'POST',
      body: formData,
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Failed to add trainer');
        }
        return res.json();
      })
      .then(() => {
        setTrainerSuccess(true);
        setTrainerForm({ username: '', email: '', password: '', mobile: '' });
        setTimeout(() => {
          setShowTrainerModal(false);
          setTrainerSuccess(false);
        }, 1500);
      })
      .catch(err => {
        setTrainerError(err.message);
      })
      .finally(() => setTrainerLoading(false));
  };
  const handleVendorSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', vendorForm.username);
    formData.append('email', vendorForm.email);
    formData.append('password', vendorForm.password);
    formData.append('phone_number', vendorForm.mobile);
    setVendorLoading(true);
    setVendorError('');
    setVendorSuccess(false);
    fetch('https://backend-demo-esqk.onrender.com/super_admin_gmt/add/vendor/', {
      method: 'POST',
      body: formData,
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || 'Failed to add vendor');
        }
        return res.json();      
      })
      .then(() => {
        setVendorSuccess(true);
        setVendorForm({ username: '', email: '', password: '', mobile: '' });
        setTimeout(() => {
          setShowVendorModal(false);
          setVendorSuccess(false);
        }, 1500);
      })
      .catch(err => {
        setVendorError(err.message);
      })
      .finally(() => setVendorLoading(false));
  };
  // Chart instances
  const chartInstances = useRef({});

  // Fetch counts
  useEffect(() => {
    fetch('https://backend-demo-esqk.onrender.com/admin_gmt/user-category-counts/')
      .then(res => res.json())
      .then(data => {
        setCounts({
          students: data.total_students || 0,
          trainers: data.total_approved_trainers || 0,
          vendors: data.total_approved_vendors || 0,
        });
      })
      .catch(() => {});
  }, []);

  // Fetch admin counts
  useEffect(() => {
    fetch('https://backend-demo-esqk.onrender.com/super_admin_gmt/admin/count/')
      .then(res => res.json()) 
      .then(data => {
        setAdminCounts({
          admin: data.total_admins || 0,
        })
        console.log(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('https://backend-demo-esqk.onrender.com/admin_gmt/trainer-status-counts/')
      .then(res => res.json())
      .then(data => {
        setTrainerCounts({
          approved: data.approved_trainers || 0,
          rejected: data.rejected_trainers || 0,
          waiting: data.waiting_trainers || 0,
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('https://backend-demo-esqk.onrender.com/admin_gmt/vendor-status-counts/')
      .then(res => res.json())
      .then(data => {
        setVendorCounts({
          approved: data.approved_vendors || 0,
          rejected: data.rejected_vendors || 0,
          waiting: data.waiting_vendors || 0,
        });
      })
      .catch(() => {});
  }, []);

  // Chart data and options
  const barData = {
    labels: ['Students', 'Approved Trainers', 'Approved Vendors', 'Admins'],
    datasets: [
      {
        label: 'Available',
        data: [counts.students, counts.trainers, counts.vendors, adminCounts.admin],
        backgroundColor: ['#3f51b5', '#f50057', '#00c853','#00c853'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Dashboard Overview' },
    },
  };

  const trainerDoughnutData = {
    labels: ['Approved', 'Rejected', 'Waiting'],
    datasets: [
      {
        data: [trainerCounts.approved, trainerCounts.rejected, trainerCounts.waiting],
        backgroundColor: ['#00c853', '#d32f2f', '#ff8a80'],
        hoverOffset: 4,
      },
    ],
  };

  const vendorDoughnutData = {
    labels: ['Approved', 'Rejected', 'Waiting'],
    datasets: [
      {
        data: [vendorCounts.approved, vendorCounts.rejected, vendorCounts.waiting],
        backgroundColor: ['#00c853', '#d32f2f', '#ff8a80'],
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Activation Status' },
    },
  };

  const VendordoughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Vendor Activation Status',
      },
    },
  };
   const TrainerdoughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Trainer Activation Status',
      },
    },
  };
  // Draw charts
  useEffect(() => {
    // Bar Chart
    if (barChartRef.current) {
      if (chartInstances.current.bar) chartInstances.current.bar.destroy();
      chartInstances.current.bar = new Chart(barChartRef.current, {
        type: 'bar',
        data: barData,
        options: barOptions,
      });
    }
    // Trainer Doughnut
    if (trainerDoughnutRef.current) {
      if (chartInstances.current.trainer) chartInstances.current.trainer.destroy();
      chartInstances.current.trainer = new Chart(trainerDoughnutRef.current, {
        type: 'doughnut',
        data: trainerDoughnutData,
        options: TrainerdoughnutOptions,
      });
    }
    // Vendor Doughnut
    if (vendorDoughnutRef.current) {
      if (chartInstances.current.vendor) chartInstances.current.vendor.destroy();
      chartInstances.current.vendor = new Chart(vendorDoughnutRef.current, {
        type: 'doughnut',
        data: vendorDoughnutData,
        options: VendordoughnutOptions,
      });
    }
    // Cleanup
    return () => {
      Object.values(chartInstances.current).forEach(chart => chart && chart.destroy());
    };
    // eslint-disable-next-line
  }, [counts, trainerCounts, vendorCounts]);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#000' : '#fff',
            paper: prefersDarkMode ? '#121212' : '#fff',
          },
        },
      }),
    [prefersDarkMode],
  );
  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen flex flex-col">
      <h1 className="text-3xl font-extrabold mb-8 text-blue-900 tracking-tight text-center drop-shadow-lg">SuperAdmin Dashboard</h1>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {/* Add Admin Button */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex flex-col items-center shadow"
            onClick={() => setShowAdminModal(true)}
          >
            <img src={adminAdd} alt="Add Admin" className="mx-auto mb-2 drop-shadow" style={{ height: 48 }} />
            Add Admin
          </button>
        </div>
        {/* Add Student Button */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex flex-col items-center shadow"
            onClick={() => setShowStudentModal(true)}
          >
            <img src={studentAdd} alt="Add Student" className="mx-auto mb-2 drop-shadow" style={{ height: 48 }} />
            Add Student
          </button>
        </div>
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform">
          <button
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex flex-col items-center shadow"
            onClick={() => setShowTrainerModal(true)}
          >
            <img src={trainerAdd} alt="Add Trainer" className="mx-auto mb-2 drop-shadow" style={{ height: 48 }} />
            Add Trainer
          </button>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform">
          <button
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex flex-col items-center shadow"
            onClick={() => setShowVendorModal(true)}
          >
            <img src={vendorAdd} alt="Add Vendor" className="mx-auto mb-2 drop-shadow" style={{ height: 48 }} />
            Add Vendor
          </button>
        </div>
        {/* Modals remain unchanged */}
        {/* Trainer Add Modal */}
        {showTrainerModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowTrainerModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Add Trainer</h2>
              <form
                onSubmit={handleTrainerSubmit}
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  placeholder="Username"
                  className="border rounded px-3 py-2"
                  value={trainerForm.username}
                  onChange={e => setTrainerForm({ ...trainerForm, username: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border rounded px-3 py-2"
                  value={trainerForm.email}
                  onChange={e => setTrainerForm({ ...trainerForm, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border rounded px-3 py-2"
                  value={trainerForm.password}
                  onChange={e => setTrainerForm({ ...trainerForm, password: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="border rounded px-3 py-2"
                  value={trainerForm.mobile}
                  onChange={e => setTrainerForm({ ...trainerForm, mobile: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Experience (in years)"
                  className="border rounded px-3 py-2"
                  value={trainerForm.total_experience_years}
                  onChange={e => setTrainerForm({ ...trainerForm, total_experience_years: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  className="bg-pink-600 text-white rounded px-4 py-2 mt-2 hover:bg-pink-700"
                  disabled={trainerLoading}
                >
                  {trainerLoading ? "Adding..." : "Add Trainer"}
                </button>
                {trainerError && (
                  <div className="text-red-500 text-sm mt-2">{trainerError}</div>
                )}
                {trainerSuccess && (
                  <div className="text-green-600 text-sm mt-2">Trainer added successfully!</div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Vendor Add Modal */}
        {showVendorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowVendorModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Add Vendor</h2>
              <form
                onSubmit={handleVendorSubmit}
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  placeholder="Username"
                  className="border rounded px-3 py-2"
                  value={vendorForm.username}
                  onChange={e => setVendorForm({ ...vendorForm, username: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border rounded px-3 py-2"
                  value={vendorForm.email}
                  onChange={e => setVendorForm({ ...vendorForm, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border rounded px-3 py-2"
                  value={vendorForm.password}
                  onChange={e => setVendorForm({ ...vendorForm, password: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="border rounded px-3 py-2"
                  value={vendorForm.mobile}
                  onChange={e => setVendorForm({ ...vendorForm, mobile: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-600 text-white rounded px-4 py-2 mt-2 hover:bg-yellow-700"
                  disabled={vendorLoading}
                >
                  {vendorLoading ? "Adding..." : "Add Vendor"}
                </button>
                {vendorError && (
                  <div className="text-red-500 text-sm mt-2">{vendorError}</div>
                )}
                {vendorSuccess && (
                  <div className="text-green-600 text-sm mt-2">Vendor added successfully!</div>
                )}
              </form>
            </div>
          </div>
        )}
        {showAdminModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowAdminModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Add Admin</h2>
              <form
                onSubmit={handleAdminSubmit}
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  placeholder="Username"
                  className="border rounded px-3 py-2"
                  value={adminForm.username}
                  onChange={e => setAdminForm({ ...adminForm, username: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border rounded px-3 py-2"
                  value={adminForm.email}
                  onChange={e => setAdminForm({ ...adminForm, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border rounded px-3 py-2"
                  value={adminForm.password}
                  onChange={e => setAdminForm({ ...adminForm, password: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="border rounded px-3 py-2"
                  value={adminForm.mobile}
                  onChange={e => setAdminForm({ ...adminForm, mobile: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded px-4 py-2 mt-2 hover:bg-blue-700"
                  disabled={adminLoading}
                >
                  {adminLoading ? "Adding..." : "Add Admin"}
                </button>
                {adminError && (
                  <div className="text-red-500 text-sm mt-2">{adminError}</div>
                )}
                {adminSuccess && (
                  <div className="text-green-600 text-sm mt-2">Admin added successfully!</div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Student Add Modal */}
        {showStudentModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowStudentModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Add Student</h2>
              <form
                onSubmit={handleStudentSubmit}
                className="flex flex-col gap-3"
              >
                <input
                  type="text"
                  placeholder="Username"
                  className="border rounded px-3 py-2"
                  value={studentForm.username}
                  onChange={e => setStudentForm({ ...studentForm, username: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border rounded px-3 py-2"
                  value={studentForm.email}
                  onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border rounded px-3 py-2"
                  value={studentForm.password}
                  onChange={e => setStudentForm({ ...studentForm, password: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="border rounded px-3 py-2"
                  value={studentForm.mobile}
                  onChange={e => setStudentForm({ ...studentForm, mobile: e.target.value })}
                  required
                />
                <input
                  type="date"
                  placeholder="Data of Birth"
                  className="border rounded px-3 py-2"
                  value={studentForm.dob}
                  onChange={e => setStudentForm({ ...studentForm, dob: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white rounded px-4 py-2 mt-2 hover:bg-green-700"
                  disabled={studentLoading}
                >
                  {studentLoading ? "Adding..." : "Add Student"}
                </button>
                {studentError && (
                  <div className="text-red-500 text-sm mt-2">{studentError}</div>
                )}
                {studentSuccess && (
                  <div className="text-green-600 text-sm mt-2">Student added successfully!</div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Graphs Section */}
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center mb-8 border border-blue-100">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4 tracking-wide">User Overview</h2>
        <div className="w-full max-w-2xl mx-auto">
          <canvas ref={barChartRef} height={120}></canvas>
        </div>
      </div>
      {/* Doughnut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center border border-pink-100">
          <h3 className="text-lg font-semibold text-pink-700 mb-4">Trainer Activation Status</h3>
          <div className="w-56 h-56 flex items-center justify-center">
            <canvas ref={trainerDoughnutRef} height={180}></canvas>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center border border-yellow-100">
          <h3 className="text-lg font-semibold text-yellow-700 mb-4">Vendor Activation Status</h3>
          <div className="w-56 h-56 flex items-center justify-center">
            <canvas ref={vendorDoughnutRef} height={180}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;