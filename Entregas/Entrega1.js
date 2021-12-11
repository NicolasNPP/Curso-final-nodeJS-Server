class Usuario {
    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName() {
        return this.nombre
    }

    countMascotas() {
        return this.mascotas.length
    }

    addMascota(nombreMascota) {

        this.mascotas.push(`${nombreMascota}`)

    }

    getBookNames() {
        return this.libros.map(
            function (libro) {
                return libro.nombre
            }
        )
    }

    addBook(nombreLibro, nombreAutor) {
        this.libros.push({ nombre: nombreLibro, autor: nombreAutor, });
    }

}

var libros =
    [
        {
            nombre: 'El Principito',
            autor: 'Autor del libro',
        }

    ]

let usuario = new Usuario('Nicolas', 'Pepe', libros, ['Perro', 'Gato']);

console.log(usuario.getFullName())

console.log(usuario.mascotas)
console.log(usuario.countMascotas())

usuario.addMascota('Canario');
console.log(usuario.mascotas);
console.log(usuario.countMascotas())


usuario.getBookNames();
console.log(usuario.getBookNames());
usuario.addBook('Volver al futuro', 'b');
console.log(usuario.getBookNames());













