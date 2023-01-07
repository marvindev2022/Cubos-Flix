let allMovies = [];
let currentPage = 0;
let currentTheme = localStorage.getItem("theme") ?? "light";

function FillData(resultsList) {
  for (let i = 0; i <= 2; i++) {
    let page = resultsList.splice(0, 6);
    allMovies.push(page);
  }
}
async function viewMovieCards() {
  try {
    const { data } = await apiAxios.get("discover/movie?language=pt-BR&include_adult=false");
    const resultsList = data.results;
    FillData(resultsList)
  } catch (erro) {
    console.error(erro.message);
  }
  createMovieCards(allMovies[0]);
}
function createMovieCards(arrayMovies) {
  const movies = document.querySelector(".movies");
  movies.innerHTML = "";

  arrayMovies.forEach((element) => {
    const movie = document.createElement("div");
    movie.classList.add("movie");
    movie.style.backgroundImage = `url(${element.poster_path ?? '../assets/imagem-indisponivel-para-produtos-sem-imagem_15_5.jpg'})`
    movie.id = element.id;

    const info = document.createElement("div");
    info.classList.add("movie__info");
    info.style.alignItems = "baseline"

    const title = document.createElement("span");
    title.classList.add("movie__title");
    title.innerText = element.title;

    const rating = document.createElement("span");
    rating.classList.add("movie__rating");
    rating.innerText = element.vote_average;
    rating.style.color = "#fff"

    const img = document.createElement("img");
    img.src = "../assets/estrela.svg";
    img.alt = "Estrela";

    movies.appendChild(movie);
    movie.appendChild(info);
    info.append(title, rating);
    rating.appendChild(img);

    movie.addEventListener("click", (event) => {
      if (event.target.id.length > 1)
        openModal(event.target.id);
    });
  });
}

const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");

function nextPage() {
  if (currentPage === 2) {
    currentPage = 0;
  } else {
    currentPage++;
  }
  createMovieCards(allMovies[currentPage]);
}
function prevPage() {
  if (currentPage === 0) {
    currentPage = 2;
  } else {
    currentPage--;
  }
  createMovieCards(allMovies[currentPage]);
}

const searchInput = document.querySelector(".input");

async function fetchMovie() {

  if (!searchInput.value)
    return viewMovieCards()

  try {

    const search = await apiAxios.get(`search/movie?language=pt-BR&include_adult=false&query=${searchInput.value}`);

    FillData(search.data.results)
    allMovies = [];

  } catch (erro) {
    console.error(erro.message);
    viewMovieCards()
  }
  createMovieCards(allMovies[0]);
  searchInput.value = "";
}
async function dayMovie() {
  try {
    const dayMovie = await apiAxios.get("discover/movie?language=pt-BR&include_adult=false");
    const movie = await apiAxios.get(`movie/${dayMovie.data.results[0].id}?language=pt-BR`);
    const trailer = await apiAxios.get(`movie/${dayMovie.data.results[0].id}/videos?language=pt-BR`);

    const highlightVideo = document.querySelector(".highlight__video");
    highlightVideo.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5) 100%, rgba(0, 0, 0, 0.5) 100%), url(${movie.data.backdrop_path})` ?? `url(${".src/assets/imagem-indisponivel-para-produtos-sem-imagem_15_5.jpg"})`;
    highlightVideo.style.backgroundSize = "cover";

    const highlightTitle = document.querySelector(".highlight__title");
    highlightTitle.innerText = movie.data.title;

    const highlightRating = document.querySelector(".highlight__rating");
    highlightRating.innerText = (movie.data.vote_average).toFixed(1);

    const highlightGenres = document.querySelector(".highlight__genres");
    highlightGenres.innerText = movie.data.genres.map((genres) => genres.name).join(", ");

    const highlightLaunch = document.querySelector(".highlight__launch");
    highlightLaunch.innerText = new Date(movie.data.release_date).toLocaleDateString(
      "pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });

    const highlightDescription = document.querySelector(".highlight__description");
    highlightDescription.innerText = movie.data.overview;

    const highlightVideoLink = document.querySelector(".highlight__video-link");
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${trailer.data.results[0].key}`;

  } catch (erro) {
    console.error(erro.message);
  }
}

const modal__close = document.querySelector(".modal__close");

async function openModal(movieId) {
  try {
    const movie = await apiAxios.get(`movie/${movieId}?language=pt-BR`);

    const openModal = document.querySelector(".modal");
    openModal.classList.remove("hidden");

    const title = document.querySelector(".modal__title");
    title.innerText = movie.data.title;

    const img = document.querySelector(".modal__img");
    img.src = movie.data.backdrop_path ?? "../assets/imagem-indisponivel-para-produtos-sem-imagem_15_5.jpg"

    const description = document.querySelector(".modal__description");
    description.innerText = movie.data.overview.length > 1 ? movie.data.overview : "Dados indisponíveis";

    const rating = document.querySelector(".modal__average");
    rating.innerText = movie.data.vote_average.toFixed(1);

    const modalGenres = document.querySelector(".modal__genres");
    modalGenres.innerText = "";

    movie.data.genres.forEach((genre) => {
      const modalGenre = document.createElement("span");

      modalGenre.innerText = genre.name;
      modalGenre.classList.add("modal__genre");
      modalGenres.appendChild(modalGenre);
    });

    modal__close.addEventListener("click", () => {
      document.querySelector(".modal").classList.add("hidden")
    });
    document.querySelector(".modal__body").addEventListener("click", () => {
      document.querySelector(".modal").classList.add("hidden");
    })
  } catch (erro) {
    console.error(erro.message);
  }
}

const body = document.querySelector("body");
const btnTheme = document.querySelector(".btn-theme");
const logo = document.querySelector(".logo");

const darkTheme = () => {
  currentTheme = "dark";
  searchInput.style.background = "#3E434D";
  searchInput.style.border = "1px solid #665F5F";
  logo.src = "../assets/logo.svg";
  btnTheme.src = "../assets/dark-mode.svg";
  btnPrev.src = "../assets/arrow-left-light.svg";
  btnNext.src = "../assets/arrow-right-light.svg";
  modal__close.src = "../assets/close.svg";
  body.style.setProperty("--background", "#1B2028");
  body.style.setProperty("--text-color", "#FFF");
  body.style.setProperty("--input-color", "#FFF");
  body.style.setProperty("--bg-secondary", "#2D3440");
  localStorage.setItem("theme", "dark");
};
const lightTheme = () => {
  currentTheme = "light";
  searchInput.style.background = "#fff";
  logo.src = "../assets/logo-dark.png";
  btnTheme.src = "../assets/light-mode.svg";
  btnPrev.src = "../assets/arrow-left-dark.svg";
  btnNext.src = "../assets/arrow-right-dark.svg";
  modal__close.src = "../assets/close-dark.svg";
  body.style.setProperty("--background", "#FFF");
  body.style.setProperty("--text-color", "#000");
  body.style.setProperty("--input-color", "#979797");
  body.style.setProperty("--bg-secondary", "#EDEDED");
  localStorage.setItem("theme", "light");
};
const changeTheme = () => {
  if (currentTheme === "light") {
    darkTheme();
  } else {
    lightTheme();
  }
};
function setTheme() {
  if (currentTheme === "light") {
    lightTheme();
  } else {
    darkTheme();
  }
}

btnNext.addEventListener("click", nextPage);
btnPrev.addEventListener("click", prevPage);
btnTheme.addEventListener("click", changeTheme);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    fetchMovie();
  }
});

viewMovieCards()
dayMovie()
setTheme()