import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const PerfilSueldoSection = () => {
  const [sueldo, setSueldo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');

  /*const guardarSueldo = () => {
    // Aquí se debe guardar en Firebase con userId y fechaAplicacion
    console.log('Sueldo guardado:', sueldo, fechaInicio);
  };*/

  return (
    <div>
      <h5>Sueldo mensual</h5>
      
    </div>
  );
};

export default PerfilSueldoSection;
