import axios from 'axios';

// Base URL with admin_gmt prefix
const BASE_URL = 'http://localhost:8000/course_gmt/';

// Utility function to convert an object to FormData
export function toFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });
    return formData;
}

// Function to post feedback data
export const postFeedback = async (feedbackData) => {
    const url = `${BASE_URL}api/feedback/`;
    const formData = toFormData(feedbackData);
    return axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const getCourseFeedbacks = async (courseId) => {
    const url = `${BASE_URL}api/feedback/course/${courseId}/`;
    return axios.get(url);
}