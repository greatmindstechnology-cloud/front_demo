// import React, { useState, useEffect } from 'react';
// import { Search, Eye, X, Check, Grid, List, DollarSign, Calendar, User, Clock, CheckCircle } from 'lucide-react';
// import { format } from 'date-fns';

// export default function PaymentApproval() {
//     const [payments, setPayments] = useState([]);
//     const [selectedPayment, setSelectedPayment] = useState(null);
//     const [viewMode, setViewMode] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [layoutMode, setLayoutMode] = useState('swipe');
//     const [filterStatus, setFilterStatus] = useState('all');

//     // Fetch payments
//     useEffect(() => {
//         fetch('https://backend-demo-esqk.onrender.com/admin_gmt/payments/') // Replace with your API
//             .then((res) => res.json())
//             .then((result) => {
//                 const data = Array.isArray(result.data) ? result.data : [];
//                 const updatedData = data.map((row, idx) => ({
//                     id: row.id || idx + 1,
//                     payment_type: row.payment_type || 'Unknown',
//                     amount_paid: row.amount_paid || 0,
//                     payment_approval: row.payment_approval || 'pending',
//                     payment_date: row.payment_date || new Date().toISOString(),
//                     payer_id: row.payer_id || 'N/A',
//                     payer_name: row.payer_name || `Payer ${row.payer_id || idx + 1}`,
//                 }));
//                 setPayments(updatedData);
//             })
//             .catch((err) => console.error('Error fetching payments:', err));
//     }, []);

//     // Approve payment
//     const handleApprove = async (paymentId) => {
//         try {
//             const formData = new FormData();
//             formData.append('id', paymentId);
//             formData.append('payment_approval', 'approved');

//             const response = await fetch('https://backend-demo-esqk.onrender.com/admin_gmt/update-payment-status/', {
//                 method: 'PUT',
//                 body: formData,
//             });

//             if (response.ok) {
//                 setPayments(prev =>
//                     prev.map(p => p.id === paymentId ? { ...p, payment_approval: 'approved' } : p)
//                 );
//             }
//         } catch (error) {
//             console.error('Network error:', error);
//         }
//     };

//     const handleView = (payment) => {
//         setSelectedPayment(payment);
//         setViewMode(true);
//     };

//     // Filters
//     const filteredPayments = payments.filter(p => {
//         const matchesSearch =
//             p.payer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             p.payment_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             p.amount_paid?.toString().includes(searchTerm);

//         const matchesFilter = filterStatus === 'all' || p.payment_approval?.toLowerCase() === filterStatus;
//         return matchesSearch && matchesFilter;
//     });

//     const getInitials = (name) => {
//         return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P';
//     };

//     const getStatusColor = (status) => {
//         return status?.toLowerCase() === 'approved'
//             ? 'bg-green-100 text-green-800 border-green-300'
//             : 'bg-yellow-100 text-yellow-800 border-yellow-300';
//     };

//     const pendingCount = payments.filter(p => p.payment_approval?.toLowerCase() === 'pending').length;
//     const approvedCount = payments.filter(p => p.payment_approval?.toLowerCase() === 'approved').length;

//     const formatDate = (dateStr) => {
//         try {
//             return format(new Date(dateStr), 'dd MMM yyyy, hh:mm a');
//         } catch {
//             return 'Invalid Date';
//         }
//     };

