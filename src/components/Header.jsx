
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-end gap-4 p-4">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => toggleLanguage('en-US')} 
          className={`p-1 border ${language === 'en-US' ? 'border-blue-500' : 'border-gray-300'} rounded`}
          aria-label="English"
          title="English"
        >
          <div className="w-6 h-4 bg-blue-900 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-[8px]">US</div>
            </div>
          </div>
        </button>

        <button 
          onClick={() => toggleLanguage('pt-BR')} 
          className={`p-1 border ${language === 'pt-BR' ? 'border-blue-500' : 'border-gray-300'} rounded`}
          aria-label="Português"
          title="Português"
        >
          <div className="w-6 h-4 bg-green-600 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-yellow-400 text-[8px]">BR</div>
            </div>
          </div>
        </button>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
        title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};

export default Header;
