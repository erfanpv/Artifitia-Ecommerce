import axios from "axios";

// const baseUrl = import.meta.env.PORT || "http://localhost:3001/api";
// console.log(baseUrl);
const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://stockverse.onrender.com/api";


const API = axios.create({
  baseURL: baseUrl,
});

export default API;
