let page = 1;
let maxPage;
let infiniteScroll;

searchFormBtn.addEventListener('click', () => {
  location.hash = '#search=' + searchFormInput.value;
});

trendingBtn.addEventListener('click', () => {
  location.hash = '#trends';
});

arrowBtn.addEventListener('click', () => {
  if ( document.referrer.indexOf('http://127.0.0.1') >= 0 ) {
    history.back();
  } else {
    location.hash = '';
  }
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, { passive: false });

function navigator() {
  console.log({ location });

  if ( infiniteScroll ) {
    window.removeEventListener('scroll', infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }

  if ( location.hash.startsWith('#trends') ) {
    trendsPage();
  } else if ( location.hash.startsWith('#search=') ) {
    searchPage();
  } else if ( location.hash.startsWith('#movie=') ) {
    moviesDetailsPage();
  } else if ( location.hash.startsWith('#category=') ) {
    categoriesPage();
  } else {
    homePage();
  }

  if ( infiniteScroll ) {
    window.addEventListener('scroll', infiniteScroll, { passive: false });
  }
}

function trendsPage() {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  likedMovieListSection.classList.add('inactive');

  getTrendingMovies();

  infiniteScroll = getPaginatedTrendingMovies;
}

function searchPage() {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  likedMovieListSection.classList.add('inactive');

  const hashQuery = location.hash.split('=')[1];
  getMoviesBySearch(hashQuery);

  infiniteScroll = getPaginatedMoviesBySearch(hashQuery);
}

function moviesDetailsPage() {
  const hashQuery = location.hash.split('=')[1];
  const id = hashQuery.split('-')[0];

  headerSection.classList.add('header-container--long');
  // headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');
  
  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');
  likedMovieListSection.classList.add('inactive');

  getMovieById(id);
}

function categoriesPage() {
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');
  likedMovieListSection.classList.add('inactive');

  const hashQuery = location.hash.split('=')[1];
  const id = hashQuery.split('-')[0];
  const name = hashQuery.split('-')[1];
  getMoviesByCategory(id, name);

  infiniteScroll = getPaginatedMoviesByCategory(id);
}

function homePage() {
  console.log('Home');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive');
  arrowBtn.classList.remove('header-arrow-white');
  headerTitle.classList.remove('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');
  likedMovieListSection.classList.remove('inactive');

  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();
}
