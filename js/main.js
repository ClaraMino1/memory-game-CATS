document.querySelectorAll('.accordion-header').forEach(header => { //acordeón de los niveles
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
    header.classList.toggle('active');
  });
});

const ShowLevel = document.getElementById("current-level-display"); //agarro el elemento para mostrar el nivel actual
const container = document.getElementById("container");
const timerElement = document.getElementById("timer");
const url = "https://cataas.com/cat/"; //url para luego concatenar la cantidad de imagenes que quiero traer

//para manejar los niveles
let currentLevel = 0; //por defecto se inicia en el nivel 1
let numberOfPairs = 2;
const level = document.querySelectorAll(".level");
setupLevelButtons();

function setupLevelButtons() {
  level.forEach((levelBtn, index) => {
    levelBtn.addEventListener("click", () => { //evento click a cada boton de nivel
      currentLevel = index;
      if (index === 0) {
        numberOfPairs = 2; // si es el nivel 1. se usan 2 pares
      } else { //si es otro nivel se calculan los pares
        numberOfPairs = (index * 2) + 1;
      }
      playAgain(numberOfPairs);
      ShowLevel.innerText = `${currentLevel + 1}`; //muestra en pantalla el nivel actual
    });
  });
}

let cards = [];
let flippedCards = [];  // Guarda las cartas que están volteadas temporalmente
let canFlip = true;
let gameStarted = false;
let gameWon = false;

//para manejar el timer
let seconds = 0;
let minutes = 0;
let timerInterval;

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++; //aumenta cada segundo
    if (seconds === 60) {//formatea a minutos y reestablece los segundos
      minutes++;
      seconds = 0;
    }
    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function playAgain(numberOfImages) {
  // Limpiar el contenedor y reiniciar variables
  container.innerHTML = "";
  gameStarted = false;
  gameWon = false;
  flippedCards = [];
  canFlip = true;
  seconds = 0;
  minutes = 0;
  timerElement.textContent = "00:00";
  stopTimer();
  
  getCatImages(numberOfImages);
}

function match(flippedCards) {
  const img1Src = flippedCards[0].querySelector(".card-img").src;
  const img2Src = flippedCards[1].querySelector(".card-img").src;

  if (img1Src === img2Src) {
    // espera a que se vea el flip antes de marcar el match
    setTimeout(() => {
      flippedCards.forEach((card) => {
        card.classList.add("card__match"); //le agrega la clase a cada card emparejada
        card.removeEventListener("click", card.clickHandler); //le saca el evento click
      });

      flippedCards.length = 0;//vacia el array
      canFlip = true;//se puede volver a dar vuelta otras cartas

      //-----verifica victoria-----
      const totalMatched = document.querySelectorAll(".card__match").length; //cantidad de cartas ya emparejadas
      //si la cantidad de cartas emparejadas es igual a la cantidad de cartas totales y el juago aun no está ganado
      if (totalMatched === cards.length * 2 && !gameWon) {
        gameWon = true;
        stopTimer(); //se para el timer para mostrar el timpo de jugada

        // SweetAlert después de que se emparejó el último par
        Swal.fire({
          icon: "success",
          title: "¡GANASTE!",
          text: `Tu tiempo: ${timerElement.innerText}`,
          confirmButtonText: "Jugar de nuevo",
          confirmButtonColor: "#3085d6",
          showDenyButton: true, // activa un segundo botón
          denyButtonText: "Siguiente nivel",
          denyButtonColor: "#e94057",
          allowOutsideClick: false, //no permite cerrar el alert con click ni esc
          allowEscapeKey: false,
          width: 550,
          padding: "3em",
          color: "#e94057",
          background: "#F5F5F5",
          backdrop: `
            rgba(0,0,123,0.4)
            url("https://i.gifer.com/PYh.gif")
            left top
            no-repeat
          `
        }).then((result) => {
          if (result.isConfirmed) {
            playAgain(numberOfPairs); //jugar de nuevo el mismo nivel
          } else if (result.isDenied) {
            currentLevel++; //subir de nivel
            ShowLevel.innerText = currentLevel + 1;
            if (currentLevel >= level.length) { // si se completa el último nivel
              import('https://esm.run/canvas-confetti').then(confetti => {
                confetti.default({
                  particleCount: 500,
                  spread: 120
                });

                Swal.fire({
                  title: "¡FELICIDADES!",
                  text: "Completaste todos los niveles",
                  confirmButtonText: "Reiniciar juego",
                  allowOutsideClick: false, //no permite cerrar el alert con click ni esc
                  allowEscapeKey: false,
                }).then(() => {
                  currentLevel = 0; //vuelve al nivel 1
                  ShowLevel.innerText = currentLevel + 1;
                  playAgain(2);
                });
              });
            } 
            numberOfPairs = currentLevel === 0 ? 2 : (currentLevel * 2) + 1; //calcula los pares
            playAgain(numberOfPairs);
          }
        });
      }
    }, 800); // este timeout espera a que el flip se vea bien
  } else {
    setTimeout(() => {
      flippedCards.forEach((card) => {
        card.classList.remove("card__flipped");
      });
      flippedCards.length = 0;
      canFlip = true;
    }, 1000);
  }
}

