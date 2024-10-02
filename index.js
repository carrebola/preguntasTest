
// link publico de la hoja de cálculo: https://docs.google.com/spreadsheets/d/1_FSWhj1fbH36mCYRGqkABrZkVVOqiK52WphaBn7e730/edit?usp=sharing

const apiKey = 'AIzaSyCxIikMRbAWPGYGHQiI2VeCC7Ql3kTnNTc';
const sheetID = '1_FSWhj1fbH36mCYRGqkABrZkVVOqiK52WphaBn7e730';

const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/preguntas?key=${apiKey}`;

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


// Función para guardar los datos del usuario en Google Sheets
async function guardarDatosUsuario(nombre, email, fechaRegistro) {
  // Datos que se enviarán a Google Sheets
  const data = {
    range: "partidas!A1", // Cambia el rango según tu hoja de cálculo
    majorDimension: "ROWS",
    values: [
      [nombre, email, fechaRegistro]
    ]
  };

  try {
    const response = await fetch(sheetURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Datos guardados correctamente:", result);
    } else {
      console.error("Error al guardar los datos:", result);
    }
  } catch (error) {
    console.error("Error al conectar con la API de Google Sheets:", error);
  }
}

// Ejemplo de uso
guardarDatosUsuario("Juan Pérez", "juan@example.com", new Date().toISOString());