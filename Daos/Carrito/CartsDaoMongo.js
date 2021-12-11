
const moduloMon = require('../../Entregas/ContenedorMongo.js')
const mongoose = require('mongoose')

class CartsDaoMongo extends moduloMon.Contenedor {

    constructor() {
        const s = new mongoose.Schema({
            productos: { type: String, required: true }

        });
        super('carts', s, mongoose.model('carts', s))
    }


}

module.exports.CartsDaoMongo = CartsDaoMongo;