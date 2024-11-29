const clientRepository = require('../repositories/clientRepository');

exports.getUserClients = async (req, res) => {
    const clientId = req.params.clientId;
    try {
        const cliente = await clientRepository.getUserClients(clientId);
        return res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Hubo un error');
    }
}

exports.getClientById = async (req, res) => {
    const clientId = req.params.id;
    try {
        const client = await clientRepository.getClientById(clientId);
        if (!client) {
            return res.status(404).json('Cliente no encontrado');
        }
        return res.status(200).json(client);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Hubo un error');
    }
}

exports.getAllClients = async (req, res) => {
    try {
        const clients = await clientRepository.getAllClients();
        return res.status(200).json(clients);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Hubo un error');
    }
}

exports.createClient = async (req, res) => {
    const { nombreCompleto, correo, contrasena,direccion, telefono } = req.body;

    console.log('Datos recibidos en el controlador para crear cliente:', { nombreCompleto, correo, contrasena, direccion, telefono });

    try {
        const newClient = await clientRepository.createClient(nombreCompleto, correo, contrasena, direccion, telefono);
        return res.status(201).json(newClient);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Hubo un error');
    }
}

exports.updateClient = async (req, res) => {
    const clientId = req.params.clienteId;
    const { nombrecompleto, telefono, direccion } = req.body;

   
    try {
        const updatedClient = await clientRepository.updateClient(clientId, nombrecompleto, telefono, direccion);
        if (!updatedClient) {
            return res.status(404).json('Cliente no encontrado');
        }
        return res.status(200).json(updatedClient);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Hubo un error');
    }
}

exports.deleteClient = async (req, res) => {
    const clientId = req.params.clientId;

    try {
        const deletedClient = await clientRepository.deleteClient(clientId);
        if (!deletedClient) {
            return res.status(404).json('Cliente no encontrado');
        }
        return res.status(200).json('Cliente y usuario eliminados');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Hubo un error');
    }
}

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


  exports.deleteCarritoByClienteId = async (req, res) => {
    const clienteId = req.params.clienteid;
    try {
      const carrito = await carritoRepository.deleteCarritoByClienteId(clienteId);
      if (!carrito) {
        return res.status(404).json({ mensaje: 'Carrito no encontrado' });
      }
      return res.status(200).json({ mensaje: 'Carrito eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el carrito:', error);
      return res.status(500).json({ mensaje: 'Hubo un error al eliminar el carrito' });
    }
  }

  exports.updateEstadoPedidoByClienteId = async (req, res) => {
    const clienteId = req.params.clienteid;
    const { estado } = req.body;
    try {
      const pedido = await pedidoRepository.updateEstadoPedidoByClienteId(clienteId, estado);
      if (!pedido) {
        return res.status(404).json({ mensaje: 'Pedido no encontrado' });
      }
      return res.status(200).json(pedido);
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
      return res.status(500).json({ mensaje: 'Hubo un error al actualizar el estado del pedido' });
    }
  }

  exports.getClienteById = async (req, res) => {
    const clienteid = req.params.clienteid;
    try {
        const cliente = await clientRepository.getClienteById(clienteid);
        if (!cliente) {
            return res.status(404).json('Cliente no encontrado');
        }
        return res.status(200).json(cliente);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Hubo un error');
    }
}