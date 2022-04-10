
const moduloMon = require('../../Entregas/ContenedorMongo.js')
const mongoose = require('mongoose')

class CartsDaoMongo extends moduloMon.Contenedor {

    constructor() {
        const s = new mongoose.Schema({
            email: { type: String, required: true },
            productos: { type: String, required: false },
            direccion: { type: String, required: false },
            fecha: { type: Date, required: false },
            idcliente: { type: String, required: true }


        });
        super('carts', s, mongoose.model('carts', s))
    }


}

module.exports.CartsDaoMongo = CartsDaoMongo;