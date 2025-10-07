import axios from 'axios';

const BASE_URL = 'http://localhost:8000/trainer_gmt';

// Interviewer APIs
export const applyAsInterviewer = (data) =>
    axios.post(`${BASE_URL}/interviewer/apply/`, data);

export const updateInterviewerApplication = (id, data) =>
    axios.put(`${BASE_URL}/interviewer/applications/${id}/`, data);

export const getInterviewerApplicationsAdmin = () =>{
    return axios.get(`${BASE_URL}/admin/interviewer/applications/`);
}

export const updateInterviewerApplicationStatus = (id, data) =>{}
    axios.put(`${BASE_URL}/admin/interviewer/applications/${id}/`, data);

// Interview APIs
export const getAvailableInterviewers = () =>{
    return axios.get(`${BASE_URL}/interview/available-interviewers/`);
}

export const submitInterviewRequest = (data) =>
    axios.post(`${BASE_URL}/interview/request/`, data);

export const getInterviewRequests = () =>{
    return axios.get(`${BASE_URL}/interview/requests/`);
}

export const acceptInterviewRequest = (id) =>
    axios.post(`${BASE_URL}/interview/requests/${id}/accept/`); 

export const rejectInterviewRequest = (id) =>
    axios.post(`${BASE_URL}/interview/requests/${id}/reject/`);

export const getInterviewSession = (id) =>
    axios.get(`${BASE_URL}/interview/session/${id}/`);

export const completeInterviewRequest = (id) =>
    axios.post(`${BASE_URL}/interview/requests/${id}/complete/`);

export const submitInterviewFeedback = (id, data) =>
    axios.post(`${BASE_URL}/interview/requests/${id}/feedback/`, data);