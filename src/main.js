const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY
  }
});

function likeMovie(movie) {
  const likedMovies = likedMovieList();

  if ( likedMovies[movie.id] ) {
    delete likedMovies[movie.id];
  } else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
  console.log(likedMovieList());
}

function likedMovieList() {
  return JSON.parse(localStorage.getItem('liked_movies') ?? '{}');
}

const lazyLoader = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if ( entry.isIntersecting || entry.isVisible ) {
      entry.target.setAttribute(
        'src',
        entry.target.getAttribute('data-img')
      );
    } else {
      entry.target.setAttribute('src', '');
    }
  });
});

function loadGenericList(container, movies, { lazyLoad=false, clean=true } = {}) {
  if ( clean ) {
    container.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const likedMovies = likedMovieList();

  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.alt = movie.title
    movieImg.setAttribute(
      lazyLoad ? 'data-img' : 'src',
      'https://image.tmdb.org/t/p/w300' + movie.poster_path
    );
    movieImg.addEventListener('error', () => {
      movieImg.setAttribute('src', '../img/404_error.jpg');
    });
    movieImg.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    });

    const movieBtn = document.createElement('button');
    movieBtn.classList.add('movie-like-btn');
    likedMovies[movie.id] && movieBtn.classList.toggle('movie-like-btn--liked');
    movieBtn.addEventListener('click', () => {
      movieBtn.classList.toggle('movie-like-btn--liked');
      likeMovie(movie);
      getLikedMovies();
    });
      
    if ( lazyLoad ) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer);
  });
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

  loadGenericList(trendingMoviesPreviewList, movies, true);
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
  maxPage = data.total_pages;
  headerCategoryTitle.innerHTML = name;

  loadGenericList(genericSection, movies, { lazyLoad: true, clean: true });
}

function getPaginatedMoviesByCategory(id) {
  return async function() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollInBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const isNotMaxPage = page < maxPage;

    if ( scrollInBottom && isNotMaxPage ) {
      page++;

      const { data } = await api('/discover/movie', {
        params: {
          with_genres: id,
          page
        }
      });
      const movies = data.results;

      loadGenericList(genericSection, movies, { lazyLoad: true, clean: false });
    }
  }
}

async function getMoviesBySearch(query) {
  const { data } = await api('/search/movie', {
    params: {
      query: query
    }
  });
  const movies = data.results;
  maxPage = data.total_pages;
  headerCategoryTitle.innerHTML = query;

  loadGenericList(genericSection, movies);
}

// Se crea un Closure para ejecutar la función que recibe el query al momento
// de asignarla a infiniteScroll, permitiendo guardar ese query para ejecutar
// después sólo la función asíncrona anidada.
function getPaginatedMoviesBySearch(query) {
  return async function() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollInBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const isNotMaxPage = page < maxPage;

    if ( scrollInBottom && isNotMaxPage ) {
      page++;

      const { data } = await api('/search/movie', {
        params: {
          query,
          page
        }
      });
      const movies = data.results;

      loadGenericList(genericSection, movies, { lazyLoad: true, clean: false });
    }
  }
}

async function getTrendingMovies() {
  const { data } = await api('/trending/movie/week');
  const movies = data.results;
  maxPage = data.total_pages;
  headerCategoryTitle.innerHTML = 'Tendencias';

  loadGenericList(genericSection, movies, { lazyLoad: true, clean: true });

  // const btnLoadMore = document.createElement('button');
  // btnLoadMore.innerText = 'Cargar más...';
  // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
  // genericSection.appendChild(btnLoadMore);
}

async function getPaginatedTrendingMovies() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  const scrollInBottom = (scrollTop + clientHeight) >= (scrollHeight - 15)
  const isNotMaxPage = page < maxPage;

  if ( scrollInBottom && isNotMaxPage ) {
    page++;
  
    const { data } = await api('/trending/movie/week', {
      params: {
        page
      }
    });
    const movies = data.results;

    loadGenericList(genericSection, movies, { lazyLoad: true, clean: false });
  }

  // const btnLoadMore = document.createElement('button');
  // btnLoadMore.innerText = 'Cargar más...';
  // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
  // genericSection.appendChild(btnLoadMore);
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


function getLikedMovies() {
  const likedMovies = likedMovieList();
  const moviesArray = Object.values(likedMovies);

  loadGenericList(likedMovieListContainer, moviesArray, { lazyLoad: true, clean: true });
}
