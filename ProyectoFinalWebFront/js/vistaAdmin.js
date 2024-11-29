document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.tipo !== "administrador") {
        alert("Acceso no autorizado. Redirigiendo a la página principal.");
        window.location.href = "index.html";
        return;
    }
    const menuBooks = document.getElementById("menu-books");
    const menuOrders = document.getElementById("menu-orders");
    const menuGeneros = document.getElementById("menu-generos");
    const viewTitle = document.getElementById("view-title");
    const dataTable = document.getElementById("data-table");

    menuBooks.classList.add("active");
    cargarLibros();

    menuBooks.addEventListener("click", () => {
        viewTitle.textContent = "Gestión de Libros";
        menuBooks.classList.add("active");
        menuOrders.classList.remove("active");
        menuGeneros.classList.remove("active");
        cargarLibros();
    });

    menuOrders.addEventListener("click", () => {
        viewTitle.textContent = "Pedidos";
        menuOrders.classList.add("active");
        menuBooks.classList.remove("active");
        menuGeneros.classList.remove("active");
        cargarPedidos();
    });

    menuGeneros.addEventListener("click", () => {
        viewTitle.textContent = "Gestión de Géneros";
        menuGeneros.classList.add("active");
        menuBooks.classList.remove("active");
        menuOrders.classList.remove("active");
        cargarGeneros();
    });
});


function cargarLibros() {
    fetch("/api/libro")
        .then((response) => {
            if (!response.ok) throw new Error("Error al cargar libros");
            return response.json();
        })
        .then((data) => {
            const html = `
                <div class="btn-add">
                    <button id="add-book-button" onclick="window.location.href='libro-frm.html'">Añadir Libro</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Título</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data
                            .map(
                                (libro) => `
                                <tr>
                                    <td>
                                        <img src="/api/libroImage/${libro.imagenid}" alt="${libro.titulo}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                                    </td>
                                    <td>${libro.titulo}</td>
                                    <td>$${parseFloat(libro.precio).toFixed(2)}</td>
                                    <td>${libro.stock}</td>
                                    <td>
                                        <a href="libro-frm.html?id=${ libro.libroid }" class="edit-button">Editar</a>
                                        <button class="delete-button" onclick="eliminarLibro(${libro.libroid})">Eliminar</button>
                                    </td>
                                </tr>`
                            )
                            .join("")}
                    </tbody>
                </table>
            `;
            document.getElementById("data-table").innerHTML = html;
        })
        .catch((error) => console.error("Error al cargar libros:", error));
}


function cargarPedidos() {
    fetch("/api/pedido/")
        .then((response) => {
            if (!response.ok) throw new Error("Error al cargar pedidos");
            return response.json();
        })
        .then((data) => {
            const html = `
                <table>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Libro</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.length > 0
                        ? data
                              .map(
                                  (pedido) => `
                              <tr>
                                  <td>${pedido.nombre_cliente}</td>
                                  <td>${pedido.nombre_libro}</td>
                                  <td>${pedido.cantidad_comprada}</td>
                                  <td>${new Date(pedido.fecha_pedido).toLocaleDateString()}</td>
                                  <td>$${parseFloat(pedido.total_pedido).toFixed(2)}</td>
                              </tr>`
                              )
                              .join("")
                        : `<tr><td colspan="5">No hay pedidos registrados.</td></tr>`}
                </tbody>
                </table>
            `;
            document.getElementById("data-table").innerHTML = html;
        })
        .catch((error) => console.error("Error al cargar pedidos:", error));
}

function eliminarLibro(libroid) {
    if (confirm("¿Estás seguro de eliminar este libro?")) {
        fetch(`/api/libro/${libroid}`, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) throw new Error("Error al eliminar libro");
                alert("Libro eliminado correctamente.");
                cargarLibros(); 
            })
            .catch((error) => {
                console.error("Error al eliminar libro:", error);
                alert("No se pudo eliminar el libro.");
            });
    }
}


function cargarGeneros() {
    fetch("/api/genero")
        .then((response) => {
            if (!response.ok) throw new Error("Error al cargar géneros");
            return response.json();
        })
        .then((data) => {
            const html = `
                <div class="btn-add">
                    <button id="add-book-button" onclick="window.location.href='genero-frm.html'">Añadir Género</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data
                            .map(
                                (genero) => `
                                <tr>
                                    <td>
                                        <img src="/api/libroImage/${genero.imagenid}" alt="${genero.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                                    </td>
                                    <td>${genero.nombre}</td>
                                    <td>
                                        <a href="genero-frm.html?id=${ genero.generoid }" class="edit-button">Editar</a>
                                        <button class="delete-button" onclick="eliminarGenero(${genero.generoid})">Eliminar</button>
                                    </td>
                                </tr>`
                            )
                            .join("")}
                    </tbody>
                </table>
            `;
            document.getElementById("data-table").innerHTML = html;
        })
        .catch((error) => console.error("Error al cargar géneros:", error));
}


function eliminarGenero(generoid) {
    if (confirm("¿Estás seguro de eliminar este género?")) {
        fetch(`/api/genero/${generoid}`, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) throw new Error("Error al eliminar género");
                alert("Género eliminado correctamente.");
                cargarGeneros(); 
            })
            .catch((error) => {
                console.error("Error al eliminar género:", error);
                alert("No se pudo eliminar el género.");
            });
    }
}
