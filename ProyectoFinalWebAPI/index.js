require('dotenv').config();

const express = require('express');
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('C:\\Users\\HP\\Desktop\\ProyectoFinalWeb'));

const pedidoRouter = require('./routes/pedidoRouter');
const clienteRouter = require('./routes/clienteRouter');
const usuarioRouter = require('./routes/usuarioRouter');
const carritoRouter = require('./routes/carritoRouter');
const libroRouter = require('./routes/librosRouter');
const generoRouter = require('./routes/generoRouter');
const detalleRouter = require('./routes/detalleRouter');
const libroImagenRouter = require('./routes/libroImagenRouter');
const adminRouter = require('./routes/AdminRouter');


app.use('/api/pedido', pedidoRouter);
app.use('/api/cliente', clienteRouter);
app.use('/api/usuario', usuarioRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/libro', libroRouter);
app.use('/api/genero', generoRouter);
app.use('/api/detalle', detalleRouter);
app.use('/api/libroImage', libroImagenRouter);
app.use('/api/admin', adminRouter);

app.listen(port, () =>{
    console.log('Server is running on port: ', port);
});
