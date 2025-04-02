
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateActivity from './pages/CreateActivity';
import NearbyActivities from './pages/NearbyActivities';
import MatchmakingPage from './pages/MatchmakingPage';
import PaymentPage from './pages/PaymentPage';
import Header from './components/Header';
import HamburgerMenu from './components/HamburgerMenu';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  // Simular autenticação (você deve implementar sua própria lógica de autenticação)
  const isAuthenticated = localStorage.getItem('token');

  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <div className="app-container min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {isAuthenticated && (
              <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm z-10">
                <div className="flex items-center">
                  <HamburgerMenu />
                  <h1 className="ml-4 text-xl font-bold text-primary dark:text-blue-400">Rent a Friend</h1>
                </div>
                <Header />
              </div>
            )}
            {isAuthenticated && <div className="pt-16"><Navbar /></div>}
            <div className={`${isAuthenticated ? 'pt-20' : ''} container mx-auto px-4`}>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />

                {/* Rotas protegidas */}
                <Route
                  path="/dashboard"
                  element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                  path="/profile"
                  element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
                />
                <Route
                  path="/create-activity"
                  element={isAuthenticated ? <CreateActivity /> : <Navigate to="/login" />}
                />
                <Route
                  path="/nearby"
                  element={isAuthenticated ? <NearbyActivities /> : <Navigate to="/login" />}
                />
                <Route
                  path="/matchmaking"
                  element={isAuthenticated ? <MatchmakingPage /> : <Navigate to="/login" />}
                />
                <Route
                  path="/payment/:activityId"
                  element={isAuthenticated ? <PaymentPage /> : <Navigate to="/login" />}
                />
                <Route
                  path="/settings"
                  element={isAuthenticated ? <div className="p-8">Página de Configurações</div> : <Navigate to="/login" />}
                />
                <Route
                  path="/community"
                  element={isAuthenticated ? <div className="p-8">Página da Comunidade</div> : <Navigate to="/login" />}
                />

                {/* Redirecionar raiz para login ou dashboard */}
                <Route
                  path="/"
                  element={
                    <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
                  }
                />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
