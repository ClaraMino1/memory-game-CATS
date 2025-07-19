const container = document.getElementById("container");
const url = "https://cataas.com/cat/";
let cards = [];
let canFlip = true;
let flippedCards = [];

//para el timer
let gameStarted = false;
let timerElement = document.getElementById("timer");
let seconds = 0;
let minutes = 0;
let timerInterval;

function startTimer() { //función para iniciar el timer
  timerInterval = setInterval(() => {
    seconds++ //incrementa los segundos

    if (seconds === 60) { //convierte a minutos y reestablece los segundos
      minutes++
      seconds = 0
    }

    let formattedMinutes = minutes.toString().padStart(2, "0");
    let formattedSeconds = seconds.toString().padStart(2, "0");

    timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
  }, 1000);
}

function stopTimer() { //función para parar el timer
  clearInterval(timerInterval);
}

function match(flippedCards){
  // accede a la URL de la imagen de cada card
  const img1Src = flippedCards[0].querySelector(".card-img").src;
  const img2Src = flippedCards[1].querySelector(".card-img").src

  //MATCH
  if(img1Src === img2Src){
    setTimeout(() => {
      //aplica la clase y deshabilita los clicks
      flippedCards.forEach((cardMatch) => {
        cardMatch.classList.add("card__match");
        cardMatch.removeEventListener("click", cardMatch.clickHandler);
      });
      //vacía el array y habilita los volteos
      flippedCards.length = 0;
      canFlip = true;
    }, 1000);
  }else { //NO MATCH
    setTimeout(() => {
      flippedCards.forEach((cardNoMatch) => {
        cardNoMatch.classList.remove("card__flipped");
      });
      //Vacía el array de cartas volteadas despues de que se hayan volteado
      flippedCards.length = 0;
      
      canFlip = true;// Habilita la capacidad de voltear cartas de nuevo
    }, 1000)
  }

}

function flip(card) {
   if (!gameStarted) { //si el juego no empezó, al dar vuelta una card, inicia el timer y cambia el estado del juego a empezado
    startTimer();
    gameStarted = true;
  }
    // Solo permitir voltear si canFlip es true y la carta no está ya volteada o emparejada
    if (!canFlip || card.classList.contains("card__flipped") || card.classList.contains("card__match")) {
        return;
    }

    flippedCards.push(card); // Agrega la card al array de cards volteadas
    card.classList.add("card__flipped");

    if (flippedCards.length === 2) { // Si hay dos cartas volteadas se evalúa coincidencia
      match(flippedCards);
    }

    if(cards.length === document.querySelectorAll(".card__match").length ){ //si ya no quedan cartas en el tablero
      console.log("ganaste")
      stopTimer()
    }
}

function shuffle(array) { //generar una repartida aleatoria
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function getCatImages(numberOfImages) {
  try {
    const response = await fetch(`https://cataas.com/api/cats?limit=${numberOfImages}`);
    const data = await response.json();

    const validImages = data.filter(item => //genera un array con las imágenes válidas
      item.mimetype === 'image/jpeg' || item.mimetype === 'image/png'
    );

    // Limita solo a la cantidad que se pidió (por si hay más de 9 válidas)
    const selectedImages = validImages.slice(0, numberOfImages);
    cards = selectedImages.map(item => url + item.id);

    // DUPLICAR + MEZCLAR
    const duplicatedCards = [...cards, ...cards];
    shuffle(duplicatedCards);

    // LIMPIAR CONTENEDOR
    container.innerHTML = "";

    duplicatedCards.forEach(imageUrl => {
      const card = document.createElement("div"); //por cada carta genera un div
      card.classList.add("card");

      const cardContent = document.createElement("div");
      cardContent.classList.add("card__content");

      const img = document.createElement("img");//crea una img para poder mostrar las imagenes
      img.classList.add("card-img");
      img.src = imageUrl;
      img.alt = "imagen de gato";

      card.clickHandler = () => {
      if (canFlip && flippedCards.length < 2 && !card.classList.contains("card__flipped") && !card.classList.contains("card__match")) {
        
        flip(card);
        }
      };

      img.onload = () => { // solo se puede dar vuelta una vez que cargó la img
        card.addEventListener("click", card.clickHandler);
        
      };

      cardContent.appendChild(img);
      card.appendChild(cardContent);
      container.appendChild(card);

    });

  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
  }
}

getCatImages(2);