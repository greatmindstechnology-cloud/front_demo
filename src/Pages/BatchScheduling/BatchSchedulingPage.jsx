
import React, { useState } from 'react';
import SessionCalendar from '../../components/SessionCalendar/SessionCalendar';
import MiniSessionCalendar from '../../components/SessionCalendar/MiniSessionCalendar';

const BatchSchedulingPage = () => {
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);

  const handleToggleMiniCalendar = () => {
    setShowMiniCalendar((prev) => !prev);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Batch Scheduling</h1>

     
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          onClick={handleToggleMiniCalendar}
        >
          {showMiniCalendar ? 'Hide Mini Calendar' : 'Show Mini Calendar'}
        </button>
      </div>

      <div className="flex gap-6 relative">
 
        <div className="flex-1">
          <SessionCalendar />
        </div>

        {showMiniCalendar && (
          <div className="w-[300px] bg-white border border-gray-200 rounded shadow-md p-4 absolute right-0 top-0 z-10">
            <MiniSessionCalendar />
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchSchedulingPage;



