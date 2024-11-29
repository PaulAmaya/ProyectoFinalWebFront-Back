const usuarioRepository = require('../repositories/userRepository');
const carritoRepository = require('../repositories/carritoRepository');
const administradorRepository = require('../repositories/AdminRepository');

exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        const user = await usuarioRepository.getUserByCorreo(correo);

        if (!user) {
            return res.status(401).json('Usuario o contraseña incorrectos');
        }

        if (user.contrasena !== contrasena) {
            return res.status(401).json('Usuario o contraseña incorrectos');
        }

        const isAdmin = await administradorRepository.getAdminByUserId(user.usuarioid);
        
        delete user.contrasena;

        if (isAdmin) {
            return res.json({ ...user, isAdmin: true });
        } else {
            const carrito = await carritoRepository.getCarritoByClienteId(user.usuarioid);

            if (!carrito) {
                return res.status(404).json('Carrito no encontrado para este usuario');
            }

            return res.json({ ...user, carritoid: carrito.carritoid, isAdmin: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json('Hubo un error');
    }
};


exports.createUser = async(req, res) => {
    const { nombrecompleto, correo, contrasena } = req.body;

    try{
        const user = await usuarioRepository.createUsuario({ nombrecompleto, correo, contrasena });

        res.status(201).json(user);

    }catch(error){
        console.error(error);
        res.status(500).json('Hubo un error');
    }
}

