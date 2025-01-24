import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Santri from './pages/Santri';
import Asatidz from './pages/Asatidz';
import Pengurus from './pages/Pengurus';
import SPP from './pages/SPP';
import Keuangan from './pages/Keuangan';
import Pengaturan from './pages/Pengaturan';
import Alumni from './pages/Alumni';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore(state => state.user);
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/santri" element={
          <ProtectedRoute>
            <Santri />
          </ProtectedRoute>
        } />
        <Route path="/asatidz" element={
          <ProtectedRoute>
            <Asatidz />
          </ProtectedRoute>
        } />
        <Route path="/pengurus" element={
          <ProtectedRoute>
            <Pengurus />
          </ProtectedRoute>
        } />
        <Route path="/spp" element={
          <ProtectedRoute>
            <SPP />
          </ProtectedRoute>
        } />
        <Route path="/keuangan" element={
          <ProtectedRoute>
            <Keuangan />
          </ProtectedRoute>
        } />
        <Route path="/alumni" element={
          <ProtectedRoute>
            <Alumni />
          </ProtectedRoute>
        } />
        <Route path="/pengaturan" element={
          <ProtectedRoute>
            <Pengaturan />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;