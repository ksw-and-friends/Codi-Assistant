import axios from 'axios';

const API_BASE_URL = 'http://www.codi.kro.kr/api';

const apiService = {
    signup: async (userId, password, name) => {
        const response = await axios.post(`${API_BASE_URL}/signup`, {
            userId,
            password,
            name,
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
