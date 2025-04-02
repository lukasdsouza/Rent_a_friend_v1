
import React, { useState, useEffect } from 'react';
import { findCompatibleUsers } from '../services/matchmakingService';
import { useNavigate } from 'react-router-dom';

const MatchmakingPage = () => {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    minRating: 0,
    interests: []
  });
  const navigate = useNavigate();
  
  // Simular o ID do usuário logado (em um cenário real, viria do contexto de autenticação)
  const currentUserId = localStorage.getItem('userId') || 'user123';

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const compatibleUsers = await findCompatibleUsers(currentUserId, filters);
        setMatches(compatibleUsers);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar matches:', err);
        setError('Não foi possível carregar usuários compatíveis. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadMatches();
  }, [currentUserId, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'minRating' ? parseFloat(value) : value
    }));
  };

  const viewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleAddInterest = (interest) => {
    if (interest && !filters.interests.includes(interest)) {
      setFilters(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const handleRemoveInterest = (interest) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  return (
    <div className="matchmaking-page p-4">
      <h1 className="text-2xl font-bold mb-6">Encontre Amigos Compatíveis</h1>
      
      {/* Filtros */}
      <div className="filter-panel bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Localização
            </label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700"
            >
              <option value="">Todas as localizações</option>
              <option value="São Paulo">São Paulo</option>
              <option value="Rio de Janeiro">Rio de Janeiro</option>
              <option value="Belo Horizonte">Belo Horizonte</option>
              <option value="Brasília">Brasília</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">
              Avaliação Mínima
            </label>
            <select
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-700"
            >
              <option value="0">Qualquer avaliação</option>
              <option value="3">3+ estrelas</option>
              <option value="4">4+ estrelas</option>
              <option value="4.5">4.5+ estrelas</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium">
            Interesses
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {filters.interests.map(interest => (
              <div 
                key={interest}
                className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                <span>{interest}</span>
                <button 
                  onClick={() => handleRemoveInterest(interest)}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex">
            <input
              type="text"
              id="interest"
              placeholder="Adicionar interesse..."
              className="flex-grow p-2 border rounded-l-md"
            />
            <button
              onClick={() => {
                const input = document.getElementById('interest');
                handleAddInterest(input.value);
                input.value = '';
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
            >
              +
            </button>
          </div>
        </div>
      </div>
      
      {/* Resultados */}
      <div className="matches-list">
        {loading ? (
          <p className="text-center py-8">Buscando pessoas compatíveis...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-8">{error}</p>
        ) : matches.length === 0 ? (
          <p className="text-center py-8">Nenhuma pessoa compatível encontrada com esses filtros.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map(match => (
              <div 
                key={match.id}
                className="match-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105"
              >
                <div className="relative">
                  <img 
                    src={match.photoURL || 'https://via.placeholder.com/300x150'} 
                    alt={match.displayName} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                    {match.compatibilityScore}% match
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{match.displayName}</h3>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path 
                            fillRule="evenodd" 
                            d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" 
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm">
                      {match.averageRating ? match.averageRating.toFixed(1) : 'Novo'}
                      {match.totalRatings && ` (${match.totalRatings})`}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-4 line-clamp-2">
                    {match.bio || 'Sem biografia disponível'}
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-1">Interesses em comum:</p>
                    <div className="flex flex-wrap gap-1">
                      {match.commonInterests.map(interest => (
                        <span 
                          key={interest}
                          className="bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                      {match.commonInterests.length === 0 && (
                        <span className="text-xs text-gray-500">Nenhum interesse em comum</span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => viewProfile(match.id)}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchmakingPage;
