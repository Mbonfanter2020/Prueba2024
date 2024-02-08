const express = require('express');
const path = require('path');
const app = express();

// Ajusta la ruta para servir archivos estáticos desde el directorio 'dist'
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Ajusta la ruta para servir el archivo 'index.html'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
