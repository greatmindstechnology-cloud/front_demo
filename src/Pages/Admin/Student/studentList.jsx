import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Eye, X, Save, Mail, Phone, Award, Grid, List } from 'lucide-react';

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [viewMode, setViewMode] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editFormData, setEditFormData] = useState({});
    const [layoutMode, setLayoutMode] = useState('cards'); // 'cards' or 'table'

    useEffect(() => {
        fetch('https://backend-demo-esqk.onrender.com/admin_gmt/students/')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    setStudents(data.data);
                } else if (Array.isArray(data)) {
                    setStudents(data);
                } else {
                    setStudents([]);
                }
            })
            .catch(error => console.error('Error fetching students:', error));
    }, []);

    const handleView = async (student) => {
        try {
            const response = await fetch(`https://backend-demo-esqk.onrender.com/admin_gmt/student/?id=${student.id}`);
            if (response.ok) {
                const data = await response.json();
                const fullStudent = data.data ? data.data : data;
                setSelectedStudent(fullStudent);
                setViewMode('view');
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };

    const handleEdit = async (student) => {
        try {
            const response = await fetch(`https://backend-demo-esqk.onrender.com/admin_gmt/student/?id=${student.id}`);
            if (response.ok) {
                const data = await response.json();
                const fullStudent = data.data ? data.data : data;
                setSelectedStudent(fullStudent);
                setEditFormData(fullStudent);
                setViewMode('edit');
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
        }
    };

    const handleDelete = (id) => {
        setStudents(students.filter(s => s.id !== id));
    };

    const handleEditSubmit = async () => {
        try {
            const formData = new FormData();
            Object.entries(editFormData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            
            const response = await fetch(`https://backend-demo-esqk.onrender.com/admin_gmt/update/student/?email=${encodeURIComponent(editFormData.email)}`, {
                method: 'PUT',
                body: formData,
            });
            
            if (response.ok) {
                setStudents(students.map(s => (s.id === editFormData.id ? { ...s, ...editFormData } : s)));
                setViewMode(null);
                setSelectedStudent(null);
            }
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const filteredStudents = students.filter(s => 
        s.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.skills?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S';
    };

    return (
        <div className="min-h-screen bg-blue-50 p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-900 mb-2">Student Directory</h1>
                        <p className="text-blue-700">Manage and view all student profiles</p>
                    </div>
                    {/* Layout Toggle */}
                    <div className="flex gap-2 bg-white p-1 rounded-lg shadow-md border border-blue-200">
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
            </div>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-blue-300 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm transition-all bg-white"
                    />
                </div>
            </div>

            {/* Cards View */}
            {layoutMode === 'cards' && (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-200"
                        >
                            {/* Card Header */}
                            <div className="h-24 bg-blue-700 relative">
                                <div className="absolute -bottom-12 left-6">
                                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {getInitials(student.firstname)}
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="pt-16 px-6 pb-6">
                                <h3 className="text-xl font-bold text-blue-900 mb-1">{student.firstname}</h3>
                                <p className="text-sm text-blue-700 mb-4 flex items-center gap-1">
                                    <Mail size={14} />
                                    {student.email}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-blue-800">
                                        <Phone size={14} className="text-blue-600" />
                                        <span>{student.contact_number || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award size={14} className="text-blue-600" />
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                            {student.skills || 'No skills listed'}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4 border-t border-blue-200">
                                    <button
                                        onClick={() => handleView(student)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Eye size={16} />
                                        <span className="text-sm font-medium">View</span>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(student)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <Trash2 size={16} />
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
                                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                                    <th className="px-6 py-4 text-left font-semibold">Skills</th>
                                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student, index) => (
                                    <tr 
                                        key={student.id}
                                        className={`border-b border-blue-200 hover:bg-blue-50 transition-colors ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                                        }`}
                                    >
                                        <td className="px-6 py-4 text-blue-900 font-medium">{student.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                                    {getInitials(student.firstname)}
                                                </div>
                                                <span className="text-blue-900 font-medium">{student.firstname}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-blue-700">{student.email}</td>
                                        <td className="px-6 py-4 text-blue-700">{student.contact_number || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                {student.skills || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(student)}
                                                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
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

            {/* View/Edit Modal */}
            {viewMode && selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-blue-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {viewMode === 'view' ? <Eye size={24} /> : <Edit2 size={24} />}
                                <h2 className="text-2xl font-bold">
                                    {viewMode === 'view' ? 'Student Profile' : 'Edit Student'}
                                </h2>
                            </div>
                            <button
                                onClick={() => { setViewMode(null); setSelectedStudent(null); }}
                                className="hover:bg-blue-600 p-2 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            {/* Profile Section */}
                            <div className="flex flex-col items-center mb-8 pb-8 border-b border-blue-200">
                                <div className="w-32 h-32 rounded-full border-4 border-blue-600 shadow-xl mb-4 overflow-hidden bg-blue-100">
                                    <img
                                        src={`https://backend-demo-esqk.onrender.com/${selectedStudent.profile_picture}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-blue-900">{selectedStudent.firstname} {selectedStudent.lastname}</h3>
                                <p className="text-blue-700">{selectedStudent.designation || 'Student'}</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(selectedStudent).map(([key, value]) => {
                                    if (key === 'profile_picture') return null;
                                    
                                    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                    
                                    return (
                                        <div key={key} className="bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-colors">
                                            <label className="text-sm font-semibold text-blue-700 mb-2 block">
                                                {label}
                                            </label>
                                            {viewMode === 'view' ? (
                                                <p className="text-blue-900">{value || 'N/A'}</p>
                                            ) : (
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={editFormData[key] || ''}
                                                    onChange={(e) => setEditFormData({...editFormData, [e.target.name]: e.target.value})}
                                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-8 pt-6 border-t border-blue-200">
                                <button
                                    onClick={() => { setViewMode(null); setSelectedStudent(null); }}
                                    className="flex-1 px-6 py-3 bg-blue-100 text-blue-800 rounded-xl font-medium hover:bg-blue-200 transition-colors"
                                >
                                    {viewMode === 'view' ? 'Close' : 'Cancel'}
                                </button>
                                {viewMode === 'edit' && (
                                    <button
                                        onClick={handleEditSubmit}
                                        className="flex-1 px-6 py-3 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={20} />
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}   