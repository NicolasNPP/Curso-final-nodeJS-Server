const express = require('express')
const { Server: HTTPServer } = require('http')
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

const jwt = require('jsonwebtoken')


//EMAILS
const email = require('./Config/Emails')

//SESSION
const session = require('express-session')

//dotenv
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({
    path:
        process.env.MODO = 'claves'
            ? path.resolve(__dirname, 'claves.env')
            : path.resolve(__dirname, 'colores.env')
})


//CLUSTER
const cluster = require('cluster')
const numCPUs = require('os').cpus().length;


//MINIMIST

const parseArgs = require('minimist')

const options = {
    alias: {
        m: 'modo',
        p: 'puerto',
        d: 'debug',

    },
    default: {
        modo: 'FORK',
        puerto: 8080,
        debug: false
    }
}

const commandLineArgs = process.argv.slice(2);
const { modo, puerto, debug, _ } = parseArgs(commandLineArgs, options)
console.log({ modo, puerto, debug, otros: _ })

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
        next();


    })



}



//


//BCRYPT


//iniciar firebase




//
//const fire = new moduloFirebase.Contenedor();

const app = express();
const httpServer = new HTTPServer(app)


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




app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/sesiones' }),
    secret: 'servicio',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 600
    },
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
        async (req, username, password, done) => {
            //const { direccion } = req.body
            let passwordHash = await bCrypt.hash(process.env.PASSWORD, 8);


            userdaomon.validateName(username).then(a => {

                if (a.length === 0) {
                    const user = {
                        id: `${Date.now()}`,
                        username,
                        password: passwordHash,
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
        }, async (req, username, password, done) => {
            //const user = usuarios.find(usuario => usuario.username == username)



            //

            userdaomon.validateName(username).then(a => {

                //HASH
                let hashSaved = a[0].password;
                let compare = bCrypt.compareSync(password, hashSaved);




                if ((a[0].username == username) && (compare == true)) {


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
        b: `Holaa! ${req.session.username}`




    }
    );


})

app.get('/info', async (req, res) => {

    let argumentos = process.argv;
    let path = process.execPath;
    let processid = process.pid;
    let so = process.platform;
    let nodev = process.version;
    let memoriatotalre = process.memoryUsage;
    let procesadores = numCPUs;

    let carpetaproyecto = process.cwd;

    const respuesta = {
        "Argumentos": { argumentos },
        "path": { path },
        "ProcessID": { processid },
        "SistemaOperativo": { so },
        "NodeVersion": { nodev },
        "MemoriaDisponible": { memoriatotalre },
        "CPUS": { procesadores }

    }


    res.json(respuesta)


})




app.post('/loginjwt', async (req, res) => {

    const user = {
        nombre: "nico",
        apellido: "pe",
        email: "dasasads@dasdas.com"
    }


    jwt.sign({ user }, 'secretkey', { expiresIn: '1h' }, (err, token) => {
        res.json(
            {
                token
            }
        )
    })



})


function verifyToken(req, res, next) {
    const bearHeader = req.headers['authorization'];

    if (typeof bearHeader !== 'undefined') {
        const bearToken = bearHeader.split(" ")[1];
        req.token = bearToken;
        next()
    } else {
        res.sendStatus(403)
    }
}


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

app.get('/nombre', authJWT, async (req, res) => {


    res.json('hola')



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

app.post('/loginjwtt', async (req, res) => {

    const { username, password } = req.body;




    const y = userdaomon.validateName(username);

    y.then(a => {

        let compare = bCrypt.compareSync(password, a[0].password);
        if ((a.length == 0)) {
            return res.send('Error al logear')
        } else {

            if ((a[0].username == username) && (compare == true)) {


                const usuario = {
                    username: a[0].username,
                    password: a[0].password,
                }

                const accessToken = generarToken(usuario);



                res.json(accessToken)
            } else {
                return res.send('Error al logear')
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

function generarToken(user) {
    const token = jwt.sign({ data: user }, 'secretkey', { expiresIn: '1h' })
    return token

}


app.post('/register', async (req, res) => {

    const y = userdaomon.validateName(req.body.username);

    spasswordHash = await bCrypt.hash(req.body.password, 8);

    y.then(a => {
        if ((a.length == 0)) {
            console.log('Registrando')

            new email.CrearEmail('ramon.hahn61@ethereal.email', `${req.body.username}`, `Su usuario fue registrado con exito`).envio()




            const usuario = {
                username: req.body.username,
                password: spasswordHash,
            }

            const accessToken = generarToken(usuario);
            console.log(usuario)
            userdaomon.save(usuario)
            res.json({ accessToken })
        } else {
            res.json({ "Detalle": "El usuario ya existe" })

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


if (modo == 'CLUSTER') {
    if (cluster.isPrimary) {
        console.log(`PID MASTER ${process.pid}`)

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`)
        })
    } else {
        const server = httpServer.listen(puerto, () => {
            console.log(`Ya me conecte al puerto ${server.address().port}`)
        })

        server.on('error', (error) => {
            console.log('Hubo un error');
            console.log(error);
        })

        console.log(`worker ${process.pid} started`)
    }


} else {

    const server = httpServer.listen(puerto, () => {
        console.log(`Ya me conecte al puerto ${server.address().port}`)
    })

    server.on('error', (error) => {
        console.log('Hubo un error');
        console.log(error);
    })
    console.log('MODO FORK')

}



