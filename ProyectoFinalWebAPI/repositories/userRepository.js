const {pool} = require('../dbConnection/postgressqlConnect');

async function getConnection() {
    try {
        const usuario = await pool.connect();
        return usuario;
    } catch (error) {
        console.error('Error getting connection', error);
        throw error;
    }
}

async function getUserByCorreo(correo) {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM usuario WHERE correo = $1', [correo]);
        return res.rows[0];
    } catch (error) {
        console.error('Error al obtener el usuario por correo:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function createUsuario(usuarioData) {
    const {nombrecompleto, correo, contrasena} = usuarioData;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            'INSERT INTO usuario (nombrecompleto, correo, contrasena) VALUES ($1, $2, $3) RETURNING *',
            [nombrecompleto, correo, contrasena]
        );

        await client.query('COMMIT');

        return result.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear el usuario:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = {
    getUserByCorreo,
    createUsuario,
    getConnection
};
