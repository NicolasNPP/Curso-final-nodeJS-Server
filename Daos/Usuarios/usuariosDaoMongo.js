
const moduloMon = require('../../Entregas/ContenedorMongo.js')
const mongoose = require('mongoose')

class usuariosDaoMongo extends moduloMon.Contenedor {

    constructor() {
        const s = new mongoose.Schema({
            _id: { type: String, required: false },
            username: { type: String, required: true },
            password: { type: String, required: true },
        });
        super('usuarios', s, mongoose.model('usuarios', s))
    }


}

module.exports.usuariosDaoMongo = usuariosDaoMongo;