// frontend/src/components/HDList.jsx (Apenas as mudanças necessárias)

// ... imports existentes (useState, useEffect, useCallback, axios)
import HDForm from './HDForm'; // 💡 Importe o novo formulário

const HDList = () => {
  // ... (Estados existentes: hds, loading, error, searchTerm)
  const [showForm, setShowForm] = useState(false); // 💡 Novo estado para mostrar/esconder o formulário
  // ... (fetchHDs e useEffect existentes)

  // 💡 Nova função para ser chamada após o sucesso do POST
  const handleHDCreated = () => {
      fetchHDs(searchTerm); // Recarrega a lista de HDs
      setShowForm(false);   // Opcional: Esconde o formulário após o sucesso
  };
  
  // ... (handleSearchChange e handleSearchSubmit existentes)

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Gerenciamento de HDs ({hds.length})</h2>
      
      {/* Botão de Toggle do Formulário */}
      <div className="mb-6 flex justify-between items-center">
          <form onSubmit={handleSearchSubmit} className="flex gap-3 w-3/4">
             {/* ... Seu Input de Busca e Botão ... */}
          </form>
          <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition duration-150"
          >
              {showForm ? 'Cancelar Cadastro' : 'Novo HD +'}
          </button>
      </div>

      {/* 💡 Formulário Condicional */}
      {showForm && (
          <div className="mb-8 border p-4 rounded-lg">
              <HDForm onHDCreated={handleHDCreated} />
          </div>
      )}
      
      {/* ... (Lógica de loading e erro) ... */}
      
      {/* 💡 Grid de HDs (Restante do componente) */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ... Mapeamento de HDs ... */}
        </div>
      )}
    </div>
  );
};

export default HDList;