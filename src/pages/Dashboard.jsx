import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');

  // Simular busca de atividades (substitua por chamada real à API)
  useEffect(() => {
    const mockActivities = [
      {
        id: 1,
        title: "Café e Conversa",
        description: "Bate-papo descontraído em uma cafeteria local",
        image: "https://source.unsplash.com/random/400x300?coffee",
        date: "2024-02-27T15:00:00",
        location: "Café Central",
        participants: 3,
        maxParticipants: 5,
        category: "social"
      },
      {
        id: 2,
        title: "Passeio no Parque",
        description: "Caminhada e picnic no parque da cidade",
        image: "https://source.unsplash.com/random/400x300?park",
        date: "2024-02-28T10:00:00",
        location: "Parque Municipal",
        participants: 5,
        maxParticipants: 8,
        category: "outdoor"
      },
      {
        id: 3,
        title: "Sessão de Cinema",
        description: "Assistir ao novo lançamento com o grupo",
        image: "https://source.unsplash.com/random/400x300?movie",
        date: "2024-02-29T19:00:00",
        location: "Cinema Shopping",
        participants: 4,
        maxParticipants: 6,
        category: "entertainment"
      }
    ];

    setActivities(mockActivities);
  }, []);

  const filterActivities = (category) => {
    setFilter(category);
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === filter);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Descubra atividades interessantes na sua região</p>
      </div>

      <div className="quick-actions">
        <Link to="/create-activity" className="action-button create">
          Criar Nova Atividade
        </Link>
        <Link to="/nearby" className="action-button nearby">
          Ver Mapa de Atividades
        </Link>
      </div>

      <div className="filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => filterActivities('all')}
        >
          Todas
        </button>
        <button 
          className={`filter-button ${filter === 'social' ? 'active' : ''}`}
          onClick={() => filterActivities('social')}
        >
          Social
        </button>
        <button 
          className={`filter-button ${filter === 'outdoor' ? 'active' : ''}`}
          onClick={() => filterActivities('outdoor')}
        >
          Ao Ar Livre
        </button>
        <button 
          className={`filter-button ${filter === 'entertainment' ? 'active' : ''}`}
          onClick={() => filterActivities('entertainment')}
        >
          Entretenimento
        </button>
      </div>

      <div className="activities-grid">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="activity-card">
            <div className="activity-image">
              <img src={activity.image} alt={activity.title} />
              <span className="activity-category">{activity.category}</span>
            </div>
            <div className="activity-content">
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <div className="activity-details">
                <div className="detail">
                  <i className="far fa-calendar"></i>
                  <span>{new Date(activity.date).toLocaleDateString()}</span>
                </div>
                <div className="detail">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{activity.location}</span>
                </div>
                <div className="detail">
                  <i className="fas fa-users"></i>
                  <span>{activity.participants}/{activity.maxParticipants} participantes</span>
                </div>
              </div>
              <div className="activity-actions">
                <button className="join-button">
                  Participar
                </button>
                <button className="details-button">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="no-activities">
          <h3>Nenhuma atividade encontrada</h3>
          <p>Tente mudar os filtros ou crie uma nova atividade!</p>
          <Link to="/create-activity" className="create-button">
            Criar Atividade
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