//     return (
//         <div className="min-h-screen bg-blue-50 p-8">
//             {/* Header */}
//             <div className="max-w-7xl mx-auto mb-8">
//                 <div className="flex justify-between items-center mb-6">
//                     <div>
//                         <h1 className="text-4xl font-bold text-blue-900 mb-2">Payment Approval Center</h1>
//                         <p className="text-blue-700">Review and approve incoming payments</p>
//                     </div>
//                     <div className="flex gap-2 bg-white p-1 rounded-lg shadow-md border border-blue-200">
//                         <button
//                             onClick={() => setLayoutMode('swipe')}
//                             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
//                                 layoutMode === 'swipe' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'
//                             }`}
//                         >
//                             <DollarSign size={18} />
//                             <span className="font-medium">Swipe</span>
//                         </button>
//                         <button
//                             onClick={() => setLayoutMode('cards')}
//                             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
//                                 layoutMode === 'cards' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'
//                             }`}
//                         >
//                             <Grid size={18} />
//                             <span className="font-medium">Cards</span>
//                         </button>
//                         <button
//                             onClick={() => setLayoutMode('table')}
//                             className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
//                                 layoutMode === 'table' ? 'bg-blue-700 text-white' : 'text-blue-700 hover:bg-blue-100'
//                             }`}
//                         >
//                             <List size={18} />
//                             <span className="font-medium">Table</span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                     <div className="bg-white rounded-xl p-4 border-l-4 border-yellow-500 shadow-md">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600 font-medium">Pending</p>
//                                 <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
//                             </div>
//                             <Clock className="text-yellow-500" size={40} />
//                         </div>
//                     </div>
//                     <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 shadow-md">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600 font-medium">Approved</p>
//                                 <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
//                             </div>
//                             <CheckCircle className="text-green-500" size={40} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Search & Filter */}
//             <div className="max-w-7xl mx-auto mb-8">
//                 <div className="flex gap-4 flex-col md:flex-row">
//                     <div className="relative flex-1">
//                         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
//                         <input
//                             type="text"
//                             placeholder="Search by payer ID, amount, or type..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-12 pr-4 py-4 rounded-xl border border-blue-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm transition-all bg-white"
//                         />
//                     </div>
//                     <select
//                         value={filterStatus}
//                         onChange={(e) => setFilterStatus(e.target.value)}
//                         className="px-6 py-4 rounded-xl border border-blue-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm bg-white text-blue-900 font-medium"
//                     >
//                         <option value="all">All Status</option>
//                         <option value="pending">Pending</option>
//                         <option value="approved">Approved</option>
//                     </select>
//                 </div>
//             </div>

//             {/* Swipe View */}
//             {layoutMode === 'swipe' && (
//                 <div className="max-w-2xl mx-auto">
//                     {filteredPayments.length > 0 ? (
//                         <div className="relative">
//                             {filteredPayments.slice(0, 3).map((payment, index) => (
//                                 <div
//                                     key={payment.id}
//                                     className={`bg-white rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden transition-all duration-300 ${
//                                         index === 0 ? 'relative z-30' : index === 1 ? 'absolute top-4 left-4 right-4 z-20 opacity-50' : 'absolute top-8 left-8 right-8 z-10 opacity-25'
//                                     }`}
//                                     style={{ transform: `scale(${1 - index * 0.05})` }}
//                                 >
//                                     {index === 0 && (
//                                         <>
//                                             <div className="h-48 bg-gradient-to-br from-green-600 to-green-800 relative flex items-center justify-center">
//                                                 <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-green-700 text-5xl font-bold shadow-xl">
//                                                     {getInitials(payment.payer_name)}
//                                                 </div>
//                                             </div>

//                                             <div className="p-8">
//                                                 <div className="text-center mb-6">
//                                                     <h2 className="text-3xl font-bold text-green-900 mb-2">₹{payment.amount_paid}</h2>
//                                                     <p className="text-green-600 text-lg">Payment #{payment.id}</p>
//                                                 </div>

