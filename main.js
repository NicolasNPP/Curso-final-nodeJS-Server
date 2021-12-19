const express = require('express')
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io');
const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = JSON.parse(fs.readFileSync('backend-coderhouse-efe86-firebase-adminsdk-nwjt9-3d483c1fd4.json', 'utf8'))
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const exphbs = require('express-handlebars');
const routerM = require('./Routers/router.js')
const modulo = require('./Entregas/Entrega2.js')
const moduloCart = require('./Entregas/cart.js')
const DaoMon = require('./Daos/Productos/productosDaoMongo')
const CartsDaoMon = require('./Daos/Carrito/CartsDaoMongo')
const DaoFirebase = require('./Daos/Productos/productosDaoFirebase')
const DaoCartsFirebase = require('./Daos/Carrito/cartsDaoFirebase')
//const moduloFirebase = require('./Entregas/Databases/Firebase.js')
const mongoose = require('mongoose')
const arc = new modulo.Contenedor('productos');
const arcCart = new moduloCart.ContenedorCart('carrito');
const msg = new modulo.Contenedor('mensajes');

//const mon = new moduloMon.Contenedor('productos', s, mongoose.model('productos', s));
const daomon = new DaoMon.productosDaoMongo();
const cartsdaomon = new CartsDaoMon.CartsDaoMongo();
const daofire = new DaoFirebase.productosDaoFirebase();
const cartsdaofire = new DaoCartsFirebase.cartsDaoFirebase();
/////////NORMALIZR
const normalizr = require('normalizr')
const normalize = normalizr.normalize;
const schema = normalizr.schema;
const desnormalize = normalize.desnormalize;

const authorSchema = new schema.Entity('author')

const mensajeSchema = new schema.Entity('text', {
    author: authorSchema,
});
//SESSION
const session = require('express-session')


//const normalizeMensaje = normalize(mensaje, mensajeSchema)
//const desnormalizeMensaje = desnormalize(normalizeMensaje.result, mensajeSchema, normalizeMensaje.entities)




/////////////////////



///MIDDELWARE

function auth(req, res, next) {

    if (req.session?.user === 'pepe' && req.session?.admin) {
        return next()
    }
    return res.status(401).send('Error de autorizacion')

}

//



//iniciar firebase




//
//const fire = new moduloFirebase.Contenedor();

const app = express();
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

//-----FIREBASE
//daofire.getAll() // -> trae todos los productos
//daofire.save({ nombre: 'Shampoo', precio: 2 })
//daofire.getById('YeomRs5ABZMyoTvFL4WO') -> Trae producto segun ID

//daofire.deleteById(' COLOCAR ID ') -> borra segun id
//daofire.update('YeomRs5ABZMyoTvFL4WO', 'ALMENDRAS') -> Actualiza segun id y nombre nuevo

//cartsdaofire.getAll() // -> trae todos los productos
//cartsdaofire.getById('GcIxd4KZYFMRpSpCUfM2')



//-----FIREBASE



//-----MONGOOSE


//Constante productos para probar con mongoose
const productos = [
    { nombre: 'Shampoo', precio: 2 },
    { nombre: 'Acondicionador', precio: 22 }
]

const cart =
    { productos: '[title: escuadra, price: 2]' },


    //----CONEXION A BD MONGO

    conectarmongo = async conectar => {
        await mongoose.connect('mongodb://localhost/productos', {
            serverSelectionTimeoutMS: 5000,
        })
        console.log('Base de datos conectada')

    }
conectarmongo()

// ---- OPERACIONES CON CONTENEDOR DE PRODUCTOS MONGOOSE ----
//daomon.save(productos);
//daomon.deleteById('61b4f54d3988dc94b6c0bfb1');
//daomon.getAll();
//daomon.getById('61b4f594e74858e93c45cbf1')

//cartsdaomon.save(cart);
//cartsdaomon.getAll();
//cartsdaomon.getById('insertar id')

//-------MONGOOSE


io.on('connection', async socket => {
    console.log('Nuevo cliente conectado')

    const productos = await arc.getAll()
    socket.emit('messages', productos)

    const mensajes = await msg.getAll()


    let mensajesNuevo = await mensajes.map(mj => {

        let a = normalize(mj, mensajeSchema)
        return a

    })
    await console.log(mensajesNuevo)

    socket.emit('mensajes', mensajesNuevo)




    socket.on('new-product', producto => {
        arc.save(producto).then(results => console.log(`${results}`));
        productos.push(producto)
        io.sockets.emit('messages', productos)
    }
    )

    socket.on('new-mensaje', async mensaje => {
        console.log(mensaje)

        const Mjnew = {
            author: {
                id: mensaje.id,
                name: mensaje.name,
                apellido: mensaje.apellido,
                edad: mensaje.edad,
                alias: mensaje.alias,
                avatar: mensaje.alias,
            },
            text: "nn"
        }


        await msg.saveNew(Mjnew).then(results => console.log(`${results}`));
        await mensajes.push(Mjnew)

        let mensajesNuevo = await mensajes.map(mj => {

            let a = normalize(mj, mensajeSchema)
            return a

        })
        await console.log(mensajesNuevo)


        await io.sockets.emit('mensajes', mensajesNuevo)

    }
    )


})




app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'servicio',
    resave: true,
    saveUninitialized: false
}
))

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'index.hbs'
})
);

app.set('view engine', 'hbs')
app.set('views', './views')

//Routers
app.use('/api', routerM)



//RUTA PARA ENTREGA HANDLE:

app.get('/productos', async (req, res) => {

    const contenido = await arc.getAll();
    res.render('datos.hbs', {
        a: contenido




    }
    );


})



app.get('/productos-test', async (req, res) => {

    const contenido = await arc.getProductFalse();
    res.render('datos.hbs', {
        a: contenido




    }
    );


})

app.get('/con-session', async (req, res) => {

    if (req.session.contador) {
        req.session.contador++;
        res.send(`Usted visito esta web ${req.session.contador} veces`);
        console.log(req.session)
    } else {
        req.session.contador = 1;
        res.send('Bienvenido')
    }


})

app.get('/private', auth, async (req, res) => {

    res.send('si ves esto es porque te logeaste')

})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.send('Logout ok')
        }
        else res.send({ status: 'logout Error', body: err })
    })
})

app.get('/login', (req, res) => {

    const { username, password } = req.query;

    if (username !== 'pepe' || password !== 'pepepass') {
        return res.send('Login failed')
    } else
        req.session.user = username;
    req.session.admin = true;
    res.send('login success')

})

app.get('/carrito', async (req, res) => {

    //arcCart.getAll(req.params.id).then(results => res.json(`${JSON.stringify(results)}`));

    cartsdaomon.getAll().then(productos => res.json(productos))


})





const server = httpServer.listen(8080, () => {
    console.log(`Ya me conecte al puerto ${server.address().port}`)
})

server.on('error', (error) => {
    console.log('Hubo un error');
    console.log(error);
})