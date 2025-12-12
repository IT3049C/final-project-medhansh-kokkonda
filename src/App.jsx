import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

// Pages (we will create these next)
import Hub from './pages/Hub.jsx';
import RPS from './pages/RPS.jsx';
import TicTacToe from './pages/TicTacToe.jsx';
import Wordle from './pages/Wordle.jsx';
import MemoryGame from './pages/MemoryGame.jsx'; // your 4th game

function App() {
  return (
    <div id="app">
      <nav>
        <Link to="/">Home</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/rps" element={<RPS />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/wordle" element={<Wordle />} />
        <Route path="/memory" element={<MemoryGame />} />
      </Routes>
    </div>
  );
}

export default App;
