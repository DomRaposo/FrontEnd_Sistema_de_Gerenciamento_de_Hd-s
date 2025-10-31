import React, { useState } from 'react';
import axios from 'axios';


const API_URL = 'http://127.0.0.1:8000/api/v1/users/'; 

const UserForm = ({ onUserCreated }) => {
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', first_name: '', last_name: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {

            const response = await axios.post(API_URL, formData);
            setSuccess(`Usuário ${response.data.username} criado com sucesso!`);
            setFormData({ username: '', email: '', password: '', first_name: '', last_name: '' });
            if (onUserCreated) onUserCreated(); 

        } catch (err) {
            console.error("Erro ao criar usuário:", err.response);
            if (err.response && err.response.status === 403) {
                setError("Acesso Negado. Apenas Superusuários podem criar contas (Erro 403).");
            } else if (err.response && err.response.data) {
                
                const errorKeys = Object.keys(err.response.data);
                const firstError = err.response.data[errorKeys[0]];
                setError(`Erro de validação: ${firstError.join ? firstError.join(' ') : firstError}`);
            } else {
                setError("Erro desconhecido ao cadastrar usuário.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">Cadastrar Novo Usuário</h3>
            
            {success && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded">{success}</div>}
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="username" placeholder="Nome de Usuário (Obrigatório)" required value={formData.username} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                <input type="password" name="password" placeholder="Senha (Obrigatório)" required value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                <input type="text" name="first_name" placeholder="Primeiro Nome" value={formData.first_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                <input type="text" name="last_name" placeholder="Sobrenome" value={formData.last_name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />

                <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-150 disabled:bg-purple-400">
                    {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
                </button>
            </form>
        </div>
    );
};

export default UserForm;