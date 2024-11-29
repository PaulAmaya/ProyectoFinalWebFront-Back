(function () {
    cargarCategorias();
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


function cargarCategorias() {
    fetch('/api/genero')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar las categorías.");
            }
            return response.json();
        })
        .then(categorias => {
            console.log("Categorías obtenidas:", categorias);
            mostrarCategorias(categorias);
        })
        .catch(error => {
            console.error("Error al cargar las categorías:", error);
            alert("Ocurrió un error al cargar las categorías.");
        });
}

function mostrarCategorias(categorias) {
    const categoriesContainer = document.querySelector('.categories');
    categoriesContainer.innerHTML = ''; 

    categorias.forEach(categoria => {
        const imgUrl = categoria.imagenid
            ? `/api/libroImage/${categoria.imagenid}`
            : 'img/default-category.jpg'; 

        const categoriaHTML = `
            <a href="main_store.html?generoid=${categoria.generoid}">
                <div class="category" style="background-image: url('${imgUrl}')">
                    <h3>${categoria.nombre}</h3>
                </div>
            </a>
        `;
        categoriesContainer.innerHTML += categoriaHTML;
    });
}

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


