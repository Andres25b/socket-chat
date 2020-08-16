const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

// * ===============================
// *  Usuario conectado al servidor
// * ===============================
io.on('connection', (client) => {

    // ? =============================
    // ?  Entrada del usuario al chat
    // ? =============================
    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario.'
            });
        }

        // * =================
        // *  Unir a una sala
        // * =================
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        // ? ==============================
        // ?  Lista de usuarios conectados
        // ? ==============================
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unio.`));
        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('crearMensaje', (data, callback) => {
        const persona = usuarios.getPersona(client.id);
        const mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    // * ===================
    // *  Mensajes Privados
    // * ===================
    client.on('mensajePrivado', data => {
        const persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

    // * ===================================
    // *  Usuario desconectado del servidor
    // * ===================================
    client.on('disconnect', () => {
        const personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} se desconecto.`));

        // ? ==============================
        // ?  Lista de usuarios conectados
        // ? ==============================
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });
});