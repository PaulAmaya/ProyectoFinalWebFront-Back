const { pool } = require('../dbConnection/postgressqlConnect');

async function getLibroById(id) {
  try {
    const result = await pool.query(
      `SELECT * FROM Libro WHERE libroid = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener el libro por ID:', error);
    throw error;
  }
}

async function addLibro(libroData) {
  const { titulo, autor, editorial, isbn, generoid, precio, stock, descripcion, anoPublicacion, idioma, imagenid } = libroData;
  try {
    const result = await pool.query(
      `INSERT INTO Libro (titulo, autor, editorial, isbn, generoid, precio, stock, descripcion, anopublicacion, idioma, imagenid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [titulo, autor, editorial, isbn, generoid, precio, stock, descripcion, anoPublicacion, idioma, imagenid]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al agregar el libro:', error);
    throw error;
  }
}

async function updateLibro(libroData) {
  const { libroid, titulo, autor, editorial, isbn, generoid, precio, stock, descripcion, anoPublicacion, idioma, imagenid } = libroData;
  const oldLibro = await getLibroById(libroid);
  const existeImage = !isNaN(imagenid) && imagenid > 0;

  try {
    const result = await pool.query(
      `UPDATE Libro SET titulo = $1, autor = $2, editorial = $3, isbn = $4, generoid = $5, precio = $6, stock = $7, descripcion = $8, anopublicacion = $9, idioma = $10, imagenid = $11
       WHERE libroid = $12 RETURNING *`,
      [titulo, autor, editorial, isbn, generoid, precio, stock, descripcion, anoPublicacion, idioma, existeImage ? imagenid : null, libroid]
    );

    if (existeImage) {
      await pool.query('UPDATE libroImagen SET temporal = false WHERE imagenid = $1', [imagenid]);
    }
    if (oldLibro.imagenid && oldLibro.imagenid !== imagenid) {
      await pool.query('UPDATE libroImagen SET temporal = true WHERE imagenid = $1', [oldLibro.imagenid]);
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar el libro:', error);
    throw error;
  }
}

async function deleteLibro(id) {
  try {
    const result = await pool.query(
      `DELETE FROM Libro WHERE libroid = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al eliminar el libro:', error);
    throw error;
  }
}

async function getLibros() {
  try {
    const result = await pool.query(`SELECT * FROM Libro`);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener los libros:', error);
    throw error;
  }
}

async function getLibrosByGenero(generoId) {
    try {
      const result = await pool.query(
        `SELECT * FROM Libro WHERE generoid = $1`,
        [generoId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error al obtener los libros por género:', error);
      throw error;
    }
  }


  async function buscarLibroPorNombreOAutor(busqueda) {
    const query = `
        SELECT *
        FROM libro
        WHERE LOWER(titulo) LIKE LOWER($1)
           OR LOWER(autor) LIKE LOWER($1)
    `;
    const valores = [`%${busqueda}%`];
    const resultado = await pool.query(query, valores);
    return resultado.rows;
}



module.exports = {
  getLibroById,
  addLibro,
  deleteLibro,
  getLibros,
  getLibrosByGenero,
  buscarLibroPorNombreOAutor,
  updateLibro
};
