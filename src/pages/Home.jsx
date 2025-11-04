import { useEffect, useState } from 'react';
import Moviecard from '../components/Moviecard';
import { FaStar, FaTimes } from "react-icons/fa";
import { mapMovieListItem } from '../libs/tmdb/mapper';
import { agregarAWatchlist, cargarWatchlist, guardarWatchlist } from "../libs/watchlist";

function Home() {

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaType, setMediaType] = useState("movie")
  const [watchlist, setWatchlist] = useState(cargarWatchlist())

  const BASE = import.meta.env.VITE_TMDB_BASE_URL;
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const LANG = import.meta.env.VITE_TMDB_LANG;

  async function fetchRandom() {
    try {
      setLoading(true);
      setError(null);

      const randomPage = Math.floor(Math.random() * 500) + 1;

      const url = `${BASE}/discover/${mediaType}?api_key=${API_KEY}&language=${LANG}&page=${randomPage}`;
      const response = await fetch(url);
      const data = await response.json();

      const lista = data.results || [];
      if (lista.length === 0) {
        throw new Error("No se encontraron resultados.");
      }
      const pick = lista[Math.floor(Math.random() * lista.length)];

      const mapped = mapMovieListItem(pick);
      setMovie({ ...mapped, mediaType });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRandom(); }, [mediaType]);

  const handleDislike = () => {
    fetchRandom();
  };

  const handleLike = () => {
        if (movie) {
      const updateWatchlist = agregarAWatchlist(watchlist, movie);
      setWatchlist(updateWatchlist)
      guardarWatchlist(updateWatchlist)

      console.log("Watchlist actualizada", updateWatchlist)
    }
    fetchRandom();
  };

  return (
    <>
      <div className="relative h-full w-full overflow-hidden">

      <div className="flex justify-center mb-2">
        <button
          onClick={() => setMediaType(mediaType === "movie" ? "tv" : "movie")}
          className="
            flex items-center justify-center gap-2
            px-4 py-2 rounded-full
            border-2 border-[var(--color-border)]
            text-[var(--color-button)] font-medium
            transition-all duration-300
            hover:scale-105 active:scale-95"
        >
          <span className="transition-opacity duration-300">
            {mediaType === "movie" ? "Películas" : "Series"}
          </span>
        </button>
      </div>

        <div className="flex flex-col items-center justify-start h-full pb-32">
          {loading && !movie && (
            <div className="h-[calc(100dvh-180px)] max-h-[720px] aspect-[2/3] w-auto rounded-2xl border-4 border-[var(--color-border)] bg-neutral-900 animate-pulse" />
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {movie && <Moviecard key={`${movie.mediaType}-${movie.id}`} movie={movie}/>}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center z-40 gap-20">
          <button
            className="border-2 border-[var(--color-border)] p-5 rounded-full shadow-lg transition-transform duration-200 active:scale-90 active:bg-red-950 hover:scale-110 hover:bg-red-950"
            onClick={handleDislike}
          >
            <FaTimes className="text-red-500 text-4xl" />
          </button>
          <button
            className="border-2 border-[var(--color-border)] p-5 rounded-full shadow-lg transition-transform duration-200 active:scale-90 active:bg-yellow-700 hover:scale-110 hover:bg-yellow-700"
            onClick={handleLike}
          >
            <FaStar className="text-yellow-500 text-4xl" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
 