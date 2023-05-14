import axios from 'axios';
require("dotenv").config({ path: '../config.env' });

export default axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true
})