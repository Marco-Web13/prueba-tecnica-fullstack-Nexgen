import { useEffect, useState } from 'react';
import client from '../api/axios';

interface Alumno {
  id: number;
  nombre: string;
  matricula: string;
}

export const MaestroView = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [nota, setNota] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'danger', texto: string } | null>(null);

  useEffect(() => {
    const cargarAlumnos = async () => {
      try {
        const res = await client.get('/maestro/alumnos');
        setAlumnos(res.data);
      } catch (error) {
        console.error("Error cargando alumnos", error);
      } finally {
        setLoading(false);
      }
    };
    cargarAlumnos();
  }, []);

  //Función para enviar la calificación
  const handleCalificar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumnoSeleccionado) return;

    try {
      await client.post('/maestro/calificaciones', {
        alumno_id: alumnoSeleccionado.id,
        materia_id: 1,
        nota: Number(nota),
        observaciones
      });

      setMensaje({ tipo: 'success', texto: `Calificación guardada para ${alumnoSeleccionado.nombre}` });
      
      // Limpiar formulario
      setAlumnoSeleccionado(null);
      setNota('');
      setObservaciones('');

    } catch (error) {
      setMensaje({ tipo: 'danger', texto: 'Error al guardar la calificación' });
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h4 className="mb-0 fw-bold" style={{color: '#1B396A'}}>Calificaciones</h4>
      </div>
      <div className="card-body">
        
        {mensaje && (
          <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
            {mensaje.texto}
            <button type="button" className="btn-close" onClick={() => setMensaje(null)}></button>
          </div>
        )}

        {/* SI HAY UN ALUMNO SELECCIONADO, MOSTRAMOS EL FORMULARIO */}
        {alumnoSeleccionado ? (
          <div className="bg-light p-4 rounded mb-4 border">
            <h5 className="fw-bold mb-3">Calificando a: <span className="text-primary">{alumnoSeleccionado.nombre}</span></h5>
            <form onSubmit={handleCalificar}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold small">Nota (0-100)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    min="0" max="100" 
                    value={nota}
                    onChange={e => setNota(e.target.value)}
                    required 
                  />
                </div>
                <div className="col-md-8 mb-3">
                  <label className="form-label fw-bold small">Observaciones</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ej. Excelente desempeño..." 
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)}
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-tec">Guardar Calificación</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setAlumnoSeleccionado(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* TABLA DE ALUMNOS */}
        <h5 className="mb-3 text-muted">Lista de Alumnos Asignados</h5>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Matrícula</th>
                  <th>Nombre</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map(alumno => (
                  <tr key={alumno.id}>
                    <td>{alumno.id}</td>
                    <td><span className="badge bg-secondary">{alumno.matricula}</span></td>
                    <td className="fw-bold">{alumno.nombre}</td>
                    <td className="text-end">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setAlumnoSeleccionado(alumno);
                          setMensaje(null); // Limpiar mensajes viejos
                        }}
                      >
                        Calificar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {alumnos.length === 0 && <p className="text-center text-muted mt-3">No hay alumnos registrados actualmente</p>}
          </div>
        )}
      </div>
    </div>
  );
};