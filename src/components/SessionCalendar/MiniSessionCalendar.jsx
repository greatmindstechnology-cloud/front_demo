import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MiniSessionCalendar.css"; // Custom styles

import { getSessions } from "../../services/sessionService";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

const MiniSessionCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [selectedDaySessions, setSelectedDaySessions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const res = await getSessions();
    const allSessions = Array.isArray(res.data)
      ? res.data
      : res.data.sessions || [];
    setSessions(allSessions);
  };

  const handleDateChange = (value) => {
    setDate(value);
    const selectedDate = value.toISOString().split("T")[0];

    const filtered = sessions.filter((session) =>
      session.start_time.startsWith(selectedDate)
    );
    setSelectedDaySessions(filtered);
    setModalOpen(true);
  };

  return (
    <div className="mini-session-calendar-container">
      <Calendar onChange={handleDateChange} value={date} />

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth>
        <DialogTitle>Sessions on {date.toDateString()}</DialogTitle>
        <DialogContent>
          {selectedDaySessions.length === 0 ? (
            <p>No sessions scheduled.</p>
          ) : (
            <ul>
              {selectedDaySessions.map((session) => (
                <li key={session.id}>
                  <strong>{session.title}</strong>
                  <br />
                  {new Date(session.start_time).toLocaleTimeString()} -{" "}
                  {new Date(session.end_time).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiniSessionCalendar;
