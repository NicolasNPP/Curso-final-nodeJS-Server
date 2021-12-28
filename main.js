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
const UserDaoMon = require('./Daos/Usuarios/usuariosDaoMongo')
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
const userdaomon = new UserDaoMon.usuariosDaoMongo();
const daofire = new DaoFirebase.productosDaoFirebase();
const cartsdaofire = new DaoCartsFirebase.cartsDaoFirebase();
/////////NORMALIZR
const normalizr = require('normalizr')
const normalize = normalizr.normalize;
const schema = normalizr.schema;
const desnormalize = normalize.desnormalize;
const MongoStore = require('connect-mongo')

const authorSchema = new schema.Entity('author')

const mensajeSchema = new schema.Entity('text', {
    author: authorSchema,
});

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bCrypt = require('bcrypt');

//SESSION
const session = require('express-session')


//const normalizeMensaje = normalize(mensaje, mensajeSchema)
//const desnormalizeMensaje = desnormalize(normalizeMensaje.result, mensajeSchema, normalizeMensaje.entities)




/////////////////////



///MIDDELWARE

function auth(req, res, next) {

    const y = userdaomon.validateName(req.session.user);


    const user = req.session.user;
    const pass = req.session.pass;

    y.then(a => {

        if ((a.length == 0)) {
            return res.status(401).send('Error de autorizacion')
        } else {
            if ((a[0].usuario == user) && (a[0].pass == pass)) {
                req.session.contador++;
                return next()
            } else {

                return res.status(401).send('Error de autorizacion')
            }
        }


    })







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
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/sesiones' }),
    secret: 'servicio',
    resave: true,
    saveUninitialized: false
}))

app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'index.hbs'
})
);

app.set('view engine', 'hbs')
app.set('views', './views')

//Routers
app.use('/api', routerM)


//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    'signup',
    new LocalStrategy(
        {
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            //const { direccion } = req.body

            userdaomon.validateName(username).then(a => {

                if (a.length === 0) {
                    const user = {
                        id: `${Date.now()}`,
                        username,
                        password,
                    }
                    //usuarios.push(user)
                    userdaomon.save(user)
                    req.session.username = username;
                    return done(null, user)



                } else {
                    console.log('El usuario ya existe')
                    return done(null, false)


                }

            })


        }
    )
)
passport.use(
    'login',
    new LocalStrategy(
        {
            passReqToCallback: true,
        }, (req, username, password, done) => {
            //const user = usuarios.find(usuario => usuario.username == username)


            userdaomon.validateName(username).then(a => {


                if ((a[0].username == username) && (a[0].password == password)) {


                    user = a[0];
                    //console.log(user)
                    req.session.username = username;
                    return done(null, user)
                } else {
                    //console.log(a)
                    return done(null, false)
                }






            })













        })
)

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    const usuario = userdaomon.getById(id)

    done(null, usuario)
})
//RUTA PARA ENTREGA HANDLE:

app.get('/productos', async (req, res) => {

    const contenido = await arc.getAll();
    res.render('datos.hbs', {
        a: contenido,
        b: `Hola! ${req.session.user}`




    }
    );


})

app.get('/failsignup', async (req, res) => {

    console.log('error al logear')



})

app.get('/datos', auth, async (req, res) => {

    res.render('misdatos.hbs', {
        nombre: req.session.username,
        contador: req.session.contador




    }
    );


})

app.get('/nombre', async (req, res) => {

    const nombre = req.session.user;
    res.json(nombre)



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
        //console.log(req.session)
    } else {
        req.session.contador = 1;
        res.send('Bienvenido')
    }


})

app.get('/private', auth, async (req, res) => {

    res.send('si ves esto es porque te logeaste')

})

app.get('/logout', (req, res) => {
    const nombreLogout = req.session.username;

    req.session.destroy(err => {
        if (!err) {
            res.send(`Hasta luego ${nombreLogout}`)
        }
        else res.send({ status: 'logout Error', body: err })
    })
})

app.get('/login', (req, res) => {

    const { username, password } = req.query;

    const y = userdaomon.validateName(username);

    y.then(a => {

        if ((a.length == 0)) {
            return res.redirect('/error.html')
        } else {

            if ((a[0].usuario == username) && (a[0].pass == password)) {
                req.session.user = username;
                req.session.pass = password;
                req.session.admin = true;
                res.redirect('/datos')
            } else {
                return res.redirect('/error.html')
            }

        }




    })



})

app.post(
    '/login',
    passport.authenticate('login', {
        failureRedirect: '/faillogin',
        successRedirect: '/datos',
    })
)

app.post(
    '/login2',
    passport.authenticate('login', {
        failureRedirect: '/faillogin',
        successRedirect: '/datos',
    })
)

app.get('/pruebas', (req, res) => {
    const y = userdaomon.validateName('nicolas');

    const user = 'nicolas';
    const pass = 'pepe';

    y.then(a => {
        if ((a[0].usuario == user) && (a[0].pass == pass)) {
            console.log('logeado')
        } else { console.log('no logeado') }
    })





})



app.get('/carrito', async (req, res) => {

    //arcCart.getAll(req.params.id).then(results => res.json(`${JSON.stringify(results)}`));

    cartsdaomon.getAll().then(productos => res.json(productos))


})

app.post('/register', async (req, res) => {

    const y = userdaomon.validateName(req.body.usuario);

    y.then(a => {
        if ((a.length == 0)) {
            console.log('Registrando')
            userdaomon.save(req.body)
            res.redirect('/login.html')
        } else {
            console.log('El usuario ya existe')

        }
    })


})

app.post(
    '/signup',
    passport.authenticate('signup', {
        failureRedirect: '/failsignup',
        successRedirect: '/datos',
    })
)





const server = httpServer.listen(8080, () => {
    console.log(`Ya me conecte al puerto ${server.address().port}`)
})

server.on('error', (error) => {
    console.log('Hubo un error');
    console.log(error);
})