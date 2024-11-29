const carritoRepository = require('../repositories/carritoRepository');

exports.getCarritoById = async (req, res) => {
  const carritoId = req.params.id;
  try {
    const carrito = await carritoRepository.getCarritoById(carritoId);
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }
    res.status(200).json(carrito);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener el carrito' });
  }
};

exports.getCarritoByClienteId = async (req, res) => {
  const clienteId = req.params.userId;
  try {
    const carrito = await carritoRepository.getCarritoByClienteId(clienteId);
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado para este usuario' });
    }
    res.status(200).json(carrito);
  } catch (error) {
    console.error('Error al obtener el carrito del usuario:', error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener el carrito del usuario' });
  }
};


exports.getCarritoDatosCliente = async (req, res) => {
  const usuarioid = req.params.usuarioid;
  try {
    const carrito = await carritoRepository.getCarritoDatosCliente(usuarioid);
    console.log('Datos del carrito recibidos del repositorio:', carrito);
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado para este usuario' });
    }
    res.status(200).json(carrito);
  } catch (error) {
    console.error('Error al obtener el carrito del usuario:', error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener el carrito del usuario' });
  }
};
