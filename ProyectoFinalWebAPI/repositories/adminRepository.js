const { pool } = require('../dbConnection/postgressqlConnect');

async function getAdminByUserId(administradorid) {
  try {
    const result = await pool.query(
      `SELECT * FROM administrador WHERE administradorid = $1`,
      [administradorid]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener el admin por ID de usuario:', error);
    throw error;
  }
}


module.exports = {
  getAdminByUserId
};