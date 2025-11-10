const KEY = "swipeflix_watchlist_key"
const IMG_BASE = "https://image.tmdb.org/t/p/w500";



function cargarWatchlist(){
 const data = localStorage.getItem(KEY)
 if (!data){
    return [];
 }
 return JSON.parse(data);
};

function guardarWatchlist(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
};

function existeEnWatchlist(list, id, type){
    const existe = list.find((item) => item.id === id && item.type === type);

    if (existe){
        return true;
    } else {
        return false;
    }
};

function normalizeForWatchlist(movie) {
  if (!movie || !movie.id) return null;

  const type =
    movie.type ||
    movie.mediaType ||
    (movie.first_air_date ? "tv" : "movie");

  const titulo = movie.titulo || movie.title || movie.name || "Sin título";
  
  const path =
    movie.posterUrl ||
    movie.poster_path ||
    movie.posterPath ||
    movie.backdrop_path ||
    null;

  const posterUrl = path?.startsWith("http")
    ? path
    : path
    ? `${IMG_BASE}${path}`
    : null;

  const rating =
    movie.rating ||
    movie.vote_average ||
    null;

  const descripcion =
    movie.descripcion ||
    movie.overview ||
    "No hay descripción disponible.";

  const año =
    movie.año ||
    (movie.release_date
      ? movie.release_date.slice(0, 4)
      : movie.first_air_date
      ? movie.first_air_date.slice(0, 4)
      : "—");

  return {
    id: movie.id,
    type,
    titulo,
    posterUrl,
    rating,
    descripcion,
    año,
    visto: !!movie.visto,
  };
}

function agregarAWatchlist(list, movie){
    const item = normalizeForWatchlist(movie);
    if (!item) return Array.isArray(list) ? list : [];
    const base = Array.isArray(list) ? list : [];
    if (existeEnWatchlist(base, item.id, item.type)) return base;
    return [...base, item];
}

function eliminarDeWatchlist(list, id, type){
    return list.filter(item => !(item.id === id && item.type === type));
}

function toggleVisto(list, id, type){
    return list.map(item =>{
        if (item.id === id && item.type === type){
            return { ...item, visto : !item.visto}
        }
        return item;
    })
}

export {existeEnWatchlist, guardarWatchlist, cargarWatchlist, agregarAWatchlist, eliminarDeWatchlist, toggleVisto}