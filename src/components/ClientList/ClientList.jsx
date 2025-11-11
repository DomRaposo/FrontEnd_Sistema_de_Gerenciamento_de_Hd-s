import React, { useState, useEffect, useCallback } from 'react';
import styles from './ClientList.module.css'; 
import ClientForm from '../ClientForm/ClientForm';
import { getClients, deleteClient } from "../services/clientService.js";

// ... Resto do seu componente ClientList.jsx ...
const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    
    const fetchClients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClients();
            setClients(data);
        } catch (err) {
            setError("Não foi possível carregar os clientes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);


    const handleClientCreated = () => {
        fetchClients();
        setShowForm(false);
    };

    const handleClientUpdated = () => {
        fetchClients();
        setEditingClient(null);
    };

    const handleDelete = async (id, nome) => {
        if (window.confirm(`Tem certeza que deseja DELETAR o cliente "${nome}"? Isso removerá todos os trabalhos associados!`)) {
            setLoading(true);
            try {
                await deleteClient(id);
                fetchClients(); 
            } catch (err) {
                setError("Erro ao deletar o cliente.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading && clients.length === 0) return <div className={styles.loadingText}>Carregando clientes...</div>;
    if (error) return <div className={styles.errorBox}>{error}</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gerenciamento de Clientes</h2>

            
            {editingClient && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <ClientForm 
                            clientData={editingClient} 
                            onClientUpdated={handleClientUpdated} 
                            onClose={() => setEditingClient(null)} 
                        />
                    </div>
                </div>
            )}
            
            
            <div className={styles.actionHeader}>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={styles.newClientButton}
                >
                    {showForm ? 'Cancelar Cadastro' : 'Novo Cliente +'}
                </button>
            </div>

            
            {showForm && (
                <div className={styles.formContainer}>
                    <ClientForm onClientCreated={handleClientCreated} />
                </div>
            )}
            
            
            <div className={styles.tableWrapper}>
                <table className={styles.clientTable}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th className={styles.th}>Nome</th>
                            <th className={styles.th}>Contato</th>
                            <th className={styles.th}>Ações</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td className={styles.tdName}>{client.nome}</td>
                                <td className={styles.td}>{client.contato}</td>
                                <td className={styles.tdActions}>
                                    <button
                                        onClick={() => setEditingClient(client)}
                                        className={styles.editButton}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id, client.nome)}
                                        className={styles.deleteButton}
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientList;