(() => {
    document.querySelector("#registrationForm").addEventListener('submit', saveUsuario);
})();

function isEmailValid(correo) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(correo);
}

async function saveUsuario(event) {
    event.preventDefault(); 

    const userData = {
        nombreCompleto: document.querySelector("#nombreCompleto").value,
        correo: document.querySelector("#correo").value,
        contrasena: document.querySelector("#contrasena").value,
        direccion: document.querySelector("#direccion").value,
        telefono: document.querySelector("#telefono").value
    };

    const msgError = document.querySelector("#msg-error-register");

    if (userData.contrasena.length < 8) {
        msgError.textContent = "La contraseña debe tener al menos 8 caracteres.";
        msgError.style.display = "block";
        return;
    }

    if (!isEmailValid(userData.correo)) {
        msgError.textContent = "Por favor, ingresa un correo electrónico válido.";
        msgError.style.display = "block";
        return;
    }

    try {
        const response = await fetch("/api/cliente/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            window.location.href = "login.html"; 
        } else {
            const errorData = await response.json();
            msgError.textContent = errorData.message || "Error al registrar usuario.";
        }
    } catch (error) {
        msgError.textContent = "Ocurrió un error. Por favor, intenta nuevamente.";
        console.error("Error:", error);
    }
}
