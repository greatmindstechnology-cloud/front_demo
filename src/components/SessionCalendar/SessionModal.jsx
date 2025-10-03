// File: src/components/SessionCalendar/SessionModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { createSession } from "../../services/sessionService";
import { getTrainers } from "../../services/trainerService";

const SessionModal = ({ open, onClose, slot, onSessionCreated }) => {
  const [form, setForm] = useState({ title: "", trainer: "", mode: "Online" });
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    if (slot) {
      setForm((prev) => ({ ...prev, start: slot.start, end: slot.end }));
    }
    loadTrainers();
  }, [slot]);

  const loadTrainers = async () => {
    const res = await getTrainers();

    const trainerList = Array.isArray(res.data)
      ? res.data
      : res.data.trainers || [];

    setTrainers(trainerList);
  };

  const handleSubmit = async () => {
    await createSession({
      ...form,
      start_time: form.start,
      end_time: form.end,
    });
    onClose();
    onSessionCreated();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Schedule New Session</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          margin="dense"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <TextField
          label="Trainer"
          select
          fullWidth
          margin="dense"
          value={form.trainer}
          onChange={(e) => setForm({ ...form, trainer: e.target.value })}
        >
          {trainers.map((tr) => (
            <MenuItem key={tr.id} value={tr.id}>
              {tr.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Mode"
          select
          fullWidth
          margin="dense"
          value={form.mode}
          onChange={(e) => setForm({ ...form, mode: e.target.value })}
        >
          <MenuItem value="Online">Online</MenuItem>
          <MenuItem value="Offline">Offline</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionModal;
