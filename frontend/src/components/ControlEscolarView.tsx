import { useState, useEffect } from 'react';
import client from '../api/axios';

interface Maestro { id: number; nombre: string; email: string; }
interface Materia { id: number; nombre: string; codigo: string; descripcion?: string; }
interface Alumno { id: number; nombre: string; matricula: string; grupo: string; fecha_nacimiento?: string; }

interface Reporte { 
  id: number; 
  nota: string | number;
  alumno: { nombre: string; matricula: string; grupo: string }; 
  materia: { nombre: string }; 
  docente: { nombre: string }; 
}

export const ControlEscolarView = () => {
  const [activeTab, setActiveTab] = useState<'reportes' | 'alumnos' | 'maestros' | 'materias' | 'asignaciones'>('reportes');
  const [mensaje, setMensaje] = useState<{ tipo: string, texto: string } | null>(null);
  
  const [maestros, setMaestros] = useState<Maestro[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [reportes, setReportes] = useState<Reporte[]>([]);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState<number | null>(null);
  
  const [formMaestro, setFormMaestro] = useState({ nombre: '', email: '', password: '' });
  const [formMateria, setFormMateria] = useState({ nombre: '', codigo: '', descripcion: '' });
  const [formAlumno, setFormAlumno] = useState({ nombre: '', matricula: '', fecha_nacimiento: '', grupo: '' });
  const [formAsignacion, setFormAsignacion] = useState({ maestro_id: '', materia_id: '' });

  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  const cargarDatos = async () => {
    try {
      if (activeTab === 'maestros' || activeTab === 'asignaciones') {
        const res = await client.get('/admin/maestros');
        setMaestros(res.data);
      }
      if (activeTab === 'materias' || activeTab === 'asignaciones') {
        const res = await client.get('/admin/materias');
        setMaterias(res.data);
      }
      if (activeTab === 'alumnos') {
        const res = await client.get('/admin/alumnos');
        setAlumnos(res.data);
      }
      if (activeTab === 'reportes') {
        const res = await client.get('/admin/reportes');
        setReportes(res.data);
      }
    } catch (error) { console.error("Error cargando datos", error); }
  };

  // --- HANDLERS GENÉRICOS ---
  const handleSuccess = (msg: string) => {
    setMensaje({ tipo: 'success', texto: msg });
    setModoEdicion(false);
    setIdEdicion(null);
    limpiarForms();
    cargarDatos();
    setTimeout(() => setMensaje(null), 2000); // Borrar mensaje a los 2 seg
  };

  const handleError = (error: any) => {
    setMensaje({ tipo: 'danger', texto: `${error.response?.data?.message || 'Error desconocido'}` });
  };

  const limpiarForms = () => {
    setFormMaestro({ nombre: '', email: '', password: '' });
    setFormMateria({ nombre: '', codigo: '', descripcion: '' });
    setFormAlumno({ nombre: '', matricula: '', fecha_nacimiento: '', grupo: '' });
  };

  const guardarMaestro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modoEdicion && idEdicion) {
        await client.put(`/admin/maestros/${idEdicion}`, formMaestro);
        handleSuccess('Maestro actualizado');
      } else {
        await client.post('/admin/maestros', formMaestro);
        handleSuccess('Maestro registrado');
      }
    } catch (err) { handleError(err); }
  };

  const borrarMaestro = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar a este maestro?')) return;
    try { await client.delete(`/admin/maestros/${id}`); handleSuccess('Maestro eliminado'); } catch (err) { handleError(err); }
  };

  const guardarMateria = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modoEdicion && idEdicion) {
        await client.put(`/admin/materias/${idEdicion}`, formMateria);
        handleSuccess('Materia actualizada');
      } else {
        await client.post('/admin/materias', formMateria);
        handleSuccess('Materia creada');
      }
    } catch (err) { handleError(err); }
  };

  const borrarMateria = async (id: number) => {
    if (!confirm('¿Eliminar materia?')) return;
    try { await client.delete(`/admin/materias/${id}`); handleSuccess('Materia eliminada'); } catch (err) { handleError(err); }
  };

  const guardarAlumno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modoEdicion && idEdicion) {
        await client.put(`/admin/alumnos/${idEdicion}`, formAlumno);
        handleSuccess('Alumno actualizado');
      } else {
        await client.post('/admin/alumnos', formAlumno);
        handleSuccess('Alumno inscrito');
      }
    } catch (err) { handleError(err); }
  };

  const borrarAlumno = async (id: number) => {
    if (!confirm('¿Eliminar alumno?')) return;
    try { await client.delete(`/admin/alumnos/${id}`); handleSuccess('Alumno eliminado'); } catch (err) { handleError(err); }
  };

  const vincular = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post(`/admin/maestros/${formAsignacion.maestro_id}/materias`, { materia_id: formAsignacion.materia_id });
      handleSuccess('Materia asignada correctamente');
    } catch (err) { handleError(err); }
  };

  const inactivarNota = async (id: number) => {
    if (!confirm('Eliminar esta calificación del reporte?')) return;
    try { await client.delete(`/admin/calificaciones/${id}`); handleSuccess('Calificación eliminada'); } catch (err) { handleError(err); }
  };

  const promedioGeneral = reportes.length > 0 
    ? (reportes.reduce((acc, curr) => acc + Number(curr.nota), 0) / reportes.length).toFixed(1) 
    : '0.0';

  return (
    <div className="card shadow border-0">
      {/* HEADER TABS */}
      <div className="card-header bg-white">
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item"><button className={`nav-link ${activeTab==='reportes'?'active fw-bold text-primary':''}`} onClick={()=>setActiveTab('reportes')}>Reportes</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='alumnos'?'active fw-bold text-primary':''}`} onClick={()=>setActiveTab('alumnos')}>Alumnos</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='maestros'?'active fw-bold text-primary':''}`} onClick={()=>setActiveTab('maestros')}>Maestros</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='materias'?'active fw-bold text-primary':''}`} onClick={()=>setActiveTab('materias')}>Materias</button></li>
          <li className="nav-item"><button className={`nav-link ${activeTab==='asignaciones'?'active fw-bold text-primary':''}`} onClick={()=>setActiveTab('asignaciones')}>Asignar</button></li>
        </ul>
      </div>

      <div className="card-body p-4">
        {mensaje && <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`}>{mensaje.texto}<button className="btn-close" onClick={()=>setMensaje(null)}></button></div>}

        {/* TAB: REPORTES*/}
        {activeTab === 'reportes' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold" style={{color: '#1B396A'}}>Reporte Académico Global</h5>
              <div className="bg-light p-2 rounded border shadow-sm">
                <span className="fw-bold text-muted me-2">Promedio General:</span>
                <span className={`badge ${Number(promedioGeneral) >= 70 ? 'bg-success' : 'bg-danger'} fs-5`}>{promedioGeneral}</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover table-bordered table-sm align-middle">
                <thead className="table-light"><tr><th>Alumno</th><th>Grupo</th><th>Materia</th><th>Docente</th><th>Nota</th><th>Acción</th></tr></thead>
                <tbody>
                  {reportes.map(r => (
                    <tr key={r.id}>
                      <td>{r.alumno.nombre}</td>
                      <td><span className="badge bg-secondary">{r.alumno.grupo}</span></td>
                      <td>{r.materia.nombre}</td>
                      <td className="text-muted small">{r.docente.nombre}</td>
                      <td className="fw-bold text-center">{r.nota}</td>
                      <td className="text-center">
                        <button className="btn btn-outline-danger btn-sm py-0" title="Inactivar" onClick={()=>inactivarNota(r.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                  {reportes.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-4">No hay calificaciones registradas aún.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABLA ALUMNOS*/}
        {activeTab === 'alumnos' && (
          <div>
            <div className="bg-light p-3 rounded border mb-4">
              <h6 className="fw-bold mb-3">{modoEdicion ? '✏️ Editando Alumno' : 'Nuevo Alumno'}</h6>
              <form onSubmit={guardarAlumno} className="row g-2 align-items-end">
                <div className="col-md-3"><input placeholder="Nombre" className="form-control form-control-sm" required value={formAlumno.nombre} onChange={e=>setFormAlumno({...formAlumno, nombre:e.target.value})} /></div>
                <div className="col-md-2"><input placeholder="Matrícula" className="form-control form-control-sm" required value={formAlumno.matricula} onChange={e=>setFormAlumno({...formAlumno, matricula:e.target.value})} /></div>
                <div className="col-md-2"><input placeholder="Grupo" className="form-control form-control-sm" required value={formAlumno.grupo} onChange={e=>setFormAlumno({...formAlumno, grupo:e.target.value})} /></div>
                <div className="col-md-3"><input type="date" className="form-control form-control-sm" value={formAlumno.fecha_nacimiento} onChange={e=>setFormAlumno({...formAlumno, fecha_nacimiento:e.target.value})} /></div>
                <div className="col-md-2 d-flex gap-1">
                  <button className={`btn btn-sm w-100 ${modoEdicion ? 'btn-warning' : 'btn-success'}`}>{modoEdicion ? 'Actualizar' : 'Agregar'}</button>
                  {modoEdicion && <button type="button" className="btn btn-sm btn-secondary" onClick={()=>{setModoEdicion(false); limpiarForms();}}>✕</button>}
                </div>
              </form>
            </div>

            <table className="table table-striped table-sm align-middle">
              <thead><tr><th>Matrícula</th><th>Nombre</th><th>Grupo</th><th>Acciones</th></tr></thead>
              <tbody>
                {alumnos.map(a => (
                  <tr key={a.id}>
                    <td className="font-monospace">{a.matricula}</td><td>{a.nombre}</td><td>{a.grupo}</td>
                    <td>
                      <button className="btn btn-link btn-sm p-0 me-2" onClick={()=>{setModoEdicion(true); setIdEdicion(a.id); setFormAlumno(a as any);}}>✏️</button>
                      <button className="btn btn-link btn-sm p-0 text-danger" onClick={()=>borrarAlumno(a.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- TAB: MAESTROS --- */}
        {activeTab === 'maestros' && (
          <div>
            <div className="bg-light p-3 rounded border mb-4">
              <h6 className="fw-bold mb-3">{modoEdicion ? '✏️ Editando Maestro' : '➕ Contratar Maestro'}</h6>
              <form onSubmit={guardarMaestro} className="row g-2 align-items-end">
                <div className="col-md-4"><input placeholder="Nombre Completo" className="form-control form-control-sm" required value={formMaestro.nombre} onChange={e=>setFormMaestro({...formMaestro, nombre:e.target.value})} /></div>
                <div className="col-md-4"><input type="email" placeholder="Correo" className="form-control form-control-sm" required value={formMaestro.email} onChange={e=>setFormMaestro({...formMaestro, email:e.target.value})} /></div>
                <div className="col-md-2"><input type="password" placeholder={modoEdicion ? "(Opcional)" : "Contraseña"} className="form-control form-control-sm" required={!modoEdicion} value={formMaestro.password} onChange={e=>setFormMaestro({...formMaestro, password:e.target.value})} /></div>
                <div className="col-md-2 d-flex gap-1">
                   <button className={`btn btn-sm w-100 ${modoEdicion ? 'btn-warning' : 'btn-primary'}`}>{modoEdicion ? 'Guardar' : 'Crear'}</button>
                   {modoEdicion && <button type="button" className="btn btn-sm btn-secondary" onClick={()=>{setModoEdicion(false); limpiarForms();}}>✕</button>}
                </div>
              </form>
            </div>
            <table className="table table-striped table-sm align-middle">
              <thead><tr><th>Nombre</th><th>Email</th><th>Acciones</th></tr></thead>
              <tbody>
                {maestros.map(m => (
                  <tr key={m.id}>
                    <td>{m.nombre}</td><td>{m.email}</td>
                    <td>
                      <button className="btn btn-link btn-sm p-0 me-2" onClick={()=>{setModoEdicion(true); setIdEdicion(m.id); setFormMaestro({...m, password:''});}}>✏️</button>
                      <button className="btn btn-link btn-sm p-0 text-danger" onClick={()=>borrarMaestro(m.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- TAB: MATERIAS --- */}
        {activeTab === 'materias' && (
          <div>
             <div className="bg-light p-3 rounded border mb-4">
              <h6 className="fw-bold mb-3">{modoEdicion ? '✏️ Editando Materia' : '➕ Nueva Materia'}</h6>
              <form onSubmit={guardarMateria} className="row g-2 align-items-end">
                <div className="col-md-4"><input placeholder="Nombre Materia" className="form-control form-control-sm" required value={formMateria.nombre} onChange={e=>setFormMateria({...formMateria, nombre:e.target.value})} /></div>
                <div className="col-md-2"><input placeholder="Código" className="form-control form-control-sm" required value={formMateria.codigo} onChange={e=>setFormMateria({...formMateria, codigo:e.target.value})} /></div>
                <div className="col-md-4"><input placeholder="Descripción" className="form-control form-control-sm" value={formMateria.descripcion} onChange={e=>setFormMateria({...formMateria, descripcion:e.target.value})} /></div>
                <div className="col-md-2 d-flex gap-1">
                   <button className={`btn btn-sm w-100 ${modoEdicion ? 'btn-warning' : 'btn-primary'}`}>{modoEdicion ? 'Guardar' : 'Crear'}</button>
                   {modoEdicion && <button type="button" className="btn btn-sm btn-secondary" onClick={()=>{setModoEdicion(false); limpiarForms();}}>✕</button>}
                </div>
              </form>
            </div>
            <table className="table table-striped table-sm align-middle">
              <thead><tr><th>Código</th><th>Materia</th><th>Acciones</th></tr></thead>
              <tbody>
                {materias.map(m => (
                  <tr key={m.id}>
                    <td className="font-monospace text-primary">{m.codigo}</td><td>{m.nombre}</td>
                    <td>
                      <button className="btn btn-link btn-sm p-0 me-2" onClick={()=>{setModoEdicion(true); setIdEdicion(m.id); setFormMateria(m as any);}}>✏️</button>
                      <button className="btn btn-link btn-sm p-0 text-danger" onClick={()=>borrarMateria(m.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- TAB: ASIGNACIONES --- */}
        {activeTab === 'asignaciones' && (
           <form onSubmit={vincular} className="p-5 bg-light border rounded text-center shadow-sm">
             <h5 className="mb-4 text-primary">🔗 Vincular Maestro con Materia</h5>
             <div className="row justify-content-center g-3">
               <div className="col-md-4">
                 <select className="form-select" required value={formAsignacion.maestro_id} onChange={e=>setFormAsignacion({...formAsignacion, maestro_id:e.target.value})}>
                   <option value="">Selecciona Maestro...</option>
                   {maestros.map(m=><option key={m.id} value={m.id}>{m.nombre}</option>)}
                 </select>
               </div>
               <div className="col-md-4">
                 <select className="form-select" required value={formAsignacion.materia_id} onChange={e=>setFormAsignacion({...formAsignacion, materia_id:e.target.value})}>
                   <option value="">Selecciona Materia...</option>
                   {materias.map(m=><option key={m.id} value={m.id}>{m.nombre} ({m.codigo})</option>)}
                 </select>
               </div>
               <div className="col-md-2">
                 <button className="btn btn-success w-100">Asignar</button>
               </div>
             </div>
           </form>
        )}

      </div>
    </div>
  );
};