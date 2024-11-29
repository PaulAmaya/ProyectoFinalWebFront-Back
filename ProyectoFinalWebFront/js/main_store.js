(function () {
    const generoid = getGeneroIdFromURL();
    const searchQuery = getSearchQueryFromURL();

    if (searchQuery) {
        buscarLibrosPorNombre(searchQuery); 
    }else if (generoid) {
        cargarLibrosPorGeneroDirecto(generoid); 
    } else {
        cargarLibros(); 
    }

    cargarGeneros();
    verificarSesion();

    document.querySelector('#clear-filters').addEventListener('click', clearFilters);
    document.querySelector('#search-button').addEventListener('click', buscarLibros);
    document.querySelector('#search-input').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            buscarLibros(); 
        }
    });
})();




function getSearchQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('search');
}

function buscarLibrosPorNombre(query) {
    fetch(`/api/libro/buscar?q=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    return []; 
                }
                throw new Error("Error al buscar libros.");
            }
            return response.json();
        })
        .then(libros => {
            mostrarLibros(libros);
        })
        .catch(error => {
            console.error("Error al realizar la búsqueda:", error);
            alert("Ocurrió un error al realizar la búsqueda. Por favor, intenta nuevamente.");
        });
}

function getGeneroIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('generoid');
}

function cargarLibrosPorGeneroDirecto(generoid) {
    cargarLibrosPorGenero(generoid)
        .then((libros) => {
            console.log(`Libros del género ${generoid} obtenidos directamente:`, libros);
            mostrarLibros(libros);
        })
        .catch((error) => {
            console.error("Error al cargar los libros por género directamente:", error);
            alert("Ocurrió un error al cargar los libros de este género.");
        });
}

function clearFilters(event) {
    event.preventDefault(); 

    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });

    cargarLibros();
}

function cargarGeneros() {
    const categoryList = document.querySelector('#category-list');
    const generoidFromURL = getGeneroIdFromURL(); 
    categoryList.innerHTML = ""; 

    fetch('/api/genero')
        .then(response => response.json())
        .then(function (generos) {
            console.log("Cargando géneros:", generos);
            generos.forEach(genre => {
                const genreHTML = getGeneroInHtml(genre, generoidFromURL);
                categoryList.innerHTML += genreHTML;
            });
            document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', onFilterChange);
            });
        })
        .catch((error) => {
            console.error("Error al cargar los géneros:", error);
        });
}

function getGeneroInHtml(genre, generoidFromURL) {
    const isChecked = generoidFromURL == genre.generoid ? 'checked' : ''; 
    return `
        <li>
            <input type="checkbox" class="filter-checkbox" id="genre-${genre.generoid}" data-category-generoid="${genre.generoid}" ${isChecked}>
            <label for="genre-${genre.generoid}">${genre.nombre}</label>
        </li>
    `;
}


function buscarLibros() {
    const query = document.querySelector('#search-input').value.trim();

    if (!query) {
        alert("Por favor, ingresa un término de búsqueda.");
        return;
    }

    fetch(`/api/libro/buscar?q=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    return []; 
                }
                throw new Error("Error al buscar libros.");
            }
            return response.json();
        })
        .then(libros => {
            mostrarLibros(libros);
        })
        .catch(error => {
            console.error("Error al realizar la búsqueda:", error);
            alert("Ocurrió un error al realizar la búsqueda. Por favor, intenta nuevamente.");
        });
}

function onFilterChange() {
    const selectedGenres = Array.from(document.querySelectorAll('.filter-checkbox:checked'))
        .map(checkbox => checkbox.getAttribute('data-category-generoid'));

    if (selectedGenres.length === 0) {
        cargarLibros(); 
        return;
    }

    const promises = selectedGenres.map(cargarLibrosPorGenero);

    Promise.all(promises)
        .then((results) => {
            const allBooks = results.flat(); 
            mostrarLibros(allBooks);
        })
        .catch((error) => {
            console.error("Error al combinar libros por género:", error);
            alert("Ocurrió un error al cargar los libros.");
        });
}

function cargarLibrosPorGenero(generoid) {
    return fetch(`/api/libro/genero/${generoid}`)
        .then(response => response.json())
        .catch((error) => {
            console.error(`Error al cargar libros del género ${generoid}:`, error);
            return []; 
        });
}

function cargarLibros() {
    fetch('/api/libro')
        .then(response => response.json())
        .then(function (data) {
            console.log("Mostrando todos los libros");
            mostrarLibros(data);
        })
        .catch((error) => {
            console.error("Error al cargar los libros:", error);
            alert("Ocurrió un error al cargar los libros.");
        });
}

function mostrarLibros(libros) {
    const librosHTML = document.querySelector("#libros");
    librosHTML.innerHTML = "";

    let html = "";
    for (const libro of libros) {
        let libroHTML = getLibroInHtml(libro);
        html += libroHTML;
    }

    librosHTML.innerHTML = html;
}

function getLibroInHtml(libro) {
    const img = libro.imagenid > 0 ? `api/libroImage/${libro.imagenid}` : "img/agresion.jpg";
    return `
    <a href="buy_book.html?id=${libro.libroid}">
        <div class="product">
            <img src=${img} alt="${libro.titulo}">
            <h4>${libro.titulo}</h4>
            <p>$${parseFloat(libro.precio).toFixed(2)}</p>
        </div>
    </a>
    `;
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


