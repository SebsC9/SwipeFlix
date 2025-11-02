import React, { useState } from "react";
import { FaAngleUp } from "react-icons/fa";

function Moviecard() {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="flex justify-center">
      <div className="relative mx-auto my-6 w-full max-w-[420px] aspect-[2/3] rounded-2xl overflow-hidden border-4 border-[var(--color-border)] text-white shadow-lg">

        <img
          className="w-full h-full object-cover rounded-lg"
          src="/src/assets/Poster.Ejemplo.jpg"
          alt="Poster de Pelicula"
        />

        <div
          className={`absolute left-4 right-4 bg-stone-700 opacity-80 backdrop-blur-sm p-3 rounded-lg flex justify-between items-center transition-all duration-300 ${
            isOpen ? "bottom-65" : "bottom-4"
          }`}
        >
          <div>
            <h2 className="text-xl font-bold text-white">
              Avengers End Game (2019)
            </h2>
            <p className="text-white">Categoría1 categoría2 categoría3</p>
            <p className="text-white">8/10</p>
          </div>
          <button
            onClick={handleClick}
            className="border-2 border-white p-3 rounded-full shadow-lg transition-transform duration-300 active:scale-90 hover:scale-110 hover:bg-stone-800"
          >
            <FaAngleUp
              className={`text-white text-2xl transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>
        <div
          className={`absolute bottom-0 left-0 right-0 bg-stone-700 opacity-80 backdrop-blur-sm p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-y-0" : "translate-y-full"
          } h-56 md:h-64`}
        >
          <p className="text-white text-sm leading-relaxed">
            Aca iria todo lo que seria la descripcion de la pelicula, sobre que trata.
          </p>
          <p className="text-white text-sm leading-relaxed">
            Aca iria lo que seria el cast de la pelicula, los actores que participan.
          </p>
            <p className="text-white text-sm leading-relaxed">
            Aca iria lo que seria la duracion de la pelicula.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Moviecard;