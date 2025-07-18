const container = document.getElementById("container");
const url = "https://cataas.com/cat/"; //url para luego concatenar el id y generar la img
let cards = [];

async function getCatImages(numberOfImages) {
  try {
    const response = await fetch(`https://cataas.com/api/cats?limit=${numberOfImages}`);
    const data = await response.json();

    data.forEach(item => { //por cada img que le llega filtra las que son png o jpeg
      if (item.mimetype === 'image/jpeg' || item.mimetype === 'image/png') {
        console.log("aceptada");

        let imageId = item.id; //obtiene el id de la img
        let imageUrl = url + imageId; //concatena para generar una url
        cards.push(imageUrl); //agrega al array

        const card = document.createElement("div");//crea card
        card.classList.add("card");

        const cardContent = document.createElement("div"); //crea cardContent
        cardContent.classList.add("card__content");

        const img = document.createElement("img"); //crea la img
        img.classList.add("card-img");
        img.src = imageUrl; //le asigna la img que hay en el array
        img.alt = "imagen de gato";

      
        cardContent.appendChild(img);
        card.appendChild(cardContent);
        container.appendChild(card);
      } else {
        console.log("gif no aceptado");
      }
    });

  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
  }
}

getCatImages(17);
