import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./HDForm.module.css";

const API_URL = 'http://127.0.0.1:8000/api/v1/hds/';

const STATUS_OPTIONS = [
    { value: 'LIVRE', label: 'Livre (Aguardando Projeto)' },
    { value: 'EM_USO', label: 'Em Uso (Projeto Ativo)' },
    { value: 'ARQUIVADO', label: 'Arquivado (Dados Completos)' },
    { value: 'MANUTENCAO', label: 'Manutenção/Defeito' },
];

const HDForm = ({ hdData, onHDCreated, onHDUpdated, onClose }) => {
    const [formData, setFormData] = useState({
        nome_hd: '',
        serial_number: '',
        tamanho_total_gb: 0.00,
        localizacao: '',
        status: 'LIVRE', 
        tamanho_livre_gb: 0.00,
    });
    const [formErrors, setFormErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const isEditing = !!hdData;

    useEffect(() => {
        if (hdData) {
            setFormData({
                nome_hd: hdData.nome_hd || '',
                serial_number: hdData.serial_number || '',
                tamanho_total_gb: parseFloat(hdData.tamanho_total_gb) || 0.00,
                localizacao: hdData.localizacao || '',
                status: hdData.status || 'LIVRE',
                tamanho_livre_gb: parseFloat(hdData.tamanho_livre_gb) || 0.00,
            });
        }
        setFormErrors({});
        setSuccess(false);
        setError(null);
    }, [hdData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'tamanho_total_gb') 
                ? (value === '' ? 0.00 : parseFloat(value)) 
                : value,
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFormErrors({});

    
    const payload = {
        ...formData,
        
        tamanho_total_gb: parseFloat(formData.tamanho_total_gb) || 0.00, 
        
        tamanho_livre_gb: isEditing 
            ? formData.tamanho_livre_gb 
            : (parseFloat(formData.tamanho_total_gb) || 0.00), 
    };

    try {
        if (isEditing) {
            await axios.put(`${API_URL}${hdData.id}/`, payload);
            setSuccess(true);
            if (onHDUpdated) onHDUpdated(); 
        } else {
            await axios.post(API_URL, payload);
            setSuccess(true);
            
            setFormData({ 
                nome_hd: '', 
                serial_number: '', 
                tamanho_total_gb: 0.00, 
                localizacao: '', 
                status: 'LIVRE' 
            }); 
            if (onHDCreated) onHDCreated(); 
        }
    } catch (err) {
        if (err.response && err.response.status === 400) {
            setFormErrors(err.response.data);
            setError("Erro de validação. Verifique os campos.");
            console.error("Erro detalhado do DRF:", err.response.data); 
        } else {
            setError("Erro ao salvar. Tente novamente ou verifique o console.");
        }
    } finally {
        setLoading(false);
    }
};

    const getFieldError = (fieldName) => {
        const error = formErrors[fieldName];
        if (Array.isArray(error)) return error[0];
        return error;
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                {isEditing ? `Editar HD: ${formData.nome_hd}` : 'Cadastrar Novo HD'}
            </h2>

            {success && <div className={styles.alertSuccess}>HD salvo com sucesso!</div>}
            {error && <div className={styles.alertError}>Erro: {error}</div>}

            <form onSubmit={handleSubmit}>
                {[
                    { label: 'Nome do HD', name: 'nome_hd', type: 'text' },
                    { label: 'Número de Série', name: 'serial_number', type: 'text' },
                    { label: 'Tamanho Total (GB)', name: 'tamanho_total_gb', type: 'number', step: '0.01' },
                    { label: 'Localização', name: 'localizacao', type: 'text' },
                ].map(field => (
                    <div className={styles.formGroup} key={field.name}>
                        <label className={styles.label} htmlFor={field.name}>{field.label}</label>
                        <input
                            className={styles.inputField}
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            step={field.step}
                            value={formData[field.name]}
                            onChange={handleChange}
                        />
                        {getFieldError(field.name) && (
                            <p className={styles.errorText}>{getFieldError(field.name)}</p>
                        )}
                    </div>
                ))}

                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={styles.inputField}
                    >
                        {STATUS_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {getFieldError('status') && (
                        <p className={styles.errorText}>{getFieldError('status')}</p>
                    )}
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.buttonNew}
                    >
                        {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar HD'}
                    </button>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.buttonCancel}
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
    