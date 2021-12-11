const express = require('express')
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io');

const exphbs = require('express-handlebars');
const routerM = require('./Routers/router.js')
const modulo = require('./Entregas/Entrega2.js')
const moduloMon = require('./Entregas/Databases/Mongo.js')
const mongoose = require('mongoose')
const arc = new modulo.Contenedor('productos');
const msg = new modulo.Contenedor('mensajes');
const mon = new moduloMon.Contenedor();
const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(fs.readFileSync('backend-coderhouse-efe86-firebase-adminsdk-nwjt9-3d483c1fd4.json', 'utf8'))

const app = express();
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

//-----FIREBASE
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const dbProductos = db.collection('productos');


productosFS = async () => {
    await await db.collection('productos').where('nombre', '=', 'a').get().then(contenido => console.log(JSON.stringify(contenido)))

}

async function buscarPorID(docName) {
    try {
        let res = {
            id: docName
        };
        let snapshot = await db.collection('productos').get();
        snapshot.forEach(doc => {
            if (doc.id == docName) {
                console.log(doc.data())
            }
        });
        return res;
    } catch (err) {
        throw err;
    }
};

async function buscar() {
    let prods = await db.collection('productos').get();
    prods.forEach(doc => console.log(doc.data()))

}

async function borrar(ID) {
    await db.collection('productos').doc(ID).delete();

}

async function insertar(objeto) {
    await db.collection('productos').doc().set(objeto)

}

async function actualizar(id) {
    await db.collection('productos').doc(id).set({
        nombre: 'lalala'
    }, { merge: true });

}


//actualizar('fFeftJGrtSvT4TfzInv3')
//buscarPorID('leYXLiQg6dSlfUKw2qdo') -> trae productos segun su id
//buscar() -> trae todos los productos
//borrar() -> borra por id





//-----FIREBASE

//Constante productos para probar con mongoose
const productos = [
    { nombre: 'Shampoo', precio: 2 },
    { nombre: 'Acondicionador', precio: 22 }
]





//------------

//----CONEXION A BD MONGO

conectarmongo = async conectar => {
    await mongoose.connect('mongodb://localhost/productos', {
        serverSelectionTimeoutMS: 5000,
    })
    console.log('Base de datos conectada')

}
conectarmongo()

// ---- OPERACIONES CON CONTENEDOR DE PRODUCTOS MONGOOSE ----
//mon.leer();
//mon.insertar(productos)
//mon.borrar('INSERTAR _ID ACA');
//


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