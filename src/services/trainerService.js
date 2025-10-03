import axios from 'axios';

export const getTrainers = () => axios.get('/api/trainers/');