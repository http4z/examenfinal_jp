// src/components/ProyectosList.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import PagoProyecto from './PagoProyecto';

const ProyectosList = ({ proyectos, setProyectos }) => {
  const [editProjectId, setEditProjectId] = useState(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editFechaVencimiento, setEditFechaVencimiento] = useState('');
  const [editPrioridad, setEditPrioridad] = useState('media');
  const [editAsignadoA, setEditAsignadoA] = useState('');
  const [editCategoria, setEditCategoria] = useState('');

  const fetchProyectos = async () => {
    try {
      const response = await api.get('/proyectos');
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/proyectos/${id}`);
      setProyectos(proyectos.filter((proyecto) => proyecto.id !== id));
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
    }
  };

  const handleEdit = (proyecto) => {
    setEditProjectId(proyecto.id);
    setEditTitulo(proyecto.titulo);
    setEditDescripcion(proyecto.descripcion);
    setEditFechaVencimiento(proyecto.fecha_vencimiento || '');
    setEditPrioridad(proyecto.prioridad || 'media');
    setEditAsignadoA(proyecto.asignado_a || '');
    setEditCategoria(proyecto.categoria || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/proyectos/${editProjectId}`, {
        titulo: editTitulo,
        descripcion: editDescripcion,
        fecha_vencimiento: editFechaVencimiento,
        prioridad: editPrioridad,
        asignado_a: editAsignadoA,
        categoria: editCategoria,
      });
      setProyectos(proyectos.map((proyecto) =>
        proyecto.id === editProjectId ? response.data : proyecto
      ));
      setEditProjectId(null); // Limpiar el estado de edición
      setEditTitulo('');
      setEditDescripcion('');
      setEditFechaVencimiento('');
      setEditPrioridad('media');
      setEditAsignadoA('');
      setEditCategoria('');
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
    }
  };

  return (
    <div>
      <h2>Lista de Proyectos</h2>
      <ul>
        {proyectos.map((proyecto) => (
          <li key={proyecto.id}>
            {editProjectId === proyecto.id ? (
              // Formulario de edición
              <form onSubmit={handleUpdate}>
                <label>Título:</label>
                <input
                  type="text"
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  required
                />

                <label>Descripción:</label>
                <input
                  type="text"
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                />

                <label>Fecha de Vencimiento:</label>
                <input
                  type="date"
                  value={editFechaVencimiento}
                  onChange={(e) => setEditFechaVencimiento(e.target.value)}
                />

                <label>Prioridad:</label>
                <select
                  value={editPrioridad}
                  onChange={(e) => setEditPrioridad(e.target.value)}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>

                <label>Asignado a:</label>
                <input
                  type="text"
                  value={editAsignadoA}
                  onChange={(e) => setEditAsignadoA(e.target.value)}
                />

                <label>Categoría:</label>
                <input
                  type="text"
                  value={editCategoria}
                  onChange={(e) => setEditCategoria(e.target.value)}
                />

                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setEditProjectId(null)}>
                  Cancelar
                </button>
              </form>
            ) : (
              // Mostrar detalles del proyecto y botones de acción
              <>
                <span>{proyecto.titulo} - {proyecto.descripcion}</span>
                <button onClick={() => handleEdit(proyecto)}>Editar</button>
                <button onClick={() => handleDelete(proyecto.id)}>Eliminar</button>
                {!proyecto.pagado && <PagoProyecto proyecto={proyecto} />}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProyectosList;
