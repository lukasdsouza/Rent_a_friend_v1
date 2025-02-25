// src/components/MapView.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


const MapView = ({ activities }) => {
  // Posição central de exemplo (São Paulo)
  const centerPosition = [-23.55052, -46.633308];

  return (
    <MapContainer center={centerPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {activities.map(activity => (
        <Marker key={activity.id} position={[activity.lat, activity.lng]}>
          <Popup>
            <strong>{activity.name}</strong>
            <br />
            {activity.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
