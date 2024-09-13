// link publico de la hoja de cálculo: https://docs.google.com/spreadsheets/d/1_FSWhj1fbH36mCYRGqkABrZkVVOqiK52WphaBn7e730/edit?usp=sharing

const apiKey = 'AIzaSyCxIikMRbAWPGYGHQiI2VeCC7Ql3kTnNTc';
const sheetID = '1_FSWhj1fbH36mCYRGqkABrZkVVOqiK52WphaBn7e730';

const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/preguntas?key=${apiKey}`;


let preguntas = []; // array con todas las preguntas y sus respuestas
let preguntaActual = []; // Objeto con la pregunta actual
let indexRespuestaCorrecta = -1; // index de la respuesta correcta de la pregunta seleccionada


// Función para leer preguntas
async function leerPreguntas() {
  // leermos los datos de la hoja de cálculo y los guardamos en un array
  try {
    const response = await fetch(sheetURL);
    const data = await response.json();
    preguntas = data.values.slice(1); // Omitir la fila de encabezado
    console.log('preguntas', preguntas); // mostramos por consola
    cargaPreguntaAleatoria()
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
  }
}

// Función para cargar una de las preguntas de forma aleatoria
function cargaPreguntaAleatoria() {

  const randomIndex = Math.floor(Math.random() * preguntas.length); // Devuelve numero aleatorio entre 0 y la longitud máxima del array de preguntas
  
  preguntaActual = preguntas[randomIndex]; // Objeto que contiene la pregunta seleccionada aleatoriamente

  console.log('numero aleatorio', randomIndex); 
  console.log('preguntaActual', preguntaActual);

  indexRespuestaCorrecta = parseInt(preguntaActual[6]) - 1; // Obtenemos la posición del array de la respuesta correcta a la pregunta seleccionada

  console.log('respuesta correcta', indexRespuestaCorrecta );

  // Inyectamos la pregunta y las respuestas en el html
  document.querySelector('#question').innerHTML = preguntaActual[0] + ' ' + preguntaActual[1];
  document.querySelector('#answer1').innerHTML = preguntaActual[2];
  document.querySelector('#answer2').innerHTML = preguntaActual[3];
  document.querySelector('#answer3').innerHTML = preguntaActual[4];
  document.querySelector('#answer4').innerHTML = preguntaActual[5];
  document.querySelector('#result').innerHTML = '';
 
}

// Función para verificar si la respuesta es correcta
function seleccionarRespuesta(indexRespuestaSeleccionada) {
  // mostramos el index del boton donde hemos hecho click
  console.log('indexRespuestaSeleccionada y correcta', indexRespuestaSeleccionada, indexRespuestaCorrecta);
  if(indexRespuestaSeleccionada === indexRespuestaCorrecta){
    textoResultado = '¡Correcto!' 
  }else{
    const respuestaCorrecta = preguntaActual[parseInt(indexRespuestaCorrecta)+1]
    textoResultado = 'Incorrecto, la respuesta correcta es: <br>' +  parseInt(indexRespuestaCorrecta + 1) + ' - ' +respuestaCorrecta
  }
  document.getElementById('result').innerHTML = textoResultado;
}

// llamamos a la función leer preguntas para empezar el juego
leerPreguntas()