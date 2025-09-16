import axios from 'axios';
const BASE_URI = import.meta.env.VITE_BASE_URI
export const apiClient = axios.create({
  baseURL:BASE_URI,
});