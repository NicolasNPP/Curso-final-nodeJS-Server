const { Router, application } = require('express');
const { Socket } = require('socket.io');
const modulo = require('../Entregas/Entrega2.js')
const arc = new modulo.Contenedor('productos');
const moduloCart = require('../Entregas/Cart.js')
const { fork } = require('child_process')
const CartsDaoMon = require('../Daos/Carrito/CartsDaoMongo')
const cartsdaomon = new CartsDaoMon.CartsDaoMongo();

const OrdenesDaoMon = require('../Daos/Ordenes/OrdenesDaoMongo')
const ordenesdaomon = new OrdenesDaoMon.OrdenesDaoMongo();
const email = require('../Config/Emails')




const routerM = Router();


function getAleatorio() {
    return parseInt(Math.random() * 3 + 1);
}

routerM.get('/', (req, res) => {
    res.send('Hola desde express')
});

routerM.get('/ordenes', (req, res) => {

    ordenesdaomon.getAll().then(results => res.json(`${JSON.stringify(results)}`));
    //enviar = new email.CrearEmail('ramon.hahn61@ethereal.email', 'nicolasnahuel94@gmail.com', 'Orden completada').envio()

});


routerM.delete('/ordenes/:id', (req, res) => {
    //En String


    ordenesdaomon.deleteById(req.params.id).then(results => res.json(`${results}`))





});

routerM.post('/ordenes/:idcart', (req, res) => {
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

            const enviar = new email.CrearEmail('ramon.hahn61@ethereal.email', `${results[0].email}`, `Su orden fue exitosa. Productos: ${results[0].productos}`).envio()

            res.json(`${JSON.stringify(orden)}`)
        }




    });





    //ordenesdaomon.save(req.body).then(results => res.send(`${results}`));


});




routerM.get('/productos', (req, res) => {
    arc.getAll().then(results => res.json(`${JSON.stringify(results)}`));
});

routerM.get('/productos-test', (req, res) => {
    arc.getProductFalse();
});

routerM.post('/productos', (req, res) => {



    arc.save(req.body).then(results => res.send(`${results}`));


    //arc.save(req.body).then(results => res.send(`${results}`));
})

routerM.get('/carrito/:id/productos', (req, res) => {
    cartsdaomon.getById(req.params.id).then(results => res.json(`${JSON.stringify(results)}`));
});

routerM.get('/carritos/', (req, res) => {


    cartsdaomon.getAll().then(results => res.json(`${JSON.stringify(results)}`));

});




routerM.get('/randoms', async (req, res) => {

    const computo = fork('./computo.js')
    computo.send('start')
    computo.on('message', sum => {
        res.send(`la suma es ${sum}`)
    })






});









routerM.post('/carrito', async (req, res) => {


    await cartsdaomon.save(req.body).then(results => res.json(`${results}`));

})



routerM.delete('/carrito/:id', (req, res) => {
    //En String


    cartsdaomon.deleteById(req.params.id).then(results => res.json(`${results}`))





});

routerM.put('/carrito/:id', (req, res) => {
    //En String


    cartsdaomon.putById(req.body, parseInt(req.params.id)).then(results => res.json(results));





});

routerM.get('/productoRandom', (req, res) => {
    arc.getById(parseInt(getAleatorio())).then(results => res.json(results));
});

routerM.get('/productos/:id', (req, res) => {
    //En String
    arc.getById(parseInt(req.params.id)).then(results => res.json(results));
    //Por consola
    arc.getById(parseInt(req.params.id)).then(results => console.log(results));
});

routerM.put('/productos/:id', (req, res) => {
    arc.putById(req.body, req.params.id).then(results => res.json(results));;
});

routerM.delete('/productos/:id', (req, res) => {
    //En String
    arc.deleteById(parseInt(req.params.id)).then(results => res.json(`${results}`))
});


routerM.post('/', (req, res) => {
    //x.push(req.body);
    //res.json(req.body);
})

module.exports = routerM;