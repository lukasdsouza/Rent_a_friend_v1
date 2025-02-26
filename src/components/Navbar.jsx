// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userImage = localStorage.getItem('userImage') || 'https://via.placeholder.com/40';
  const userName = localStorage.getItem('userName') || 'Usuário';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="logo">
          Rent a Friend
        </Link>

        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/nearby" className="nav-link">
            Nas Redondezas
          </Link>
          <Link to="/create-activity" className="nav-link">
            Criar Atividade
          </Link>
        </div>

        <div className="nav-profile">
          <div className="profile-menu" onClick={() => navigate('/profile')}>
            <img
              src={userImage}
              alt={userName}
              className="profile-image"
            />
            <span className="profile-name">{userName}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Sair
          </button>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>

        <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/dashboard" className="mobile-link">Dashboard</Link>
          <Link to="/nearby" className="mobile-link">Nas Redondezas</Link>
          <Link to="/create-activity" className="mobile-link">Criar Atividade</Link>
          <Link to="/profile" className="mobile-link">Perfil</Link>
          <button onClick={handleLogout} className="mobile-logout">Sair</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
