const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Obtener todos los proyectos
router.get('/', async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const result = await pool.query('SELECT * FROM proyectos');
    console.log("Datos de proyectos:", result.rows); // Esto imprimirá los datos obtenidos en la consola
    res.json(result.rows); // Asegúrate de que estamos enviando el array de filas correctamente
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res.status(500).json({ error: 'Error al obtener proyectos', details: error.message });
  }
});


// Crear un nuevo proyecto
router.post('/', async (req, res) => {
  const { titulo, descripcion, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto } = req.body;
  const pool = req.app.locals.pool;
  try {
    const result = await pool.query(
      'INSERT INTO proyectos (titulo, descripcion, completada, fecha_creacion, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto, pagado) VALUES ($1, $2, false, NOW(), $3, $4, $5, $6, $7, false) RETURNING *',
      [titulo, descripcion, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
});

// Actualizar un proyecto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, completada, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto, pagado } = req.body;
  const pool = req.app.locals.pool;
  try {
    const result = await pool.query(
      'UPDATE proyectos SET titulo = $1, descripcion = $2, completada = $3, fecha_vencimiento = $4, prioridad = $5, asignado_a = $6, categoria = $7, costo_proyecto = $8, pagado = $9 WHERE id = $10 RETURNING *',
      [titulo, descripcion, completada, fecha_vencimiento, prioridad, asignado_a, categoria, costo_proyecto, pagado, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
});

// Eliminar un proyecto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const pool = req.app.locals.pool;
  try {
    await pool.query('DELETE FROM proyectos WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
});

// Ruta de pago para un proyecto
router.post('/:id/pagar', async (req, res) => {
  const { id } = req.params;
  const pool = req.app.locals.pool;

  try {
    const project = await pool.query('SELECT * FROM proyectos WHERE id = $1', [id]);
    if (!project.rows.length) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: project.rows[0].costo_proyecto * 100,
      currency: 'usd'
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
});

module.exports = router;
