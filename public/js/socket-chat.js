const socket = io();
const parametros = new URLSearchParams(window.location.search);

if (!parametros.has('nombre') || !parametros.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios.');
}

const usuario = {
    nombre: parametros.get('nombre'),
    sala: parametros.get('sala')
};

// * ===============================
// *  Usuario conectado al servidor
// * ===============================
socket.on('connect', () => {
    console.log('Conectado con el servidor.');

    // ? =============================
    // ?  Entrada del usuario al chat
    // ? =============================
    socket.emit('entrarChat', usuario, (resp) => {
        console.log('Usuarios Conectados ', resp);
    });
});

// * ===================================
// *  Usuario desconectado del servidor
// * ===================================
socket.on('disconnect', () => {
    console.log('Perdimos conexión con el servidor.');
});

// socket.on('crearMensaje', {usuario: 'Fernando', mensaje: 'Hola Mundo'}, (resp) => {
//     console.log(`Respuesta del servidor: ${mensaje}`);
// });

socket.on('crearMensaje', (mensaje) => {
    console.log(`Servidor: ${mensaje}`);
});


// * ==============================
// *  Lista de usuarios conectados
// * ==============================
socket.on('listaPersona', (mensaje) => {
    console.log(mensaje);
});

// * ===================
// *  Mensajes Privados
// * ===================
socket.on('mensajePrivado', (mensaje) => {
    console.log(`Mensaje privado: ${mensaje}`);
});