import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer your-token',
    },
})