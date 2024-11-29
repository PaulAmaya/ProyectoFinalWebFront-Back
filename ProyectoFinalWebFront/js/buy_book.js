(function () {
    const libroId = getLibroIdFromURL();
    if (libroId) {
        cargarLibro(libroId);
    } else {
        alert("No se encontró el ID del libro en la URL.");
    }

    const searchButton = document.querySelector('#search-button');
    const searchInput = document.querySelector('#search-input');

    verificarSesion();


    if (searchButton && searchInput) {
        searchButton.addEventListener('click', realizarBusqueda);
        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                realizarBusqueda();
            }
        });
    }


})();


function manejarAgregarAlCarrito() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.tipo === "invitado") {
        alert("Debes iniciar sesión para añadir productos al carrito.");
        return;
    }

    const libroId = getLibroIdFromURL();
    const cantidad = parseInt(document.getElementById("quantity").value, 10);

    if (!libroId || isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, selecciona una cantidad válida.");
        return;
    }

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const libroExistente = carrito.find((item) => item.libroid === parseInt(libroId, 10));

    if (libroExistente) {
        libroExistente.cantidad += cantidad;
    } else {
        carrito.push({ libroid: parseInt(libroId, 10), cantidad: cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto añadido al carrito.");
    actualizarContadorCarrito();
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

function getLibroIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function cargarLibro(libroId) {
    fetch(`/api/libro/${libroId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se pudo obtener los datos del libro.");
            }
            return response.json();
        })
        .then(async (data) => {
            const generoNombre = await getGeneroName(data.generoid);
            mostrarLibro(data, generoNombre);
            cargarProductosRelacionados(data.generoid, libroId); 
        })
        .catch((error) => {
            console.error("Error al cargar los datos del libro:", error);
            alert("Ocurrió un error al cargar los datos del libro. Por favor, intenta nuevamente.");
        });
}

function mostrarLibro(libro, generoNombre) {
    const img = libro.imagenid > 0 ? `api/libroImage/${libro.imagenid}` : "img/agresion.jpg";
    const bookContainer = document.querySelector(".book-container");

    const breadcrumb = document.querySelector(".breadcrumb");
    breadcrumb.innerHTML = `
        <a href="main_store.html">Home</a> &gt; 
        <a href="main_store.html?generoid=${libro.generoid}">${generoNombre}</a> &gt; 
        ${libro.titulo}
    `;

    bookContainer.innerHTML = `
        <div class="book-image">
            <img src="${img}" alt="${libro.titulo}">
        </div>
        <div class="book-info">
            <h2>${libro.titulo}</h2>
            <p class="price">$${parseFloat(libro.precio).toFixed(2)}</p>
            <p class="availability">${libro.stock > 0 ? "Disponibilidad: Hay Existencias" : "Disponibilidad: Agotado"}</p>
            <p>
                <strong>Autor:</strong> ${libro.autor || "Desconocido"}<br>
                <strong>Editorial:</strong> ${libro.editorial || "Desconocida"}<br>
                <strong>Idioma:</strong> ${libro.idioma || "No especificado"}<br>
                <strong>ISBN:</strong> ${libro.isbn || "No disponible"}<br>
                <strong>Año de Publicación:</strong> ${new Date(libro.anopublicacion).getFullYear()}
            </p>
            <label for="quantity">Cantidad</label>
            <select id="quantity">
                ${[...Array(10).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join("")}
            </select>
            <button id="add-to-cart" class="add-to-cart">Añadir al carrito</button>
            <h3>Descripción</h3>
            <p>${libro.descripcion || "No hay descripción disponible."}</p>
        </div>
    `;

    const addToCartButton = document.getElementById('add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', manejarAgregarAlCarrito);
    }
}

function getGeneroName(generoid) {
    return fetch(`/api/genero/${generoid}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se pudo obtener el nombre del género.");
            }
            return response.json();
        })
        .then((data) => {
            return data.nombre; 
        })
        .catch((error) => {
            console.error("Error al obtener el nombre del género:", error);
            return "Sin género";
        });
}

function cargarProductosRelacionados(generoid, currentLibroId) {
    fetch(`/api/libro/genero/${generoid}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se pudieron obtener los productos relacionados.");
            }
            return response.json();
        })
        .then((data) => {
            const relacionados = data.filter(libro => libro.libroid !== parseInt(currentLibroId));
            mostrarProductosRelacionados(relacionados);
        })
        .catch((error) => {
            console.error("Error al cargar los productos relacionados:", error);
            alert("Ocurrió un error al cargar los productos relacionados. Por favor, intenta nuevamente.");
        });
}

function mostrarProductosRelacionados(librosRelacionados) {
    const relatedItemsContainer = document.querySelector(".related-items");
    relatedItemsContainer.innerHTML = ""; // Limpiar contenedor

    if (librosRelacionados.length > 0) {
        librosRelacionados.forEach(libro => {
            const img = libro.imagenid > 0 ? `api/libroImage/${libro.imagenid}` : "img/agresion.jpg";
            relatedItemsContainer.innerHTML += `
                <div class="related-item">
                    <a href="buy_book.html?id=${libro.libroid}">
                        <img src="${img}" alt="${libro.titulo}">
                        <p>${libro.titulo}<br>$${parseFloat(libro.precio).toFixed(2)}</p>
                    </a>
                </div>
            `;
        });
    } else {
        relatedItemsContainer.innerHTML = "<p>No hay productos relacionados disponibles.</p>";
    }
}


function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const cartCountElement = document.getElementById("cart-count");

    if (cartCountElement) {
        cartCountElement.textContent = carrito.length;
    }
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

