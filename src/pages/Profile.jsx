// src/pages/Profile.js
import React from 'react';

const Profile = ({ user }) => {
  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <img 
          src={user.photoURL || 'https://via.placeholder.com/150'} 
          alt="Foto de perfil" 
          className="w-16 h-16 rounded-full mr-4" 
        />
        <div>
          <h2 className="text-2xl">{user.displayName}</h2>
          <p>{user.description}</p>
        </div>
      </div>
      <div>
        <h3 className="text-xl mb-2">Histórico de Atividades</h3>
        {user.activities && user.activities.map(activity => (
          <div key={activity.id} className="border p-2 mb-2 rounded">
            <h4 className="font-bold">{activity.name}</h4>
            <p>{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
