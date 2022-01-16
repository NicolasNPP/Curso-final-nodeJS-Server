


const computo = () => {
    let sum = 0;
    console.info('inicio de cálculo');
    console.time('El cálculo requiere mucho tiempo');
    for (let i = 0; i < 300; i++) {
        sum += i
    };
    console.info('Fin del cálculo');
    console.timeEnd('El cálculo requiere mucho tiempo');
    return sum;
};

process.on('message', msg => {
    console.log(msg, 'process.pid', process.pid); // id del proceso hijo	
    const sum = computo();
    // Si el proceso Node.js se genera a través de la comunicación entre procesos, entonces el método process.send () se puede usar para enviar un mensaje al proceso padre	
    process.send(sum);
})


//module.exports.computo = computo;