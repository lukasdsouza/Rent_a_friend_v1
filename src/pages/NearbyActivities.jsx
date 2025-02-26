import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const NearbyActivities = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([]);

  // Configurações do mapa
  const mapStyles = {
    height: "calc(100vh - 80px)",
    width: "100%"
  };

  const defaultCenter = {
    lat: -23.550520, // São Paulo
    lng: -46.633308
  };

  // Obter localização atual
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Simular atividades próximas (você deve substituir isso com dados reais do seu backend)
  useEffect(() => {
    // Exemplo de atividades
    const mockActivities = [
      {
        id: 1,
        title: "Café e Conversa",
        description: "Bate-papo descontraído em uma cafeteria",
        location: { lat: -23.550520, lng: -46.633308 },
        date: "2024-02-27T15:00:00",
        participants: 3,
      },
      {
        id: 2,
        title: "Passeio no Parque",
        description: "Caminhada e picnic no parque",
        location: { lat: -23.552520, lng: -46.635308 },
        date: "2024-02-28T10:00:00",
        participants: 5,
      },
      // Adicione mais atividades conforme necessário
    ];

    setActivities(mockActivities);
  }, []);

  return (
    <div className="nearby-activities">
      <div className="page-header">
        <h1>Atividades nas Redondezas</h1>
        <p>Encontre atividades próximas a você</p>
      </div>

      <div className="map-container">
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={13}
            center={currentPosition || defaultCenter}
          >
            {/* Marcador da localização atual */}
            {currentPosition && (
              <Marker
                position={currentPosition}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                }}
              />
            )}

            {/* Marcadores das atividades */}
            {activities.map(activity => (
              <Marker
                key={activity.id}
                position={activity.location}
                onClick={() => setSelectedActivity(activity)}
              />
            ))}

            {/* Janela de informações da atividade selecionada */}
            {selectedActivity && (
              <InfoWindow
                position={selectedActivity.location}
                onCloseClick={() => setSelectedActivity(null)}
              >
                <div className="info-window">
                  <h3>{selectedActivity.title}</h3>
                  <p>{selectedActivity.description}</p>
                  <p>Data: {new Date(selectedActivity.date).toLocaleString()}</p>
                  <p>Participantes: {selectedActivity.participants}</p>
                  <button
                    onClick={() => {/* Implementar lógica para participar */}}
                    className="join-button"
                  >
                    Participar
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="activities-list">
        <h2>Atividades Disponíveis</h2>
        <div className="activities-grid">
          {activities.map(activity => (
            <div key={activity.id} className="activity-card">
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <p>Data: {new Date(activity.date).toLocaleString()}</p>
              <p>Participantes: {activity.participants}</p>
              <button
                onClick={() => setSelectedActivity(activity)}
                className="view-on-map-button"
              >
                Ver no Mapa
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearbyActivities;
