import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './ClientForm.module.css';

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
        // 3. Substituir classes Tailwind por classes do Module
        <div className={styles.container}>
            <h3 className={styles.title}>
                {isEditing ? `Editar Cliente: ${clientData.nome}` : 'Cadastrar Novo Cliente'}
            </h3>
            
            {success && <div className={styles.successMessage}>Cliente salvo com sucesso!</div>}
            {error && <div className={styles.errorMessage}>Erro: {error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                
                <div>
                    <label htmlFor="nome" className={styles.label}>Nome</label>
                    <input type="text" name="nome" id="nome" required
                        value={formData.nome} onChange={handleChange}
                        className={styles.inputField}
                    />
                </div>

                
                <div>
                    <label htmlFor="contato" className={styles.label}>Contato</label>
                    <input type="text" name="contato" id="contato"
                        value={formData.contato} onChange={handleChange}
                        className={styles.inputField}
                    />
                </div>
                
                
                <div>
                    <label htmlFor="observacoes" className={styles.label}>Observações</label>
                    <textarea name="observacoes" id="observacoes"
                        value={formData.observacoes} onChange={handleChange}
                        rows="3"
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? 'Salvando...' : 'Salvar Cliente'}
                    </button>
                    
                    {isEditing && onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.closeButton}
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