// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const proyectoRoutes = require('./routes/proyecto');
require('dotenv').config();
const { Pool } = require('pg');

// Inicializa Express y el pool de PostgreSQL
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

app.locals.pool = pool;

// Configuración de middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas de la API
app.use('/api/proyectos', proyectoRoutes);

// Ruta de prueba de conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send({ message: 'Conexión a la base de datos exitosa', timestamp: result.rows[0].now });
  } catch (error) {
    res.status(500).send({ message: 'Error al conectar a la base de datos', error: error.message });
  }
});

module.exports = app;
