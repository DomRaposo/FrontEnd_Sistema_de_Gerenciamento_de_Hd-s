import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = 'http://127.0.0.1:8000/api/v1/hds/';


const STATUS_OPTIONS = [
    { value: 'LIVRE', label: 'Livre (Aguardando Projeto)' },
    { value: 'EM_USO', label: 'Em Uso (Projeto Ativo)' },
    { value: 'ARQUIVADO', label: 'Arquivado (Dados Completos)' },
    { value: 'MANUTENCAO', label: 'Manutenção/Defeito' },
];

const HDForm = ({ hdData, onHDCreated, onUpdated, onCLose }) => {
 
    const [formData, setFormData] = useState({
        nome_hd: '',
        serial_number: '',
        tamanho_total_gb: 0.00,
        localizacao: '',
        status: 'LIVRE', 
    });
    
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        if (hdData) {
            
            setFormData({
                
                nome_hd: hdData.nome_hd,
                serial_number: hdData.serial_number,
                tamanho_total_gb: parseFloat(hdData.tamanho_total_gb),
                localizacao: hdData.localizacao,
                status: hdData.status,
            });
        }
    }, [hdData]);
    

    const isEditing = !!hdData;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            
            [name]: (name === 'tamanho_total_gb') ? parseFloat(value) : value,
        }));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (isEditing) {
                
                await axios.put(`${API_URL}${hdData.id}/`, formData);
                setSuccess(true);
                if (onHDUpdated) onHDUpdated(); 
            } else {
                
                await axios.post(API_URL, formData);
                setSuccess(true);
                
                setFormData({ nome_hd: '', serial_number: '', tamanho_total_gb: 0.00, localizacao: '', status: 'LIVRE' });
                if (onHDCreated) onHDCreated(); 
            }

        } catch (err) {
            console.error("Erro no formulário:", err.response ? err.response.data : err.message);
            setError(err.response ? JSON.stringify(err.response.data) : "Erro ao salvar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                {isEditing ? `Editar HD: ${hdData.nome_hd}` : 'Cadastrar Novo HD'}
            </h2>
            
            {success && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded">HD salvo com sucesso!</div>}
            {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">Erro: {error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white flex-grow ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar HD'}
                    </button>
                    
                    {isEditing && onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default HDForm;