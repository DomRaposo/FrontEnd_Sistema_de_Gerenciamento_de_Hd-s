import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/clientes/';

/**
 * Busca a lista de todos os clientes na API.
 * @returns {Promise<Array>} Lista de clientes.
 */
export const getClients = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Deleta um cliente pelo ID.
 * @param {number} id - O ID do cliente a ser deletado.
 */
export const deleteClient = async (id) => {
    await axios.delete(`${API_URL}${id}/`);
};