// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="flex justify-between items-center">
          {/* Logo / Título */}
          <Link to="/" className="text-xl font-bold text-white">
            SocialAtividades
          </Link>
          {/* Botão para menu mobile */}
          <div className="menu-toggle md:hidden" onClick={toggleMenu}>
            <svg className="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </div>
          {/* Links para telas maiores */}
          <div className={`menu ${isOpen ? 'active' : ''} md:flex md:items-center space-x-4`}>
            <Link to="/" className="text-white px-3 py-2">
              Home
            </Link>
            <Link to="/create-activity" className="text-white px-3 py-2">
              Criar Atividade
            </Link>
            <Link to="/profile" className="text-white px-3 py-2">
              Perfil
            </Link>
            <Link to="/login" className="text-white px-3 py-2">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
