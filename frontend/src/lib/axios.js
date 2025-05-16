import axios from 'axios';

export const axiosInstance = axios.create({
    baseUrl: import.meta.env.MODE == 'development' ? 'http://localhost:8080/api/v1' : 'https://judge0-ce.p.rapidapi.com',
})