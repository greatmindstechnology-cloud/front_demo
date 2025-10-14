import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    students: 0,
    trainers: 0,
    vendors: 0,
  });

  const [TrainerCounts, setTrainerCounts] = useState({
    approved: 0,
    rejected: 0,
    waiting: 0,
  });

  const [VendorCounts, setVendorCounts] = useState({
    approved: 0,
    rejected: 0,
    waiting: 0,
  });

  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [trainerCourseData, setTrainerCourseData] = useState({
    created: 0,
    approved: 0,
    waiting: 0
  });

  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendorEventData, setVendorEventData] = useState({
    internships: { created: 0, approved: 0, waiting: 0 },
    workshops: { created: 0, approved: 0, waiting: 0 }
  });

  const [csrData, setCsrData] = useState({
    totalEvents: 0,
    registeredParticipants: 0
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

  const totalCount = counts.students + counts.trainers + counts.vendors;

  const statsCards = [
    { label: 'Total Students', value: counts.students, bgColor: 'bg-blue-500', borderColor: 'border-blue-400' },
    { label: 'Approved Trainers', value: counts.trainers, bgColor: 'bg-blue-600', borderColor: 'border-blue-500' },
    { label: 'Approved Vendors', value: counts.vendors, bgColor: 'bg-blue-700', borderColor: 'border-blue-600' },
    { label: 'Total Count', value: totalCount, bgColor: 'bg-blue-800', borderColor: 'border-blue-700' }
  ];

  const barData = {
    labels: ['Students', 'Trainers', 'Vendors'],
    datasets: [
      {
        label: 'Count',
        data: [counts.students, counts.trainers, counts.vendors],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(34, 197, 94, 0.8)'],
        borderColor: ['rgb(59, 130, 246)', 'rgb(139, 92, 246)', 'rgb(34, 197, 94)'],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: 'User Distribution Overview', 
        font: { size: 15, weight: '600' },
        color: '#1e293b'
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      x: { 
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    }
  };

  const TrainerdoughnutData = {
    labels: ['Approved', 'Rejected', 'Waiting'],
    datasets: [
      {
        data: [TrainerCounts.approved, TrainerCounts.rejected, TrainerCounts.waiting],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(251, 191, 36, 0.8)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)', 'rgb(251, 191, 36)'],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const VendordoughnutData = {
    labels: ['Approved', 'Rejected', 'Waiting'],
    datasets: [
      {
        data: [VendorCounts.approved, VendorCounts.rejected, VendorCounts.waiting],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(251, 191, 36, 0.8)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)', 'rgb(251, 191, 36)'],
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          padding: 12, 
          font: { size: 11 },
          color: '#475569'
        } 
      },
      title: { 
        display: true, 
        text: title, 
        font: { size: 14, weight: '600' },
        color: '#1e293b'
      },
    },
  });

  const trainerCourseChartData = {
    labels: ['Created', 'Approved', 'Waiting'],
    datasets: [
      {
        data: [trainerCourseData.created, trainerCourseData.approved, trainerCourseData.waiting],
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(251, 191, 36, 0.8)'],
        borderColor: ['rgb(59, 130, 246)', 'rgb(34, 197, 94)', 'rgb(251, 191, 36)'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const trainerCoursePieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          padding: 15, 
          font: { size: 12 },
          color: '#475569',
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, i) => ({
              text: `${label}: ${data.datasets[0].data[i]}`,
              fillStyle: data.datasets[0].backgroundColor[i],
              hidden: false,
              index: i
            }));
          }
        } 
      },
      title: { 
        display: true, 
        text: 'Course Status Distribution', 
        font: { size: 15, weight: '600' },
        padding: 15,
        color: '#1e293b'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const vendorEventsChartData = {
    labels: ['Internships Created', 'Internships Approved', 'Internships Waiting', 'Workshops Created', 'Workshops Approved', 'Workshops Waiting'],
    datasets: [
      {
        label: 'Events',
        data: [
          vendorEventData.internships.created,
          vendorEventData.internships.approved,
          vendorEventData.internships.waiting,
          vendorEventData.workshops.created,
          vendorEventData.workshops.approved,
          vendorEventData.workshops.waiting
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(139, 92, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)'
        ],
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const csrChartData = {
    labels: ['Total CSR Events', 'Registered Participants'],
    datasets: [
      {
        data: [csrData.totalEvents, csrData.registeredParticipants],
        backgroundColor: ['rgba(236, 72, 153, 0.8)', 'rgba(14, 165, 233, 0.8)'],
        borderColor: ['rgb(236, 72, 153)', 'rgb(14, 165, 233)'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Administrative Dashboard
          </h1>
          <p className="text-slate-600 text-base">System Analytics and Management Overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-6 text-white shadow-md border ${stat.borderColor} hover:shadow-lg transition-shadow duration-200`}
            >
              <p className="text-sm opacity-80 mb-1 uppercase tracking-wide">{stat.label}</p>
              <p className="text-4xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="h-80">
              <Doughnut data={TrainerdoughnutData} options={doughnutOptions('Trainer Status Overview')} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="h-80">
              <Doughnut data={VendordoughnutData} options={doughnutOptions('Vendor Status Overview')} />
            </div>
          </div>
        </div>

        {/* Trainer Courses Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-5 pb-3 border-b border-gray-200">
            Trainer Course Analytics
          </h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Trainer</label>
            <div className="relative">
              <select
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
                className="w-full md:w-96 px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 appearance-none bg-white cursor-pointer text-sm"
              >
                <option value="">Select a trainer</option>
                <option value="trainer1">John Doe</option>
                <option value="trainer2">Jane Smith</option>
                <option value="trainer3">Mike Johnson</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
          {selectedTrainer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-80 flex items-center justify-center">
                <Pie data={trainerCourseChartData} options={trainerCoursePieOptions} />
              </div>
              <div className="flex flex-col justify-center gap-4">
                <div className="bg-blue-600 rounded-lg p-5 text-white shadow-sm border border-blue-500">
                  <p className="text-xs opacity-80 mb-1 uppercase tracking-wide">Created Courses</p>
                  <p className="text-4xl font-bold">{trainerCourseData.created}</p>
                </div>
                <div className="bg-green-600 rounded-lg p-5 text-white shadow-sm border border-green-500">
                  <p className="text-xs opacity-80 mb-1 uppercase tracking-wide">Approved Courses</p>
                  <p className="text-4xl font-bold">{trainerCourseData.approved}</p>
                </div>
                <div className="bg-amber-500 rounded-lg p-5 text-white shadow-sm border border-amber-400">
                  <p className="text-xs opacity-80 mb-1 uppercase tracking-wide">Waiting Courses</p>
                  <p className="text-4xl font-bold">{trainerCourseData.waiting}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vendor Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-5 pb-3 border-b border-gray-200">
            Vendor Events Management
          </h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Vendor</label>
            <div className="relative">
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full md:w-96 px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-slate-500 appearance-none bg-white cursor-pointer text-sm"
              >
                <option value="">Select a vendor</option>
                <option value="vendor1">Tech Corp Ltd</option>
                <option value="vendor2">Innovation Hub</option>
                <option value="vendor3">Digital Solutions Inc</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>
          {selectedVendor && (
            <div className="h-96">
              <Bar data={vendorEventsChartData} options={{ 
                ...barOptions, 
                plugins: { 
                  ...barOptions.plugins, 
                  legend: { display: false },
                  title: { 
                    display: true, 
                    text: 'Internships and Workshops Status Distribution', 
                    font: { size: 15, weight: '600' },
                    color: '#1e293b'
                  } 
                } 
              }} />
            </div>
          )}
        </div>

        {/* CSR Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-5 pb-3 border-b border-gray-200">
            CSR Events Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80">
              <Pie data={csrChartData} options={doughnutOptions('CSR Events and Participation')} />
            </div>
            <div className="flex flex-col justify-center gap-5">
              <div className="bg-pink-600 rounded-lg p-6 text-white shadow-sm border border-pink-500">
                <p className="text-xs opacity-80 mb-1 uppercase tracking-wide">Total CSR Events</p>
                <p className="text-5xl font-bold">{csrData.totalEvents}</p>
              </div>
              <div className="bg-sky-600 rounded-lg p-6 text-white shadow-sm border border-sky-500">
                <p className="text-xs opacity-80 mb-1 uppercase tracking-wide">Registered Participants</p>
                <p className="text-5xl font-bold">{csrData.registeredParticipants}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;