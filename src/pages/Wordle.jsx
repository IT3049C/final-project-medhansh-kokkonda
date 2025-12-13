import { useState, useEffect, useContext } from "react";
import { PlayerContext } from "../context/PlayerContext.jsx";

const WORD_API = "https://random-word-api.herokuapp.com/word?length=5";

function Wordle() {
  const { playerName } = useContext(PlayerContext);

  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentRow, setCurrentRow] = useState(0);
  const [input, setInput] = useState("");
  const [shakeRow, setShakeRow] = useState(false);
  const [message, setMessage] = useState("");

  // ─────────────────────────────────────────────
  // FETCH RANDOM TARGET WORD
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchWord() {
      try {
        const res = await fetch(WORD_API);
        const data = await res.json();
        setTargetWord(data[0].toUpperCase());
      } catch {
        setTargetWord("APPLE"); // fallback
      }
    }
    fetchWord();
  }, []);

  // ─────────────────────────────────────────────
  // VALIDATE WORD USING DICTIONARY API
  // ─────────────────────────────────────────────
  async function isValidWord(word) {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );
      return res.ok;
    } catch {
      return false;
    }
  }

  // ─────────────────────────────────────────────
  // HANDLE TYPING
  // ─────────────────────────────────────────────
  function handleKeyPress(e) {
    if (currentRow >= 6) return;

    if (/^[A-Za-z]$/.test(e.key)) {
      if (input.length < 5) {
        setInput((prev) => prev + e.key.toUpperCase());
      }
    } else if (e.key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
    } else if (e.key === "Enter") {
      submitGuess();
    }
  }

  // Listen for keyboard input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  // ─────────────────────────────────────────────
  // SUBMIT GUESS
  // ─────────────────────────────────────────────
  async function submitGuess() {
    if (input.length < 5) {
      triggerShake("Not enough letters");
      return;
    }

    const valid = await isValidWord(input);
    if (!valid) {
      triggerShake("Invalid word");
      return;
    }

    const updated = [...guesses];
    updated[currentRow] = input;
    setGuesses(updated);

    if (input === targetWord) {
      setMessage("You guessed it!");
    } else if (currentRow === 5) {
      setMessage(`Game over — Word: ${targetWord}`);
    }

    setCurrentRow((r) => r + 1);
    setInput("");
  }

  // ─────────────────────────────────────────────
  // SHAKE ANIMATION FOR INVALID WORD
  // ─────────────────────────────────────────────
  function triggerShake(msg) {
    setMessage(msg);
    setShakeRow(true);
    setTimeout(() => setShakeRow(false), 600);
  }

  // ─────────────────────────────────────────────
  // GET TILE COLORING
  // ─────────────────────────────────────────────
  function getTileColor(rowIndex, tileIndex) {
    if (rowIndex >= currentRow) return "tile";

    const letter = guesses[rowIndex][tileIndex];
    const isCorrect = targetWord[tileIndex] === letter;
    const isPresent = targetWord.includes(letter);

    if (isCorrect) return "tile correct";
    if (isPresent) return "tile present";
    return "tile absent";
  }

  return (
    <div className="page-container">
      <div className="frosted-card" style={{ maxWidth: "420px", margin: "auto" }}>
        <h1>Wordle</h1>
        <p>Player: <b>{playerName || "Guest"}</b></p>

        {message && <p style={{ marginTop: 10 }}>{message}</p>}

        <div className="grid">
          {guesses.map((guess, rowIndex) => (
            <div
              key={rowIndex}
              className={`row ${shakeRow && rowIndex === currentRow ? "shake" : ""}`}
            >
              {Array(5)
                .fill(0)
                .map((_, tileIndex) => {
                  const letter =
                    rowIndex === currentRow ? input[tileIndex] || "" : guess[tileIndex] || "";

                  return (
                    <div
                      key={tileIndex}
                      className={getTileColor(rowIndex, tileIndex)}
                    >
                      {letter}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wordle;
