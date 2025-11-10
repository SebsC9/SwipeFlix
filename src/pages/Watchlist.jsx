import { useEffect, useState } from "react";
import Moviecard from "../components/Moviecard";
import { cargarWatchlist, guardarWatchlist, eliminarDeWatchlist, toggleVisto } from "../libs/watchlist";
import { FaEye, FaTrash } from "react-icons/fa";

function Watchlist() {
  const [list, setList] = useState(() => cargarWatchlist());
  const [search, setSearch] = useState("");
  const [orderKey, setOrderKey] = useState("added");
  const [orderDir, setOrderDir] = useState("desc");
  const [selected, setSelected] = useState(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    guardarWatchlist(list);
  }, [list]);

  const filtered = list.filter((it) => {
    const t = (it.title || it.titulo || it.name || "").toLowerCase();
    const matchesSearch = t.includes(search.trim().toLowerCase());
    const matchesType =
      filterType === "all" ||
      (filterType === "movie" && (it.type === "movie" || it.tipo === "película")) ||
      (filterType === "tv" && (it.type === "tv" || it.tipo === "serie"));
    return matchesSearch && matchesType;
  });

  

  const sorted = (() => {
    const base = [...filtered];
    const dir = orderDir === "asc" ? 1 : -1;

    if (orderKey === "added") {
      return orderDir === "asc" ? base : base.reverse();
    }

    if (orderKey === "title") {
      return base.sort((a, b) =>
        ((a.title || a.titulo || a.name || "").localeCompare(
          (b.title || b.titulo || b.name || ""),
          undefined,
          { sensitivity: "base" }
        )) * dir
      );
    }

    if (orderKey === "rating") {
      const val = (x) =>
        typeof x.vote_average === "number"
          ? x.vote_average
          : typeof x.rating === "number"
          ? x.rating
          : -Infinity;
      return base.sort((a, b) => (val(a) - val(b)) * dir);
    }

    if (orderKey === "date") {
      const toMs = (x) => {
        const s = x.release_date || x.first_air_date || "";
        const ms = Date.parse(s);
        if (!Number.isNaN(ms)) return ms;
        const y = x.año ? Number(String(x.año).slice(0, 4)) : NaN;
        return Number.isFinite(y) ? Date.parse(`${y}-01-01`) : -Infinity;
      };
      return base.sort((a, b) => (toMs(a) - toMs(b)) * dir);
    }

    if (orderKey === "visto") {
      const v = (x) => (x.visto ? 1 : 0);
      return base.sort((a, b) => (v(a) - v(b)) * dir);
    }

    return base;
  })();

  const handleSelect = (item) => setSelected(item);

  const handleEliminar = (id, type) => {
    setList((prev) => eliminarDeWatchlist(prev, id, type));
    setSelected((cur) => (cur && cur.id === id && cur.type === type ? null : cur));
  };

  const handleToggleVisto = (id, type) => {
    setList((prev) => toggleVisto(prev, id, type));
    setSelected((cur) =>
      cur && cur.id === id && cur.type === type ? { ...cur, visto: !cur.visto } : cur
    );
  };

  const toMoviecard = (it) => ({
    ...it,
    mediaType: it.type || it.media_type,
    posterPath: it.posterUrl || null,
    backdropPath: null,
  });

  const movie = selected ? toMoviecard(selected) : null;

  return (
    <section className=" relative px-4 py-6">
      <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-3">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 rounded-lg border border-[var(--color-border)] px-3 py-2 bg-transparent outline-none focus:ring-2 focus:ring-[var(--color-border)]/40"
        />

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border-[var(--color-border)] rounded-lg border px-3 py-2 bg-transparent outline-none"
          >
            <option className="bg-[var(--color-background)]" value="all">
              Todas
            </option>
            <option className="bg-[var(--color-background)]" value="movie">
              Películas
            </option>
            <option className="bg-[var(--color-background)]" value="tv">
              Series
            </option>
          </select>

          <select
            value={orderKey}
            onChange={(e) => setOrderKey(e.target.value)}
            className="border-[var(--color-border)] rounded-lg border px-3 py-2 bg-transparent outline-none"
          >
            <option 
             className="bg-[var(--color-background)]"
             value="added">
              Orden de agregado
              </option>
            <option 
             className="bg-[var(--color-background)]"
             value="title">
             Título
            </option>
            <option
              className="bg-[var(--color-background)]"
              value="rating">
              Rating
              </option>
            <option
             className="bg-[var(--color-background)]"
             value="date">
              Fecha
              </option>
            <option
             className="bg-[var(--color-background)]"
             value="visto">
              Visto/No visto
              </option>
          </select>

          <button
            onClick={() => setOrderDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="border-[var(--color-border)] rounded-lg border px-3 py-2 transition cursor-pointer"
          >
            {orderDir === "asc" ? "ASC" : "DESC"}
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="opacity-70 text-center py-10">
          {list.length ? `Sin resultados para “${search}”.` : "No tenés nada guardado aún."}
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {sorted.map((it) => {
            const title = it.title || it.name || it.titulo || "Sin título";
            const poster = it.posterUrl || null;
            const visto = !!it.visto;

            return (
              <li
                key={`${it.type}-${it.id}`}
                className="group relative rounded-xl overflow-hidden border border-[var(--color-border)] cursor-pointer"
                onClick={() => handleSelect(it)}
                title={title}
              >
                <div className={`aspect-[2/3] ${visto ? "opacity-70" : ""}`}>
                  {poster ? (
                    <img src={poster} alt={title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full grid place-content-center text-sm opacity-60">
                      Sin póster
                    </div>
                  )}
                </div>

                {visto && (
                  <span className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full bg-black/70 border backdrop-blur">
                    Visto ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {movie && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" onClick={(e) => e.stopPropagation()}>
            <Moviecard key={`${movie.mediaType}-${movie.id}`} movie={movie} />
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center z-50 gap-20">
            <button
              aria-label={movie.visto? "Marcar como no visto" : "Marcar como visto"}
              className="cursor-pointer border-2 border-[var(--color-border)] p-5 rounded-full shadow-lg transition-transform duration-200 active:scale-90 active:bg-green-900 hover:scale-110 hover:bg-green-900"
              onClick={() => handleToggleVisto(movie.id, movie.mediaType || movie.type)}
              title={movie.visto ? "Marcar como no visto" : "Marcar como visto"}
            >
              <FaEye className="text-green-400 text-3xl" />
            </button>

            <button
              aria-label="Eliminar de la Watchlist"
              className="cursor-pointer border-2 border-[var(--color-border)] p-5 rounded-full shadow-lg transition-transform duration-200 active:scale-90 active:bg-red-950 hover:scale-110 hover:bg-red-950"
              onClick={() => handleEliminar(movie.id, movie.mediaType || movie.type)}
              title="Eliminar de la watchlist"
            >
              <FaTrash className="text-red-500 text-3xl" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Watchlist;
