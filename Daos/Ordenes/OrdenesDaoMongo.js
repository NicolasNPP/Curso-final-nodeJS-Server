
const moduloMon = require('../../Entregas/ContenedorMongo.js')
const mongoose = require('mongoose')

class OrdenesDaoMongo extends moduloMon.Contenedor {

    constructor() {
        const s = new mongoose.Schema({
            idcliente: { type: String, required: false },
            productos: { type: String, required: true },
            fecha: { type: Date, required: false }


        });
        super('ordenes', s, mongoose.model('ordenes', s))
    }


}

module.exports.OrdenesDaoMongo = OrdenesDaoMongo;