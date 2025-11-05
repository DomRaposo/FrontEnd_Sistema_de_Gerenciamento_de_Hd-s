import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import clsx from 'clsx'; // Adicionar 'npm install clsx' se necessário
import HDList from './components/HDList/HDList'; 
import ClientList from './components/ClientList'; 
import TrabalhoList from './components/TrabalhoList';
import LoginPage from './components/LoginPage/LoginPage'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import UserForm from './components/UserForm'; 
import styles from './App.module.css'; 


function AppLayout() {
    
    const location = useLocation();
    // Você deve garantir que 'user' contenha 'is_superuser' via JWT customizado!
    const { user, logoutUser } = useAuth();
    const isAdmin = user && user.is_superuser;
    
    // Função agora usa clsx e as classes importadas
    const getTabClasses = (path) => {
        const isActive = location.pathname === path;
        
        return clsx(
            styles.navLink, // Classes base
            {
                [styles.navLinkActive]: isActive // Classes ativas
            }
        );
    };

    return (
        <div className={styles.appContainer}>
            <header className={styles.header}>
                    
                    <nav className={styles.nav}>
                        <div className={styles.titlenav}>
                        <h1 className={styles.title}>
                            Legado HD Manager
                        </h1>
                        
                        {user && (
                            <div className={styles.userInfo}>
                                <span className={styles.username}>
                                    Olá, {user.username} {isAdmin && '(Admin)'}
                                </span> 
                                <button onClick={logoutUser} className={styles.logoutButton}> Sair </button>
                            </div>
                        )}
                        </div>
                        <div className={styles.navb}>
                        <Link to="/hds" className={getTabClasses('/hds')}>
                            Gerenciar HDs 
                        </Link>
                        <Link to="/clients" className={getTabClasses('/clients')}>
                            Gerenciar Clientes 
                        </Link>
                        <Link to="/trabalhos" className={getTabClasses('/trabalhos')}>
                            Gerenciar Projetos
                        </Link>
                        
                        {/* Exibir o link Painel Admin apenas se for Superusuário */}
                        {isAdmin && (
                            <Link to="/admin-painel" className={getTabClasses('/admin-painel')}>
                                Painel Admin
                            </Link>
                        )}
                        </div>
                    </nav>

                
            </header>
            
            <main>
                <div className={styles.mainContent}>
                    
                    <Routes>
                        <Route path="/hds" element={<HDList />} />
                        <Route path="/clients" element={<ClientList />} />
                        <Route path="/trabalhos" element={<TrabalhoList />} />
                        
                        <Route path="/admin-painel" element={
                            // Proteção de rota interna
                            isAdmin ? (
                                <div className={styles.adminPanel}>
                                    <h2 className={styles.adminTitle}>Funções de Administração</h2>
                                    <UserForm onUserCreated={() => console.log("Usuário criado!")} /> 
                                </div>
                            ) : (
                                <div className={styles.loadingText}>Acesso negado. Você não tem permissão de administrador.</div>
                            )
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

    // Reutilizando a classe de texto de loading/erro
    if (loading) {
        return <div className={styles.loadingText}>Carregando autenticação...</div>;
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