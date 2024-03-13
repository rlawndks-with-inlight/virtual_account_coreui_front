import axios from 'axios';
// config
// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: process.env.BACK_URL });
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
