(function () {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.tipo !== "registrado") {
        alert("Debes iniciar sesión para ver tu carrito.");
        window.location.href = "login.html";
        return;
    }

    cargarCarrito();
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


function cargarCarrito() {
    const cartItems = JSON.parse(localStorage.getItem("carrito")) || [];

    if (cartItems.length === 0) {
        mostrarCarrito([]);
        return;
    }

    const promises = cartItems.map(item =>
        fetch(`/api/libro/${item.libroid}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar información del libro con ID ${item.libroid}`);
                }
                return response.json();
            })
            .then(libro => ({ ...libro, cantidad: item.cantidad }))
    );

    Promise.all(promises)
        .then(libros => {
            mostrarCarrito(libros);
        })
        .catch(error => {
            console.error("Error al cargar el carrito:", error);
            alert("Ocurrió un error al cargar el carrito.");
        });
}

function mostrarCarrito(carrito) {
    const cartItemsContainer = document.getElementById("cart-items");
    const summaryContainer = document.querySelector(".cart-summary");
    let html = "";
    let subtotal = 0;

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = "<tr><td colspan='5'>Tu carrito está vacío.</td></tr>";
        summaryContainer.innerHTML = `
            <h3>Resumen (0 artículos)</h3>
            <p>Subtotal: $0.00</p>
            <p>Total: <strong>$0.00</strong></p>
        `;
        return;
    }

    carrito.forEach((libro, index) => {
        const totalItem = libro.precio * libro.cantidad;
        subtotal += totalItem;

        html += `
            <tr>
                <td><img src="/api/libroImage/${libro.imagenid}" alt="${libro.titulo}" class="cart-item-image" /></td>
                <td>${libro.titulo}</td>
                <td>$${libro.precio}</td>
                <td>
                    <input 
                        type="number" 
                        class="quantity-input" 
                        value="${libro.cantidad}" 
                        min="1" 
                        onchange="actualizarCantidad(${index}, this.value)"
                    />
                </td>
                <td>$${totalItem.toFixed(2)}</td>
                <td><button class="delete-button" onclick="eliminarDelCarrito(${index})"><i class="fas fa-trash-alt"></i>🗑️</button></td>
            </tr>
        `;
    });

    cartItemsContainer.innerHTML = html;

    summaryContainer.innerHTML = `
        <h3>Resumen (${carrito.length} artículos)</h3>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Total: <strong>$${subtotal.toFixed(2)}</strong></p>
        <button class="checkout-button" onclick="procesarPedido()">Realizar Pedido</button>
    `;
}

function eliminarDelCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) ;
    carrito.splice(index, 1); 
    localStorage.setItem("carrito", JSON.stringify(carrito)); 
    cargarCarrito();    
}


function actualizarCantidad(index, nuevaCantidad) {
    if (nuevaCantidad < 1) {
        alert("La cantidad debe ser al menos 1.");
        return;
    }

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito[index].cantidad = parseInt(nuevaCantidad, 10);
    localStorage.setItem("carrito", JSON.stringify(carrito)); 

    cargarCarrito();
}


async function procesarPedido() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const cartItems = JSON.parse(localStorage.getItem("carrito")) ;

    if (cartItems.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    try {
        const pedidoResponse = await fetch("/api/pedido/realizar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                clienteid: usuario.usuarioid,
                items: cartItems.map(item => ({
                    libroid: item.libroid,
                    cantidad: item.cantidad
                }))
            }),
        });

        if (!pedidoResponse.ok) {
            throw new Error("Error al crear el pedido.");
        }

        const pedidoData = await pedidoResponse.json();
        const pedidoId = pedidoData.pedidoid;

        localStorage.setItem("pedidoId", pedidoId);

        localStorage.removeItem("carrito");
        alert("Pago procesado exitosamente.");
        window.location.href = "pedido-confirmado.html";
    } catch (error) {
        console.error("Error al procesar el pago:", error);
        alert("Ocurrió un error al procesar el pago.");
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


