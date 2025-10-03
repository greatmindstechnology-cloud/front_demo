import React, { useState } from 'react';
import { SiMysql } from "react-icons/si";


// Mock domains data (replace with API fetch)
const mockDomains = [
  { id: 1, name: 'Full-Stack Developer', color: 'from-red-400 to-red-600', icon: '💻' },
  { id: 2, name: 'Data Scientist', color: 'from-green-400 to-green-600', icon: '📄' },
  { id: 3, name: 'Machine Learning Engineer', color: 'from-blue-400 to-blue-600', icon: '⚙️' },
  { id: 4, name: 'SQL Developer', color: 'from-purple-400 to-purple-600', icon: <SiMysql /> },
];

// Predefined 1-hour time slots from 9 AM to 5 PM
const timeSlots = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
];

// Mock request status data (replace with API)
const mockRequests = [
  { id: 1, domain: 'Fitness', day: 'Monday', time: '09:00-10:00', status: 'pending' },
  { id: 2, domain: 'Yoga', day: 'Tuesday', time: '10:00-11:00', status: 'approved' },
  { id: 3, domain: 'Coding', day: 'Friday', time: '14:00-15:00', status: 'rejected' },
];

const StudentInterview = () => {
  const [selectedDomainId, setSelectedDomainId] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [viewMode, setViewMode] = useState('apply'); // 'apply' or 'requests'
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDomainClick = (domainId) => {
    setSelectedDomainId(selectedDomainId === domainId ? null : domainId);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotClick = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleRequest = (domainName) => {
    if (!selectedTimeSlot) {
      alert('Please select a time slot.');
      return;
    }
    const requestData = {
      domain: domainName,
      day: selectedDay,
      time: selectedTimeSlot,
    };
    console.log('Interview request:', requestData);
    alert(`Interview requested for ${domainName} on ${selectedDay} at ${selectedTimeSlot}`);
    setSelectedDomainId(null);
    setSelectedTimeSlot(null);
  };

  const toggleView = () => {
    setViewMode(viewMode === 'apply' ? 'requests' : 'apply');
    setSelectedDomainId(null);
  };

  const handleClearRequests = () => {
    alert('Clearing all requests (mock action).');
    // Simulate API call to clear requests
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            {viewMode === 'apply' ? 'Apply for Interview' : 'My Interview Requests'}
          </h1>
          <button
            onClick={toggleView}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-2 rounded-full hover:from-gray-700 hover:to-gray-900 transition-all text-sm font-semibold"
          >
            {viewMode === 'apply' ? 'View My Requests' : 'Back to Apply'}
          </button>
        </div>

        {viewMode === 'apply' ? (
          <div className="space-y-6">
            {mockDomains.map((domain) => (
              <div
                key={domain.id}
                className={`rounded-xl shadow-lg bg-gradient-to-r ${domain.color} transition-all duration-300 overflow-hidden`}
              >
                <div
                  onClick={() => handleDomainClick(domain.id)}
                  className="p-6 cursor-pointer flex justify-between items-center text-white font-semibold hover:opacity-90"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{domain.icon}</span>
                    <span>{domain.name}</span>
                  </div>
                  <span className="text-lg">{selectedDomainId === domain.id ? '−' : '+'}</span>
                </div>
                {selectedDomainId === domain.id && (
                  <div className="p-6 bg-white">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Schedule Interview for {domain.name}</h2>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Choose Day</label>
                      <select
                        value={selectedDay}
                        onChange={(e) => {
                          setSelectedDay(e.target.value);
                          setSelectedTimeSlot(null);
                        }}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                      >
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Choose Time Slot</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => handleTimeSlotClick(slot)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              selectedTimeSlot === slot
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRequest(domain.name)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all text-sm font-semibold"
                      disabled={!selectedTimeSlot}
                    >
                      Request Interview
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Requests</h2>
              <button
                onClick={handleClearRequests}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all text-sm"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-4">
              {mockRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{req.domain}</p>
                      <p className="text-sm text-gray-600">{req.day} {req.time}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        req.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : req.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInterview;