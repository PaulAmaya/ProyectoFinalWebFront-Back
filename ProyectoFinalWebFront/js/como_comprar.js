(function () {
    verificarSesion();

    const searchButton = document.querySelector('#search-button');
    const searchInput = document.querySelector('#search-input');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', realizarBusqueda);
        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                realizarBusqueda();
            }
        });
    }
})();


function realizarBusqueda() {
    const query = document.querySelector('#search-input').value.trim();

    if (!query) {
        alert("Por favor, ingresa un término de búsqueda.");
        return;
    }

    const url = `main_store.html?search=${encodeURIComponent(query)}`;
    window.location.href = url;
}


function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const cartCountElement = document.getElementById("cart-count");

    if (cartCountElement) {
        cartCountElement.textContent = carrito.length;
    }
}


function dispararEventoPedidoAgregado() {
    const event = new Event("pedidoAgregado");
    document.dispatchEvent(event);
}


function verificarSesion() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        alert("Por favor, inicia sesión o continúa como invitado.");
        window.location.href = "login.html";
        return;
    }

    const userNameDisplay = document.querySelector('#user-name-display');

    if (usuario.tipo === "invitado") {
        userNameDisplay.textContent = "👤 Invitado";
    } else if (usuario.tipo === "registrado") {
        userNameDisplay.textContent = `👤 ${usuario.nombrecompleto}`;
    }

    actualizarContadorCarrito(usuario.usuarioid);

    document.addEventListener("pedidoAgregado", () => {
        actualizarContadorCarrito(usuario.usuarioid);
    });
}