//                                                 <div className="space-y-4 mb-8">
//                                                     <div className="bg-green-50 rounded-xl p-4 flex items-start gap-3">
//                                                         <User className="text-green-600 mt-1" size={20} />
//                                                         <div>
//                                                             <p className="text-xs font-semibold text-green-700 mb-1">Payer</p>
//                                                             <p className="text-green-900">{payment.payer_name} ({payment.payer_id})</p>
//                                                         </div>
//                                                     </div>
//                                                     <div className="bg-green-50 rounded-xl p-4 flex items-start gap-3">
//                                                         <DollarSign className="text-green-600 mt-1" size={20} />
//                                                         <div>
//                                                             <p className="text-xs font-semibold text-green-700 mb-1">Type</p>
//                                                             <p className="text-green-900">{payment.payment_type}</p>
//                                                         </div>
//                                                     </div>
//                                                     <div className="bg-green-50 rounded-xl p-4 flex items-start gap-3">
//                                                         <Calendar className="text-green-600 mt-1" size={20} />
//                                                         <div>
//                                                             <p className="text-xs font-semibold text-green-700 mb-1">Date</p>
//                                                             <p className="text-green-900 font-bold text-lg">{formatDate(payment.payment_date)}</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="flex gap-4">
//                                                     <button
//                                                         onClick={() => handleView(payment)}
//                                                         className="flex-1 px-6 py-4 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-all flex items-center justify-center gap-2"
//                                                     >
//                                                         <Eye size={24} />
//                                                         View Details
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleApprove(payment.id)}
//                                                         className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg"
//                                                     >
//                                                         <Check size={24} />
//                                                         Approve
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//                             <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
//                             <h3 className="text-2xl font-bold text-gray-800 mb-2">All Payments Approved!</h3>
//                             <p className="text-gray-600">No pending approvals</p>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Cards View */}
//             {layoutMode === 'cards' && (
//                 <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredPayments.map((payment) => (
//                         <div key={payment.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-200">
//                             <div className="h-24 bg-green-700 relative">
//                                 <div className="absolute -bottom-12 left-6">
//                                     <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
//                                         {getInitials(payment.payer_name)}
//                                     </div>
//                                 </div>
//                                 <div className="absolute top-4 right-4">
//                                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.payment_approval)} border-2`}>
//                                         {payment.payment_approval?.toUpperCase()}
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="pt-16 px-6 pb-6">
//                                 <h3 className="text-xl font-bold text-green-900 mb-1">₹{payment.amount_paid}</h3>
//                                 <p className="text-sm text-green-700 mb-4 flex items-center gap-1">
//                                     <User size={14} /> {payment.payer_id}
//                                 </p>

//                                 <div className="space-y-2 mb-4">
//                                     <div className="flex items-center gap-2 text-sm text-green-800">
//                                         <DollarSign size={14} className="text-green-600" />
//                                         <span>{payment.payment_type}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2 text-xs text-green-600">
//                                         <Calendar size={14} />
//                                         <span>{formatDate(payment.payment_date)}</span>
//                                     </div>
//                                 </div>

//                                 <div className="flex gap-2 pt-4 border-t border-green-200">
//                                     <button
//                                         onClick={() => handleView(payment)}
//                                         className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                                         title="View"
//                                     >
//                                         <Eye size={16} />
//                                     </button>
//                                     <button
//                                         onClick={() => handleApprove(payment.id)}
//                                         className="flex-1 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                                         title="Approve"
//                                     >
//                                         <Check size={16} />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Table View */}
//             {layoutMode === 'table' && (
//                 <div className="max-w-7xl mx-auto">
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-200">
//                         <table className="w-full">
//                             <thead className="bg-green-700 text-white">
//                                 <tr>
//                                     <th className="px-6 py-4 text-left font-semibold">ID</th>
//                                     <th className="px-6 py-4 text-left font-semibold">Payer</th>
//                                     <th className="px-6 py-4 text-left font-semibold">Type</th>
//                                     <th className="px-6 py-4 text-left font-semibold">Amount</th>
//                                     <th className="px-6 py-4 text-left font-semibold">Date</th>
//                                     <th className="px-6 py-4 text-center font-semibold">Status</th>
//                                     <th className="px-6 py-4 text-center font-semibold">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {filteredPayments.map((payment, index) => (
//                                     <tr
//                                         key={payment.id}
//                                         className={`border-b border-green-200 hover:bg-green-50 transition-colors ${
//                                             index % 2 === 0 ? 'bg-white' : 'bg-green-50'
//                                         }`}
//                                     >
//                                         <td className="px-6 py-4 text-green-900 font-medium">#{payment.id}</td>
//                                         <td className="px-6 py-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
//                                                     {getInitials(payment.payer_name)}
//                                                 </div>
//                                                 <div>
//                                                     <p className="text-green-900 font-medium">{payment.payer_name}</p>
//                                                     <p className="text-xs text-green-600">ID: {payment.payer_id}</p>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 text-green-700">{payment.payment_type}</td>
//                                         <td className="px-6 py-4 text-green-900 font-bold">₹{payment.amount_paid}</td>
//                                         <td className="px-6 py-4 text-green-700 text-sm">{formatDate(payment.payment_date)}</td>
//                                         <td className="px-6 py-4 text-center">
//                                             <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.payment_approval)}`}>
//                                                 {payment.payment_approval?.toUpperCase()}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <div className="flex justify-center gap-2">
//                                                 <button
//                                                     onClick={() => handleView(payment)}
//                                                     className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                                                     title="View"
//                                                 >
//                                                     <Eye size={16} />
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleApprove(payment.id)}
//                                                     className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                                                     title="Approve"
//                                                 >
//                                                     <Check size={16} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}

