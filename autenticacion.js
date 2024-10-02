function handleCredentialResponse(response) {
  // Decodificar el token de respuesta JWT
  const userInfo = parseJwt(response.credential);
  console.log('Información del usuario:', userInfo);
  
  // Mostrar la foto de perfil en tu aplicación
  document.querySelector('#foto-perfil').src = userInfo.picture;
  document.querySelector('#userName').innerHTML = userInfo.name;

}

// Función para decodificar el token JWT y obtener información del usuario
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
