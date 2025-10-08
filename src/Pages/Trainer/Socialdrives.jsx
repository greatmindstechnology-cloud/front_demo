
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
        const res = await axios.get("https://backend-demo-esqk.onrender.com/vendor_gmt/get_all/get_csrevent/"); 
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
