import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@store/slices/authSlice';

// Layout Components
import Dashboard from '@pages/Dashboard/Dashboard';
import Generator from '@pages/Generator/Generator';
import CoverageAnalyzer from '@pages/CoverageAnalyzer/CoverageAnalyzer';
import StandardsChecker from '@pages/StandardsChecker/StandardsChecker';
import TestPlans from '@pages/TestPlans/TestPlans';
import Integrations from '@pages/Integrations/Integrations';
import Documentation from '@pages/Documentation/Documentation';

// Auth Components
import Login from '@pages/Auth/Login';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } 
      />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/generator/ui" element={<Generator />} />
        <Route path="/generator/api" element={<Generator />} />
        <Route path="/coverage" element={<CoverageAnalyzer />} />
        <Route path="/standards" element={<StandardsChecker />} />
        <Route path="/testplans" element={<TestPlans />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/documentation" element={<Documentation />} />
        
        {/* Settings Routes */}
        <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
        <Route path="/profile" element={<div>Profile Page (Coming Soon)</div>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;