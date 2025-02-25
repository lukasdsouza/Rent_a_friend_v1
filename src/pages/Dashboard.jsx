// src/pages/Dashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MapView from '../components/MapView';


const Dashboard = () => {
  // Atividades simuladas para demonstração
  const [activities] = useState([
    {
      id: 1,
      name: 'Futebol no Parque',
      description: 'Jogo amistoso de futebol em um lindo parque.',
      lat: -23.55052,
      lng: -46.633308,
      date: '2025-03-15',
      category: 'Esportes'
    },
    {
      id: 2,
      name: 'Caminhada na Natureza',
      description: 'Trilha revigorante em meio à natureza exuberante.',
      lat: -23.557,
      lng: -46.645,
      date: '2025-03-20',
      category: 'Lazer'
    },
    {
      id: 3,
      name: 'Piquenique no Jardim',
      description: 'Encontro descontraído para um delicioso piquenique.',
      lat: -23.560,
      lng: -46.630,
      date: '2025-03-25',
      category: 'Lazer'
    }
  ]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lista de Atividades */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Atividades em Destaque</h2>
            {activities.map(activity => (
              <div key={activity.id} className="p-4 mb-4 border rounded hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold">{activity.name}</h3>
                <p>{activity.description}</p>
                <p className="text-sm text-gray-600">Data: {activity.date}</p>
                <Link to={`/activity/${activity.id}`} className="text-blue-500 hover:underline">
                  Ver detalhes
                </Link>
              </div>
            ))}
          </div>
          {/* Seção de Mapa Interativo */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Mapa Interativo</h2>
            <MapView activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
