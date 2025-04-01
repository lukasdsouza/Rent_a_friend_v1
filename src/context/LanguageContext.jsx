
import React, { createContext, useState, useContext, useEffect } from 'react';

// Traduções
const translations = {
  'en-US': {
    // Menu
    'menu.profile': 'Profile',
    'menu.settings': 'Settings',
    'menu.activities': 'Activities',
    'menu.community': 'Community',
    'menu.logout': 'Logout',
    // Navbar
    'navbar.dashboard': 'Dashboard',
    'navbar.nearby': 'Nearby',
    'navbar.createActivity': 'Create Activity',
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.createAccount': 'Create Account',
    // Common
    'common.darkMode': 'Dark Mode',
    'common.lightMode': 'Light Mode',
    'common.language': 'Language',
  },
  'pt-BR': {
    // Menu
    'menu.profile': 'Perfil',
    'menu.settings': 'Configurações',
    'menu.activities': 'Atividades',
    'menu.community': 'Comunidade',
    'menu.logout': 'Sair',
    // Navbar
    'navbar.dashboard': 'Dashboard',
    'navbar.nearby': 'Nas Redondezas',
    'navbar.createActivity': 'Criar Atividade',
    // Auth
    'auth.login': 'Entrar',
    'auth.register': 'Registrar',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.forgotPassword': 'Esqueceu a senha?',
    'auth.noAccount': 'Não tem uma conta?',
    'auth.createAccount': 'Criar Conta',
    // Common
    'common.darkMode': 'Modo Escuro',
    'common.lightMode': 'Modo Claro',
    'common.language': 'Idioma',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'pt-BR';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
