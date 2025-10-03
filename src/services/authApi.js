
import axios from "axios";

// Base Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000", // Change if your backend runs elsewhere
  headers: {
    "Content-Type": "application/json",
  },
});

// ========== OTP ==========

// Send OTP
export const sendOtp = async (email) => {
  try {
    const response = await api.post("/otpsend/", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post("/verifyotp/", { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== Login ==========

export const login = async (data) => {
  try {
    const response = await api.post("/login/", data);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== Student Signup ==========

export const studentSignup = async (formData) => {
  try {
    const response = await api.post("/signup/student/", formData);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== Vendor Signup (with files) ==========

export const vendorSignup = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/signup/vendor/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ========== Trainer Signup (with files) ==========

export const trainerSignup = async (formData) => {
  console.log(formData);
  // Log each key-value pair in the FormData object
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  
  try {
    const response = await axios.post(
      "http://localhost:8000/signup/trainer/",
      formData,
    );
    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const BASE_URL = 'http://localhost:8000'; // Django backend URL

export const trainerCreateCourse = async (formData, trainerId) => {
  console.log(formData);
  const response = await fetch(`${BASE_URL}/trainer_gmt/courses/create/?trainer_id=${trainerId}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create course');
  }

  return await response.json();
};

