const fs = require('fs');
const faker = require('faker');

class Contenedor {
    constructor(nombreArchivo) {
        this.ruta = nombreArchivo
    }

    save = async persona => {
        const arregloPersonas = await this.getAll();
        let ids = arregloPersonas.map(function (prod) { return prod.id });
        let max = Math.max.apply(null, ids);
        persona.id = max + 1


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

    getAll = async () => {

        try {
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(contenido)
        } catch (error) {
            await fs.promises.writeFile(this.ruta, JSON.stringify([], null, 2))
            const contenido = await fs.promises.readFile(this.ruta, 'utf-8');
            return JSON.parse(contenido)
        }

    }

    deleteById = async id => {

        const arregloPersonas = await this.getAll();
        const personaBuscada = arregloPersonas.find(p => p.id === id);
        const buscarPos = await arregloPersonas.indexOf(personaBuscada);
        await arregloPersonas.splice(buscarPos, 1)
        await fs.promises.writeFile(this.ruta, JSON.stringify(arregloPersonas, null, 2))
        return 'Elemento eliinado'




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


    getProductFalse = async () => {




        try {
            let contenido = [];
            let producto1 = {
                "title": faker.commerce.productName(),
                "price": faker.random.number({ min: 199, max: 239 }),
                "thumbnail": faker.image.nature(),
                "id": faker.random.number({ min: 1, max: 99 }),
            }

            let producto2 = {
                "title": faker.commerce.productName(),
                "price": faker.random.number({ min: 199, max: 239 }),
                "thumbnail": faker.image.nature(),
                "id": faker.random.number({ min: 1, max: 99 }),
            }

            let producto3 = {
                "title": faker.commerce.productName(),
                "price": faker.random.number({ min: 199, max: 239 }),
                "thumbnail": faker.image.nature(),
                "id": faker.random.number({ min: 1, max: 99 }),
            }

            let producto4 = {
                "title": faker.commerce.productName(),
                "price": faker.random.number({ min: 199, max: 239 }),
                "thumbnail": faker.image.nature(),
                "id": faker.random.number({ min: 1, max: 99 }),
            }

            let producto5 = {
                "title": faker.commerce.productName(),
                "price": faker.random.number({ min: 199, max: 239 }),
                "thumbnail": faker.image.nature(),
                "id": faker.random.number({ min: 1, max: 99 }),
            }
            contenido.push(producto1);
            contenido.push(producto2);
            contenido.push(producto3);
            contenido.push(producto4);
            contenido.push(producto5);

            return contenido
        } catch (error) {
            console.log(error);
        }




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
module.exports.Contenedor = Contenedor;