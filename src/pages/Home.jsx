import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Moviecard from "../components/Moviecard";
import { FaStar, FaTimes } from "react-icons/fa";
import { tmdb } from "../libs/http/tmdbClient";
import { mapMovieListItem } from "../libs/tmdb/mapper";
import { agregarAWatchlist, cargarWatchlist, guardarWatchlist } from "../libs/watchlist";

// Elige un elemento del array de randompage
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function Home() {
  const [mediaType, setMediaType] = useState("movie");
  const [watchlist, setWatchlist] = useState(() => cargarWatchlist());

  //TanStack Query, recibe pelicula o serie aleatoria
  const {
    data: movie,
    isFetching: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["random", mediaType],
    queryFn: async () => {
      const randomPage = Math.floor(Math.random() * 500) + 1; //genera una pagina random
      const { data } = await tmdb.get(`/discover/${mediaType}`, {
        params: { page: randomPage }, //pide la pagina de resultaedos, del tipo seleccionado
      });
      const items = Array.isArray(data?.results) ? data.results : [];
      if (!items.length) throw new Error("No se encontraron resultados.");

      const validItems =items.filter(
        (item) =>
          item.poster_path &&
          item.overview &&
          item.vote_average > 5
      );

      if (!validItems) throw new Error("Contenido insuficiente, rentenarndo..")

      const pick = pickRandom(validItems); //elige una serie/pelicula

      return { ...mapMovieListItem(pick), mediaType };
    },
    keepPreviousData: true,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  //Dislike
  const handleDislike = () => {
    refetch();
  };

  //Like y agregar a la watchlist
  const handleLike = () => {
    if (!movie) return;
    const updated = agregarAWatchlist(watchlist, movie);
    setWatchlist(updated);
    guardarWatchlist(updated);
    refetch();
  };

  return (
    <>
      <div className="relative h-full w-full overflow-hidden">
        
        {/*Boton para alternar entre series y peliculas*/}
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setMediaType(mediaType === "movie" ? "tv" : "movie")}
            className="
              flex items-center justify-center gap-2
              px-4 py-2 rounded-full cursor-pointer
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

        {/*Manejo de carga, errores y renderizacion de moviecard*/}
        <div className="flex flex-col items-center justify-start h-full pb-32">
          {loading && !movie && (
            <div className="h-[calc(100dvh-180px)] max-h-[720px] aspect-[2/3] w-auto rounded-2xl border-4 border-[var(--color-border)] bg-neutral-900 animate-pulse" />
          )}
          {error && <p className="text-red-500 text-sm">{String(error.message || error)}</p>}
          {movie && <Moviecard key={`${movie.mediaType}-${movie.id}`} movie={movie} />}
        </div>

        {/*Boton like y dislike*/}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center z-40 gap-20">
          <button
            className="cursor-pointer border-2 border-[var(--color-border)] p-5 rounded-full shadow-lg transition-transform duration-200 active:scale-90 active:bg-red-950 hover:scale-110 hover:bg-red-950"
            onClick={handleDislike}
          >
            <FaTimes className="text-red-500 text-4xl" />
          </button>
          <button
            className="cursor-pointer border-2 border-[var(--color-border)] p-5 rounded-full shadow-lg transition-transform duration-200 active:scale-90 active:bg-yellow-700 hover:scale-110 hover:bg-yellow-700"
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