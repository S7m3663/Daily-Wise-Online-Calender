// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import DailyPlan from './pages/DailyPlan';
import MonthlyPlan from "./pages/MonthlyPlan";
import Profil from "./pages/Profil";
import { UserProvider } from './Context/UserContext';
import ProtectedRoute from './Context/ProtectedRoute';
import { PlanProvider } from './Context/PlanContext';

const App = () => {
  return (
     <UserProvider>
      <PlanProvider>
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" />} /> {/* varsayılan olarak ilk girildiğinde welcome ekranının açılmasını ayarladık. */}
      <Route path="/welcome" element={<Welcome/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/gunluk" element={<DailyPlan/>} />
      <Route path="/aylik" element={<MonthlyPlan/>} />
      <Route path="/profil" element={<Profil/>} />

      <Route path="/gunluk" element={
          <ProtectedRoute><DailyPlan /></ProtectedRoute>
        } />
        <Route path="/aylik" element={
          <ProtectedRoute><MonthlyPlan /></ProtectedRoute>
        } />
        <Route path="/profil" element={
          <ProtectedRoute><Profil /></ProtectedRoute>
        } />

    </Routes>
    </PlanProvider>
    </UserProvider>
  );
};

export default App;
