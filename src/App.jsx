import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateActivity from './pages/CreateActivity';
import NearbyActivities from './pages/NearbyActivities';

function App() {
  // Simular autenticação (você deve implementar sua própria lógica de autenticação)
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navbar />}
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

          {/* Redirecionar raiz para login ou dashboard */}
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
