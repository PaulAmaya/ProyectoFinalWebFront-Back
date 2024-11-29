const libroImagenRepository = require('../repositories/libroImagenRepository');
const fs = require('fs');
const path = require('path');

const getMimeType = (filename) => {
    if (!filename) {
        console.error('fileName is undefined');
        return 'application/octet-stream'; 
    }

    const extension = path.extname(filename.toLowerCase());
    switch (extension) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}

exports.getImagenById = async (req, res) => {
    const imagenId = req.params.imagenId;

    console.log('ID recibido en el controlador:', imagenId);

    try {
        const imagen = await libroImagenRepository.getImagenById(imagenId);
        if (!imagen) {
            console.log('Imagen no encontrada para el ID:', imagenId);
            return res.status(404).json('Imagen no encontrada');
        }

        console.log('Imagen encontrada:', imagen);

        fs.readFile(imagen.path, (err, data) => {
            if (err) {
                console.error('Error al leer la imagen:', err);
                return res.status(404).send('Image not found');
            }
            const contentType = getMimeType(imagen.filename);
            console.log('Tipo MIME determinado:', contentType);
            res.setHeader('Content-Type', contentType);
            res.send(data);
        });
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        return res.status(500).json('Hubo un error');
    }
}

exports.createImagen = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const filename = req.file.originalname;
        const path = req.file.path;

        const imagenid = await libroImagenRepository.createImagen({ filename, path });

        res.json(imagenid);
    } catch (error) {
        console.error(error);
        return null;
    }
}