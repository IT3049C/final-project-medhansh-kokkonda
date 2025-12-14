import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext.jsx";

import Hub from "./pages/Hub.jsx";
import RPS from "./pages/RPS.jsx";
import TicTacToe from "./pages/TicTacToe.jsx";
import Wordle from "./pages/Wordle.jsx";
import MemoryGame from "./pages/MemoryGame.jsx";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div id="app">
      <header className="app-nav">
        <div className="app-logo">GameHub</div>
        <div className="app-nav-right">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/rps" element={<RPS />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/wordle" element={<Wordle />} />
          <Route path="/memory" element={<MemoryGame />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
