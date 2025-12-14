import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logoImg from '../styles/iconNexgen.png';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await client.post('/auth/login', { email, password });
      login(response.data.token);
      navigate('/dashboard'); 
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div className="bg-tec vh-100 d-flex justify-content-center align-items-center">
      
      {/* TARJETA */}
      <div className="card shadow-lg p-4 border-0" style={{ maxWidth: '450px', width: '90%' }}>
        <div className="card-body">
          
          {/* LOGO */}
          <div className="text-center mb-4">
            <img 
              src={logoImg} 
              alt="Logo nexgen" 
              className="img-fluid"
              style={{ maxHeight: '120px' }} 
            />
          </div>

          <h2 className="text-center fw-bold mb-2" style={{ color: '#1B396A' }}>NEXGEN SYSTEMS</h2>
          <p className="text-center text-muted mb-4 small">
            Bienvenido, ingresa tus credenciales para acceder a la plataforma
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* INPUT EMAIL */}
            <div className="mb-3">
              <label className="form-label fw-bold small">Correo</label>
              <input
                type="email"
                className="form-control py-2"
                placeholder="@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* INPUT PASSWORD CON OJITO (Input Group de React) */}
            <div className="mb-4">
              <label className="form-label fw-bold small">Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control py-2 border-end-0"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  className="btn btn-outline-secondary border-start-0"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ backgroundColor: '#1B396A', borderColor: '#ced4da' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* BOTÓN LOGIN */}
            <button type="submit" className="btn btn-tec w-100 py-2 mb-3" style={{borderColor: "#1B396A"}}>
              Iniciar sesión
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};