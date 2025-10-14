import React, { useState, useEffect } from 'react';
import { Search, Eye, X, Check, XCircle, Grid, List, User, Mail, Phone, Award, Clock, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function TrainerApproval() {
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [layoutMode, setLayoutMode] = useState('swipe');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetch('https://backend-demo-esqk.onrender.com/admin_gmt/trainers/')
            .then((res) => res.json())
            .then((result) => {
                const data = Array.isArray(result.data) ? result.data : [];
                const updatedData = data.map((row, idx) => ({
                    id: row.id || idx,
                    firstname: (row.first_name || '').trim(),
                    contact_email: (row.email || '').trim(),
                    contact_phone: (row.phone_number || '').trim(),
                    experience: row.total_experience_years || '',
                    status: row.status || 'waiting',
                    message: '',
                }));
                setTrainers(updatedData);
            })
            .catch((err) => {
                console.error('Error fetching trainers:', err);
            });
    }, []);

    const handleStatusChange = async (trainerId, newStatus) => {
        try {
            const formData = new FormData();
            formData.append('id', trainerId);
            formData.append('status', newStatus);

            const response = await fetch('https://backend-demo-esqk.onrender.com/admin_gmt/update-trainer-status/', {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                setTrainers(prev =>
                    prev.map(trainer =>
                        trainer.id === trainerId
                            ? { 
                                ...trainer, 
                                status: newStatus, 
                                message: newStatus === 'approved' ? 'Approved ✅' : newStatus === 'rejected' ? 'Rejected ❌' : '' 
                              }
                            : trainer
                    )
                );
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const handleView = (trainer) => {
        setSelectedTrainer(trainer);
        setViewMode(true);
    };

    const filteredTrainers = trainers.filter(t => {
        const matchesSearch = t.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.experience?.toString().includes(searchTerm);
        
        const matchesFilter = filterStatus === 'all' || t.status?.toLowerCase() === filterStatus;
        
        return matchesSearch && matchesFilter;
    });

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'T';
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-800 border-green-300';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        }
    };

    const pendingCount = trainers.filter(t => t.status?.toLowerCase() === 'waiting').length;
    const approvedCount = trainers.filter(t => t.status?.toLowerCase() === 'approved').length;
    const rejectedCount = trainers.filter(t => t.status?.toLowerCase() === 'rejected').length;

    return (
        <div className="min-h-screen bg-blue-50 p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-900 mb-2">Trainer Approval Center</h1>
                        <p className="text-blue-700">Review and manage trainer applications</p>
                    </div>
                    {/* Layout Toggle */}
                    <div className="flex gap-2 bg-white p-1 rounded-lg shadow-md border border-blue-200">
                        <button
                            onClick={() => setLayoutMode('swipe')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                layoutMode === 'swipe' 
                                    ? 'bg-blue-700 text-white' 
                                    : 'text-blue-700 hover:bg-blue-100'
                            }`}
                        >
                            <ThumbsUp size={18} />
                            <span className="font-medium">Swipe</span>
                        </button>
                        <button
                            onClick={() => setLayoutMode('cards')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                layoutMode === 'cards' 
                                    ? 'bg-blue-700 text-white' 
                                    : 'text-blue-700 hover:bg-blue-100'
                            }`}
                        >
                            <Grid size={18} />
                            <span className="font-medium">Cards</span>
                        </button>
                        <button
                            onClick={() => setLayoutMode('table')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                                layoutMode === 'table' 
                                    ? 'bg-blue-700 text-white' 
                                    : 'text-blue-700 hover:bg-blue-100'
                            }`}
                        >
                            <List size={18} />
                            <span className="font-medium">Table</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border-l-4 border-yellow-500 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Pending Review</p>
                                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                            </div>
                            <Clock className="text-yellow-500" size={40} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Approved</p>
                                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                            </div>
                            <CheckCircle className="text-green-500" size={40} />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-l-4 border-red-500 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Rejected</p>
                                <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
                            </div>
                            <AlertCircle className="text-red-500" size={40} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex gap-4 flex-col md:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or experience..."
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
                        <option value="waiting">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Swipe View - Tinder-style */}
            {layoutMode === 'swipe' && (
                <div className="max-w-2xl mx-auto">
                    {filteredTrainers.length > 0 ? (
                        <div className="relative">
                            {filteredTrainers.slice(0, 3).map((trainer, index) => (
                                <div
                                    key={trainer.id}
                                    className={`bg-white rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden transition-all duration-300 ${
                                        index === 0 ? 'relative z-30' : index === 1 ? 'absolute top-4 left-4 right-4 z-20 opacity-50' : 'absolute top-8 left-8 right-8 z-10 opacity-25'
                                    }`}
                                    style={{ transform: `scale(${1 - index * 0.05})` }}
                                >
                                    {index === 0 && (
                                        <>
                                            {/* Profile Header */}
                                            <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 relative flex items-center justify-center">
                                                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-blue-700 text-5xl font-bold shadow-xl">
                                                    {getInitials(trainer.firstname)}
                                                </div>
                                            </div>

                                            {/* Profile Info */}
                                            <div className="p-8">
                                                <div className="text-center mb-6">
                                                    <h2 className="text-3xl font-bold text-blue-900 mb-2">{trainer.firstname}</h2>
                                                    <p className="text-blue-600 text-lg">Trainer Application #{trainer.id}</p>
                                                </div>

                                                <div className="space-y-4 mb-8">
                                                    <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                                                        <Mail className="text-blue-600 mt-1" size={20} />
                                                        <div>
                                                            <p className="text-xs font-semibold text-blue-700 mb-1">Email</p>
                                                            <p className="text-blue-900">{trainer.contact_email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                                                        <Phone className="text-blue-600 mt-1" size={20} />
                                                        <div>
                                                            <p className="text-xs font-semibold text-blue-700 mb-1">Phone</p>
                                                            <p className="text-blue-900">{trainer.contact_phone || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                                                        <Award className="text-blue-600 mt-1" size={20} />
                                                        <div>
                                                            <p className="text-xs font-semibold text-blue-700 mb-1">Experience</p>
                                                            <p className="text-blue-900 font-bold text-lg">{trainer.experience} years</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => handleStatusChange(trainer.id, 'rejected')}
                                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                                                    >
                                                        <XCircle size={24} />
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleView(trainer)}
                                                        className="px-6 py-4 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-all"
                                                    >
                                                        <Eye size={24} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(trainer.id, 'approved')}
                                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
                                                    >
                                                        <Check size={24} />
                                                        Approve
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
                            <p className="text-gray-600">No pending applications to review</p>
                        </div>
                    )}
                </div>
            )}

            {/* Cards View */}
            {layoutMode === 'cards' && (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrainers.map((trainer) => (
                        <div
                            key={trainer.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-200"
                        >
                            <div className="h-24 bg-blue-700 relative">
                                <div className="absolute -bottom-12 left-6">
                                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {getInitials(trainer.firstname)}
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trainer.status)} border-2`}>
                                        {trainer.status?.toUpperCase() || 'WAITING'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-16 px-6 pb-6">
                                <h3 className="text-xl font-bold text-blue-900 mb-1">{trainer.firstname}</h3>
                                <p className="text-sm text-blue-700 mb-4 flex items-center gap-1">
                                    <Mail size={14} />
                                    {trainer.contact_email}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-blue-800">
                                        <Phone size={14} className="text-blue-600" />
                                        <span>{trainer.contact_phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award size={14} className="text-blue-600" />
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            {trainer.experience} years
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-blue-200">
                                    <button
                                        onClick={() => handleStatusChange(trainer.id, 'rejected')}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleView(trainer)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(trainer.id, 'approved')}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
            {layoutMode === 'table' && (
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-200">
                        <table className="w-full">
                            <thead className="bg-blue-700 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                                    <th className="px-6 py-4 text-left font-semibold">Phone</th>
                                    <th className="px-6 py-4 text-left font-semibold">Experience</th>
                                    <th className="px-6 py-4 text-center font-semibold">Status</th>
                                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrainers.map((trainer, index) => (
                                    <tr 
                                        key={trainer.id}
                                        className={`border-b border-blue-200 hover:bg-blue-50 transition-colors ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                                        }`}
                                    >
                                        <td className="px-6 py-4 text-blue-900 font-medium">{trainer.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                                    {getInitials(trainer.firstname)}
                                                </div>
                                                <span className="text-blue-900 font-medium">{trainer.firstname}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-blue-700">{trainer.contact_email}</td>
                                        <td className="px-6 py-4 text-blue-700">{trainer.contact_phone || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                {trainer.experience} years
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trainer.status)}`}>
                                                {trainer.status?.toUpperCase() || 'WAITING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(trainer.id, 'rejected')}
                                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleView(trainer)}
                                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(trainer.id, 'approved')}
                                                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
            {viewMode && selectedTrainer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-blue-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <User size={24} />
                                <h2 className="text-2xl font-bold">Trainer Details</h2>
                            </div>
                            <button
                                onClick={() => { setViewMode(false); setSelectedTrainer(null); }}
                                className="hover:bg-blue-600 p-2 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex flex-col items-center mb-8 pb-8 border-b border-blue-200">
                                <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-4 border-4 border-blue-200">
                                    {getInitials(selectedTrainer.firstname)}
                                </div>
                                <h3 className="text-2xl font-bold text-blue-900 mb-2">{selectedTrainer.firstname}</h3>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedTrainer.status)} border-2`}>
                                    {selectedTrainer.status?.toUpperCase() || 'WAITING'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Mail className="text-blue-600" size={18} />
                                        <label className="text-sm font-semibold text-blue-700">Email Address</label>
                                    </div>
                                    <p className="text-blue-900 ml-7">{selectedTrainer.contact_email}</p>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Phone className="text-blue-600" size={18} />
                                        <label className="text-sm font-semibold text-blue-700">Phone Number</label>
                                    </div>
                                    <p className="text-blue-900 ml-7">{selectedTrainer.contact_phone || 'N/A'}</p>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award className="text-blue-600" size={18} />
                                        <label className="text-sm font-semibold text-blue-700">Experience</label>
                                    </div>
                                    <p className="text-blue-900 ml-7">{selectedTrainer.experience} years</p>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="text-blue-600" size={18} />
                                        <label className="text-sm font-semibold text-blue-700">Application Status</label>
                                    </div>
                                    <p className="text-blue-900 ml-7">{selectedTrainer.status || 'Waiting'}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-6 border-t border-blue-200">
                                <button
                                    onClick={() => { handleStatusChange(selectedTrainer.id, 'approved'); setViewMode(false); }}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={20} />
                                    Approve
                                </button>
                                <button
                                    onClick={() => { handleStatusChange(selectedTrainer.id, 'rejected'); setViewMode(false); }}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <XCircle size={20} />
                                    Reject
                                </button>
                                <button
                                    onClick={() => { setViewMode(false); setSelectedTrainer(null); }}
                                    className="flex-1 px-6 py-3 bg-blue-100 text-blue-800 rounded-xl font-medium hover:bg-blue-200 transition-colors"
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