const { pool } = require('../dbConnection/postgressqlConnect');

async function getGeneroById(generoid) {
  try {
    const result = await pool.query(
      `SELECT * FROM genero WHERE generoid = $1`,
      [generoid]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener el género por ID:', error);
    throw error;
  }
}

async function addGenero(generoData) {
  const { nombre } = generoData;
  try {
    const result = await pool.query(
      `INSERT INTO genero (nombre) VALUES ($1) RETURNING *`,
      [nombre]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al agregar el género:', error);
    throw error;
  }
}

async function deleteGenero(generoid) {
  try {
    const result = await pool.query(
      `DELETE FROM genero WHERE generoid = $1 RETURNING *`,
      [generoid]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al eliminar el género:', error);
    throw error;
  }
}

async function getGeneros() {
  try {
    const result = await pool.query(`SELECT * FROM genero`);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener los géneros:', error);
    throw error;
  }
}



async function updateGenero(generoData) {
  const { generoid, nombre, imagenid} = generoData;
  const oldGenero = await getGeneroById(generoid);
  const existeImage = !isNaN(imagenid) && imagenid > 0;

  try {
    const result = await pool.query(
      `UPDATE genero SET nombre = $1, imagenid = $2
       WHERE generoid = $3 RETURNING *`,
      [nombre, existeImage ? imagenid : null, generoid]
    );

    if (existeImage) {
      await pool.query('UPDATE libroImagen SET temporal = false WHERE imagenid = $1', [imagenid]);
    }
    if (oldGenero.imagenid && oldGenero.imagenid !== imagenid) {
      await pool.query('UPDATE libroImagen SET temporal = true WHERE imagenid = $1', [oldGenero.imagenid]);
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar el libro:', error);
    throw error;
  }
}


module.exports = {
  getGeneroById,
  addGenero,
  deleteGenero,
  getGeneros,
  updateGenero
  
};