function flip(card) {
  if (!gameStarted) { //se inicia el timer con el primer flip
    startTimer();
    gameStarted = true;
  }

  // Verifica si se puede voltear
  if (!canFlip || card.classList.contains("card__flipped") || card.classList.contains("card__match")) {
    return;
  }

  flippedCards.push(card);
  card.classList.add("card__flipped");

  //si ya se dieron vuelta dos cartas
  if (flippedCards.length === 2) {
    canFlip = false;//no deja seguir dando vuelta cartas
    match(flippedCards);//evalua conincidencias
  }
}

//reparte aleatoriamente
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function setCardLayoutByLevel() {
  const container = document.getElementById('container');
  if (currentLevel >= 6) { // nivel 7 es currentLevel 6 (base 0)
    container.classList.add('horizontal-layout');
  } else {
    container.classList.remove('horizontal-layout');
  }
}

async function getCatImages(numberOfImages) {
  try {
    // Reiniciar todas las variables del juego
    container.innerHTML = "";
    gameStarted = false;
    gameWon = false;
    flippedCards = [];
    canFlip = true;
    seconds = 0;
    minutes = 0;
    timerElement.textContent = "00:00";
    stopTimer();
    
    // Obtener imágenes de gatos desde la API
    const response = await fetch(`https://cataas.com/api/cats?limit=${numberOfImages}`);
    const data = await response.json();
    
    // Filtrar solo imágenes JPEG/PNG (no gifs)
    const validImages = data.filter(item =>
      item.mimetype === 'image/jpeg' || item.mimetype === 'image/png'
    );
    
    // Seleccionar el número requerido de imágenes
    const selectedImages = validImages.slice(0, numberOfImages);
    // Guardar las URLs de las imágenes seleccionadas
    cards = selectedImages.map(item => url + item.id);
    
    // Crear pares de cartas y mezclarlas
    const duplicatedCards = [...cards, ...cards];
    shuffle(duplicatedCards);
    
    // Crear las cartas en el DOM
    duplicatedCards.forEach(imageUrl => {
      const card = document.createElement("div");
      card.classList.add("card");
      
      const cardContent = document.createElement("div");
      cardContent.classList.add("card__content");
      
      const img = document.createElement("img");
      img.classList.add("card-img");
      img.src = imageUrl;
      img.alt = "imagen de gato";
      
      card.clickHandler = () => {
        if (canFlip && 
            flippedCards.length < 2 && 
            !card.classList.contains("card__flipped") && 
            !card.classList.contains("card__match")) {
          flip(card);
        }
      };
      
      // Agregar el evento click después de que la imagen cargue
      img.onload = () => {
        card.addEventListener("click", card.clickHandler);
      }
    
      // Construir la estructura de la carta
      cardContent.appendChild(img);
      card.appendChild(cardContent);
      container.appendChild(card);
    });
    
    // Ajustar el layout después de repartir las cartas
    setCardLayoutByLevel();
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    // Mostrar mensaje de error al usuario
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar las imágenes de gatos. Intenta de nuevo más tarde.",
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6"
    });
  }
}

//------INICIAR PARTIDA------
getCatImages(numberOfPairs); //empieza con el nivel 1