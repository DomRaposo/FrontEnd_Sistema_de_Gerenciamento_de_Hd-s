
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 


const TOKEN_URL = 'http://127.0.0.1:8000/api/token/'; 
const REFRESH_URL = 'http://127.0.0.1:8000/api/token/refresh/'; 

const TOKEN_REFRESH_INTERVAL = 1000 * 60 * 4; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const setAxiosAuthHeader = (accessToken) => {
    if (accessToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

export const AuthProvider = ({ children }) => {
    
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );
    const [user, setUser] = useState(() => {
        const storedTokens = localStorage.getItem('authTokens');
        if (storedTokens) {
            try {
                const token = JSON.parse(storedTokens).access;
                return jwtDecode(token); 
            } catch (error) {
                console.error("Erro ao decodificar token na inicialização:", error);
                return null;
            }
        }
        return null;
    }); 
    const [loading, setLoading] = useState(true);

    
    const loginUser = async (username, password) => {
        setLoading(true);
        try {
            const response = await axios.post(TOKEN_URL, { username, password });
            
            if (response.status === 200) {
                const data = response.data;
                const decodedUser = jwtDecode(data.access); 

                setAuthTokens(data);
                setUser(decodedUser); 
                localStorage.setItem('authTokens', JSON.stringify(data));
                setAxiosAuthHeader(data.access);
                return true;
            }
        } catch (error) {
            
            console.error("Erro no login:", error.response ? error.response.data : error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    
    const logoutUser = useCallback(() => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        setAxiosAuthHeader(null);
        
    }, []);

    
    const updateToken = useCallback(async () => {
        if (!authTokens || !authTokens.refresh) {
            
            if (!loading) { 
                console.log("Token de refresh ausente. Forçando logout.");
                logoutUser();
            }
            return;
        }

        try {
            const response = await axios.post(REFRESH_URL, { 
                refresh: authTokens.refresh 
            });

            if (response.status === 200) {
                const data = response.data;
                const decodedUser = jwtDecode(data.access);

                setAuthTokens(prev => ({ ...prev, access: data.access }));
                setUser(decodedUser);
                localStorage.setItem('authTokens', JSON.stringify({ ...authTokens, access: data.access }));
                setAxiosAuthHeader(data.access);
                console.log("Token de acesso atualizado.");
            } else {
                
                logoutUser();
            }
        } catch (error) {
            console.error("Erro na atualização do token. Forçando logout:", error);
            logoutUser();
        }
    }, [authTokens, logoutUser, loading]);

    
    useEffect(() => {
        if (authTokens) {
            setAxiosAuthHeader(authTokens.access);
        }
        setLoading(false);
    }, [authTokens]);

    
    useEffect(() => {
        
        let interval = null;
        if (authTokens) {
            interval = setInterval(() => {
                updateToken();
            }, TOKEN_REFRESH_INTERVAL);
        }
        
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [authTokens, updateToken]);


    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
        loading,
        
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
