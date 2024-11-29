document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.tipo !== "registrado") {
        alert("Debes iniciar sesión para continuar.");
        window.location.href = "login.html";
        return;
    }

    const nombreCompleto = usuario.nombrecompleto;

    document.getElementById("user-name").textContent = nombreCompleto;
    document.getElementById("user-name-display").textContent = `👤${nombreCompleto}`;

    document.getElementById("logout-link").addEventListener("click", cerrarSesion);
    document.getElementById("logout-button").addEventListener("click", cerrarSesion);

    document.getElementById("view-orders").addEventListener("click", (e) => {
        e.preventDefault();
        cargarPedidos(usuario.usuarioid);
    });
});

function cerrarSesion() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("carrito");
    alert("Has cerrado sesión.");
    window.location.href = "login.html";
}

function cargarPedidos(usuarioId) {
    const ordersSection = document.getElementById("orders-section");
    const ordersTableBody = document.querySelector("#orders-table tbody");

    fetch(`/api/pedido/cliente/${usuarioId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener los pedidos.");
            }
            return response.json();
        })
        .then((pedidos) => {
            if (pedidos.length === 0) {
                ordersTableBody.innerHTML = `
                    <tr>
                        <td colspan="4">No tienes pedidos registrados.</td>
                    </tr>
                `;
            } else {
                const pedidosHTML = pedidos.map((pedido) => `
                    <tr>
                        <td>${pedido.pedidoid}</td>
                        <td>${new Date(pedido.fecha).toLocaleDateString()}</td>
                        <td>$${pedido.total}</td>
                        <td>${pedido.estado}</td>
                    </tr>
                `).join("");

                ordersTableBody.innerHTML = pedidosHTML;
            }

            ordersSection.style.display = "block";
        })
        .catch((error) => {
            console.error("Error al cargar pedidos:", error);
            alert("Ocurrió un error al cargar tus pedidos.");
        });
}
