import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-tec shadow-sm mb-4">
      <div className="container">
        {/* Logo */}
        <span className="navbar-brand fw-bold" style={{color: '#1B396A'}}>
          NEXGEN SYSTEMS
        </span>

        {/* Información del Usuario a la derecha */}
        <div className="d-flex align-items-center gap-3">
          <div className="text-end text-white d-none d-md-block">
            <div className="fw-bold small">{user?.nombre}</div>
            <div className="badge bg-light text-dark" style={{fontSize: '0.7rem'}}>
              {user?.rol}
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="btn btn-outline-light btn-sm"
            style = {{background: '#1B396A'}}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};