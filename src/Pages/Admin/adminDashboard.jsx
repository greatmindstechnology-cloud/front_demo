import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { data } from 'autoprefixer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  // Data 1: Bar Chart
const [counts, setCounts] = useState({
  students: 0,
  trainers: 0,
  vendors: 0,
});

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

const barData = {
  labels: ['Students', 'Approved Trainers', 'Approved Vendors'],
  datasets: [
    {
      label: 'Available',
      data: [counts.students, counts.trainers, counts.vendors],
      backgroundColor: ['#3f51b5', '#f50057', '#00c853'],
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

  const [TrainerCounts, setTrainerCounts] = useState({
    approved : 0,
    rejected: 0,
    waiting: 0,
  });
  useEffect(() => {
    fetch('https://backend-demo-esqk.onrender.com/admin_gmt/trainer-status-counts/')
      .then(res => res.json())
      .then(data => {
        setTrainerCounts({
          approved: data.approved_trainers || 0,
          rejected: data.rejected_trainers || 0,
          waiting: data.waiting_trainers || 0,
        });
        console.log(data)
      })
      .catch(() => {});
  }, []);
  // Data 2: Doughnut Chart for Activation
  const TrainerdoughnutData = {
    labels: ['Approved', 'Rejected', 'Waiting'],
    datasets: [
      {
        data: [TrainerCounts.approved, TrainerCounts.rejected, TrainerCounts.waiting],
        backgroundColor: ['#00c853', '#d32f2f', '#ff8a80'], // Green, Red, Light Red
        hoverOffset: 4,
      },
    ],
  };

  const[VendorCounts, setVendorCounts] = useState({
    approved: 0,
    rejected: 0,
    waiting: 0,
  });

  useEffect(() => {
    fetch('https://backend-demo-esqk.onrender.com/admin_gmt/vendor-status-counts/')
      .then(res => res.json())
      .then(data => {
        setVendorCounts({
          approved: data.approved_vendors || 0,
          rejected: data.rejected_vendors || 0,
          waiting: data.waiting_vendors || 0,
        });
        console.log(data)
      })
      .catch(() => {});
  },[])

  const VendordoughnutData = {
    labels: ['Approved', 'Rejected', 'Waiting'],
    datasets: [
      {
        data: [VendorCounts.approved, VendorCounts.rejected, VendorCounts.waiting],  // You can change this to actual counts
        backgroundColor: ['#00c853', '#d32f2f', '#ff8a80'],
        hoverOffset: 4,
      },
    ],
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

  return (
    <div className="flex flex-col gap-10 justify-center items-center min-h-screen p-10 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
      {/* Dashboard Title */}
      <h1 className="text-4xl font-bold text-blue-800 mb-6 drop-shadow-lg tracking-wide">
        Admin Dashboard
      </h1>
      {/* Charts Grid */}
      <div className="flex flex-row gap-12 justify-center items-start w-full flex-wrap">
        {/* User Overview Group */}
        <div className="flex flex-col gap-8 items-center">
          {/* Bar Chart */}
          <div className="bg-white shadow-2xl rounded-3xl flex flex-col justify-center items-center w-96 h-[430px] p-6 border-2 border-blue-300 hover:scale-105 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">User Overview</h2>
            <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} style={{height: "300px"}} />
          </div>
        </div>
        {/* Status Group */}
        <div className="flex flex-col gap-8 items-center">
          {/* Trainer Doughnut */}
          <div className="bg-white shadow-2xl rounded-3xl flex flex-col justify-center items-center w-80 h-[340px] p-6 border-2 border-blue-200 hover:scale-105 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Trainer Status</h2>
            <Doughnut data={TrainerdoughnutData} options={{ ...TrainerdoughnutOptions, maintainAspectRatio: false }} style={{height: "220px", width: "220px"}}/>
          </div>
          {/* Vendor Doughnut */}
          <div className="bg-white shadow-2xl rounded-3xl flex flex-col justify-center items-center w-80 h-[340px] p-6 border-2 border-blue-200 hover:scale-105 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Vendor Status</h2>
            <Doughnut data={VendordoughnutData} options={{ ...VendordoughnutOptions, maintainAspectRatio: false }} style={{height: "220px", width: "220px"}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
