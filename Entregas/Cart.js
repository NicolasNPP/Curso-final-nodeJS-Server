const fs = require('fs');

class ContenedorCart {
    constructor(nombreArchivo) {
        this.ruta = nombreArchivo
    }

    save = async persona => {
        const arregloPersonas = await this.obtenerTodo();
        let ids = arregloPersonas.map(function (prod) { return prod.id });
        let max = Math.max.apply(null, ids);
        persona.id = max + 1
        const dia = new Date();
        persona.timestamp = dia;


        arregloPersonas.push(persona);

        try {
            await fs.promises.writeFile(this.ruta, JSON.stringify(arregloPersonas, null, 2))
            return `Guardado con ID ${persona.id}`
        } catch (error) {
            throw new Error('No se pudo guardar')
        }

    }


    getById = async id => {
        const arregloPersonas = await this.getAll();
        const personaBuscada = await arregloPersonas.find(p => p.id === id);
        if (personaBuscada == undefined) {
            return { error: 'producto no encontrado' }
        } else {
            return personaBuscada;
        }

    }

    getAll = async (ide) => {

        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8');
            const enJSON = JSON.parse(contenido)
            const resultado = await enJSON.find(p => p.id == ide);


            return resultado
        } catch (error) {

            return console.log(error)
        }

    }

    obtenerTodo = async () => {

        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(contenido)
        } catch (error) {
            return error
        }

    }

    deleteById = async ide => {

        //const arregloPersonas = await this.getAll(ide);

        const contenido = await fs.promises.readFile(this.ruta, 'utf-8');
        const enJSON = JSON.parse(contenido)

        const carritoBuscado = enJSON.find(p => p.id === ide);

        if (carritoBuscado != undefined) {
            const buscarPos = await enJSON.indexOf(carritoBuscado);
            await enJSON.splice(buscarPos, 1);
            await fs.promises.writeFile(this.ruta, JSON.stringify(enJSON, null, 2))

            return 'Carrito borrado'

        } else



            return 'No se encontro carrito con ese ID'






    }

    deleteProdById = async (ide, ideProd) => {

        //const arregloPersonas = await this.getAll(ide);

        const contenido = await fs.promises.readFile(this.ruta, 'utf-8');
        const enJSON = JSON.parse(contenido)
        const carritoBuscado = enJSON.find(p => p.id === ide);

        const productoBuscado = carritoBuscado.productos.find(p => p.id === ideProd);

        const buscarPosCart = await enJSON.indexOf(carritoBuscado);
        //borrado 

        const buscarPos = await carritoBuscado.productos.indexOf(productoBuscado);
        //await enJSON[buscarPosCart].productos[buscarPos].splice(buscarPos, 1);
        await enJSON[buscarPosCart].productos.splice(buscarPos, 1);
        await fs.promises.writeFile(this.ruta, JSON.stringify(enJSON, null, 2))









        return 'Producto eliminado'






    }

    saveProdById = async (prod, idecart) => {

        //const arregloPersonas = await this.getAll(ide);

        const contenido = await fs.promises.readFile(this.ruta, 'utf-8');
        const enJSON = JSON.parse(contenido)
        const carritoBuscado = enJSON.find(p => p.id === idecart);

        //const productoBuscado = carritoBuscado.productos.find(p => p.id === ideProd);

        const buscarPosCart = await enJSON.indexOf(carritoBuscado);
        await enJSON[buscarPosCart].productos.push(prod)

        await fs.promises.writeFile(this.ruta, JSON.stringify(enJSON, null, 2))









        return 'Producto agregado'






    }


    deleteAll = async () => {

        try {
            return await fs.promises.writeFile(this.ruta, JSON.stringify([], null, 2))
        } catch (error) {
            return error
        }


    }

    putById = async (producto, idprod) => {

        //getbyid
        const arregloPersonas = await this.getAll();
        const personaBuscada = arregloPersonas.find(p => p.id === parseInt(idprod));
        const buscarPos = await arregloPersonas.indexOf(personaBuscada);

        arregloPersonas[buscarPos] = producto;
        arregloPersonas[buscarPos].id = parseInt(idprod);


        fs.promises.writeFile(this.ruta, JSON.stringify(arregloPersonas, null, 2))

        return `Producto actualizado`

    }

}

//const archivo = new Contenedor('../miArchivo');

const operaciones = async () => {

    //console.log(await archivo.getAll())
    //Ejecutar para guardar objeto console.log(await archivo.save({ id: 5, nombre: 'Lorenzo', email: 'lorenzo@gmail.com' }))
    //Ejecutar para obtener segun idconsole.log(await archivo.getById(6));
    //Ejecutar para borrar todo  archivo.deleteAll();
    //Ejecutar para eliminar segun ID console.log(await archivo.deleteById(6));

}


//operaciones()
module.exports.ContenedorCart = ContenedorCart;