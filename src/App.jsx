import React, { useState } from 'react';
import HDList from './components/HDList'; 
import ClientList from './components/ClientList'; 
import TrabalhoList from './components/TrabalhoList';
import './index.css'; 


function App() {
  
  const [activeTab, setActiveTab] = useState('hds'); 

  const renderContent = () => {
    if (activeTab === 'hds') {
      return <HDList />;
    } else if (activeTab === 'clients') {
      return <ClientList />;
    } else if (activeTab === 'trabalhos') {
      return <TrabalhoList/>;
    }
    return <p>Selecione uma opção de gerenciamento.</p>;
  };

  const getTabClasses = (tabName) => 
    `px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
      activeTab === tabName 
        ? 'bg-white text-indigo-700 border-b-2 border-indigo-700' 
        : 'text-white hover:bg-indigo-700'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Legado HD Manager
          </h1>
          
          
          <nav className="flex space-x-2 border-b border-indigo-700">
            <button
              onClick={() => setActiveTab('hds')}
              className={getTabClasses('hds')}
            >
              Gerenciar HDs
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={getTabClasses('clients')}
            >
            
              Gerenciar Clientes
            </button>

            <button onClick={() => setActiveTab('trabalhos')} className={getTabClasses('trabalhos')}>
                Gerenciar Projetos  
              </button>  
          </nav>

        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;