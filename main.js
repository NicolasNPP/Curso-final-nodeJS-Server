//SERVIDOR
const express = require('express')
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io');
const exphbs = require('express-handlebars');
//RUTEO
const routerM = require('./Routers/router.js')
//BASE DE DATOS
const mongoose = require('mongoose')
//DAO
const UserDaoMon = require('./Persistencia/Daos/Usuarios/usuariosDaoMongo')
const userdaomon = new UserDaoMon.usuariosDaoMongo();
//Autenticacion y encriptar
const jwt = require('jsonwebtoken')
const bCrypt = require('bcrypt');
//EMAILS
const email = require('./Config/Emails')
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



const app = express();
const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

////////
io.on('connection', async socket => {
    console.log('Nuevo cliente conectado')

    const mensajes = [{ "email": "Barco", "mj": "29" }]
    socket.emit('mensajes', mensajes)




    socket.on('new-product', producto => {
        //arc.save(producto).then(results => console.log(`${results}`));
        dataBase.insertar(producto).then(result => console.log('producto insertado'))
        productos.push(producto)
        io.sockets.emit('messages', productos)
    }
    )

    socket.on('new-mensaje', mensaje => {
        console.log(mensaje)
        //msg.save(mensaje).then(results => console.log(`${results}`));
        dataBase.insertarMensaje(mensaje).then(results => console.log('Mensaje guardado en DB'))
        mensajes.push(mensaje)
        io.sockets.emit('mensajes', mensajes)

    }
    )


})




///////


//-----MONGOOSE
//----CONEXION A BD MONGO

conectarmongo = async conectar => {
    await mongoose.connect('mongodb://localhost/productos', {
        serverSelectionTimeoutMS: 5000,
    })
    console.log('Base de datos conectada')

}
conectarmongo()

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

//Vista con plantilla de configuracion del servidor
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
        Argumentos: { argumentos },
        path: { path },
        ProcessID: { processid },
        SistemaOperativo: { so },
        NodeVersion: { nodev },
        MemoriaDisponible: { memoriatotalre },
        CPUS: { procesadores }

    }

    enString = JSON.stringify(respuesta)

    res.render('datos.hbs', {
        a: enString




    }
    );
})





/////////LOGIN CON JWT
app.post('/login', async (req, res) => {

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


//MODO CLUSTER

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