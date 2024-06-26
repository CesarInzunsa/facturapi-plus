// Importar el módulo de express
const express = require('express');

// Importar rutas
const customerRoutes = require('./src/api/routes/customerRoutes');
const productRoutes = require('./src/api/routes/productRoutes');
const billRoutes = require('./src/api/routes/billRoutes');

// Importar configuración para variables de entorno
const config = require('./src/config/config');

// Crear aplicación de express
const app = express();

// Habilitar el uso de JSON
app.use(express.json());

// Establecer la conexion a la base de datos
const db = require('./src/config/database.config');

// Establecer el puerto
app.set('port', config.PORT);

// | ======================== |
// |     SECCIÓN DE RUTAS     |
// | ======================== |
app.use('/customer', customerRoutes);
app.use('/product', productRoutes);
app.use('/bill', billRoutes);

// Iniciar el servidor
app.listen(config.PORT, () => {
    console.log(`Server is running on: ${app.get('port')}`);
});
