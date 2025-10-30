
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/clientes/';

const ClientForm = ({ clientData, onClientCreated, onClientUpdated, onClose }) => {
    
    const [formData, setFormData] = useState({
        nome: '',
        contato: '',
        observacoes: '',
    });
    
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const isEditing = !!clientData;

    useEffect(() => {
        if (clientData) {
            setFormData({
                nome: clientData.nome,
                contato: clientData.contato,
                observacoes: clientData.observacoes || '',
            });
        }
    }, [clientData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (isEditing) {
                
                await axios.put(`${API_URL}${clientData.id}/`, formData);
                if (onClientUpdated) onClientUpdated();
            } else {
                
                await axios.post(API_URL, formData);
                setFormData({ nome: '', contato: '', observacoes: '' }); 
                if (onClientCreated) onClientCreated();
            }
            setSuccess(true);

        } catch (err) {
            console.error("Erro no cadastro:", err.response ? err.response.data : err.message);
            setError(err.response ? JSON.stringify(err.response.data) : "Erro ao salvar o cliente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">
                {isEditing ? `Editar Cliente: ${clientData.nome}` : 'Cadastrar Novo Cliente'}
            </h3>
            
            {success && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded">Cliente salvo com sucesso!</div>}
            {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">Erro: {error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
                    <input type="text" name="nome" id="nome" required
                        value={formData.nome} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                
                <div>
                    <label htmlFor="contato" className="block text-sm font-medium text-gray-700">Contato</label>
                    <input type="text" name="contato" id="contato"
                        value={formData.contato} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                
                
                <div>
                    <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">Observações</label>
                    <textarea name="observacoes" id="observacoes"
                        value={formData.observacoes} onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`py-2 px-4 rounded-md text-sm font-medium text-white flex-grow ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {loading ? 'Salvando...' : 'Salvar Cliente'}
                    </button>
                    
                    {isEditing && onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Fechar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ClientForm;