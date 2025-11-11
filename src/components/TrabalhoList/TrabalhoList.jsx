// frontend/src/components/TrabalhoList.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TrabalhoForm from '../TrabalhoForm/TrabalhoForm';

const API_URL = 'http://127.0.0.1:8000/api/v1/trabalhos/';

const TrabalhoList = () => {
    const [trabalhos, setTrabalhos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState(''); 
    const [showForm, setShowForm] = useState(false); 
    const [editingTrabalho, setEditingTrabalho] = useState(null); 
    

    const fetchTrabalhos = useCallback(async (search = '') => {
        setLoading(true);
        setError(null);
        try {
            const url = search 
                ? `${API_URL}?search=${encodeURIComponent(search)}` 
                : API_URL;
            const response = await axios.get(url);
           
            setTrabalhos(response.data);
        } catch (err) {
            console.error("Erro ao buscar trabalhos:", err);
            setError("Não foi possível carregar a lista de trabalhos/projetos.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrabalhos(searchTerm);
    }, [fetchTrabalhos, searchTerm]);


    const handleTrabalhoSaved = () => {
        fetchTrabalhos(searchTerm); 
        setShowForm(false);
        setEditingTrabalho(null);
    };
    

    const handleDelete = async (id, titulo) => {
        if (window.confirm(`Tem certeza que deseja DELETAR o Trabalho "${titulo}"? Isso não exclui o HD, mas remove a associação!`)) {
            setLoading(true);
            try {
                await axios.delete(`${API_URL}${id}/`);
                fetchTrabalhos(searchTerm); 
            } catch (err) {
                setError("Erro ao deletar o trabalho.");
            } finally {
                setLoading(false);
            }
        }
    };
 
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchTrabalhos(searchTerm);
    };

    // Função para calcular os dias restantes
    const getDaysRemaining = (dateString) => {
        if (!dateString) return 'N/A';
        const today = new Date();
        const endDate = new Date(dateString);
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { text: `${Math.abs(diffDays)} dias de atraso`, class: 'text-red-600 font-bold' };
        if (diffDays <= 7) return { text: `${diffDays} dias restantes`, class: 'text-yellow-600 font-bold' };
        return { text: `${diffDays} dias restantes`, class: 'text-green-600' };
    };


    if (loading && trabalhos.length === 0) return <div className="text-center py-10 text-purple-600">Carregando projetos...</div>;
    
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            
            
            {editingTrabalho && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <TrabalhoForm 
                            trabalhoData={editingTrabalho} 
                            onTrabalhoSaved={handleTrabalhoSaved} 
                            onClose={() => setEditingTrabalho(null)} 
                        />
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Gerenciamento de Trabalhos/Projetos ({trabalhos.length})</h2>
            
            <div className="mb-6 flex justify-between items-center">
                
                
                <form onSubmit={handleSearchSubmit} className="flex gap-3 w-3/4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Buscar por título, cliente ou HD..."
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition duration-150"
                    >
                        Buscar
                    </button>
                </form>
                
                
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700 transition duration-150"
                >
                    {showForm ? 'Cancelar Cadastro' : 'Novo Projeto +'}
                </button>
            </div>


            {showForm && (
                <div className="mb-8 border p-4 rounded-lg bg-gray-50">
                    <TrabalhoForm onTrabalhoSaved={handleTrabalhoSaved} onClose={() => setShowForm(false)} />
                </div>
            )}
            
            {error && <div className="text-red-600 bg-red-100 p-4 rounded text-center mb-4">{error}</div>}


            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">HD Alocado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Prazo</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {trabalhos.map((trabalho) => {
                            const prazo = getDaysRemaining(trabalho.data_fim_prevista);
                            return (
                                <tr key={trabalho.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {trabalho.titulo}
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{trabalho.descricao}</p>
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                        {trabalho.hd_usado_nome || trabalho.hd_usado}
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {trabalho.cliente_nome || trabalho.cliente}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                                        <span className={prazo.class}>
                                            {prazo.text}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                                        <button
                                            onClick={() => setEditingTrabalho(trabalho)}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(trabalho.id, trabalho.titulo)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {trabalhos.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Nenhum projeto encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default TrabalhoList;