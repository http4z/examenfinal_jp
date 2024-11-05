require('dotenv').config();
const app = require('./app');
const { Pool } = require('pg');

const Production = process.env.NODE_ENV === 'produccion';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: Production ? { rejectUnauthorized: false } : false,
});


app.locals.pool = pool;

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
