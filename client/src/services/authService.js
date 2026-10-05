
import api from './api';

export const register = async ({ name, email, password }) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data.data.user;
};

export const login = async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data.user;
};

export const getCurrentUser = async () => {
    const res = await api.get('/auth/me');
    return res.data.data;
};

export const logout = async () => {
    await api.post('/auth/logout');
};