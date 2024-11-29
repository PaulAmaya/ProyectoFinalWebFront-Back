const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');

// Ruta para buscar libros por nombre o autor
router.get('/buscar', libroController.buscarLibroPorNombreOAutor);

// Ruta para obtener libros por género
router.get('/genero/:generoId', libroController.getLibrosByGenero);

// Ruta para obtener todos los libros
router.get('/', libroController.getLibros);

// Ruta para obtener un libro por ID
router.get('/:id', libroController.getLibroById);

// Ruta para agregar un nuevo libro
router.post('/', libroController.addLibro);

// Ruta para eliminar un libro por ID
router.delete('/:id', libroController.deleteLibro);

router.put('/', libroController.updateLibro);


module.exports = router;