//             {/* View Modal */}
//             {viewMode && selectedPayment && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90VH] overflow-y-auto shadow-2xl">
//                         <div className="sticky top-0 bg-green-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
//                             <div className="flex items-center gap-3">
//                                 <DollarSign size={24} />
//                                 <h2 className="text-2xl font-bold">Payment Details</h2>
//                             </div>
//                             <button
//                                 onClick={() => { setViewMode(false); setSelectedPayment(null); }}
//                                 className="hover:bg-green-600 p-2 rounded-lg transition-colors"
//                             >
//                                 <X size={24} />
//                             </button>
//                         </div>

//                         <div className="p-8">
//                             <div className="flex flex-col items-center mb-8 pb-8 border-b border-green-200">
//                                 <div className="w-32 h-32 rounded-full bg-green-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-4 border-4 border-green-200">
//                                     {getInitials(selectedPayment.payer_name)}
//                                 </div>
//                                 <h3 className="text-3xl font-bold text-green-900 mb-2">₹{selectedPayment.amount_paid}</h3>
//                                 <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedPayment.payment_approval)} border-2`}>
//                                     {selectedPayment.payment_approval?.toUpperCase()}
//                                 </span>
//                             </div>

//                             <div className="grid grid-cols-1 gap-6">
//                                 <div className="bg-green-50 rounded-xl p-4">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <User className="text-green-600" size={18} />
//                                         <label className="text-sm font-semibold text-green-700">Payer</label>
//                                     </div>
//                                     <p className="text-green-900 ml-7">{selectedPayment.payer_name} (ID: {selectedPayment.payer_id})</p>
//                                 </div>

//                                 <div className="bg-green-50 rounded-xl p-4">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <DollarSign className="text-green-600" size={18} />
//                                         <label className="text-sm font-semibold text-green-700">Payment Type</label>
//                                     </div>
//                                     <p className="text-green-900 ml-7">{selectedPayment.payment_type}</p>
//                                 </div>

//                                 <div className="bg-green-50 rounded-xl p-4">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <Calendar className="text-green-600" size={18} />
//                                         <label className="text-sm font-semibold text-green-700">Payment Date</label>
//                                     </div>
//                                     <p className="text-green-900 ml-7">{formatDate(selectedPayment.payment_date)}</p>
//                                 </div>
//                             </div>

//                             <div className="flex gap-4 mt-8 pt-6 border-t border-green-200">
//                                 <button
//                                     onClick={() => { handleApprove(selectedPayment.id); setViewMode(false); }}
//                                     className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
//                                 >
//                                     <Check size={20} />
//                                     Approve Payment
//                                 </button>
//                                 <button
//                                     onClick={() => { setViewMode(false); setSelectedPayment(null); }}
//                                     className="flex-1 px-6 py-3 bg-green-100 text-green-800 rounded-xl font-medium hover:bg-green-200 transition-colors"
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  X,
  Check,
  Grid,
  List,
  DollarSign,
  Calendar,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

