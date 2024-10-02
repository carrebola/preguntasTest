
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


//********************************* */

// El ID de cliente y el alcance (scope) necesarios para interactuar con la API
const CLIENT_ID = idCliente;
const API_KEY = apiKey;
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// ID de la hoja de cálculo y el rango donde escribiremos los datos
const SHEET_ID = sheetID;
const RANGE = 'partidas!A1';  // El rango donde escribirás los datos

let auth2;  // Variable para el objeto de autenticación

// Inicializar la API de Google y el cliente OAuth
function initOAuth() {
  gapi.load('auth2', function () {
    auth2 = gapi.auth2.init({
      client_id: CLIENT_ID,
      scope: SCOPES
    });

    auth2.isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(auth2.isSignedIn.get());
  });
}

// Actualizar el estado de la sesión (autenticado o no)
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById('writeToSheetBtn').style.display = 'block';
    document.getElementById('loginBtn').style.display = 'none';
  } else {
    document.getElementById('writeToSheetBtn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'block';
  }
}

// Iniciar sesión con Google
function signIn() {
  auth2.signIn().then(() => {
    console.log('Usuario autenticado');
    document.getElementById('writeToSheetBtn').style.display = 'block';
  });
}

// Salir de la sesión
function signOut() {
  auth2.signOut().then(() => {
    console.log('Usuario desconectado');
    document.getElementById('writeToSheetBtn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'block';
  });
}

// Escribir datos en Google Sheets
function writeToSheet() {
  const values = [
    ["Nombre", "Edad", "Correo"],  // Encabezados
    ["Juan Pérez", "30", "juan@example.com"],  // Datos de ejemplo
  ];

  const body = {
    values: values
  };

  // Llamada a la API de Google Sheets
  const params = {
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: "RAW",
    auth: auth2.currentUser.get().getAuthResponse().access_token  // Token de acceso OAuth
  };

  const request = gapi.client.sheets.spreadsheets.values.update(params, body);
  
  request.then((response) => {
    console.log("Datos escritos correctamente:", response);
  }, (error) => {
    console.error("Error al escribir en la hoja:", error);
  });
}

// Cargar y preparar la API de Google Sheets
function loadSheetsApi() {
  gapi.client.load('sheets', 'v4', () => {
    console.log('API de Google Sheets cargada');
  });
}

// Inicializar la API de Google
function loadClient() {
  gapi.client.setApiKey(API_KEY);
  loadSheetsApi();
}

document.getElementById('loginBtn').addEventListener('click', signIn);
document.getElementById('writeToSheetBtn').addEventListener('click', writeToSheet);

// Inicializamos las bibliotecas cuando la página cargue
window.onload = function () {
  gapi.load('client', loadClient);
  initOAuth();
};
