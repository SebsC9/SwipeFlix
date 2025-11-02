import React from 'react';
import Moviecard from '../components/Moviecard';
import { FaStar, FaTimes } from "react-icons/fa";

function Home() {
  return (
    <>
      <div>
        <Moviecard />
      </div>
      <div className="fixed bottom-20 md:bottom-12 left-1/2 -translate-x-1/2 flex justify-center gap-32">
        <div className="">
          <button className="border-2 border-[var(--color-border)] p-5 rounded-full shadow-lg transition-transform duration-200 active:scale-90  active:bg-red-950 hover:scale-110 hover:bg-red-950">
            <FaTimes className="text-red-500 text-4xl" />
          </button>
        </div>
        <div>
          <button className="border-2 border-[var(--color-border)] p-5 rounded-full shadow-lg transition-transform duration-200 active:scale-90  active:bg-yellow-700 hover:scale-110 hover:bg-yellow-700">
            <FaStar className="text-yellow-500 text-4xl" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
 