// Dummy Data
const DUMMY_PAYMENTS = [
  {
    id: 1,
    payment_type: "Course Fee",
    amount_paid: 24999,
    payment_approval: "pending",
    payment_date: "2025-10-28T14:30:00",
    payer_id: "STU1001",
    payer_name: "Aarav Sharma",
  },
  {
    id: 2,
    payment_type: "Internship Deposit",
    amount_paid: 5000,
    payment_approval: "pending",
    payer_id: "STU1002",
    payer_name: "Priya Patel",
  },
  {
    id: 3,
    payment_type: "Workshop Fee",
    amount_paid: 999,
    payment_approval: "approved",
    payment_date: "2025-10-25T09:15:00",
    payer_id: "STU1003",
    payer_name: "Rohan Verma",
  },
  {
    id: 4,
    payment_type: "UPI Transfer",
    amount_paid: 15000,
    payment_approval: "pending",
    payer_id: "STU1004",
    payer_name: "Sneha Gupta",
  },
  {
    id: 5,
    payment_type: "Bank Transfer",
    amount_paid: 35000,
    payment_approval: "approved",
    payment_date: "2025-10-20T11:45:00",
    payer_id: "STU1005",
    payer_name: "Vikram Singh",
  },
  {
    id: 6,
    payment_type: "Credit Card",
    amount_paid: 8000,
    payment_approval: "pending",
    payer_id: "STU1006",
    payer_name: "Ananya Reddy",
  },
  {
    id: 7,
    payment_type: "Course Fee",
    amount_paid: 19999,
    payment_approval: "pending",
    payer_id: "STU1007",
    payer_name: "Karan Malhotra",
  },
  {
    id: 8,
    payment_type: "Internship Full",
    amount_paid: 20000,
    payment_approval: "approved",
    payment_date: "2025-10-18T16:20:00",
    payer_id: "STU1008",
    payer_name: "Ishaan Mehta",
  },
  {
    id: 9,
    payment_type: "Seminar Ticket",
    amount_paid: 499,
    payment_approval: "pending",
    payer_id: "STU1009",
    payer_name: "Diya Kapoor",
  },
  {
    id: 10,
    payment_type: "Net Banking",
    amount_paid: 27500,
    payment_approval: "approved",
    payment_date: "2025-10-15T13:10:00",
    payer_id: "STU1010",
    payer_name: "Arjun Desai",
  },
];

