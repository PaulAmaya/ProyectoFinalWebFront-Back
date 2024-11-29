const {pool} = require('../dbConnection/postgressqlConnect');

async function crearPedido(clienteid) {
  const query = `
      INSERT INTO pedido (clienteid, fecha, estado, total)
      VALUES ($1, NOW(), 'realizado', 0)
      RETURNING pedidoid;
  `;
  const values = [clienteid];

  try {
      const result = await pool.query(query, values);
      return result.rows[0].pedidoid;
  } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
  }
}

async function actualizarTotalPedido(pedidoid, total) {
  const query = `
      UPDATE pedido
      SET total = $1
      WHERE pedidoid = $2;
  `;
  const values = [total, pedidoid];

  try {
      await pool.query(query, values);
  } catch (error) {
      console.error('Error al actualizar el total del pedido:', error);
      throw error;
  }
}
  
  async function getPedidoById(id) {
    try {
      const result = await pool.query(
        `SELECT * FROM Pedido WHERE pedidoid = $1`, 
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener el pedido:', error);
      throw error;
    }
  }
  
  async function deletePedido(id) {
    try {
      const result = await pool.query(
        `DELETE FROM Pedido WHERE pedidoid = $1 RETURNING *`, 
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
      throw error;
    }
  }

  async function getPedidosByUserId(clienteId) {
    try {
      const result = await pool.query(
        `SELECT * FROM Pedido WHERE clienteid = $1 ORDER BY fecha DESC`,
        [clienteId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error al obtener los pedidos por ID de usuario:', error);
      throw error;
    }
  }


  async function getPedidoWithDetails() {
    const query = `
        SELECT 
          u.nombrecompleto AS nombre_cliente,
          l.titulo AS nombre_libro,
          dp.cantidad AS cantidad_comprada,
          p.fecha AS fecha_pedido,
          p.total AS total_pedido
      FROM 
          pedido p
      JOIN 
          usuario u ON p.clienteid = u.usuarioid 
      JOIN 
          detallepedido dp ON dp.pedidoid = p.pedidoid
      JOIN 
          libro l ON dp.libroid = l.libroid
      ORDER BY 
          p.fecha DESC;
    `;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener la lista de pedidos:', error);
        throw error;
    }
  }
  
  module.exports = {
    crearPedido,
    actualizarTotalPedido,
    getPedidoById,
    deletePedido,
    getPedidosByUserId,
    getPedidoWithDetails,
  };