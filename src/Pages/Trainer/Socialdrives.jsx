// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Socialdrives() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   const csrItems = [
//     {
//       title: 'Blood donation',
//       location: 'Chennai',
//       image: '/src/assets/blooddonation.jpg',
//       date: '2025-09-15',
//       registered: 1000,
//       allowed: 500,
//       organizer: 'CSR Foundation',
//       category: 'Health',
//       time: '10:00 AM',
//       contactNumber: '+91 99876 54321',
//       contactEmail: 'blooddonation@example.com',
//       description: 'Donate blood and help save lives.',
//       requirements: 'Must be 18+, healthy, and bring ID.',
//       whatToBring: 'Government-issued ID, water bottle.',
//       facilities: 'Snacks, certificate, first-aid.',
//       duration: '4–5 hours',
//       dressCode: 'Red/white casuals'
//     },
//     {
//       title: 'Tree planting',
//       location: 'Chennai',
//       image: '/src/assets/treegrowth.jpg',
//       date: '2025-09-18',
//       registered: 800,
//       allowed: 600,
//       organizer: 'Green Earth Org',
//       category: 'Environment',
//       time: '9:00 AM',
//       contactNumber: '+91 98765 43210',
//       contactEmail: 'treeplant@example.com',
//       description: 'Help make the city greener by planting trees.',
//       requirements: 'Must be 16+, wear gloves.',
//       whatToBring: 'Hat, water bottle, gardening gloves.',
//       facilities: 'Refreshments, tools provided.',
//       duration: '3 hours',
//       dressCode: 'Green/earth-tone clothing'
//     },
//     {
//       title: 'Motivational speech',
//       location: 'Chennai',
//       image: '/src/assets/motivationtalk.jpg',
//       date: '2025-09-20',
//       registered: 1200,
//       allowed: 700,
//       organizer: 'Inspire Minds',
//       category: 'Education',
//       time: '11:00 AM',
//       contactNumber: '+91 91234 56789',
//       contactEmail: 'motivation@example.com',
//       description: 'Inspiring session by guest speakers.',
//       requirements: 'Open to all above 15 years.',
//       whatToBring: 'Notebook and pen.',
//       facilities: 'Tea, Q&A session.',
//       duration: '2 hours',
//       dressCode: 'Smart casual'
//     },
//     {
//       title: 'Awareness events',
//       location: 'Chennai',
//       image: '/src/assets/awarenessevents.jpg',
//       date: '2025-09-22',
//       registered: 950,
//       allowed: 450,
//       organizer: 'Social Impact Group',
//       category: 'Public Awareness',
//       time: '2:00 PM',
//       contactNumber: '+91 90000 00000',
//       contactEmail: 'awareness@example.com',
//       description: 'Awareness campaign on public health.',
//       requirements: 'Must be passionate about social issues.',
//       whatToBring: 'ID card, water.',
//       facilities: 'Lunch, volunteer kit.',
//       duration: '5 hours',
//       dressCode: 'White top with blue jeans'
//     },
//     {
//       title: 'Other event',
//       location: 'Chennai',
//       image: '/src/assets/otherevent.jpg',
//       date: '2025-09-25',
//       registered: 1100,
//       allowed: 500,
//       organizer: 'CSR Volunteers',
//       category: 'General',
//       time: '1:00 PM',
//       contactNumber: '+91 95555 55555',
//       contactEmail: 'otherevent@example.com',
//       description: 'General event for community service.',
//       requirements: 'Willing to contribute 3 hours of time.',
//       whatToBring: 'Positive attitude, ID.',
//       facilities: 'Refreshments, certificate.',
//       duration: '3 hours',
//       dressCode: 'Comfortable casuals'
//     },
//   ];


//   const filteredItems = csrItems.filter(item =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleDetailsClick = (item) => {
//     navigate('/dashboard/trainer/Csrdetails', { state: item });
//   };

//   return (
//     <div>
//       <div className="container mt-5 mb-5">
//         <div className="d-flex justify-content-between align-items-center mt-2">
//           <span>CSR</span>

//           <div className="d-flex gap-2">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search CSR"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="row g-2">
//           {filteredItems.length > 0 ? (
//             filteredItems.map((item, index) => (
//               <div className="col-md-3" key={index}>
//                 <div className="card p-2 py-3 text-center">
//                   <div className="img mb-2 d-flex justify-content-center">
//                     <img
//                       src={item.image}
//                       className="img-fluid rounded-3"
//                       alt={item.title}
//                       style={{ width: '200px', height: '150px', objectFit: 'cover' }}
//                     />
//                   </div>
//                   <h5 className="mb-0">{item.title}</h5>
//                   <small>{item.location}</small>
//                   <div className="mt-2">
//                     <i className="fa fa-calendar me-1"></i>
//                     <span>{item.date}</span>
//                   </div>
//                   <div className="mt-2">
//                     <i className="fa fa-users me-1 text-primary"></i><span>{item.registered} regis</span> / <i className="fa fa-check-circle me-1 text-warning"></i><span>{item.allowed} allow</span>
//                   </div>
//                   <div className="mt-4 apointment">
//                     <button
//                       className="btn btn-success text-uppercase"
//                       onClick={() => handleDetailsClick(item)}
//                     >
//                       Registration
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center">No CSR events found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Socialdrives;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // for API calls

function Socialdrives() {
  const [searchTerm, setSearchTerm] = useState("");
  const [csrItems, setCsrItems] = useState([]); // store API data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state
  const navigate = useNavigate();

  // ✅ Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/vendor_gmt/get_all/get_csrevent/"); 
        // replace with your real API endpoint
        setCsrItems(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ✅ Search filter
  const filteredItems = csrItems.filter((item) =>
    item.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Navigate to details page with event info
  const handleDetailsClick = (item) => {
    navigate("/dashboard/trainer/Csrdetails", { state: item });
  };

  if (loading) return <p className="text-center mt-5">Loading events...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <div>
      <div className="container mt-5 mb-5">
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span>CSR</span>

          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search CSR"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div className="col-md-3" key={item.id}>
                <div className="card p-2 py-3 text-center">
                  {/* Thumbnail */}
                  <div className="img mb-2 d-flex justify-content-center">
                    <video
                      src={item.video}
                      className="rounded-3"
                      style={{ width: "200px", height: "150px", objectFit: "cover" }}
                      controls
                    />
                  </div>

                  {/* Event name */}
                  <h5 className="mb-0">{item.event_name}</h5>
                  <small className="text-muted">{item.event_type}</small>

                  {/* Date */}
                  <div className="mt-2">
                    <i className="fa fa-calendar me-1"></i>
                    <span>
                      {new Date(item.start_datetime).toLocaleDateString()}{" "}
                      {new Date(item.start_datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Slots */}
                  <div className="mt-2">
                    <i className="fa fa-check-circle me-1 text-warning"></i>
                    <span>{item.no_of_slots} slots</span>
                  </div>

                  {/* Registration Button */}
                  <div className="mt-4 apointment">
                    <button
                      className="btn btn-success text-uppercase"
                      onClick={() => handleDetailsClick(item)}
                    >
                      Registration
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No CSR events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Socialdrives;
