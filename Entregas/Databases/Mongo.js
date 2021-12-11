const mongoose = require('mongoose')

class Contenedor {
    constructor(est) {
        this.productos = est
        this.productoSchema = new mongoose.Schema({
            nombre: { type: String, required: true },
            precio: { type: Number, required: true }

        })

        this.productosDAO = mongoose.model('productos', this.productoSchema)
    }





    insertar = async inser => {
        this.productos = inser;
        this.productosDAO.insertMany(this.productos)
    }

    leer = async inser => {
        this.productosDAO.find({}, function (error, productos) {
            if (error) {
                console.log('Ha surgido un error.');
            } else {
                console.log({
                    productos: productos
                });
            }
        })
    }


    borrar = async ID => {
        this.productosDAO.remove({ _id: ID }, function (error) {
            if (error) {
                console.log('Error al intentar eliminar el personaje.');
            } else {
                console.log('Registro borrado');
            }
        });
    }






}

module.exports.Contenedor = Contenedor;