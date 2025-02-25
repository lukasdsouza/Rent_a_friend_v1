import React, { useState } from 'react';  // Importando o React, necessário para JSX
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const Register = () => {
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); // Usando useNavigate para navegação

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('As senhas não conferem!');
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName: name });
      navigate('/'); // Navegar para a página inicial
    } catch (error) {
      console.error('Erro no registro:', error);
      alert(`Erro no registro: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Registro</h2>
        <input 
          type="text" 
          placeholder="Nome Completo" 
          className="border p-2 mb-4 w-full" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <select 
          name="userType" 
          className="border p-2 mb-4 w-full" 
          value={userType} 
          onChange={(e) => setUserType(e.target.value)} 
          required
        >
          <option value="">Selecione o tipo de usuário</option>
          <option value="creator">Criador de Atividades</option>
          <option value="participant">Participante</option>
        </select>
        <input 
          type="email" 
          placeholder="Email" 
          className="border p-2 mb-4 w-full" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          className="border p-2 mb-4 w-full" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Confirmar Senha" 
          className="border p-2 mb-4 w-full" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Register;
