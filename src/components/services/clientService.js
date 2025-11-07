import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/clientes/';

export const getClients = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const deleteClient = async (id) => {
    await axios.delete(`${API_URL}${id}/`);
};

export const createClient = async (clientData) => {
    const response = await axios.post(API_URL, clientData);
    return response.data;
};

export const updateClient = async (id, clientData) => {
    const response = await axios.put(`${API_URL}${id}/`, clientData);
    return response.data;
};