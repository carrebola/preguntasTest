
// link publico de la hoja de cálculo: https://docs.google.com/spreadsheets/d/1_FSWhj1fbH36mCYRGqkABrZkVVOqiK52WphaBn7e730/edit?usp=sharing

const apiKey = 'AIzaSyCxIikMRbAWPGYGHQiI2VeCC7Ql3kTnNTc';
const sheetID = '1_FSWhj1fbH36mCYRGqkABrZkVVOqiK52WphaBn7e730';
let hoja = 'preguntas'
let sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${hoja}?key=${apiKey}`;

const idCliente = '1011906717113-ni524ihb5rfd7tt24am8iufa1ncnnqaa.apps.googleusercontent.com'
const secretoCliente = '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'




let preguntas = []; // array con todas las preguntas y sus respuestas
let preguntaActual = []; // Objeto con la pregunta actual
let indexRespuestaCorrecta = -1; // index de la respuesta correcta de la pregunta seleccionada
let preguntasCorrectas = 0
let errores = 0
let tiempo = 120
let posicionActual = 0
let temporizador


// Función para leer preguntas
async function leerPreguntas() {
  // leermos los datos de la hoja de cálculo y los guardamos en un array
  try {
    const response = await fetch(sheetURL);
    const data = await response.json();
    preguntas = data.values.slice(1); // Omitir la fila de encabezado
    // cargaPreguntaAleatoria()
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
  }
}
leerPreguntas()



function cargaPreguntaAleatoria() {
  const randomIndex = Math.floor(Math.random() * preguntas.length);
  preguntaActual = preguntas[randomIndex];
  indexRespuestaCorrecta = parseInt(preguntaActual[6]) - 1;

  document.querySelector('#question').innerHTML = preguntaActual[0] + ' ' + preguntaActual[1];
  document.querySelector('#answer1').disabled = false
  document.querySelector('#answer2').disabled = false
  document.querySelector('#answer3').disabled = false
  document.querySelector('#answer4').disabled = false
  document.querySelector('#answer1').innerHTML = preguntaActual[2];
  document.querySelector('#answer2').innerHTML = preguntaActual[3];
  document.querySelector('#answer3').innerHTML = preguntaActual[4];
  document.querySelector('#answer4').innerHTML = preguntaActual[5];
  document.getElementById('result').style.display = 'none';
  document.querySelector('#next-question').disabled = true
}

function seleccionarRespuesta(indexRespuestaSeleccionada) {

  document.querySelector('#answer1').disabled = true
  document.querySelector('#answer2').disabled = true
  document.querySelector('#answer3').disabled = true
  document.querySelector('#answer4').disabled = true
  document.querySelector('#next-question').disabled = false
  let textoResultado;
  if (indexRespuestaSeleccionada === indexRespuestaCorrecta) {
    textoResultado = '¡Correcto!';
    preguntasCorrectas++
    document.querySelector('#aciertos').innerHTML = preguntasCorrectas;
    moverFicha(10)
  } else {
    const respuestaCorrecta = preguntaActual[parseInt(indexRespuestaCorrecta) + 2];
    textoResultado = 'Incorrecto, la respuesta correcta es: ' + respuestaCorrecta;
    errores++
    document.querySelector('#errores').innerHTML = errores;
    moverFicha(-3)
  }
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = textoResultado;
  resultDiv.className = indexRespuestaSeleccionada === indexRespuestaCorrecta ? 'alert alert-success' : 'alert alert-danger';
  resultDiv.style.display = 'block';
}

function moverFicha(posiciones) {
  const fichas = document.querySelectorAll('.div');
  fichas[posicionActual].classList.remove('div-point')
  posicionActual += posiciones
  if (posicionActual < 0) posicionActual = 0
  if (posicionActual >= 19) {
    posicionActual = 19 //
    clearInterval(temporizador)
    finPartida()
  }
  console.log('posicionActual', posicionActual);
  fichas[posicionActual].classList.add('div-point')
}


function finPartida() {
  alert('fin partida')
}



document.querySelector('#question').innerHTML = 'Cada acierto avanzas una casilla, pero cada error retrocedes 3. ¡Suerte!';

document.querySelector('#btnTiempo').addEventListener('click', ()=>{
  
  document.querySelector('#btnComenzar').classList.add('d-none');
  document.querySelector('#answers').classList.remove('d-none');
  document.querySelector('#next-question').classList.remove('d-none');;
  cargaPreguntaAleatoria();
  temporizador = setInterval(() => {
    tiempo--
    document.querySelector('#tiempo').innerHTML = tiempo;
    if(tiempo == 0){
      clearInterval(temporizador)
      finPartida()
    }
  }, 1000)
});

document.querySelector('#btnSinTiempo').addEventListener('click', ()=>{
  
  document.querySelector('#btnComenzar').classList.add('d-none');
  document.querySelector('#answers').classList.remove('d-none');
  document.querySelector('#next-question').classList.remove('d-none');;
  cargaPreguntaAleatoria();
  tiempo = 0
  temporizador = setInterval(() => {
    tiempo++
    document.querySelector('#tiempo').innerHTML = tiempo;
   
  }, 1000)
});

// Configuración de OAuth 2.0
const CLIENT_ID = 'TU_CLIENT_ID.apps.googleusercontent.com'; // Reemplaza con tu client ID
const API_KEY = 'TU_API_KEY';  // No es necesario, pero es opcional en algunas configuraciones
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';  // Acceso para editar Google Sheets

// ID de la hoja de cálculo de Google Sheets (reemplázalo por el ID de tu hoja)
const SPREADSHEET_ID = 'TU_SHEET_ID';

// Inicializar la API de Google y autenticar al usuario
function iniciarOAuth() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    scope: SCOPES,
    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
  }).then(() => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
      console.log("Usuario ya autenticado");
    } else {
      // Si no está autenticado, pedimos iniciar sesión
      authInstance.signIn();
    }
  }).catch(error => {
    console.error("Error al inicializar el cliente de Google:", error);
  });
}

// Función para guardar los datos del usuario en Google Sheets
async function guardarDatosUsuario(nombre, email, fechaRegistro) {
  const datos = {
    range: "Sheet1!A1", // El rango de celdas que queremos modificar
    majorDimension: "ROWS",
    values: [
      [nombre, email, fechaRegistro]  // Los datos que queremos guardar
    ]
  };

  try {
    // Realizamos la solicitud para añadir datos a la hoja de cálculo
    const request = gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      resource: datos
    });

    const response = await request;
    console.log("Datos guardados correctamente:", response.result);
  } catch (error) {
    console.error("Error al guardar los datos en Google Sheets:", error);
  }
}

// Evento para iniciar la autenticación
document.querySelector("#btnLogin").addEventListener('click', iniciarOAuth);

// Evento para guardar datos
document.querySelector("#btnGuardarDatos").addEventListener('click', () => {
  console.log('guardar');
  if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
    // Solo guardar los datos si el usuario está autenticado
    guardarDatosUsuario("Juan Pérez", "juan@example.com", new Date().toISOString());
  } else {
    console.log("El usuario no está autenticado.");
  }
});
