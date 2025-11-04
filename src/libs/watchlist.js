function cargarWatchlist(){
 const data = localStorage.getItem("swipefilx_watchlist_key")
 if (!data){
    return [];
 }
 return JSON.parse(data);
};

function guardarWatchlist(list) {
    localStorage.setItem("swipeflix_watchlist_key", JSON.stringify(list));
};

function existeEnWatchlist(list, id, type){
    const existe = list.find((item) => item.id === id && item.type === type);

    if (existe){
        return true;
    } else {
        return false;
    }
};

function agregarAWatchlist(list, movie){
    if (existeEnWatchlist(list, movie.id, movie.type)){
        return list;
    }
    const nuevaLista = [...list, movie]
    return nuevaLista
}
export {existeEnWatchlist, guardarWatchlist, cargarWatchlist, agregarAWatchlist}