import axios from 'axios';
import { normalizeObject } from '../utils/urlUtils';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:4005/api/v1',
  timeout: 30000,
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = normalizeObject(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
