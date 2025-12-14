import { useEffect, useState } from 'react';
import client from '../api/axios';

interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
}

interface AlumnoConNota {
  id: number;
  nombre: string;
  matricula: string;
  grupo: string;
  nota: number | null;
  observaciones: string;
}

export const MaestroView = () => {
  // Inicializamos siempre como arrays vacíos
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<Materia | null>(null);
  
  const [alumnos, setAlumnos] = useState<AlumnoConNota[]>([]);
  const [loading, setLoading] = useState(false);

  const [alumnoAEditar, setAlumnoAEditar] = useState<AlumnoConNota | null>(null);
  const [notaInput, setNotaInput] = useState('');
  const [obsInput, setObsInput] = useState('');
  const [mensaje, setMensaje] = useState<{tipo: string, texto: string} | null>(null);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    try {
      const res = await client.get('/maestro/materias');
      console.log("📦 Respuesta Materias:", res.data); 
      
      if (Array.isArray(res.data)) {
        setMaterias(res.data);
      } else {
        console.error("El backend no devolvió una lista de materias:", res.data);
        setErrorGlobal("Error al cargar materias: Formato incorrecto.");
        setMaterias([]);
      }
    } catch (err: any) {
      console.error("❌ Error cargando materias:", err);
      setErrorGlobal("No se pudieron cargar las materias. Revisa tu conexión o el servidor.");
    }
  };

  const seleccionarMateria = async (materia: Materia) => {
    setLoading(true);
    setMateriaSeleccionada(materia);
    setAlumnos([]); // Limpiar anterior
    setErrorGlobal(null);

    try {
      const res = await client.get(`/maestro/materias/${materia.id}/alumnos`);
      console.log("🎓 Respuesta Alumnos:", res.data); 

      if (Array.isArray(res.data)) {
        setAlumnos(res.data);
      } else {
        console.error("El backend no devolvió una lista de alumnos:", res.data);
        setAlumnos([]);
        setMensaje({ tipo: 'warning', texto: 'La respuesta del servidor no tiene el formato esperado.' });
      }
    } catch (error) {
      console.error("❌ Error cargando alumnos:", error);
      setMensaje({ tipo: 'danger', texto: 'Error al cargar la lista de alumnos.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarNota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumnoAEditar || !materiaSeleccionada) return;

    try {
      await client.post('/maestro/calificaciones', {
        alumno_id: alumnoAEditar.id,
        materia_id: materiaSeleccionada.id,
        nota: Number(notaInput),
        observaciones: obsInput
      });

      setMensaje({ tipo: 'success', texto: 'Calificación guardada correctamente' });
      
      // Recargar la lista para ver cambios
      const res = await client.get(`/maestro/materias/${materiaSeleccionada.id}/alumnos`);
      if (Array.isArray(res.data)) setAlumnos(res.data);
      
      setAlumnoAEditar(null);
    } catch (error) {
      console.error(error);
      setMensaje({ tipo: 'danger', texto: 'Error al guardar la calificación.' });
    }
  };

  // --- VISTA PRINCIPAL (SELECCIÓN DE MATERIAS) ---
  if (!materiaSeleccionada) {
    return (
      <div className="container mt-4">
        <h3 className="fw-bold mb-4" style={{color: '#1B396A'}}>Materias Asignadas</h3>
        
        {errorGlobal && <div className="alert alert-danger">{errorGlobal}</div>}

        <div className="row">
          {Array.isArray(materias) && materias.length === 0 && !errorGlobal && (
            <p className="text-muted">No tienes materias asignadas aún.</p>
          )}
          
          {Array.isArray(materias) && materias.map(materia => (
            <div key={materia.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm hover-effect border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold text-dark">{materia.nombre}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{materia.codigo}</h6>
                  <p className="card-text small">{materia.descripcion}</p>
                  <button 
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => seleccionarMateria(materia)}
                  >
                    Ver Grupo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VISTA DETALLE (ALUMNOS) ---
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <div>
          <button onClick={() => setMateriaSeleccionada(null)} className="btn btn-outline-secondary btn-sm me-3">
            Volver
          </button>
          <span className="fw-bold h5" style={{color: '#1B396A'}}>{materiaSeleccionada.nombre}</span>
        </div>
        <span className="badge bg-light text-dark border">{materiaSeleccionada.codigo}</span>
      </div>

      <div className="card-body">
        {mensaje && (
          <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
            {mensaje.texto}
            <button type="button" className="btn-close" onClick={() => setMensaje(null)}></button>
          </div>
        )}

        {/* FORMULARIO EDITAR */}
        {alumnoAEditar && (
          <div className="bg-light p-4 rounded mb-4 border border-primary">
            <h5 className="fw-bold">Calificando a: {alumnoAEditar.nombre}</h5>
            <form onSubmit={handleGuardarNota} className="d-flex gap-3 align-items-end flex-wrap">
              <div>
                <label className="form-label small fw-bold">Nota (0-100)</label>
                <input 
                  type="number" className="form-control" min="0" max="100" required
                  value={notaInput} onChange={e => setNotaInput(e.target.value)}
                />
              </div>
              <div className="flex-grow-1">
                <label className="form-label small fw-bold">Observaciones</label>
                <input 
                  type="text" className="form-control" placeholder="Opcional..."
                  value={obsInput} onChange={e => setObsInput(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-success">Guardar</button>
              <button type="button" className="btn btn-secondary" onClick={() => setAlumnoAEditar(null)}>Cancelar</button>
            </form>
          </div>
        )}

        {/* TABLA DE ALUMNOS */}
        {loading ? <p className="text-center py-5">Cargando alumnos...</p> : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Matrícula</th>
                  <th>Nombre</th>
                  <th>Grupo</th>
                  <th className="text-center">Calificación</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* AQUÍ ESTÁ LA CORRECCIÓN: 
                   Agregamos .filter() para quitar los nulls y evitar el error "Cannot read properties of null"
                */}
                {Array.isArray(alumnos) && alumnos.length > 0 ? (
                  alumnos
                    .filter(alum => alum !== null && alum !== undefined) // <--- ESTO ELIMINA LOS FANTASMAS
                    .map(alum => (
                    <tr key={alum.id}>
                      <td><span className="font-monospace text-muted">{alum.matricula}</span></td>
                      <td className="fw-bold">{alum.nombre || "Sin Nombre"}</td>
                      <td><span className="badge bg-secondary">{alum.grupo}</span></td>
                      <td className="text-center">
                        {alum.nota !== null ? (
                          <span className={`badge ${alum.nota >= 70 ? 'bg-success' : 'bg-danger'} p-2`}>
                            {alum.nota}
                          </span>
                        ) : <span className="text-muted small">- Sin nota -</span>}
                      </td>
                      <td className="text-end">
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setAlumnoAEditar(alum);
                            setNotaInput(alum.nota ? String(alum.nota) : '');
                            setObsInput(alum.observaciones || '');
                            setMensaje(null);
                          }}
                        >
                          {alum.nota !== null ? 'Editar' : 'Calificar'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="text-center text-muted py-4">
                     {alumnos.length === 0 ? "No hay alumnos inscritos en esta materia." : "Error mostrando alumnos."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};