const { createTransport } = require('nodemailer')

class CrearEmail {
    constructor(desde, hasta, elMensaje) {
        this.from = desde;
        this.to = hasta;
        this.text = elMensaje;


    }

    envio = () => {
        try {
            const transporter = createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: this.from,
                    pass: 'AKNBdQzNHABpDmq95D'
                }
            });

            const mailOptions = {
                from: 'Curso Coderhouse',
                to: this.to,
                subject: 'Mail de prueba',
                text: this.text
            }

            const info = transporter.sendMail(mailOptions)

            console.log(info)
        } catch (error) {
            console.log(error)
        }

    }

}

module.exports.CrearEmail = CrearEmail;