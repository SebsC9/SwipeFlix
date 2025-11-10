const KEY = "swipeflix_watchlist_key"

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

const normalizeForWatchlist = (movie) => {
  if (!movie || movie.id == null) return null;

  const type =
    movie.type ??
    movie.mediaType ??
    movie.media_type ??
    (movie.first_air_date ? "tv" : "movie");

  return {
    id: movie.id,
    type,
    title: movie.title ?? movie.name ?? "",
    name: movie.name ?? null,
    poster_path:
      movie.poster_path ??
      movie.posterPath ??
      movie.backdrop_path ??
      movie.backdropPath ??
      null,
    vote_average: movie.vote_average ?? movie.voteAverage ?? null,
    release_date: movie.release_date ?? movie.releaseDate ?? null,
    first_air_date: movie.first_air_date ?? movie.firstAirDate ?? null,
    visto: false,
  };
};

function agregarAWatchlist(list, movie){
    if (existeEnWatchlist(list, movie.id, movie.type)){
        return list;
    }
    const nuevaLista = [...list, { ...movie, visto: false}];
    return nuevaLista
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