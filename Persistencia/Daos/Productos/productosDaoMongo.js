
const moduloMon = require('../../Contenedores/ContenedorMongo')
const mongoose = require('mongoose')

class productosDaoMongo extends moduloMon.Contenedor {

    constructor() {
        const s = new mongoose.Schema({
            nombre: { type: String, required: true },
            precio: { type: Number, required: false },
            descripcion: { type: String, required: false },
            Categoria: { type: String, required: false },
            Foto: { type: String, required: false }

        });
        super('productos', s, mongoose.model('productos', s))
    }


}

module.exports.productosDaoMongo = productosDaoMongo;