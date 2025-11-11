import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; 
import styles from './LoginPage.module.css';

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
        if (!success) setError('Falha no login. Verifique o nome de usuário e a senha.');

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                
            <h2 className={styles.title}>Acesso HD Manager</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && (
                        <div className={styles.errorBox} role="alert">
                            {error}
                        </div>
                    )}
                    
                        <label className={styles.label}>Nome de Usuário</label>
                    <div className={styles.inputGroup}>
                        
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={styles.input}
                            placeholder="Seu usuário"
                        />  
                    </div>
                    <label className={styles.label}>Senha</label>
                    <div className={styles.inputGroup}>                  
                        
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Sua senha"
                        />
                        
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`${styles.button} ${loading ? styles.disabled : ''}`}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>

                    
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
