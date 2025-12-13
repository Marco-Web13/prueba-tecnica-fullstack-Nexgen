import { useState } from 'react';
import client from '../api/axios';

export const ControlEscolarView = () => {
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [grupo, setGrupo] = useState('');
  
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'danger', texto: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInscribir = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      await client.post('/alumnos', {
        nombre,
        matricula,
        fecha_nacimiento: fechaNacimiento,
        grupo
      });

      setMensaje({ tipo: 'success', texto: `Alumno ${nombre} inscrito correctamente.` });
      
      // Limpiar formulario
      setNombre('');
      setMatricula('');
      setFechaNacimiento('');
      setGrupo('');

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Error al inscribir alumno';
      setMensaje({ tipo: 'danger', texto: ""+errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 border-bottom-0">
        <h4 className="mb-0 fw-bold text-success">Inscripción de Alumnos</h4>
      </div>
      <div className="card-body p-4">
        
        {mensaje && (
          <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
            {mensaje.texto}
            <button type="button" className="btn-close" onClick={() => setMensaje(null)}></button>
          </div>
        )}

        <form onSubmit={handleInscribir}>
          <div className="row">
            {/* Nombre */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold small">Nombre Completo</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nombre del Alumno"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
              />
            </div>

            {/* Matrícula */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold small">Matrícula</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej. 2117005"
                value={matricula}
                onChange={e => setMatricula(e.target.value)}
                required
              />
            </div>

            {/* Fecha Nacimiento */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold small">Fecha de Nacimiento</label>
              <input 
                type="date" 
                className="form-control" 
                value={fechaNacimiento}
                onChange={e => setFechaNacimiento(e.target.value)}
                required
              />
            </div>

            {/* Grupo */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold small">Grupo Asignado</label>
              <select 
                className="form-select" 
                value={grupo} 
                onChange={e => setGrupo(e.target.value)}
                required
              >
                <option value="">Selecciona un grupo...</option>
                <option value="A">Grupo A - Matutino</option>
                <option value="B">Grupo B - Vespertino</option>
                <option value="C">Grupo C - Mixto</option>
              </select>
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-success py-2 fw-bold" disabled={loading}>
              {loading ? 'Inscribiendo...' : 'Inscribir Alumno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};