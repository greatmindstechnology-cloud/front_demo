// src/services/sessionService.js
import axios from 'axios';

export const getSessions = () => axios.get('/api/sessions/');
export const createSession = (data) => axios.post('/api/sessions/', data);
