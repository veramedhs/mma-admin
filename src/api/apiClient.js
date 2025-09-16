import axios from 'axios';
export const apiClient = axios.create({
  baseURL: 'http://192.168.1.7:3000'// Replace with your API base URL
});