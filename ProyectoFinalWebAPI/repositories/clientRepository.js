const { pool } = require('../dbConnection/postgressqlConnect');

//traer los datos de cliente y los datos de ususario con usuarioid
async function getUserClients(id) {
    const result = await pool.query(`SELECT u."usuarioid", u.nombreCompleto, u.correo, c.direccion, c.telefono
         FROM usuario u
         JOIN cliente c ON u."usuarioid" = c."clienteid"
         WHERE u."usuarioid" = $1`, 
        [id]);
    return result.rows;
}

async function getAllClients() {
    try {
        const result = await pool.query(
            `SELECT u."usuarioid", u.nombreCompleto, u.correo, c.direccion, c.telefono
             FROM usuario u
             JOIN cliente c ON u."usuarioid" = c."clienteid"`
        );
        return result.rows;
    } catch (error) {
        console.error('Error al obtener todos los clientes:', error);
        throw error;
    }
}

async function createClient(nombreCompleto, correo, contrasena, direccion, telefono) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const insertUsuarioResult = await client.query(
            'INSERT INTO usuario (nombrecompleto, correo, contrasena) VALUES ($1, $2, $3) RETURNING "usuarioid"',
            [nombreCompleto, correo, contrasena]
        );

        const usuarioid = insertUsuarioResult.rows[0].usuarioid;

        const insertClienteResult = await client.query(
            'INSERT INTO cliente ("clienteid", direccion, telefono) VALUES ($1, $2, $3) RETURNING *',
            [usuarioid, direccion, telefono]
        );

        await client.query('COMMIT');

        console.log('Datos recibidos en el repositorio para crear cliente:', { nombreCompleto, correo, contrasena, direccion, telefono });

        return {
            usuarioid,
            nombreCompleto,
            correo,
            contrasena,
            direccion,
            telefono
        };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear el cliente:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function updateClient(ClientId, nombrecompleto, telefono, direccion) {
    const client = await pool.connect();


    try {
        await client.query('BEGIN');

        const updateUsuarioResult = await client.query(
            'UPDATE usuario SET nombrecompleto = $1 WHERE "usuarioid" = $2 RETURNING *',
            [nombrecompleto, ClientId]
        );

        const updateClienteResult = await client.query(
            'UPDATE cliente SET telefono = $1, direccion = $2 WHERE "clienteid" = $3 RETURNING *',
            [telefono, direccion, ClientId]
        );

        await client.query('COMMIT');

        return {
            ...updateUsuarioResult.rows[0],
            ...updateClienteResult.rows[0]
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al actualizar el cliente:', error);
        throw error;
    }finally{
        client.release();
    }
}

async function deleteClient(id) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const deleteClienteResult = await client.query(
            'DELETE FROM cliente WHERE "clienteid" = $1 RETURNING *',
            [id]
        );

        const deleteUsuarioResult = await client.query(
            'DELETE FROM usuario WHERE "usuarioid" = $1 RETURNING *',
            [id]
        );

        await client.query('COMMIT');

        return {
            ...deleteClienteResult.rows[0],
            ...deleteUsuarioResult.rows[0]
        };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al eliminar el cliente y el usuario:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function deleteCarritoByClienteId(clienteId) {
    try {
        const result = await pool.query(
            `DELETE FROM carrito WHERE clienteid = $1 RETURNING *`,
            [clienteId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al eliminar el carrito:', error);
        throw error;
    }
}   


async function updateEstadoPedidoByClienteId(clienteId, estado) {
    try {
        const result = await pool.query(
            `UPDATE pedido SET estado = $1 WHERE clienteid = $2 RETURNING *`,
            [estado, clienteId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        throw error;
    }
}

async function getClienteById(clienteid) {
    const result = await pool.query(`SELECT * FROM cliente WHERE clienteid = $1`, [clienteid]);
    return result.rows[0];
}

module.exports = {
    getUserClients,
    getAllClients,
    createClient,
    updateClient,
    deleteClient,
    deleteCarritoByClienteId,
    updateEstadoPedidoByClienteId,
    getClienteById
};