import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ClientForm from './ClientForm'; 

const API_URL = 'http://127.0.0.1:8000/api/v1/clientes/';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    
    const fetchClients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            setClients(response.data);
        } catch (err) {
            setError("Não foi possível carregar os clientes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);


    const handleClientCreated = () => {
        fetchClients();
        setShowForm(false);
    };

    const handleClientUpdated = () => {
        fetchClients();
        setEditingClient(null);
    };

    const handleDelete = async (id, nome) => {
        if (window.confirm(`Tem certeza que deseja DELETAR o cliente "${nome}"? Isso removerá todos os trabalhos associados!`)) {
            setLoading(true);
            try {
                await axios.delete(`${API_URL}${id}/`);
                fetchClients(); 
            } catch (err) {
                setError("Erro ao deletar o cliente.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && clients.length === 0) return <div className="text-center py-10">Carregando clientes...</div>;
    if (error) return <div className="text-red-600 bg-red-100 p-4 rounded text-center">{error}</div>;

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Gerenciamento de Clientes ({clients.length})</h2>

            
            {editingClient && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-md bg-white">
                        <ClientForm 
                            clientData={editingClient} 
                            onClientUpdated={handleClientUpdated} 
                            onClose={() => setEditingClient(null)} 
                        />
                    </div>
                </div>
            )}
            
            
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition duration-150"
                >
                    {showForm ? 'Cancelar Cadastro' : 'Novo Cliente +'}
                </button>
            </div>

            
            {showForm && (
                <div className="mb-8 border p-4 rounded-lg">
                    <ClientForm onClientCreated={handleClientCreated} />
                </div>
            )}
            
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.nome}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.contato}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                    <button
                                        onClick={() => setEditingClient(client)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id, client.nome)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientList;