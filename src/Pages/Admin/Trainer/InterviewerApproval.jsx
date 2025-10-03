import React, { useState } from 'react';

// Mock data for pending trainer requests (replace with API fetch in real app)
const mockRequests = [
  {
    trainer_id: 101,
    name: 'John Doe',
    domains: 'Fitness, Yoga',
    why_interested: 'Passionate about training others.',
    availability: {
      Monday: '09:00-17:00',
      Tuesday: '09:00-17:00',
      Wednesday: '09:00-17:00',
      Thursday: '09:00-17:00',
      Friday: '09:00-17:00',
      Saturday: '10:00-14:00',
      Sunday: 'Off',
    },
    docs: 'https://example.com/docs/john_doe_cert.pdf', // Assume URL to document
    status: 'pending',
  },
  {
    trainer_id: 102,
    name: 'Jane Smith',
    domains: 'Technical Training, Coding',
    why_interested: 'Experienced in tech education.',
    availability: {
      Monday: '10:00-18:00',
      Tuesday: '10:00-18:00',
      Wednesday: '10:00-18:00',
      Thursday: '10:00-18:00',
      Friday: '10:00-18:00',
      Saturday: 'Off',
      Sunday: 'Off',
    },
    docs: 'https://example.com/docs/jane_smith_cert.pdf',
    status: 'pending',
  },
];

const InterviewerApproval = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleCardClick = (request) => {
    setSelectedRequest(request);
  };

  const handleApprove = (trainer_id) => {
    // Simulate API call to approve
    setRequests(requests.map((req) => (req.trainer_id === trainer_id ? { ...req, status: 'approved' } : req)));
    setSelectedRequest(null);
  };

  const handleReject = (trainer_id) => {
    // Simulate API call to reject
    setRequests(requests.map((req) => (req.trainer_id === trainer_id ? { ...req, status: 'rejected' } : req)));
    setSelectedRequest(null);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Interviewer Approval Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests
          .filter((req) => req.status === 'pending')
          .map((request) => (
            <div
              key={request.trainer_id}
              onClick={() => handleCardClick(request)}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800">{request.name}</h2>
                <span className="text-sm text-gray-500">ID: {request.trainer_id}</span>
              </div>
              <p className="mt-2 text-gray-600">Domains: {request.domains}</p>
            </div>
          ))}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedRequest.name}</h2>
              <span className="text-sm text-gray-500">ID: {selectedRequest.trainer_id}</span>
            </div>
            <p className="mb-4 text-gray-600">Domains: {selectedRequest.domains}</p>
            <p className="mb-4 text-gray-600">Why Interested: {selectedRequest.why_interested}</p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Availability</h3>
              <ul className="space-y-1">
                {Object.entries(selectedRequest.availability).map(([day, time]) => (
                  <li key={day} className="text-gray-600">
                    <span className="font-medium">{day}:</span> {time}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <a
                href={selectedRequest.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 inline-block"
              >
                View Documents
              </a>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleApprove(selectedRequest.trainer_id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(selectedRequest.trainer_id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewerApproval;