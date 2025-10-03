import react from 'react';
import axios from 'axios';

// Base URL with blood_gmt prefix
const BASE_URL = 'http://localhost:8000/vendor_gmt/';

export const getAllBloodNeedRequests = async () => {
    try {
        const response = await axios.get(`${BASE_URL}get_all/blood_need`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const AddBloodRequest = async (data) => {
    try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        console.log("FormData entries:");
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        const response = await axios.post(`${BASE_URL}create/blood_need`, formData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(
                error.response.data.message ||
                JSON.stringify(error.response.data, null, 2)
            );
        } else {
            console.error("Error creating blood request:");
            throw new Error(error.message);
        }
    }
};
