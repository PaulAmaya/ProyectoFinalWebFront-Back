const generoRepository = require('../repositories/generoRepository');

exports.getGeneroById = async (req, res) => {
  const generoid = req.params.generoid;
  try {
    const genero = await generoRepository.getGeneroById(generoid);
    if (!genero) {
      return res.status(404).json({ mensaje: 'Género no encontrado' });
    }
    res.status(200).json(genero);
  } catch (error) {
    console.error('Error al obtener el género:', error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener el género' });
  }
};

exports.addGenero = async (req, res) => {
  const generoData = req.body;
  try {
    const nuevoGenero = await generoRepository.addGenero(generoData);
    res.status(201).json(nuevoGenero);
  } catch (error) {
    console.error('Error al agregar el género:', error);
    res.status(500).json({ mensaje: 'Hubo un error al agregar el género' });
  }
};

exports.deleteGenero = async (req, res) => {
  const generoid = req.params.generoid;
  try {
    const genero = await generoRepository.deleteGenero(generoid);
    if (!genero) {
      return res.status(404).json({ mensaje: 'Género no encontrado' });
    }
    res.status(200).json({ mensaje: 'Género eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el género:', error);
    res.status(500).json({ mensaje: 'Hubo un error al eliminar el género' });
  }
};

// Obtener todos los géneros
exports.getGeneros = async (req, res) => {
  try {
    const generos = await generoRepository.getGeneros();
    res.status(200).json(generos);
  } catch (error) {
    console.error('Error al obtener los géneros:', error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener los géneros' });
  }
};


exports.updateGenero = async (req, res) => {
    const generoData = req.body;
    
    try {
      const generoActualizado = await generoRepository.updateGenero(generoData);
      if (!generoActualizado) {
        return res.status(404).json({ mensaje: 'Género no encontrado' });
      }
      res.status(200).json(generoActualizado);
    } catch (error) {
      console.error('Error al actualizar el género:', error);
      res.status(500).json({ mensaje: 'Hubo un error al actualizar el género' });
    }
  };
