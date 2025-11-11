import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./HDList.module.css";
const API_URL = 'http://127.0.0.1:8000/api/v1/hds/';

const HDForm = ({ hdData, onHDCreated, onHDUpdated, onClose = () => {} }) => {
    
    const [formData, setFormData] = useState({
        nome_hd: '',
        serial_number: '',
        
        tamanho_total_gb: 0.00, 
        
        tamanho_livre_gb: 0.00, 
        
        localizacao: '',
        
        status: 'LIVRE', 
    });
    
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    
    const isEditing = !!hdData;

    // 🚩 CORREÇÃO ESSENCIAL 1: Ajustar o useEffect para carregar TODOS os 5 campos na edição e resetar na criação.
    useEffect(() => {
        if (isEditing) {
            setFormData({
                nome_hd: hdData.nome_hd || '',
                serial_number: hdData.serial_number || '',
                
                // CAMPO CORRIGIDO
                tamanho_total_gb: String(hdData.tamanho_total_gb || 0), 
                
                tamanho_livre_gb: String(hdData.tamanho_livre_gb || 0), 
                localizacao: hdData.localizacao || '',

                // CAMPO CORRIGIDO
                status: hdData.status || 'LIVRE', 
            });
        } else {
            // Reset do estado para a criação, incluindo todos os campos numéricos como 0.00
            setFormData({
                nome_hd: '',
                serial_number: '',
                tamanho_total_gb: 0.00, 
                tamanho_livre_gb: 0.00, 
                localizacao: '',
                status: 'LIVRE',
            });
        }
        setFormErrors({});
    }, [hdData, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormErrors({});
        
        // Função auxiliar para garantir que valores vazios ('') ou inválidos se tornem 0.00
        const parseDecimal = (value) => parseFloat(value) || 0.00;

        const payload = {
            ...formData,
            // 1. Garante que tamanho_total_gb seja um número válido
            tamanho_total_gb: parseDecimal(formData.tamanho_total_gb), 
            
            // 2. Lógica de tamanho_livre_gb
            tamanho_livre_gb: isEditing 
                ? parseDecimal(formData.tamanho_livre_gb)
                : parseDecimal(formData.tamanho_total_gb), 
            
            // 3. Garante que o número de série e localização não sejam null ou undefined.
            serial_number: formData.serial_number || '',
            localizacao: formData.localizacao || '',
        };

        try {
            if (isEditing) {
                // Requisição PUT
                await axios.put(`${API_URL}${hdData.id}/`, payload);
                if (onHDUpdated) onHDUpdated();
            } else {
                // Requisição POST
                await axios.post(API_URL, payload);
                if (onHDCreated) onHDCreated();
                
                // Limpa o formulário após o sucesso na criação
                setFormData({ nome_hd: '', serial_number: '', tamanho_total_gb: 0.00, localizacao: '', status: 'LIVRE', tamanho_livre_gb: 0.00 });
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                // Captura os erros de validação do DRF
                setFormErrors(err.response.data); 
                console.error("DRF Validation Errors:", err.response.data);
                
            } else {
                console.error("Erro na requisição:", err);
            }
        } finally {
            setLoading(false);
        }
    };
    
    // 🚩 CORREÇÃO ESSENCIAL 2: Adicionar a função que estava faltando (Resolve o ReferenceError)
    const getFieldError = (fieldName) => {
        const error = formErrors[fieldName];
        if (Array.isArray(error)) return error[0];
        return error;
    };
    
    const title = isEditing ? `Editar HD: ${formData.nome_hd || hdData.nome_hd}` : 'Cadastrar Novo HD';
    const submitButtonText = isEditing ? 'Salvar Alterações' : 'Cadastrar';

    return (

    <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
            
            <h3 className={styles.formTitle}>{title}</h3>
            
            <div className={styles.inputGroup}>
                <label htmlFor="nome_hd" className={styles.label}>Nome do HD: </label>
                <input
                    type="text"
                    id="nome_hd"
                    name="nome_hd"
                    value={formData.nome_hd}
                    onChange={handleChange}
                    className={styles.input}
                    disabled={loading}
                />
                {getFieldError('nome_hd') && <p className={styles.errorText}>{getFieldError('nome_hd')}</p>}
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="serial_number" className={styles.label}>Número de Série: </label>
                <input
                    type="text"
                    id="serial_number"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleChange}
                    className={styles.input}
                    disabled={loading}
                />
                {getFieldError('serial_number') && <p className={styles.errorText}>{getFieldError('serial_number')}</p>}
            </div>
            
            {/* 🚩 CORREÇÃO ESSENCIAL 3: Adicionar o campo tamanho_total_gb no JSX */}
            <div className={styles.inputGroup}>
                <label htmlFor="tamanho_total_gb" className={styles.label}>Tamanho Total (GB): </label>
                <input
                    type="number"
                    id="tamanho_total_gb"
                    name="tamanho_total_gb"
                    value={formData.tamanho_total_gb} 
                    onChange={handleChange}
                    className={styles.input}
                    disabled={loading}
                />
                {getFieldError('tamanho_total_gb') && <p className={styles.errorText}>{getFieldError('tamanho_total_gb')}</p>}
            </div>


            <div className={styles.inputGroup}>
                <label htmlFor="tamanho_livre_gb" className={styles.label}>Tamanho Livre (GB): </label>
                <input
                    type="number"
                    id="tamanho_livre_gb"
                    name="tamanho_livre_gb"
                    value={formData.tamanho_livre_gb}
                    onChange={handleChange}
                    className={styles.input}
                    disabled={loading || !isEditing} // Desabilita na criação (é calculado)
                />
                {getFieldError('tamanho_livre_gb') && <p className={styles.errorText}>{getFieldError('tamanho_livre_gb')}</p>}
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="localizacao" className={styles.label}>Localização:</label>
                <input
                    type="text"
                    id="localizacao"
                    name="localizacao"
                    value={formData.localizacao}
                    onChange={handleChange}
                    className={styles.input}
                    disabled={loading}
                />
                {getFieldError('localizacao') && <p className={styles.errorText}>{getFieldError('localizacao')}</p>}
            </div>
            
            {/* 🚩 CORREÇÃO ESSENCIAL 4: Adicionar o campo status no JSX */}
            <div className={styles.inputGroup}>
                <label htmlFor="status" className={styles.label}>Status: </label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={styles.input}
                    disabled={loading}
                >
                    <option value="LIVRE">Livre (Aguardando Projeto)</option>
                    <option value="EM_USO">Em Uso (Projeto Ativo)</option>
                    <option value="ARQUIVADO">Arquivado (Dados Completos)</option>
                    <option value="MANUTENCAO">Manutenção/Defeito</option>
                </select>
                {getFieldError('status') && <p className={styles.errorText}>{getFieldError('status')}</p>}
            </div>

            <div className={styles.actions}>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                >
                    {loading ? 'Processando...' : submitButtonText}
                </button>
                
                <button
                    type="button"
                    onClick={onClose}
                    className={styles.cancelButton}
                    disabled={loading}
                >
                    Cancelar
                </button>
            </div>
        </form>
    </main>
    
    );
};

export default HDForm;