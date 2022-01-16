const path = require('path')
const dotenv = require('dotenv')

dotenv.config({
    path:
        process.env.MODO = 'claves'
            ? path.resolve(__dirname, 'claves.env')
            : path.resolve(__dirname, 'colores.env')
})

const q = process.env.CLAVE

console.log(
    q
)