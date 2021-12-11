const express = require('express')
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io');

const exphbs = require('express-handlebars');
const routerM = require('./Routers/router.js')
const modulo = require('./Entregas/Entrega2.js')
const DaoMon = require('./Daos/Productos/productosDaoMongo')
const DaoFirebase = require('./Daos/Productos/productosDaoFirebase')
//const moduloFirebase = require('./Entregas/Databases/Firebase.js')
const mongoose = require('mongoose')
const arc = new modulo.Contenedor('productos');
const msg = new modulo.Contenedor('mensajes');

//const mon = new moduloMon.Contenedor('productos', s, mongoose.model('productos', s));
const daomon = new DaoMon.productosDaoMongo();
const daofire = new DaoFirebase.productosDaoFirebase();


//const fire = new moduloFirebase.Contenedor();

const app = express();
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

//-----FIREBASE

//daofire.buscar() // -> trae todos los productos
//daofire.save({ nombre: 'Shampoo', precio: 2 })
//daofire.getById('YeomRs5ABZMyoTvFL4WO') -> Trae producto segun ID

//daofire.deleteById(' COLOCAR ID ') -> borra segun id
//daofire.update('YeomRs5ABZMyoTvFL4WO', 'ALMENDRAS') -> Actualiza segun id y nombre nuevo

//-----FIREBASE



//-----MONGOOSE


//Constante productos para probar con mongoose
const productos = [
    { nombre: 'Shampoo', precio: 2 },
    { nombre: 'Acondicionador', precio: 22 }
]


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
//daomon.getById('61b4f594e74858e93c45cbf1')



//-------MONGOOSE


io.on('connection', async socket => {
    console.log('Nuevo cliente conectado')

    const productos = await arc.getAll()
    socket.emit('messages', productos)

    const mensajes = await msg.getAll()
    socket.emit('mensajes', mensajes)




    socket.on('new-product', producto => {
        arc.save(producto).then(results => console.log(`${results}`));
        productos.push(producto)
        io.sockets.emit('messages', productos)
    }
    )

    socket.on('new-mensaje', mensaje => {
        console.log(mensaje)
        msg.save(mensaje).then(results => console.log(`${results}`));
        mensajes.push(mensaje)
        io.sockets.emit('mensajes', mensajes)

    }
    )


})




app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

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




const server = httpServer.listen(8080, () => {
    console.log(`Ya me conecte al puerto ${server.address().port}`)
})

server.on('error', (error) => {
    console.log('Hubo un error');
    console.log(error);
})