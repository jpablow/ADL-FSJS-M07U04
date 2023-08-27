const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDB,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  allowExitOnIdle: true,
});

const agregarPost = async (titulo, img, descripcion) => {
  try {
    const consulta = 'INSERT INTO posts VALUES(DEFAULT, $1, $2, $3, $4)';
    const valores = [titulo, img, descripcion, 0];
    await pool.query(consulta, valores);
    console.log(`
🟢 Servidor: Nuevo registro creado en la tabla posts
    `);
  } catch (err) {
    throw { code: err.code, message: err.message };
  }
};

const obtenerPosts = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY id ASC');
    console.log(`
🟢 Servidor: Registros obtenidos exitosamente
        `);
    return rows;
  } catch (err) {
    throw { code: err.code, message: err.message };
  }
};

const obtenerPost = async (id) => {
  try {
    const consulta = 'SELECT * FROM posts WHERE id = $1';
    const { rows } = await pool.query(consulta, [id]);
    console.log(`
🟢 Servidor: Registro con id ${id} obtenido exitosamente
        `);
    return rows;
  } catch (err) {
    throw { code: err.code, message: err.message };
  }
};

const modificarPost = async (titulo, img, descripcion, id) => {
  try {
    const consulta =
      'UPDATE posts SET titulo = $1, img = $2, descripcion = $3 WHERE id = $4';
    const valores = [titulo, img, descripcion, id];
    await pool.query(consulta, valores);
    console.log(`
🟢 Servidor: Registro con id ${id} modificado exitosamente
      `);
  } catch (err) {
    throw { code: err.code, message: err.message };
  }
};

const agregarLike = async (id) => {
  try {
    const consulta = 'UPDATE posts SET likes = likes + 1 WHERE id = $1';
    await pool.query(consulta, [id]);
    console.log(`
🟢 Servidor: Se ha agregado un like al registro con id ${id}
          `);
  } catch (err) {
    throw { code: err.code, message: err.message };
  }
};

const eliminarPost = async (id) => {
  try {
    const consulta = 'DELETE FROM posts WHERE id = $1';
    await pool.query(consulta, [id]);
    console.log(`
🟢 Servidor: Se ha eliminado exitosamente el registro con id ${id}
              `);
  } catch (err) {
    throw { code: err.code, message: err.message };
  }
};

module.exports = {
  agregarPost,
  obtenerPosts,
  obtenerPost,
  modificarPost,
  eliminarPost,
  agregarLike,
};
