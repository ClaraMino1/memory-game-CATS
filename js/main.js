const container = document.getElementById("container");
const timerElement = document.getElementById("timer");
const url = "https://cataas.com/cat/"; //url para luego concatenar la cantidad de imagenes que quiero traer

let cards = [];
let flippedCards = [];
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

async function getCatImages(numberOfImages) {
  try {
    const response = await fetch(`https://cataas.com/api/cats?limit=${numberOfImages}`);
    const data = await response.json();

    //no permite gifs
    const validImages = data.filter(item =>
      item.mimetype === 'image/jpeg' || item.mimetype === 'image/png'
    );

    const selectedImages = validImages.slice(0, numberOfImages);
    cards = selectedImages.map(item => url + item.id);

    const duplicatedCards = [...cards, ...cards];
    shuffle(duplicatedCards);

    container.innerHTML = "";
    gameStarted = false;
    gameWon = false;
    flippedCards = [];
    canFlip = true;
    seconds = 0;
    minutes = 0;
    timerElement.textContent = "00:00";
    stopTimer();

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
        if (canFlip && flippedCards.length < 2 && !card.classList.contains("card__flipped") && !card.classList.contains("card__match")) {
          flip(card);
        }
      };

      img.onload = () => {
        card.addEventListener("click", card.clickHandler);
      };

      cardContent.appendChild(img);
      card.appendChild(cardContent);
      container.appendChild(card);
    })

  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
  }
}

getCatImages(2);
