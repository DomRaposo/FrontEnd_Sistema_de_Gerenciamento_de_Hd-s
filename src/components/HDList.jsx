
import HDForm from './HDForm'; // 💡 

const HDList = () => {
 
  const [showForm, setShowForm] = useState(false); 

  const [isEditingHD, setEditingHD] = useState(null);

 
  const handleHDCreated = () => {
      fetchHDs(searchTerm);
      setShowForm(false);   
  };

  const handleHDUpdated = () => {
    fetchHDs(searchTerm);
    setEditingHD(null);
  }

  const handleDelete = async (id, nome) => {
        if (window.confirm(`Tem certeza que deseja DELETAR o HD "${nome}" e todo o seu conteúdo? Esta ação é irreversível!`)) {
            setLoading(true);
            try {
                await axios.delete(`${API_URL}${id}/`);
                fetchHDs(searchTerm); // Recarrega a lista
            } catch (err) {
                setError("Erro ao deletar o HD.");
            } finally {
                setLoading(false);
            }
        }
    };
  
 
  return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            
          
            {editingHD && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
                        <HDForm 
                            hdData={editingHD} 
                            onHDUpdated={handleHDUpdated} 
                            onClose={() => setEditingHD(null)} 
                        />
                    </div>
                </div>
            )}
            
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Gerenciamento de HDs ({hds.length})</h2>
            
            <div className="mb-6 flex justify-between items-center">
                
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition duration-150"
                >
                    {showForm ? 'Cancelar Cadastro' : 'Novo HD +'}
                </button>
            </div>

            {/* Formulário de Criação Condicional */}
            {showForm && (
                <div className="mb-8 border p-4 rounded-lg">
                    <HDForm onHDCreated={handleHDCreated} />
                </div>
            )}
            
            
            
            {/* 💡 Grid de HDs - Adicionando botões de Ação */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hds.map((hd) => (
                        <div key={hd.id} className="border p-4 rounded-lg shadow-sm">
                            {/* ... (Exibição de dados) ... */}
                            <p className="text-xl font-bold text-indigo-700">{hd.nome_hd}</p>
                            {/* ... (Outros campos) ... */}

                            <div className="mt-4 pt-3 border-t flex justify-end gap-3">
                                {/* Botão de Editar */}
                                <button
                                    onClick={() => setEditingHD(hd)}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Editar
                                </button>
                                {/* Botão de Deletar */}
                                <button
                                    onClick={() => handleDelete(hd.id, hd.nome_hd)}
                                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HDList;