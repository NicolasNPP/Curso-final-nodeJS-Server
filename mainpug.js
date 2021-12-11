const express = require('express');
const exphbs = require('express-handlebars');
const routerM = require('./Routers/router.js')
const modulo = require('./Entregas/Entrega2.js')
const arc = new modulo.Contenedor('productos');
const fs = require('fs');



const app = express();


app.use(express.json());
app.use(express.static('Public'));
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'pug')

app.get('/PUG', async (req, res) => {
    const contenido = await arc.getAll();
    res.render('../views/layouts/index.pug', {
        productos: `${contenido.map((a) => { return a.title })}`
    })
})







//Routers
app.use('/api', routerM)



const server = app.listen(8080, () => {
    console.log(`Ya me conecte al puerto ${server.address().port}`)
})

server.on('error', (error) => {
    console.log('Hubo un error');
    console.log(error);
})