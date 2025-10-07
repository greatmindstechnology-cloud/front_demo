import axios from 'axios';

// Base URL with admin_gmt prefix
const BASE_URL = 'https://backend-demo-esqk.onrender.com/course_gmt/';

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

export const getStudentCourses  = async (studentId) => {
    const url = `${BASE_URL}getstudent/${studentId}/student_courses/`;
    return axios.get(url);
}
export const getMultipleCourses = async (courseIDs) => {
    const url = `${BASE_URL}courses/get-multiple/`;
    return axios.post(url, { course_ids: courseIDs });
}
