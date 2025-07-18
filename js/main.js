const container = document.getElementById("container");
const url = "https://cataas.com/cat/";
let cards = [];

function flip(card) {// funcion para dar vuelta la card
  card.classList.add("card__flipped");
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
      img.onload = () => { //solo se puede dar vuelta una vez que cargó la img
        card.addEventListener("click", () => {
          flip(card);
        });
      } 

      cardContent.appendChild(img);
      card.appendChild(cardContent);
      container.appendChild(card);

    });

  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
  }
}

getCatImages(9);
