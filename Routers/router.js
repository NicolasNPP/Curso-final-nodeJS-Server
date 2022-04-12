const { Router } = require('express');
const routerM = Router();
const jwt = require('jsonwebtoken')

/////CONTROLADORES
const Controladores = require('../ControladoresYNegocio/controladores')
const controladores = new Controladores.Controladores()


/////RUTAS/////

////ORDENES
routerM.get('/ordenes', controladores.getOrder);

routerM.delete('/ordenes/:id', controladores.deleteOrder);

routerM.post('/ordenes/:idcart', controladores.createOrder);

////PRODUCTOS
routerM.get('/productos', controladores.getProduct);

routerM.post('/productos', authJWT, controladores.createProduct)

routerM.get('/productos/:id', controladores.ViewProductId);

routerM.put('/productos/:id', authJWT, (req, res) => {
    productosdaomon.putById(req.params.id, req.body.nuevo).then(results => res.json("Producto actualizado"));
});

routerM.delete('/productos/:id', authJWT, controladores.DeleteProductId);

////CARRITO
routerM.get('/carrito/:id', controladores.ViewCartId);

routerM.get('/carritos/', controladores.ViewAllCarts);

routerM.post('/carrito', controladores.createCart)

routerM.delete('/carrito/:id', controladores.deleteCart);

routerM.put('/carrito/:id', controladores.putCart);

//Agregar o quitar productos carrito
routerM.put('/carrito/:idcart/:idprod/:cant', controladores.addToCart);



///MIDDELWARE DE AUTH + ADMIN
function authJWT(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({
            error: 'No autorizado'
        })
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: 'No autorizado'
            })
        }
        req.username = decoded.data;
        console.log(decoded.data)

        //VERIFICO SI ES EL USUARIO ADMIN (Harcodeado)
        if (decoded.data.username == 'pruebajwt@a.com') {
            next();
        } else return res.status(403).json({
            error: 'No autorizado'
        })


    })
}

module.exports = routerM;