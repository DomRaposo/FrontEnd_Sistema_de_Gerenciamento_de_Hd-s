import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HDList from './components/HDList/HDList'; 
import ClientList from './components/ClientList'; 
import TrabalhoList from './components/TrabalhoList';
import LoginPage from './components/LoginPage/LoginPage'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import UserForm from './components/UserForm'; 
import './index.css'; 


function AppLayout() {
    
    const location = useLocation();
    const { user, logoutUser } = useAuth();
    
 
    const getTabClasses = (path) => 
        `px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
          location.pathname === path 
            ? 'bg-white text-indigo-700 border-b-2 border-indigo-700' 
            : 'text-white hover:bg-indigo-700'
        }`;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-white">
                            Legado HD Manager
                        </h1>
                        
                        {user && (
                            <div className="flex items-center space-x-4">
                            
                                <span className="text-white text-sm">Olá, {user.username}</span> 
                                <button
                                    onClick={logoutUser}
                                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 text-sm"
                                >
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <nav className="flex space-x-2 border-b border-indigo-700 mt-4">
                        <Link to="/hds" className={getTabClasses('/hds')}>
                            Gerenciar HDs | 
                        </Link>
                        <Link to="/clients" className={getTabClasses('/clients')}>
                            Gerenciar Clientes | 
                        </Link>
                        <Link to="/trabalhos" className={getTabClasses('/trabalhos')}>
                            Gerenciar Projetos
                        </Link>
                        
                        
                        <Link to="/admin-painel" className={getTabClasses('/admin-painel')}>
                            Painel Admin
                        </Link>
                    </nav>

                </div>
            </header>
            
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    
                    <Routes>
                        <Route path="/hds" element={<HDList />} />
                        <Route path="/clients" element={<ClientList />} />
                        <Route path="/trabalhos" element={<TrabalhoList />} />
                        
                       
                        <Route path="/admin-painel" element={
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                                <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-indigo-700">Funções de Administração</h2>
                                
                                
                                <UserForm onUserCreated={() => {
                                    
                                    console.log("Usuário criado, atualizando lista...");
                                }} /> 
                            </div>
                        } />
                        
                        
                        <Route path="*" element={<HDList />} /> 
                    </Routes>
                </div>
            </main>
        </div>
    );
}



function AuthGuard() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="text-center py-20 text-indigo-600">Carregando autenticação...</div>;
    }

    
    if (location.pathname === '/login') {
        
        if (user) return <AppLayout />;
        return <LoginPage />;
    }

    
    if (!user) {
        return <LoginPage />;
    }
    
    
    return <AppLayout />;
}


function App() {
    return (
        <Router>
            <AuthProvider>
                <AuthGuard />
            </AuthProvider>
        </Router>
    );
}

export default App;