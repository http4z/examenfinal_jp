// src/components/PagoProyecto.js
import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api';

const PagoProyecto = ({ proyecto }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // Para controlar el estilo del mensaje de éxito

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSuccess(false); // Restablecer el estado de éxito

    try {
      const { clientSecret } = await api.post(`/proyectos/${proyecto.id}/pagar`).then(res => res.data);

      const cardNumberElement = elements.getElement(CardNumberElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: 'Nombre del Cliente',
          },
        },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        setMessage('Pago realizado con éxito');
        setIsSuccess(true);
        await api.put(`/proyectos/${proyecto.id}`, { pagado: true }); // Actualizar el estado "pagado" en la base de datos
      }
    } catch (error) {
      setMessage('Ocurrió un error al procesar el pago');
    }
  };

  return (
    <div className="payment-section">
      <h3>Pagar Proyecto: {proyecto.titulo}</h3>
      <form onSubmit={handleSubmit}>
        <div className="payment-field">
          <label>Número de Tarjeta</label>
          <CardNumberElement className="CardElement" />
        </div>
        <div className="payment-field">
          <label>Fecha de Vencimiento</label>
          <CardExpiryElement className="CardElement" />
        </div>
        <div className="payment-field">
          <label>CVV</label>
          <CardCvcElement className="CardElement" />
        </div>
        <button type="submit" disabled={!stripe || !elements}>
          Pagar ${proyecto.costo_proyecto}
        </button>
      </form>
      {message && (
        <div className={isSuccess ? 'payment-success' : 'payment-error'}>
          {message}
        </div>
      )}
    </div>
  );
};

export default PagoProyecto;
