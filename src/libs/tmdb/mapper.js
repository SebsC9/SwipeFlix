//Manejo del poster
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const posterUrl = (path) =>
    path ? `${IMG_BASE}${path}` : null;

//usamos solo el año de estreno o 1ra emision
const getYear = (dateStr) => (dateStr ? String(dateStr).slice(0, 4) : "—");

//Mapea un resultado simple
const mapMovieListItem = (r) => {
    const isSerie = !!r.name || r.media_type === "tv";
    return {
            id: r.id,
            isSerie,
            titulo: isSerie ? r.name : r.title,
            año: isSerie ? getYear(r.first_air_date) : getYear(r.release_date),
            posterUrl: posterUrl(r.poster_path),
            rating: r.vote_average ?? null,
            descripcion: r.overview || "No hay descripción disponible.",
            tipo: isSerie ? "serie" : "película",
        };
};
export { mapMovieListItem };

//Mapea los detalles completos
const mapMovieDetails = (d) => {
    const isSerie = !!d.name;
    return {
        id: d.id,
        isSerie,
        titulo: isSerie ? d.name : d.title,
        año: isSerie ? getYear(d.first_air_date) : getYear(d.release_date),
        posterUrl: posterUrl(d.poster_path),
        rating: d.vote_average ?? null,
        descripcion: d.overview || "No hay descripción disponible.",
        genero: Array.isArray(d.genres)
            ? d.genres.map((g) => g.name).join(", ")
            : "Desconocido",
        duracion: !isSerie && d.runtime ? `${d.runtime} min` : "Desconocida",
        capitulos: isSerie && typeof d.number_of_episodes === "number" ? d.number_of_episodes : null,
        tipo: isSerie ? "serie" : "película",
    };
};
export { mapMovieDetails };