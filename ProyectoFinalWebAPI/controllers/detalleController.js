const detalleRepository = require('../repositories/detalleRepository');

exports.getDetalleById = async (req, res) => {
  const detalleId = req.params.id;
  try {
    const detalle = await detalleRepository.getDetalleById(detalleId);
    if (!detalle) {
      return res.status(404).json({ mensaje: 'Detalle no encontrado' });
    }
    res.status(200).json(detalle);
  } catch (error) {
    console.error('Error al obtener el detalle:', error);
    res.status(500).json({ mensaje: 'Hubo un error al obtener el detalle' });
  }
};

exports.deleteDetalle = async (req, res) => {
  const detalleId = req.params.id;
  try {
    const detalle = await detalleRepository.deleteDetalle(detalleId);
    if (!detalle) {
      return res.status(404).json({ mensaje: 'Detalle no encontrado' });
    }
    res.status(200).json({ mensaje: 'Detalle eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el detalle:', error);
    res.status(500).json({ mensaje: 'Hubo un error al eliminar el detalle' });
  }
};

exports.updateCantidadDetalle = async (req, res) => {
  const detalleId = req.params.id;
  const { cantidad } = req.body;

  try {
    const updatedDetalle = await detalleRepository.updateCantidadDetalle(detalleId, cantidad);
    if (!updatedDetalle) {
      return res.status(404).json('Detalle no encontrado');
    }
    return res.status(200).json(updatedDetalle);
  } catch (error) {
    console.error(error);
    return res.status(500).json('Hubo un error');
  }
}