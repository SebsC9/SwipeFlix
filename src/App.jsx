import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";


export default function App() {
  return (
    <div className="h-dvh bg-[var(--color-background)] text-white">
      <header className="sticky top-0 z-50">
        <div className="mx-auto w-full max-w-5xl px-2">
         <Navbar />
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden mx-auto w-full max-w-5xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </main>
    </div>
  );
}
