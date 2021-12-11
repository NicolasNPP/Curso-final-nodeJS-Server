
const moduloFirebase = require('../../Entregas/ContenedorFirebase.js')

class cartsDaoFirebase extends moduloFirebase.Contenedor {

    constructor() {

        super('carts')
    }


}

module.exports.cartsDaoFirebase = cartsDaoFirebase;