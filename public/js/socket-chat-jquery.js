const parametros = new URLSearchParams(window.location.search);

const nombre = parametros.get('nombre');
const sala = parametros.get('sala');

// * =======================
// *  Referencias de jQuery
// * =======================
const divUsuarios = $('#divUsuarios');
const formEnviar = $('#formEnviar');
const txtMensaje = $('#txtMensaje');
const divChatbox = $('#divChatbox');

// * =====================
// *  Renderizar Usuarios
// * =====================
const renderizarUsuarios = (personas) => {
    console.log(personas);
    let html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + parametros.get('sala') + '</span></a>';
    html += '</li>';

    for (let i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
}

const renderizarMensajes = (mensaje, yo) => {
    let html = '';
    const fecha = new Date(mensaje.fecha);
    const hora = fecha.getHours() + ':' + fecha.getMinutes();
    let adminClass = 'info';

    if(mensaje.nombre === "Administrador") {
        adminClass = 'danger';
    }

    if (yo) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animate__animated animate__fadeIn">';

        if(mensaje.nombre != 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" />';
        }

        html += '</div>';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// * ===========
// *  Listeners
// * ===========
divUsuarios.on('click', 'a', () => {
    if (id) {
        const id = $(this).data('id');
    }
});

formEnviar.on('submit', (e) => {
    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }
    socket.emit('crearMensaje', { nombre, mensaje: txtMensaje.val() }, (mensaje) => {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });
});