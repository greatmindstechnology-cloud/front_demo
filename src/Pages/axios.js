import axios from "axios";

const BASE_URL = "https://backend-demo-esqk.onrender.com/api";

const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/",
});

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default api; // ✅ named exports
