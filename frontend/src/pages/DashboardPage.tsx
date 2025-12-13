import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { MaestroView } from '../components/MaestroView';
import { ControlEscolarView } from '../components/ControlEscolarView';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-light min-vh-100">
      <Navbar />

      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold text-dark">Panel de Control</h2>
            <p className="text-muted">Bienvenido al sistema de gestión de calificaciones</p>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-5 text-center">
            
            {user?.rol === 'MAESTRO' && (
              <div>
                <MaestroView />
              </div>
            )}

            {user?.rol === 'CONTROL_ESCOLAR' && (
              <div>
                <ControlEscolarView />
              </div>
            )}

            {/* Si por error entra alguien sin rol */}
            {!['MAESTRO', 'CONTROL_ESCOLAR'].includes(user?.rol || '') && (
              <div className="alert alert-warning">
                Tu rol no tiene permisos asignados. Contacta a soporte.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};