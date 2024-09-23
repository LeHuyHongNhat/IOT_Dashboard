import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.response.use(
  (response) => response?.data ?? response,
  (error) => Promise.reject(error),
)

export default axiosClient