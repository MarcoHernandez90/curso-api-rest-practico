const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY
  }
});

function loadGenericList(container, movies) {
  container.innerHTML = '';

  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    movieContainer.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    });

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.src = 'https://image.tmdb.org/t/p/w300' + movie.poster_path;

    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createCategories(container, categories) {
  container.innerHTML = '';

  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    categoryContainer.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    
    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.id = 'id' + category.id;
    
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

async function getTrendingMoviesPreview() {
  const { data } = await api('/trending/movie/week');
  const movies = data.results;

  loadGenericList(trendingMoviesPreviewList, movies);
}

async function getCategoriesPreview() {
  const { data } = await api('/genre/movie/list');
  const categories = data.genres;
  
  createCategories(categoriesPreviewList, categories);
}

async function getMoviesByCategory(id, name) {
  const { data } = await api('/discover/movie', {
    params: {
      with_genres: id
    }
  });
  const movies = data.results;
  headerCategoryTitle.innerHTML = name;

  loadGenericList(genericSection, movies);
}

async function getMoviesBySearch(query) {
  const { data } = await api('/search/movie', {
    params: {
      query: query
    }
  });
  const movies = data.results;
  headerCategoryTitle.innerHTML = query;

  loadGenericList(genericSection, movies);
}

async function getTrendingMovies() {
  const { data } = await api('/trending/movie/week');
  const movies = data.results;
  headerCategoryTitle.innerHTML = 'Tendencias';

  loadGenericList(genericSection, movies);
}

async function getMovieById(id) {
  const { data: movie } = await api('/movie/' + id);
  console.log(movie);

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = (movie.vote_average).toFixed(1);

  const moviePosterUrl = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(https://image.tmdb.org/t/p/w500${movie.poster_path})
  `;

  headerSection.style.background = moviePosterUrl;

  createCategories(movieDetailCategoriesList, movie.genres);
  getRelatedMovies(id);
}

async function getRelatedMovies(id) {
  const { data } = await api('/movie/' + id + '/similar');
  const relatedMovies = data.results;
  relatedMoviesContainer.innerHTML = '';

  loadGenericList(relatedMoviesContainer, relatedMovies);

  relatedMoviesContainer.scroll({ left: 0 });
}
