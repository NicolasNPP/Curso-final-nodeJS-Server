
class Contenedor {
    constructor(coleccion, schema, DAO) {
        this.coleccion = coleccion;
        this.schema = schema;
        this.DAO = DAO;
    }

    save = async inser => {
        const dataAInsertar = inser;
        const guardar = this.DAO.insertMany(dataAInsertar)
        await guardar
        return guardar



    }

    getAll = async inser => {
        const productos = this.DAO.find({})



        return productos
    }


    getById = async ID => {
        const buscar = this.DAO.find({ _id: ID })
        return buscar


    }


    putById = async (ID, nuevo) => {
        const reemplazar = this.DAO.findOneAndUpdate({ _id: ID }, nuevo)
        return reemplazar

    }

    validateName = async name => {
        const productos = this.DAO.find({ username: name })
        return productos
    }

    deleteById = async ID => {
        this.DAO.remove({ _id: ID }, function (error) {
            if (error) {
                console.log('Error al eliminar.');
            } else {
                console.log('Registro borrado');
            }
        });
    }



}


//operaciones()
module.exports.Contenedor = Contenedor;