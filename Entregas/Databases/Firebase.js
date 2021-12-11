
const admin = require('firebase-admin');
const fs = require('fs');
class Contenedor {
    constructor() {
        const serviceAccount = JSON.parse(fs.readFileSync('backend-coderhouse-efe86-firebase-adminsdk-nwjt9-3d483c1fd4.json', 'utf8'))
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        this.db = admin.firestore();
        this.dbProductos = this.db.collection('productos');


    }

    buscar = async inser => {
        let prods = await this.db.collection('productos').get();
        prods.forEach(doc => console.log(doc.data()))
    }

    borrar = async ID => {
        await this.db.collection('productos').doc(ID).delete();
    }


    actualizar = async (id, name) => {
        await this.db.collection('productos').doc(id).set({
            nombre: name
        }, { merge: true });

    }

    buscarPorID = async (docName) => {
        try {
            let res = {
                id: docName
            };
            let snapshot = await this.db.collection('productos').get();
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

    insertar = async (objeto) => {
        await this.db.collection('productos').doc().set(objeto)

    }







}

module.exports.Contenedor = Contenedor;