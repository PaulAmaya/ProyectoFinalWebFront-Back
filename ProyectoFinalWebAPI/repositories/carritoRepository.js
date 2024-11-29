const { pool } = require('../dbConnection/postgressqlConnect');

async function getCarritoById(id) {
  try {
    const result = await pool.query(
      `SELECT * FROM carrito WHERE carritoId = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener el carrito por ID:', error);
    throw error;
  }
}

async function getCarritoByClienteId(clienteId) {
  try {
    const result = await pool.query(
      `SELECT * FROM carrito WHERE clienteid = $1`,
      [clienteId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener el carrito por ID de usuario:', error);
    throw error;
  }
}

async function getCarritoDatosCliente(usuarioid) {
  const query = `
      SELECT 
    c.clienteid AS id_cliente,
    dp.detallepedidoid AS id_detalle,
    l.titulo AS nombre_libro,
    l.precio AS precio_libro,
    dp.cantidad AS cantidad_libro
FROM 
    cliente c
JOIN 
    pedido p ON c.clienteid = p.clienteid
JOIN 
    detallepedido dp ON p.pedidoid = dp.pedidoid
JOIN 
    libro l ON dp.libroid = l.libroid
WHERE 
    c.clienteid = $1; 
  `;
  const values = [usuarioid];

  try {
      const result = await pool.query(query, values);
      console.log('Resultado de la consulta en el repositorio:', result.rows);
      return result.rows;
  } catch (error) {
      console.error('Error al obtener el carrito del cliente:', error);
      throw error;
  }
}



module.exports = {
  getCarritoById,
  getCarritoByClienteId,
  getCarritoDatosCliente
};
