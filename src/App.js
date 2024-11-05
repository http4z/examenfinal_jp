// src/App.js
import React, { useState } from 'react';
import './App.css'; 
import ProyectosList from './components/ProyectosList';
import AgregarProyecto from './components/AgregarProyecto';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Q9al42MS36KtBxlNBjs2cnvG1bpKaKlf4R2WqiuAMIvP1HdkKHOFcPDRx1lmV4fcaGKE222t03DXtstTFWnBveS00yJrdsLJM'); 

function App() {
  const [proyectos, setProyectos] = useState([]);

  const handleProyectoAgregado = (nuevoProyecto) => {
    setProyectos([...proyectos, nuevoProyecto]);
  };

  return (
    <div className="App">
      <h1>Gestión de Proyectos</h1>
      <AgregarProyecto onProyectoAgregado={handleProyectoAgregado} />
      <Elements stripe={stripePromise}>
        <ProyectosList proyectos={proyectos} setProyectos={setProyectos} />
      </Elements>
    </div>
  );
}

export default App;