export default function PaymentApproval() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [layoutMode, setLayoutMode] = useState("cards"); // default: cards
  const [filterStatus, setFilterStatus] = useState("all");

  // Load dummy data
  useEffect(() => {
    setPayments(DUMMY_PAYMENTS);
  }, []);

  // Approve payment
  const handleApprove = (paymentId) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId ? { ...p, payment_approval: "approved" } : p
      )
    );
  };

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setViewMode(true);
  };

  // Filters
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.payer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.payment_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.amount_paid?.toString().includes(searchTerm) ||
      p.payer_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      p.payment_approval?.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "P"
    );
  };

  const getStatusColor = (status) => {
    return status?.toLowerCase() === "approved"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  const pendingCount = payments.filter(
    (p) => p.payment_approval?.toLowerCase() === "pending"
  ).length;
  const approvedCount = payments.filter(
    (p) => p.payment_approval?.toLowerCase() === "approved"
  ).length;

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              Payment Approval Center
            </h1>
            <p className="text-blue-700">
              Review and approve incoming payments
            </p>
          </div>
          {/* Layout Toggle: Only Cards & Table */}
          <div className="flex gap-2 bg-white p-1 rounded-lg shadow-md border border-blue-200">
            <button
              onClick={() => setLayoutMode("cards")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                layoutMode === "cards"
                  ? "bg-blue-700 text-white"
                  : "text-blue-700 hover:bg-blue-100"
              }`}
            >
              <Grid size={18} />
              <span className="font-medium">Cards</span>
            </button>
            <button
              onClick={() => setLayoutMode("table")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                layoutMode === "table"
                  ? "bg-blue-700 text-white"
                  : "text-blue-700 hover:bg-blue-100"
              }`}
            >
              <List size={18} />
              <span className="font-medium">Table</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border-l-4 border-yellow-500 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
              </div>
              <Clock className="text-yellow-500" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {approvedCount}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={40} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by payer, ID, amount, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-blue-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm transition-all bg-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-4 rounded-xl border border-blue-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm bg-white text-blue-900 font-medium"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Cards View */}
      {layoutMode === "cards" && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-200"
            >
              <div className="h-24 bg-green-700 relative">
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(payment.payer_name)}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.payment_approval)} border-2`}
                  >
                    {payment.payment_approval?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="pt-16 px-6 pb-6">
                <h3 className="text-xl font-bold text-green-900 mb-1">
                  ₹{payment.amount_paid.toLocaleString()}
                </h3>
                <p className="text-sm text-green-700 mb-4 flex items-center gap-1">
                  <User size={14} /> {payment.payer_id}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <DollarSign size={14} className="text-green-600" />
                    <span>{payment.payment_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <Calendar size={14} />
                    <span>{formatDate(payment.payment_date)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-green-200">
                  <button
                    onClick={() => handleView(payment)}
                    className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleApprove(payment.id)}
                    className="flex-1 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Approve"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {layoutMode === "table" && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-green-200">
            <table className="w-full">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Payer</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className={`border-b border-green-200 hover:bg-green-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-green-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-green-900 font-medium">
                      #{payment.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(payment.payer_name)}
                        </div>
                        <div>
                          <p className="text-green-900 font-medium">
                            {payment.payer_name}
                          </p>
                          <p className="text-xs text-green-600">
                            ID: {payment.payer_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-green-700">
                      {payment.payment_type}
                    </td>
                    <td className="px-6 py-4 text-green-900 font-bold">
                      ₹{payment.amount_paid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-green-700 text-sm">
                      {formatDate(payment.payment_date)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.payment_approval)}`}
                      >
                        {payment.payment_approval?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleView(payment)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleApprove(payment.id)}
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewMode && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-green-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <DollarSign size={24} />
                <h2 className="text-2xl font-bold">Payment Details</h2>
              </div>
              <button
                onClick={() => {
                  setViewMode(false);
                  setSelectedPayment(null);
                }}
                className="hover:bg-green-600 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="flex flex-col items-center mb-8 pb-8 border-b border-green-200">
                <div className="w-32 h-32 rounded-full bg-green-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-4 border-4 border-green-200">
                  {getInitials(selectedPayment.payer_name)}
                </div>
                <h3 className="text-3xl font-bold text-green-900 mb-2">
                  ₹{selectedPayment.amount_paid.toLocaleString()}
                </h3>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedPayment.payment_approval)} border-2`}
                >
                  {selectedPayment.payment_approval?.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="text-green-600" size={18} />
                    <label className="text-sm font-semibold text-green-700">
                      Payer
                    </label>
                  </div>
                  <p className="text-green-900 ml-7">
                    {selectedPayment.payer_name} (ID: {selectedPayment.payer_id}
                    )
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-green-600" size={18} />
                    <label className="text-sm font-semibold text-green-700">
                      Payment Type
                    </label>
                  </div>
                  <p className="text-green-900 ml-7">
                    {selectedPayment.payment_type}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="text-green-600" size={18} />
                    <label className="text-sm font-semibold text-green-700">
                      Payment Date
                    </label>
                  </div>
                  <p className="text-green-900 ml-7">
                    {formatDate(selectedPayment.payment_date)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-green-200">
                <button
                  onClick={() => {
                    handleApprove(selectedPayment.id);
                    setViewMode(false);
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Approve Payment
                </button>
                <button
                  onClick={() => {
                    setViewMode(false);
                    setSelectedPayment(null);
                  }}
                  className="flex-1 px-6 py-3 bg-green-100 text-green-800 rounded-xl font-medium hover:bg-green-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
