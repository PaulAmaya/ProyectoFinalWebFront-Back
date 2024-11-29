const libroRepository = require('../repositories/libroRepository');

exports.getLibroById = async (req, res) => {
  const libroId = req.params.id;
  try {
    const libro = await libroRepository.getLibroById(libroId);
    if (!libro) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }
    res.status(200).json(libro);
  } catch (error) {
    console.error('Error al obtener el libro:', error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener el libro' });
  }
};

exports.addLibro = async (req, res) => {
  const libroData = req.body;
  try {
    const nuevoLibro = await libroRepository.addLibro(libroData);
    res.status(201).json(nuevoLibro);
  } catch (error) {
    console.error('Error al agregar el libro:', error);
    res.status(500).json({ mensaje: 'Hubo un error al agregar el libro' });
  }
};

exports.deleteLibro = async (req, res) => {
  const libroId = req.params.id;
  try {
    const libro = await libroRepository.deleteLibro(libroId);
    if (!libro) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }
    res.status(200).json({ mensaje: 'Libro eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el libro:', error);
    res.status(500).json({ mensaje: 'Hubo un error al eliminar el libro' });
  }
};

exports.getLibros = async (req, res) => {
  try {
    const libros = await libroRepository.getLibros();
    res.status(200).json(libros);
  } catch (error) {
    console.error('Error al obtener los libros:', error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener los libros' });
  }
};


exports.getLibrosByGenero = async (req, res) => {
    const generoId = req.params.generoId;
    try {
      const libros = await libroRepository.getLibrosByGenero(generoId);
      if (libros.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron libros para este género' });
      }
      res.status(200).json(libros);
    } catch (error) {
      console.error('Error al obtener los libros por género:', error);
      res.status(500).json({ mensaje: 'Hubo un error al obtener los libros por género' });
    }
  };


  exports.buscarLibroPorNombreOAutor = async (req, res) => {
    const { q } = req.query;

    console.log('Búsqueda recibida en el controlador:', q);

    try {
        const libros = await libroRepository.buscarLibroPorNombreOAutor(q);
        return res.status(200).json(libros);
    } catch (error) {
        console.error('Error al buscar libros:', error);
        return res.status(500).json('Hubo un error');
    }
}

exports.updateLibro = async (req, res) => {
    const libroData = req.body;
    try {
      const libro = await libroRepository.updateLibro(libroData);
      if (!libro) {
        return res.status(404).json({ mensaje: 'Libro no encontrado' });
      }
      res.status(200).json(libro);
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      res.status(500).json({ mensaje: 'Hubo un error al actualizar el libro' });
    }
  }
