

class Contenedor {
    constructor(coleccion, schema, DAO) {
        this.coleccion = coleccion;
        this.schema = schema;
        this.DAO = DAO;
    }

    save = async inser => {
        const dataAInsertar = inser;
        this.DAO.insertMany(dataAInsertar)

    }

    getAll = async inser => {
        const productos = this.DAO.find({})
        return productos
    }


    getById = async ID => {
        this.DAO.find({ _id: ID }, function (error, productos) {
            if (error) {
                console.log('Ha surgido un error.');
            } else {
                console.log({
                    productos: productos
                });
            }
        })
    }

    validateName = async name => {
        const productos = this.DAO.find({ usuario: name })
        return productos
    }

    deleteById = async ID => {
        this.DAO.remove({ _id: ID }, function (error) {
            if (error) {
                console.log('Error al intentar eliminar el personaje.');
            } else {
                console.log('Registro borrado');
            }
        });
    }




}


//operaciones()
module.exports.Contenedor = Contenedor;