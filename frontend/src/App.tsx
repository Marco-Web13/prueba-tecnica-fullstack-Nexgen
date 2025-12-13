import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta para el Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Ruta para el Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Si entran a la raíz, redirigir al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;