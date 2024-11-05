// src/components/AgregarProyecto.js
import React, { useState } from 'react';
import api from '../api';

const AgregarProyecto = ({ onProyectoAgregado }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/proyectos', { titulo, descripcion });
      onProyectoAgregado(response.data);
      setTitulo('');
      setDescripcion('');
    } catch (error) {
      console.error("Error al agregar el proyecto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar Proyecto</h3>
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <button type="submit">Agregar Proyecto</button>
    </form>
  );
};

export default AgregarProyecto;
