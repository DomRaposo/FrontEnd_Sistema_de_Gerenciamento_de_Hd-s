import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    
    const { loginUser } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        
        const success = await loginUser(username, password);

        if (!success) {
            setError('Falha no login. Verifique o nome de usuário e a senha.');
        } 
        
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-indigo-600">
                    Acesso ao Legado HD Manager
                </h2>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Campo Nome de Usuário */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Nome de Usuário
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Seu usuário"
                        />
                    </div>

                    {/* Campo Senha */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Sua senha"
                        />
                    </div>

                    
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;