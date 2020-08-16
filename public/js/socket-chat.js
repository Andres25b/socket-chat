const socket = io();
// const parametros = new URLSearchParams(window.location.search);

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
        renderizarUsuarios(resp);
    });
});

// * ===================================
// *  Usuario desconectado del servidor
// * ===================================
socket.on('disconnect', () => {
    console.log('Perdimos conexión con el servidor.');
});

// * =================
// *  Mandar Mensajes
// * =================
// socket.on('crearMensaje', {usuario: 'Fernando', mensaje: 'Hola Mundo'}, (resp) => {
//     console.log(`Respuesta del servidor: ${mensaje}`);
// });

socket.on('crearMensaje', (mensaje) => {
    renderizarMensajes(mensaje, false);
    scrollBottom();
});


// * ==============================
// *  Lista de usuarios conectados
// * ==============================
socket.on('listaPersona', (personas) => {
    renderizarUsuarios(personas);
});

// * ===================
// *  Mensajes Privados
// * ===================
socket.on('mensajePrivado', (mensaje) => {
    console.log(`Mensaje privado: ${mensaje}`);
});