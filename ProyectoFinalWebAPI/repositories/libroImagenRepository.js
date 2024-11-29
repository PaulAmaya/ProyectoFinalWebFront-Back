const { pool } = require('../dbConnection/postgressqlConnect');

const getImagenById = async (id) => {
    const sql = 'SELECT * FROM libroimagen WHERE imagenid = $1';
    const result = await pool.query(sql, [id]);
    return result.rows[0];
}

const createImagen = async (imagen) => {
    const { filename, path } = imagen;
    const temporal = 1;
    const fechaSubida = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const data = [filename, path, temporal, fechaSubida];
    const sql = 'INSERT INTO libroimagen (filename, path, temporal, fechaSubida) VALUES ($1, $2, $3, $4) RETURNING imagenid';

    const result = await pool.query(sql, data);
    const imagenid = result.rows[0].imagenid;

    return imagenid;
}

module.exports = {
    getImagenById,
    createImagen,
};