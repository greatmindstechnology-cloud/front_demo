import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { addDays, format, isBefore, parseISO } from "date-fns";

import SessionModal from "./SessionModal";
import { getSessions } from '../../services/sessionService';


// Helper: map title keywords to weekdays (0=Sunday,...6=Saturday)
const getRecurrenceDaysFromTitle = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes("weekend")) return [0, 6]; // Sunday and Saturday
  if (lower.includes("weekday")) return [1, 2, 3, 4, 5]; // Mon-Fri
  // fallback to Monday if no info
  return [1];
};

const generateRecurringEvents = (session) => {
  const events = [];

  const startDate = parseISO(session.session_start_date);
  const endDate = parseISO(session.session_end_date);
  const recurrenceDays = getRecurrenceDaysFromTitle(session.title);

  let currentDate = new Date(startDate);
  while (!isBefore(endDate, currentDate)) {
    if (recurrenceDays.includes(currentDate.getDay())) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      events.push({
        id: `${session.batch_id}-${format(currentDate, "yyyyMMdd")}`,
        title: session.title,
        start: `${dateStr}T${session.start_time}`,
        end: `${dateStr}T${session.end_time}`,
        extendedProps: {
          mode: session.mode,
          trainer_id: session.trainer,
        },
      });
    }
    currentDate = addDays(currentDate, 1);
  }

  return events;
};

const SessionCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await getSessions();
      const sessions = Array.isArray(res.data)
        ? res.data
        : res.data.sessions || [];

      console.log("Raw sessions:", sessions);

      const allEvents = sessions.flatMap(generateRecurringEvents);
      console.log("Generated events:", allEvents);

      setEvents(allEvents);
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  };

  const handleDateSelect = (info) => {
    setSelectedSlot({ start: info.startStr, end: info.endStr });
    setModalOpen(true);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        select={handleDateSelect}
        events={events}
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
      <SessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        slot={selectedSlot}
        onSessionCreated={loadSessions}
      />
    </>
  );
};

export default SessionCalendar;
