import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Moviecard from "../components/Moviecard";
import { FaStar } from "react-icons/fa";
import { tmdb } from "../libs/http/tmdbClient";
import { mapMovieListItem } from "../libs/tmdb/mapper";
import { cargarWatchlist, guardarWatchlist, agregarAWatchlist } from "../libs/watchlist";

function Search() {
  const [q, setQ] = useState("");
  const [mediaType, setMediaType] = useState("movie");
  const [selected, setSelected] = useState(null);
  const [watchlist, setWatchlist] = useState(cargarWatchlist());

  //Manejo de carga, errores y exito(Tanstack) y axios para llamar y buscar en la API
  const {
    data: results = [],
    isFetching: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["search", mediaType, q],
    queryFn: async () => {
      const { data } = await tmdb.get(`/search/${mediaType}`, {
        params: { query: q, page: 1 },
      });
      const items = Array.isArray(data?.results) ? data.results : [];
      return items.map(mapMovieListItem);
    },
    enabled: false,
    keepPreviousData: true,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  //Funcion agregar a la watchlist
  function handleAgregarAWatchlist(movie) {
    const updated = agregarAWatchlist(watchlist, movie);
    setWatchlist(updated);
    guardarWatchlist(updated);
  }


  const movie = selected ? { ...selected, mediaType } : null;

  return (
    <>
      <section className="relative px-4 py-6">
        {/*Formulario de busqueda y seleccion de tipo*/}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) refetch();
          }}
          className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3"
        >
          <input
            type="text"
            placeholder="Buscar Película o Serie"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full sm:w-96 rounded-lg border border-[var(--color-border)] px-3 py-2 bg-transparent outline-none focus:ring-2 focus:ring-[var(--color-border)]/40"
          />

          <div className="flex items-center gap-2">
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 bg-transparent outline-none"
            >
              <option className="bg-[var(--color-background)]" value="movie">
                Películas
              </option>
              <option className="bg-[var(--color-background)]" value="tv">
                Series
              </option>
            </select>

            <button
              type="submit"
              className="rounded-lg border px-3 py-2 border-[var(--color-border)] hover:bg-[var(--color-border)] hover:text-[var(--color-background)] transition"
            >
              Buscar
            </button>
          </div>
        </form>

        {/*Manejo de carga, error y grilla de busqueda */}
        {error && (
          <p className="text-red-500 text-sm mb-3">
            {String(error.message || error)}
          </p>
        )}
        {loading && <p className="opacity-70 mb-3">Buscando...</p>}

        {results.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {results.map((it) => (
              <li
                key={`${it.type}-${it.id}`}
                className="group relative rounded-xl overflow-hidden border border-[var(--color-border)] cursor-pointer"
                onClick={() => setSelected(it)}
                title={it.titulo}
              >
                <div className="aspect-[2/3]">
                  {it.posterUrl ? (
                    <img
                      src={it.posterUrl}
                      alt={it.titulo}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full grid place-content-center text-sm opacity-60">
                      Sin Póster
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/*Renderizacion de moviecard para ver mas data de la pelicula buscada */}
        {movie && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelected(null)}
          >
            <div
              className="relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Moviecard key={`${movie.mediaType}-${movie.id}`} movie={movie} />

              {/*Agregar a watchlist desde search */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => handleAgregarAWatchlist(movie)}
                  className="cursor-pointer border-2 border-[var(--color-border)] p-5 rounded-full shadow-lg transition-transform duration-200 active:scale-90 active:bg-yellow-700 hover:scale-110 hover:bg-yellow-700"
                >
                  <FaStar className="text-yellow-500 text-4xl" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Search;
