// 1. Getting today's date 2. Transforming into the string '2023-11-23T12:34:56.789Z' 3. Splitting on 'T' and creating array 4. Getting the first string
const today = new Date().toISOString().split("T")[0];
// Setting the 'max' attribute with const today as it's value
document.getElementById("galaxy-date").setAttribute("max", today);

const $submitButton = document.getElementById("submit-button"),
  dateChosen = document.getElementById("galaxy-date"),
  $galaxyImage = document.getElementById("galaxy-image"),
  $imageLink = document.getElementById("image-link"),
  $imageTitle = document.getElementById("image-title"),
  $imageExplanation = document.getElementById("image-explanation"),
  $favoriteButton = document.getElementById("favorite-button"),
  $favoriteImagesContainer = document.getElementById("favoriteImagesContainer")
  ;

let favoriteImages = []
if (localStorage.getItem('favoriteImages')) {
  favoriteImages = JSON.parse(localStorage.getItem('favoriteImages'))
} let data


$submitButton.addEventListener("click", () => {
  const selectedDate = dateChosen.value;
  fetch(
    `https://api.nasa.gov/planetary/apod?api_key=cQYFhjPGPvkwQHxL4krbA4hkMUDIwo9Md4ticWBA&date=${selectedDate}`
  )
    .then((response) => response.json())
    .then((responseData) => {
      data = responseData
      $imageTitle.textContent = `${data.title} (${selectedDate})`;
      $galaxyImage.setAttribute("src", data.url);
      $imageLink.href = data.hdurl;
      $imageExplanation.textContent = data.explanation;
      $favoriteButton.classList.remove("d-none");

    });
});

$favoriteButton.addEventListener("click", () => {
  if (data) {
    addFavorites(data)
  } else {
    console.log("Data not fetched")
  }
});

function addFavorites(data) {
  favoriteImages.push(data)
  console.log(favoriteImages)
  localStorage.setItem("favoriteImages", JSON.stringify(favoriteImages))
  renderFavorites()
}



function renderFavorites() {
  $favoriteImagesContainer.innerHTML = ''

  favoriteImages.forEach((image) => {
    const $favoriteItem = document.createElement("div")
    $favoriteItem.classList.add("card")

    const $favoriteName = document.createElement("h3")
    const $favoriteImage = document.createElement("img")
    $favoriteImage.classList.add("card-image")

    const $removeFavorite = document.createElement("button")

    $favoriteName.textContent = `${image.title} (${image.date})`
    $favoriteImage.src = image.url
    $removeFavorite.textContent = "Remove"
    $removeFavorite.addEventListener("click", () => {
      localStorage.removeItem(image)
      favoriteImages = favoriteImages.filter(item => item !== image)
      localStorage.setItem("favoriteImages", JSON.stringify(favoriteImages))
      renderFavorites()
    })

    $favoriteItem.appendChild($favoriteName)
    $favoriteItem.appendChild($favoriteImage)
    $favoriteItem.appendChild($removeFavorite)
    $favoriteImagesContainer.append($favoriteItem)
  })
}

renderFavorites()