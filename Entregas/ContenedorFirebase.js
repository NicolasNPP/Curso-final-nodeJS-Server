const admin = require('firebase-admin');
const fs = require('fs');

class Contenedor {
    constructor(coleccion) {
        this.coleccion = coleccion;
        const serviceAccount = JSON.parse(fs.readFileSync('backend-coderhouse-efe86-firebase-adminsdk-nwjt9-3d483c1fd4.json', 'utf8'))
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        this.db = admin.firestore();
        this.dbProductos = this.db.collection(this.coleccion);

    }

    save = async objeto => {
        await this.db.collection(this.coleccion).doc().set(objeto)

    }

    getAll = async inser => {
        let prods = await this.db.collection(this.coleccion).get();
        prods.forEach(doc => console.log(doc.data()))
    }

    getById = async docName => {
        try {
            let res = {
                id: docName
            };
            let snapshot = await this.db.collection(this.coleccion).get();
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

    deleteById = async ID => {
        await this.db.collection(this.coleccion).doc(ID).delete();
    }

    update = async (id, name) => {
        await this.db.collection(this.coleccion).doc(id).set({
            nombre: name
        }, { merge: true });

    }




}


//operaciones()
module.exports.Contenedor = Contenedor;