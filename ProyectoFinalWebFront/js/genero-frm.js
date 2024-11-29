document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("usuario")) {
        document.location.href = "login.html";
        return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario.tipo !== "administrador") {
        alert("Acceso no autorizado. Redirigiendo a la página principal.");
        window.location.href = "index.html";
        return;
    }

    document.querySelector("body").style.display = "block";

    const urlParams = new URLSearchParams(window.location.search);
    const generoid = urlParams.get("id");

    if (generoid && !isNaN(generoid)) {
        document.querySelector("#page-title").innerText = "Editar Género";
        loadGenero(generoid);
    } else {
        document.querySelector("#page-title").innerText = "Añadir Nuevo Género";
    }

    document.querySelector("#btn-save").addEventListener("click", saveGenero);
    document.querySelector("#imageUploader").addEventListener("change", uploadImage);
});

function loadGenero(generoid) {
    fetch(`/api/genero/${generoid}`)
        .then((response) => response.json())
        .then((data) => {
            document.querySelector("#generoid").value = data.generoid;
            document.querySelector("#nombre").value = data.nombre;
            document.querySelector("#imagenid").value = data.imagenid;

            if (data.imagenid > 0) {
                document.querySelector("#miniatura").src = `/api/libroImage/${data.imagenid}`;
            }
        })
        .catch((error) => console.error("Error al cargar el género:", error));
}

function saveGenero(event) {
    event.preventDefault();

    const genero = {
        generoid: document.querySelector("#generoid").value,
        nombre: document.querySelector("#nombre").value.trim(),
        imagenid: document.querySelector("#imagenid").value,
    };

    const method = genero.generoid === "0" ? "POST" : "PUT";

    fetch("/api/genero", {
        method: method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(genero),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al guardar el género");
            return response.json();
        })
        .then(() => {
            alert("Género guardado correctamente");
            document.location.href = "vistaAdmin.html";
        })
        .catch((error) => console.error("Error al guardar el género:", error));
}

function uploadImage() {
    const input = document.querySelector("#imageUploader");
    const data = new FormData();
    data.append("file", input.files[0]);

    fetch("/api/libroImage", {
        method: "POST",
        body: data,
    })
        .then((response) => response.json())
        .then((imagenid) => {
            document.querySelector("#imagenid").value = imagenid;
            document.querySelector("#miniatura").src = `/api/libroImage/${imagenid}`;
        })
        .catch((error) => console.error("Error al subir la imagen:", error));
}
