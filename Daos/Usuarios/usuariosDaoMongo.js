
const moduloMon = require('../../Entregas/ContenedorMongo.js')
const mongoose = require('mongoose')

class usuariosDaoMongo extends moduloMon.Contenedor {

    constructor() {
        const s = new mongoose.Schema({
            usuario: { type: String, required: true },
            pass: { type: String, required: true }

        });
        super('usuarios', s, mongoose.model('usuarios', s))
    }


}

module.exports.usuariosDaoMongo = usuariosDaoMongo;