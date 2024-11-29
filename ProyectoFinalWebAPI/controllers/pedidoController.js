const pedidoRepository = require('../repositories/pedidoRepository');
const libroRepository = require('../repositories/libroRepository');
const detalleRepository = require('../repositories/detalleRepository');


exports.realizarPedido = async (req, res) => {
  const { clienteid, items } = req.body;

  try {
      if (!Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ mensaje: "El campo 'items' debe ser un array no vacío." });
      }

      const pedidoid = await pedidoRepository.crearPedido(clienteid);

      let total = 0; 

      for (const item of items) {
          const libro = await libroRepository.getLibroById(item.libroid);
          if (!libro) {
              return res.status(404).json({ mensaje: `Libro con ID ${item.libroid} no encontrado.` });
          }

          const precioUnitario = parseFloat(libro.precio); 
          const subtotal = precioUnitario * item.cantidad;

          await detalleRepository.agregarDetallePedido(pedidoid, item.libroid, item.cantidad, precioUnitario);

          total += subtotal; 
      }

      await pedidoRepository.actualizarTotalPedido(pedidoid, total);

      return res.status(201).json({
          mensaje: 'Pedido realizado con éxito.',
          pedidoid,
          total,
      });
  } catch (error) {
      console.error('Error al realizar el pedido:', error);
      return res.status(500).json({ mensaje: 'Ocurrió un error al realizar el pedido.', error: error.message });
  }
};


  
exports.getPedidoById = async (req, res) => {
  const pedidoId = req.params.id;
  try {
    const pedido = await pedidoRepository.getPedidoById(pedidoId);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener el pedido' });
  }
};

exports.deletePedido = async (req, res) => {
  const pedidoId = req.params.id;
  try {
    const pedido = await pedidoRepository.deletePedido(pedidoId);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json({ mensaje: 'Pedido eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    res.status(500).json({ mensaje: 'Hubo un error al eliminar el pedido' });
  }
};

exports.getPedidosByUserId = async (req, res) => {
  const clienteId = req.params.id; 
  try {
    const pedidos = await pedidoRepository.getPedidosByUserId(clienteId);
    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron pedidos para este cliente' });
    }
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos del cliente:', error);
    return res.status(500).json({ mensaje: 'Hubo un error al obtener los pedidos' });
  }
};


exports.getPedidoWithDetails = async (req, res) => {
  try {
    const pedidos = await pedidoRepository.getPedidoWithDetails();
    res.status(200).json(pedidos);
} catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ mensaje: 'Error al obtener los pedidos.' });
}
};