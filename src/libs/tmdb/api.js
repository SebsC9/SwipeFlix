
const BASE = import.meta.env.VITE_TMDB_BASE_URL;
const KEY  = import.meta.env.VITE_TMDB_API_KEY;
const LANG = import.meta.env.VITE_TMDB_LANG || "en-US";

import { mapMovieDetails } from "./mapper";

//Obtiene los detalles completos de la pelicula o serie segun id
export async function getDetailById({ id, mediaType }) {
  if (!id) throw new Error("id requerido");

  //construye la url
  const path = `${mediaType === "tv" ? "tv" : "movie"}/${id}`;
  const url  = `${BASE}/${path}?api_key=${KEY}&language=${LANG}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);

  //convierte la respuesta en json
  const data = await res.json();
 
  //normaliza para m
  return mapMovieDetails(data);
}