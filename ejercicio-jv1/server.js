const express = require('express');
const app = express();

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Puerto desde variable de entorno o por defecto 3001
const PORT = process.env.PORT || 3001;

// Endpoint GET /saludar con parámetro nombre
app.get('/saludar', (req, res) => {
  const nombre = req.query.nombre;
  
  if (!nombre) {
    return res.status(400).json({ 
      error: 'El parámetro "nombre" es requerido' 
    });
  }
  
  res.json({ 
    mensaje: `Hola, ${nombre}!` 
  });
});

// Endpoint POST que recibe un JSON y lo imprime
app.post('/', (req, res) => {
  const datosRecibidos = req.body;
  
  // Imprimir el JSON recibido en la consola
  console.log('JSON recibido:', JSON.stringify(datosRecibidos, null, 2));
  
  res.json({ 
    mensaje: 'Datos recibidos correctamente',
    datos: datosRecibidos
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

