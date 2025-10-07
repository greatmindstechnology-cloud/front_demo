import axios from 'axios';

// Base URL with admin_gmt prefix
const BASE_URL = 'https://backend-demo-esqk.onrender.com/admin_gmt/api/institutions/';

// Convert object to FormData
const toFormData = (dataObj) => {
  const formData = new FormData();
  Object.entries(dataObj).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
};

// 📌 Create Institution
export const createInstitution = async (dataObj) => {
  const formData = toFormData(dataObj);
  const response = await axios.post(BASE_URL, formData);
  return response.data;
};

// 📌 List Institutions
export const listInstitutions = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

// 📌 Get Institution by ID
export const getInstitution = async (id) => {
  const response = await axios.get(`${BASE_URL}${id}/get/`);
  return response.data;
};

// 📌 Update Institution
export const updateInstitution = async (id, dataObj) => {
  Object.entries(dataObj).forEach(([key, value]) => {
    console.log(`${key}:`, value);
  });
  const formData = toFormData(dataObj);
  const response = await axios.patch(`${BASE_URL}${id}/update/`, formData);
  return response.data;
};

// 📌 Delete Institution
export const deleteInstitution = async (id) => {
  const response = await axios.delete(`${BASE_URL}${id}/delete/`);
  return response.data;
};
