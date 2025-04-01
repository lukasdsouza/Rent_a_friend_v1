
// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Header from '../components/Header';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Simulando login bem-sucedido
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('userName', 'Usuário');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      alert(`Erro no login: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-0 right-0">
        <Header />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md transition-all">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-16" />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">{t('auth.login')}</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-primary hover:text-primary-dark dark:text-blue-400 dark:hover:text-blue-300">
                {t('auth.forgotPassword')}
              </a>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('auth.login')}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.noAccount')}{' '}
              <a onClick={() => navigate('/register')} className="cursor-pointer text-primary hover:text-primary-dark dark:text-blue-400 dark:hover:text-blue-300">
                {t('auth.createAccount')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
