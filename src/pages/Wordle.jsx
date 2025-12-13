import { useState, useEffect, useContext } from "react";
import { PlayerContext } from "../context/PlayerContext.jsx";

const ROWS = 6;
const COLS = 5;

function Wordle() {
  const { playerName } = useContext(PlayerContext);

  const [answer, setAnswer] = useState("");
  const [board, setBoard] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );
  const [colors, setColors] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );

  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [shake, setShake] = useState(false);
  const [bounceCell, setBounceCell] = useState(null);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  // Random 5-letter word
  useEffect(() => {
    fetch("https://random-word-api.herokuapp.com/word?length=5")
      .then((res) => res.json())
      .then((data) => setAnswer(data[0].toUpperCase()))
      .catch(() => setAnswer("APPLE"));
  }, []);

  // Keyboard input
  useEffect(() => {
    function handleKey(e) {
      if (gameOver) return;
      const key = e.key.toUpperCase();

      if (key === "ENTER") submitGuess();
      else if (key === "BACKSPACE") deleteLetter();
      else if (/^[A-Z]$/.test(key)) addLetter(key);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  function addLetter(letter) {
    if (col >= COLS) return;

    const updated = board.map((r) => [...r]);
    updated[row][col] = letter;
    setBoard(updated);

    setBounceCell({ row, col });
    setTimeout(() => setBounceCell(null), 200);

    setCol(col + 1);
  }

  function deleteLetter() {
    if (col === 0) return;

    const updated = board.map((r) => [...r]);
    updated[row][col - 1] = "";
    setBoard(updated);
    setCol(col - 1);
  }

  function submitGuess() {
    if (col < COLS) {
      setMessage("Not enough letters.");
      triggerShake();
      return;
    }

    const guess = board[row].join("");
    const rowColors = Array(COLS).fill("gray");
    let remaining = answer.split("");

    // Greens
    for (let i = 0; i < COLS; i++) {
      if (guess[i] === answer[i]) {
        rowColors[i] = "green";
        remaining[i] = null;
      }
    }

    // Yellows
    for (let i = 0; i < COLS; i++) {
      if (rowColors[i] === "gray" && remaining.includes(guess[i])) {
        rowColors[i] = "gold";
        remaining[remaining.indexOf(guess[i])] = null;
      }
    }

    const newColors = colors.map((r) => [...r]);
    newColors[row] = rowColors;
    setColors(newColors);

    if (guess === answer) {
      setMessage(`Correct! Nice job${playerName ? ", " + playerName : ""}.`);
      setGameOver(true);
      return;
    }

    if (row === ROWS - 1) {
      setMessage(`Out of guesses! Word: ${answer}`);
      setGameOver(true);
      return;
    }

    setRow(row + 1);
    setCol(0);
    setMessage("");
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 350);
  }

  return (
    <div className="page-container">
      <div className="frosted-card" style={{ textAlign: "center" }}>
        <h1>Wordle</h1>
        {playerName && <p style={{ marginTop: 4 }}>Player: {playerName}</p>}

        <div
          className={shake ? "shake-row" : ""}
          style={{
            marginTop: "24px",
            display: "grid",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {board.map((r, rIndex) => (
            <div key={rIndex} style={{ display: "flex", gap: "10px" }}>
              {r.map((letter, cIndex) => {
                const isBounce =
                  bounceCell &&
                  bounceCell.row === rIndex &&
                  bounceCell.col === cIndex;

                return (
                  <div
                    key={cIndex}
                    className={`tile ${colors[rIndex][cIndex]} ${
                      isBounce ? "bounce" : ""
                    }`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {message && (
          <h3 style={{ marginTop: "18px", fontSize: "0.95rem" }}>{message}</h3>
        )}
      </div>
    </div>
  );
}

export default Wordle;
