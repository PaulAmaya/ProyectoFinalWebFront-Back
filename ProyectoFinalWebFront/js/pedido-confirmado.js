document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.tipo !== "registrado") {
        alert("Debes iniciar sesión para ver esta página.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("user-name-display").textContent = `👤 ${usuario.nombrecompleto}`;

    cargarPedido(usuario.usuarioid);

    cargarDatosCliente(usuario.usuarioid);

    document.getElementById("pay-button").addEventListener("click", () => {
        window.location.href = "pago-confirmado.html";
    });
});

function cargarPedido() {
    const pedidoId = localStorage.getItem("pedidoId");

    if (!pedidoId) {
        console.error("No se encontró el ID del pedido en localStorage.");
        alert("No se encontró el ID del pedido.");
        return;
    }

    fetch(`/api/pedido/${pedidoId}`)
        .then((response) => {
            if (!response.ok) throw new Error("Error al cargar el pedido.");
            return response.json();
        })
        .then((pedido) => {
            document.getElementById("pedido-id").textContent = pedido.pedidoid;
            document.getElementById("pedido-fecha").textContent = new Date(pedido.fecha).toLocaleDateString();
            document.getElementById("pedido-total").textContent = `$${parseFloat(pedido.total).toFixed(2)}`;
        })
        .catch((error) => console.error("Error al cargar el pedido:", error));
}

document.addEventListener("DOMContentLoaded", cargarPedido);



function cargarDatosCliente(usuarioid) {
    fetch(`/api/cliente/${usuarioid}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al cargar los datos del cliente.");
            }
            return response.json();
        })
        .then((cliente) => {
            document.getElementById("direccion").textContent = 
                `${cliente.direccion || "Dirección no proporcionada"}`;
        })
        .catch((error) => {
            console.error("Error al cargar los datos del cliente:", error);
            document.getElementById("direccion").textContent = "Dirección no proporcionada.";
        });
}
