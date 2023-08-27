const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const PORT = 3000;
const {
  agregarPost,
  obtenerPosts,
  obtenerPost,
  modificarPost,
  eliminarPost,
  agregarLike,
} = require('./consultas');
const app = express();
app.disable('x-powered-by');

//var bodyParser = require('body-parser');

app.use(express.json());
app.use(cors());
require('dotenv').config();
app.use(logger('dev'));

app.listen(PORT, console.log(`Servidor iniciado en: http://localhost:${PORT}`));

// app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

app.post('/posts', async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body;
    const resultado = await agregarPost(titulo, url, descripcion);
    res.json(resultado);

    console.log(`🟢 Cliente : Se ha agregado correctamente el post
    `);
  } catch (err) {
    console.error(`
🔴 Servidor: Ha habido un error -> Error (${err.code}): ${err.message}
    `);
    res.status(500).send('Error interno en el Servidor');
  }
});

app.get('/posts', async (req, res) => {
  try {
    const resultado = await obtenerPosts();
    res.json(resultado);
  } catch (err) {
    console.error(`
🔴 Servidor: Ha habido un error -> Error (${err.code}): ${err.message}
    `);
    res.status(500).send('Error interno en el Servidor');
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await obtenerPost(id);
    res.json(resultado);
  } catch (err) {
    console.error(`
🔴 Servidor: Ha habido un error -> Error (${err.code}): ${err.message}
    `);
    res.status(500).send('Error interno en el Servidor');
  }
});

app.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { titulo, img, descripcion } = req.query;
    if (titulo == null || img == null || descripcion == null) {
      let datosPost = await obtenerPost(id);
      if (!titulo) {
        titulo = datosPost[0].titulo;
      }
      if (!img) {
        img = datosPost[0].img;
      }
      if (!descripcion) {
        descripcion = datosPost[0].descripcion;
      }
    }
    await modificarPost(titulo, img, descripcion, id);
    res.status(200).send(`Se ha modificado el post llamado ${titulo}`);
  } catch (err) {
    console.error(`
🔴 Servidor: Ha habido un error -> Error (${err.code}): ${err.message}
    `);
    res.status(500).send('Error interno en el Servidor');
  }
});

app.put('/posts/like/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await agregarLike(id);
    res.send(`Se ha agregado un like al post`);
  } catch (err) {
    console.error(`
🔴 Servidor: Ha habido un error -> Error (${err.code}): ${err.message}
    `);
    res.status(500).send('Error interno en el Servidor');
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarPost(id);
    return res.send('Se ha eliminado el post');
  } catch (err) {
    console.error(`
🔴 Servidor: Ha habido un error -> Error (${err.code}): ${err.message}
    `);
    res.status(500).send('Error interno en el Servidor');
  }
});
