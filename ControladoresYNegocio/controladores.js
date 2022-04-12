//CONFIGURACION EMAILS
const email = require('../Config/Emails')

//DAO ORDENES
const OrdenesDaoMon = require('../Persistencia/Daos/Ordenes/OrdenesDaoMongo')
const ordenesdaomon = new OrdenesDaoMon.OrdenesDaoMongo();

//DAO CARRITO
const CartsDaoMon = require('../Persistencia/Daos/Carrito/CartsDaoMongo')
const cartsdaomon = new CartsDaoMon.CartsDaoMongo();

//DAO PRODUCTOS
const ProductosDaoMon = require('../Persistencia/Daos/Productos/ProductosDaoMongo')
const productosdaomon = new ProductosDaoMon.productosDaoMongo();



class Controladores {
    constructor() {

    }

    /////Controladores de Ordenes de compra/////

    //Ver ordenes
    getOrder = (req, res) => {
        ordenesdaomon.getAll().then(results => res.json(`${JSON.stringify(results)}`));
    }

    //Borrar ordenes
    deleteOrder = (req, res) => {
        ordenesdaomon.deleteById(req.params.id).then(results => res.json(`${results}`))
    }

    //Crear orden
    createOrder = (req, res) => {

        const orden = {
            "idcliente": undefined
        }


        cartsdaomon.getById(req.params.idcart).then(results => {

            orden.idcliente = `${results[0].idcliente}`;
            orden.productos = `${results[0].productos}`;

            if (orden.idcliente === undefined) {
                res.json({ "Respuesta": "No encontrado" })
            } else {

                ordenesdaomon.save(orden)

                cartsdaomon.deleteById(req.params.idcart)

                new email.CrearEmail('ramon.hahn61@ethereal.email', `${results[0].email}`, `Su orden fue exitosa. Productos: ${results[0].productos}`).envio()

                res.json(`${JSON.stringify(orden)}`)
            }

        });

    }


    /////Controladores de Ordenes de productos/////

    //Ver todos los productos
    getProduct = (req, res) => {
        productosdaomon.getAll().then(results => res.json(`${JSON.stringify(results)}`));
    }

    //Crear producto
    createProduct = (req, res) => {
        productosdaomon.save(req.body).then(results => res.send(`${results}`));
    }

    //Ver producto por ID
    ViewProductId = (req, res) => {
        productosdaomon.getById(req.params.id).then(results => res.json(results));
    }

    //Borrar producto por ID
    DeleteProductId = (req, res) => {
        productosdaomon.deleteById(req.params.id).then(results => res.json(`${results}`))
    }

    /////Controladores de Ordenes de Carrito/////

    //Ver carrito por ID
    ViewCartId = (req, res) => {
        cartsdaomon.getById(req.params.id).then(results => res.json(`${JSON.stringify(results)}`));
    }

    //Ver todos los carritos
    ViewAllCarts = (req, res) => {
        cartsdaomon.getAll().then(results => res.json(`${JSON.stringify(results)}`));
    }

    //Crear carrito
    createCart = (req, res) => {
        cartsdaomon.save(req.body).then(results => res.json(`${results}`));
    }

    //Borrrar carrito
    deleteCart = (req, res) => {
        cartsdaomon.deleteById(req.params.id).then(results => res.json(`${results}`))
    }

    //Actualizar carrito
    putCart = (req, res) => {
        cartsdaomon.putById(req.params.id, req.body.nuevo)
    }

    //Agregar o quitar productos carrito
    addToCart = (req, res) => {


        cartsdaomon.getById(req.params.idcart).then(
            (results) => {
                console.log(results[0].productos)


                const Reemplazo = results[0].productos.find(name => name.producto === `${req.params.idprod}`)

                if (Reemplazo == undefined) {


                    const producto = {
                        producto: `${req.params.idprod}`,
                        cantidad: parseInt(`${req.params.cant}`)
                    }
                    results[0].productos.push(producto)
                    cartsdaomon.putById(req.params.idcart, results[0]).then(results => console.log(results));
                    res.json('El producto no existe en el carrito, vamos a agregarlo.')
                } else {


                    const index = results[0].productos.findIndex((element) => element.producto === req.params.idprod);



                    Reemplazo.cantidad += parseInt(req.params.cant)

                    results[0].productos[index] = Reemplazo

                    cartsdaomon.putById(req.params.idcart, results[0]).then(results => console.log(results));





                    res.json(results[0])
                }





            }

        )





    }








}




module.exports.Controladores = Controladores;