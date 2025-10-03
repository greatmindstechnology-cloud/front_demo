import React, { useState } from 'react';
import { Range } from 'react-range';

const TrainerRequestForm = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [formData, setFormData] = useState({
    domains: '',
    why_interested: '',
    availability: days.reduce((acc, day) => ({ ...acc, [day]: [9 * 60, 17 * 60] }), {}), // Default: 9 AM to 5 PM in minutes
    docs: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, docs: e.target.files[0] });
  };

  const handleSliderChange = (day, values) => {
    setFormData({
      ...formData,
      availability: { ...formData.availability, [day]: values },
    });
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert availability to JSON format (e.g., {"Monday": "09:00-17:00", ...})
    const formattedAvailability = Object.keys(formData.availability).reduce((acc, day) => {
      const [start, end] = formData.availability[day];
      acc[day] = `${formatTime(start)}-${formatTime(end)}`;
      return acc;
    }, {});
    const submissionData = { ...formData, availability: formattedAvailability };
    console.log('Form submitted:', submissionData);
    setIsSubmitted(true);
    // Reset form
    setFormData({
      domains: '',
      why_interested: '',
      availability: days.reduce((acc, day) => ({ ...acc, [day]: [9 * 60, 17 * 60] }), {}),
      docs: null,
    });
  };

  const closePopup = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">Submission Successful</h2>
            <p className="mb-4 text-sm">Your request has been submitted and is pending approval. You will be notified soon.</p>
            <button
              onClick={closePopup}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Trainer Registration Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Domains of Expertise</label>
                <input
                  type="text"
                  name="domains"
                  value={formData.domains}
                  onChange={handleInputChange}
                  placeholder="e.g., Fitness, Yoga, Technical Training"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Why Interested?</label>
                <textarea
                  name="why_interested"
                  value={formData.why_interested}
                  onChange={handleInputChange}
                  placeholder="Why do you want to be a trainer?"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <div className="grid grid-cols-2 gap-4">
                  {days.map((day) => (
                    <div key={day} className="mb-4">
                      <label className="block text-xs font-medium text-gray-600">{day}</label>
                      <Range
                        step={30} // 30-minute increments
                        min={0} // 12:00 AM
                        max={24 * 60} // 12:00 AM next day
                        values={formData.availability[day]}
                        onChange={(values) => handleSliderChange(day, values)}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            className="h-1 bg-gray-200 rounded"
                            style={{ ...props.style }}
                          >
                            {children}
                          </div>
                        )}
                        renderThumb={({ props, index }) => (
                          <div
                            {...props}
                            className="h-3 w-3 bg-blue-500 rounded-full"
                            style={{ ...props.style }}
                          />
                        )}
                      />
                      <div className="text-xs text-gray-600 mt-1">
                        {formatTime(formData.availability[day][0])} - {formatTime(formData.availability[day][1])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
                <input
                  type="file"
                  name="docs"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm"
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default TrainerRequestForm;