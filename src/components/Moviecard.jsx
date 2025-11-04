import { useState } from "react";
import { FaAngleUp, FaImdb } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getDetailById } from "../libs/tmdb/api.js";


function Moviecard({ movie }) {
  const [isOpen, setIsOpen] = useState(false);
  const isSerie = movie.mediaType === "tv";

  const { data: d, isLoading, isError, error } = useQuery({
    queryKey: ["detalle", movie, movie.mediaType],
    queryFn: () => getDetailById({ id: movie.id, mediaType: movie.mediaType }),
    enabled: !!movie?.id && !!movie.mediaType,
    staleTime: 30 * 60_000,
  });

  if (!movie?.id || !movie?.mediaType) return null;

  function handleClick(){
    setIsOpen(!isOpen)
  }

  return (
    <div className="flex justify-center">
      <div
        className="
          relative mx-auto
          h-[calc(100dvh-260px)] max-w-[420px]
          aspect-[2/3] w-auto
          rounded-2xl overflow-hidden
          border-4 border-[var(--color-border)]
          text-white shadow-lg z-10
        "
      >
        {isLoading ? (
          <div className="w-full h-full bg-neutral-900 animate-pulse" />
        ) : isError ? (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-sm text-red-400">
            {error.message}
          </div>
        ) : (
          <img
            className="w-full h-full object-cover"
            src={d?.posterUrl}
            alt={d?.titulo || 'Poster'}
            loading="lazy"
          />
        )}

        <div
          className={`absolute left-4 right-4 bg-stone-700/80 backdrop-blur-sm p-3 rounded-lg flex justify-between items-center transition-all duration-300 ${
            isOpen ? 'bottom-64' : 'bottom-4'
          }`}
        >
          <div>
            <h2 className=" text-xl font-bold  text-white tracking-widest">
              {d?.titulo ? `${d.titulo} (${d.año || '—'})` : isLoading ? 'Cargando…' : '—'}
            </h2>
            <p className="text-white text-sm">{d?.tipo || (isSerie ? 'serie' : 'película')}</p>
            <p className="text-white text-sm"><span className="text-amber-400">IMDb</span> {d?.rating ?? d?.puntuacion ?? '—'}</p>
          </div>
          <button
            onClick={handleClick}
            className="border-2 border-white p-3 rounded-full shadow-lg transition-transform duration-300 active:scale-90 hover:scale-110 hover:bg-stone-800"
            aria-label="toggle details"
          >
            <FaAngleUp
              className={`text-white text-2xl transition-transform duration-300 ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 bg-stone-700/80 backdrop-blur-sm p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          } h-56 md:h-64`}
        >
          <p className="text-white text-sm leading-relaxed">Género: {d?.genero || '—'}</p>
          <p className="text-white text-sm leading-relaxed mt-1">
            {isSerie ? `Capítulos: ${d?.capitulos ?? '—'}` : `Duración: ${d?.duracion ?? '—'}`}
          </p>
          <p className="text-white text-sm leading-relaxed mt-2">{d?.descripcion || '—'}</p>
        </div>
      </div>
    </div>
  );
}

export default Moviecard;
