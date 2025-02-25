// src/pages/CreateActivity.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Usando useNavigate do React Router v6

const CreateActivity = () => {
  const [activity, setActivity] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    participants: '',
    category: ''
  });

  const navigate = useNavigate(); // Usando useNavigate para navegação

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você chamaria sua API (Node.js/Express) para salvar a atividade no PostgreSQL
    console.log('Atividade criada:', activity);
    navigate('/'); // Substituindo history.push por navigate
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl mb-4">Criar Atividade</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Nome da atividade" 
          onChange={handleChange} 
          className="border p-2 mb-4 w-full" 
          required 
        />
        <textarea 
          name="description" 
          placeholder="Descrição" 
          onChange={handleChange} 
          className="border p-2 mb-4 w-full" 
          required 
        />
        <input 
          type="date" 
          name="date" 
          onChange={handleChange} 
          className="border p-2 mb-4 w-full" 
          required 
        />
        <input 
          type="time" 
          name="time" 
          onChange={handleChange} 
          className="border p-2 mb-4 w-full" 
          required 
        />
        <input 
          type="text" 
          name="location" 
          placeholder="Localização" 
          onChange={handleChange} 
          className="border p-2 mb-4 w-full" 
          required 
        />
        <input 
          type="number" 
          name="participants" 
          placeholder="Número de participantes" 
          onChange={handleChange} 
          className="border p-2 mb-4 w-full" 
          required 
        />
        <select 
          name="category" 
          onChange={handleChange} 
          className="border p-2 mb-4 w-full" 
          required
        >
          <option value="">Selecione a categoria</option>
          <option value="esportes">Esportes</option>
          <option value="lazer">Lazer</option>
          <option value="turismo">Turismo</option>
        </select>
        <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
          Criar Atividade
        </button>
      </form>
    </div>
  );
};

export default CreateActivity;
