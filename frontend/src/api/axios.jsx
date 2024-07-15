import axios from 'axios';

const API_BASE_URL = 'http://localhost:3030/api';

const apiService = {
    signup: async (name, userId, password) => {
        const response = await axios.post(`${API_BASE_URL}/signup`, {
            name,
            userId,
            password,
        });
        return response.data;
    },

    login: async (userId, password) => {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            userId,
            password,
        });
        return response.data;
    },

    logout: async () => {
        const response = await axios.post(`${API_BASE_URL}/logout`);
        return response.data;
    },
};

export default apiService;
