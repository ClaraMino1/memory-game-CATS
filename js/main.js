const container = document.getElementById("container")
const url = "https://cataas.com/cat/"; //para luego concatenarle el id
let cards = [];

async function getCatImages(numberOfImages) { 
  try {
    const response = await fetch(`https://cataas.com/api/cats?limit=${numberOfImages}`);
    const data = await response.json();

    data.forEach(item => {
      let imageId = item.id; //obtiene el id de la img
      let imageUrl = url + imageId; //concatena la url con el id para poder acceder a la img
      cards.push(imageUrl); //mete la img al array

        const img = document.createElement("img") //crea la img por cada elemento del array
        img.classList.add("card-img")
        img.src = imageUrl
        img.alt = "imagen de gato"

        container.appendChild(img) //img en el dom
    })      

  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
  }
}

getCatImages(6);
