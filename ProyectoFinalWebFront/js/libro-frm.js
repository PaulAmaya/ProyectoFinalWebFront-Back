document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("userInSession")) {
        document.location.href = "login.html";
        return;
    }
    document.querySelector("body").style.display = "block";

    const urlParams = new URLSearchParams(window.location.search);
    const libroid = urlParams.get("id");

    if (libroid && !isNaN(libroid)) {
        document.querySelector("#page-title").innerText = "Editar Libro";
        loadBook(libroid);
    } else {
        document.querySelector("#page-title").innerText = "Añadir Nuevo Libro";
    }

    document.querySelector("#btn-save").addEventListener("click", saveBook);
    document.querySelector("#imageUploader").addEventListener("change", uploadImage);
    cargarGeneros();
});

function loadBook(libroid) {
    fetch(`/api/libro/${libroid}`)
        .then((response) => response.json())
        .then((data) => {
            document.querySelector("#libroid").value = data.libroid;
            document.querySelector("#titulo").value = data.titulo;
            document.querySelector("#autor").value = data.autor;
            document.querySelector("#editorial").value = data.editorial;
            document.querySelector("#isbn").value = data.isbn;
            document.querySelector("#precio").value = data.precio;
            document.querySelector("#stock").value = data.stock;
            document.querySelector("#generoid").value = data.generoid;
            document.querySelector("#descripcion").value = data.descripcion;
            document.querySelector("#imagenid").value = data.imagenid;

            if (data.imagenid > 0) {
                document.querySelector("#miniatura").src = `/api/libroImage/${data.imagenid}`;
            }
        })
        .catch((error) => console.error("Error al cargar el libro:", error));
}

function saveBook(event) {
    event.preventDefault();

    const libro = {
        libroid: document.querySelector("#libroid").value,
        titulo: document.querySelector("#titulo").value.trim(),
        autor: document.querySelector("#autor").value.trim(),
        editorial: document.querySelector("#editorial").value.trim(),
        isbn: document.querySelector("#isbn").value.trim(),
        precio: parseFloat(document.querySelector("#precio").value),
        stock: parseInt(document.querySelector("#stock").value),
        generoid: parseInt(document.querySelector("#generoid").value),
        descripcion: document.querySelector("#descripcion").value.trim(),
        imagenid: document.querySelector("#imagenid").value,
    };

    const method = libro.libroid === "0" ? "POST" : "PUT";

    fetch("/api/libro", {
        method: method,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(libro),
    })
        .then((response) => {
            if (!response.ok) throw new Error("Error al guardar el libro");
            return response.json();
        })
        .then(() => {
            alert("Libro guardado correctamente");
            document.location.href = "vistaAdmin.html";
        })
        .catch((error) => console.error("Error al guardar el libro:", error));
}

async function cargarGeneros() {
    try {
        const response = await fetch('/api/genero'); 
        if (!response.ok) {
            throw new Error('Error al obtener los géneros');
        }
        const generos = await response.json();
        console.log('Géneros obtenidos:', generos);

        const generoSelect = document.querySelector("#generoid");
        generos.forEach((genero) => {
            const option = document.createElement("option");
            option.value = genero.generoid;
            option.textContent = genero.nombre;
            generoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
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
