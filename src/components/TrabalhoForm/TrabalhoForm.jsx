import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = 'http://127.0.0.1:8000/api/v1/trabalhos/';
const CLIENTES_URL = 'http://127.0.0.1:8000/api/v1/clientes/';
const HDS_URL = 'http://127.0.0.1:8000/api/v1/hds/';

const TrabalhoForm = ({ trabalhoData, onTrabalhoSaved, onClose }) => {
    
    const isEditing = !!trabalhoData;
    
    
    const [clientes, setClientes] = useState([]);
    const [hds, setHDs] = useState([]);

    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        cliente: '', 
        hd_usado: '', 
        data_inicio: '',
        data_fim_prevista: '',
    });
    
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                
                const clientesRes = await axios.get(CLIENTES_URL);
                const hdsRes = await axios.get(HDS_URL);
                
                setClientes(clientesRes.data);
                setHDs(hdsRes.data);

                if (trabalhoData) {
                    
                    
                    setFormData({
                        titulo: trabalhoData.titulo || '',
                        descricao: trabalhoData.descricao || '',
                        cliente: trabalhoData.cliente, 
                        hd_usado: trabalhoData.hd_usado,
                        data_inicio: trabalhoData.data_inicio ? trabalhoData.data_inicio.substring(0, 10) : '',
                        data_fim_prevista: trabalhoData.data_fim_prevista ? trabalhoData.data_fim_prevista.substring(0, 10) : '',
                    });
                }
            } catch (err) {
                setError("Erro ao carregar dados de Clientes ou HDs.");
            }
        };
        fetchDependencies();
    }, [trabalhoData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            
            [name]: (name === 'cliente' || name === 'hd_usado') ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            
            if (!formData.cliente || !formData.hd_usado) {
                 throw new Error("Cliente e HD são obrigatórios.");
            }

            if (isEditing) {
                await axios.put(`${API_URL}${trabalhoData.id}/`, formData);
            } else {
                await axios.post(API_URL, formData);
                
                setFormData(prev => ({ ...prev, titulo: '', descricao: '' }));
            }
            
            setSuccess(true);
            if (onTrabalhoSaved) onTrabalhoSaved();

        } catch (err) {
            console.error("Erro no formulário:", err.response ? err.response.data : err.message || err.message);
            setError(err.response ? JSON.stringify(err.response.data) : "Erro ao salvar o Trabalho.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">
                {isEditing ? `Editar Trabalho: ${trabalhoData.titulo}` : 'Cadastrar Novo Trabalho'}
            </h3>
            
            
            {success && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded">Trabalho salvo com sucesso!</div>}
            {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">Erro: {error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                
                <div>
                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título do Projeto</label>
                    <input type="text" name="titulo" id="titulo" required
                        value={formData.titulo} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea name="descricao" id="descricao" rows="3"
                        value={formData.descricao} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>


                <div>
                    <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">Cliente</label>
                    <select name="cliente" id="cliente" required
                        value={formData.cliente} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">-- Selecione o Cliente --</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                </div>


                <div>
                    <label htmlFor="hd_usado" className="block text-sm font-medium text-gray-700">HD Alocado</label>
                    <select name="hd_usado" id="hd_usado" required
                        value={formData.hd_usado} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">-- Selecione o HD --</option>
                        {hds.map(h => (
                            
                            <option key={h.id} value={h.id}>{h.nome_hd} (S/N: {h.serial_number}) - {h.status}</option>
                        ))}
                    </select>
                </div>


                <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700">Início</label>
                        <input type="date" name="data_inicio" id="data_inicio" required
                            value={formData.data_inicio} onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="data_fim_prevista" className="block text-sm font-medium text-gray-700">Previsão de Fim</label>
                        <input type="date" name="data_fim_prevista" id="data_fim_prevista"
                            value={formData.data_fim_prevista} onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>


                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`py-2 px-4 rounded-md text-sm font-medium text-white flex-grow ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {loading ? 'Salvando...' : isEditing ? 'Salvar Projeto' : 'Cadastrar Projeto'}
                    </button>
                    
                    {onClose && (
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

export default TrabalhoForm;