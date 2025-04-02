
// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const userImage = localStorage.getItem('userImage') || 'https://via.placeholder.com/40';
  const userName = localStorage.getItem('userName') || 'Usuário';

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar bg-white dark:bg-gray-800 shadow-md">
      <div className="navbar-container max-w-6xl mx-auto px-4">
        <div className="flex justify-center w-full">
          <div className="nav-links flex">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
            >
              {t('navbar.dashboard')}
            </Link>
            <Link 
              to="/nearby" 
              className={`nav-link ${isActive('/nearby') ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
            >
              {t('navbar.nearby')}
            </Link>
            <Link 
              to="/matchmaking" 
              className={`nav-link ${isActive('/matchmaking') ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Matchmaking
            </Link>
            <Link 
              to="/create-activity" 
              className={`nav-link ${isActive('/create-activity') ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
            >
              {t('navbar.createActivity')}
            </Link>
            <Link 
              to="/subscription" 
              className={`nav-link ${isActive('/subscription') ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Assinatura
            </Link>
            <Link 
              to="/verification" 
              className={`nav-link ${isActive('/verification') ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Verificação
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
