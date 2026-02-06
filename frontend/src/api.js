import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const uploadPaper = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData);
    return response.data;
};

export const getSummary = async (paperId, level) => {
    const response = await api.get(`/summarize/${paperId}`, {
        params: { level }
    });
    return response.data;
};

export default api;
