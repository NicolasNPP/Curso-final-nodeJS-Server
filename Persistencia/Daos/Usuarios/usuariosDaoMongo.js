
const moduloMon = require('../../Contenedores/ContenedorMongo')
const mongoose = require('mongoose')

class usuariosDaoMongo extends moduloMon.Contenedor {

    constructor() {
        const s = new mongoose.Schema({
            _id: { type: String, required: false },
            username: { type: String, required: true },
            password: { type: String, required: true },
            photoLink: { type: String, required: false },
            phone: { type: Number, required: false },

        });
        super('usuarios', s, mongoose.model('usuarios', s))
    }


}

module.exports.usuariosDaoMongo = usuariosDaoMongo;