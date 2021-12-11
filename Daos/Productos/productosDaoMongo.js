
const moduloMon = require('../../Entregas/ContenedorMongo.js')
const mongoose = require('mongoose')

class productosDaoMongo extends moduloMon.Contenedor {

    constructor() {
        const s = new mongoose.Schema({
            nombre: { type: String, required: true },
            precio: { type: Number, required: true }

        });
        super('productos', s, mongoose.model('productos', s))
    }


}

module.exports.productosDaoMongo = productosDaoMongo;