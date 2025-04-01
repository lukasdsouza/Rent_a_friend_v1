
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, User, Settings, Activity, Users, LogOut } from 'lucide-react';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setIsOpen(false);
  };

  const menuItems = [
    { icon: User, label: t('menu.profile'), action: () => navigate('/profile') },
    { icon: Settings, label: t('menu.settings'), action: () => navigate('/settings') },
    { icon: Activity, label: t('menu.activities'), action: () => navigate('/dashboard') },
    { icon: Users, label: t('menu.community'), action: () => navigate('/community') },
    { icon: LogOut, label: t('menu.logout'), action: handleLogout, className: 'text-red-500' },
  ];

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all"
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 z-50 transition-all ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}>
        <div className="py-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${item.className || ''}`}
            >
              <item.icon size={18} className="mr-2" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay to close menu when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default HamburgerMenu;
