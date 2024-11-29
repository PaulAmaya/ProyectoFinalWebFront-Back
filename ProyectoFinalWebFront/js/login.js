document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form').addEventListener('submit', iniciarSesion);

  document.getElementById('btn-guest').addEventListener('click', continuarComoInvitado);
});

async function iniciarSesion(event) {
  event.preventDefault(); 

  const correo = document.getElementById('correo').value.trim();
  const contrasena = document.getElementById('contrasena').value.trim();

  if (!correo || !contrasena) {
      mostrarError("Por favor, completa todos los campos.");
      return;
  }

  try {
      const response = await fetch('/api/usuario/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo, contrasena }),
      });

      if (response.ok) {
          const data = await response.json();

          if (data.isAdmin) {
              const adminInfo = {
                  usuarioid: data.usuarioid,
                  nombrecompleto: data.nombrecompleto,
                  correo: data.correo,
                  tipo: "administrador", 
              };
              localStorage.setItem("usuario", JSON.stringify(adminInfo));
              

              alert(`Bienvenido, Administrador ${data.nombrecompleto}`);
              window.location.href = 'vistaAdmin.html'; 
          } else {
              
              const userInfo = {
                  usuarioid: data.usuarioid,
                  nombrecompleto: data.nombrecompleto,
                  correo: data.correo,
                  tipo: "registrado", 
                  carritoid: data.carritoid,
              };
              localStorage.setItem("usuario", JSON.stringify(userInfo));
              

              alert(`Bienvenido, ${data.nombrecompleto}`);
              window.location.href = 'index.html'; 
          }
      } else {
          const errorData = await response.json();
          mostrarError(errorData.mensaje || "Credenciales incorrectas.");
      }
  } catch (error) {
      console.error('Error al conectarse con la API:', error);
      mostrarError("Error al conectarse con el servidor.");
  }
}


function continuarComoInvitado() {
  const userInfo = {
      tipo: "invitado" 
  };
  localStorage.setItem("usuario", JSON.stringify(userInfo));

  alert("Has iniciado como invitado.");
  window.location.href = 'index.html'; 
}

function mostrarError(mensaje) {
  const errorElement = document.getElementById('error-message');
  errorElement.textContent = mensaje;
  errorElement.style.color = 'red';
  errorElement.style.textAlign = 'center';
  errorElement.style.marginTop = '10px';
}
