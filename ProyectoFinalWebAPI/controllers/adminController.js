const adminRepository = require('../repositories/AdminRepository');

exports.getAdminByUserId = async (req, res) => {
    const administradorid = req.params.administradorid;
    try {
        const admin = await adminRepository.getAdminByUserId(administradorid);
        if (!admin) {
            return res.status(404).json('Admin no encontrado');
        }
        return res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Hubo un error');
    }
}