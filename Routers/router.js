const { Router, application } = require('express');
const { Socket } = require('socket.io');
const modulo = require('../Entregas/Entrega2.js')
const arc = new modulo.Contenedor('productos');
const moduloCart = require('../Entregas/Cart.js')
const cart = new moduloCart.ContenedorCart('carrito');





const routerM = Router();


function getAleatorio() {
    return parseInt(Math.random() * 3 + 1);
}

routerM.get('/', (req, res) => {
    res.send('Hola desde express')
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
    cart.getAll(parseInt(req.params.id)).then(results => res.json(`${JSON.stringify(results)}`));
});

routerM.post('/carrito', async (req, res) => {


    await cart.save(req.body).then(results => res.send(`${results}`));

})



routerM.delete('/carrito/:id', (req, res) => {
    //En String


    cart.deleteById(parseInt(req.params.id)).then(results => res.json(`${results}`))





});

routerM.put('/carrito/:id', (req, res) => {
    //En String


    cart.putById(req.body, parseInt(req.params.id)).then(results => res.json(results));





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