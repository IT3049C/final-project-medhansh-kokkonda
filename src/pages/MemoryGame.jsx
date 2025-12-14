import { useState, useEffect, useContext } from "react";
import { PlayerContext } from "../context/PlayerContext.jsx";

const ICONS = ["🍎", "🍇", "🍋", "🍒", "🍉", "🥝", "🥥", "🍑"];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function MemoryGame() {
  const { playerName } = useContext(PlayerContext);

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  function resetGame() {
    const deck = shuffle([...ICONS, ...ICONS]);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  }

  function flipCard(index) {
    if (flipped.length === 2) return;
    if (flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;

      if (cards[first] === cards[second]) {
        setTimeout(() => {
          setMatched((prev) => [...prev, first, second]);
          setFlipped([]);
        }, 400);
      } else {
        setTimeout(() => setFlipped([]), 700);
      }
    }
  }

  return (
    <div className="page-container">
      <div className="frosted-card" style={{ textAlign: "center" }}>
        <h1>Memory Cards</h1>
        <p style={{ marginTop: 4 }}>
          Player: <b>{playerName || "Guest"}</b>
        </p>
        <p style={{ opacity: 0.85, marginTop: 8 }}>Flip and match card pairs.</p>
        <p style={{ marginTop: "10px", fontWeight: 600 }}>Moves: {moves}</p>

        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 80px)",
            gap: "14px",
            justifyContent: "center",
          }}
        >
          {cards.map((icon, index) => {
            const isFlipped =
              flipped.includes(index) || matched.includes(index);

            return (
              <div
                key={index}
                onClick={() => flipCard(index)}
                role="button"
                aria-label={`memory card ${index}`}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "2rem",
                  cursor: "pointer",
                  background: isFlipped
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(148,163,184,0.45)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  transition: "all 0.18s ease",
                  boxShadow: isFlipped
                    ? "0 16px 32px rgba(15,23,42,0.45)"
                    : "0 8px 20px rgba(15,23,42,0.35)",
                }}
              >
                {isFlipped ? icon : ""}
              </div>
            );
          })}
        </div>

        <button style={{ marginTop: "22px" }} onClick={resetGame}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default MemoryGame;
