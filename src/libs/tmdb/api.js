
const BASE = import.meta.env.VITE_TMDB_BASE_URL;
const KEY  = import.meta.env.VITE_TMDB_API_KEY;
const LANG = import.meta.env.VITE_TMDB_LANG || "es-AR";

import { mapMovieDetails } from "./mapper";

export async function getDetailById({ id, isSerie }) {
  const path = isSerie ? `/tv/${id}` : `/movie/${id}`;
  const url = `${BASE}${path}?api_key=${KEY}&language=${LANG}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB respondió con error");
  const data = await res.json();

  return mapMovieDetails(data);
}