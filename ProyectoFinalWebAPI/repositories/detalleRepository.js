const { pool } = require('../dbConnection/postgressqlConnect');

// Obtener un detalle por su ID
async function getDetalleById(id) {
  try {
    const result = await pool.query(
      `SELECT * FROM detallePedido WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener el detalle por ID:', error);
    throw error;
  }
}

async function agregarDetallePedido(pedidoid, libroid, cantidad, precioUnitario) {
  try {
      const checkQuery = `
          SELECT cantidad 
          FROM detallepedido 
          WHERE pedidoid = $1 AND libroid = $2;
      `;
      const checkValues = [pedidoid, libroid];
      const checkResult = await pool.query(checkQuery, checkValues);

      if (checkResult.rows.length > 0) {
          const updateQuery = `
              UPDATE detallepedido
              SET cantidad = cantidad + $1
              WHERE pedidoid = $2 AND libroid = $3
              RETURNING detallepedidoid;
          `;
          const updateValues = [cantidad, pedidoid, libroid];
          const updateResult = await pool.query(updateQuery, updateValues);

          console.log('Cantidad actualizada en detallepedido:', updateResult.rows[0]);
          return updateResult.rows[0].detallepedidoid;
      } else {
          const insertQuery = `
              INSERT INTO detallepedido (pedidoid, libroid, cantidad, preciounitario)
              VALUES ($1, $2, $3, $4)
              RETURNING detallepedidoid;
          `;
          const insertValues = [pedidoid, libroid, cantidad, precioUnitario];
          const insertResult = await pool.query(insertQuery, insertValues);

          console.log('Nuevo detalle agregado en detallepedido:', insertResult.rows[0]);
          return insertResult.rows[0].detallepedidoid;
      }
  } catch (error) {
      console.error('Error al agregar o actualizar detalle de pedido:', error);
      throw error;
  }
}


async function deleteDetalle(id) {
  try {
    const result = await pool.query(
      `DELETE FROM detallePedido WHERE detallepedidoid = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al eliminar el detalle:', error);
    throw error;
  }
  
}


async function updateCantidadDetalle(detallepedidoid, cantidad) {
  try {
    const result = await pool.query(
      `UPDATE detallePedido SET cantidad = $1 WHERE detallepedidoid = $2 RETURNING *`,
      [cantidad, detallepedidoid]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar la cantidad del detalle:', error);
    throw error;
  }
}


module.exports = {
    getDetalleById,
    agregarDetallePedido,
    updateCantidadDetalle,
    deleteDetalle
    };