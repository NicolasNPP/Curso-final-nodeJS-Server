
const moduloFirebase = require('../../Entregas/ContenedorFirebase.js')

class productosDaoFirebase extends moduloFirebase.Contenedor {

    constructor() {

        super('productos')
    }


}

module.exports.productosDaoFirebase = productosDaoFirebase;