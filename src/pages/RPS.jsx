import { useState, useContext } from "react";
import { PlayerContext } from "../context/PlayerContext.jsx";

const CHOICES = ["Rock", "Paper", "Scissors"];

function RPS() {
  const { playerName } = useContext(PlayerContext);

  const [difficulty, setDifficulty] = useState("easy");
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [round, setRound] = useState(1);
  const [result, setResult] = useState("");
  const [playerChoice, setPlayerChoice] = useState("");
  const [cpuChoice, setCpuChoice] = useState("");

  const counter = (choice) => {
    if (choice === "Rock") return "Paper";
    if (choice === "Paper") return "Scissors";
    return "Rock";
  };

  function getCpuMove(playerPick) {
    const roll = Math.random();

    if (difficulty === "easy") {
      return CHOICES[Math.floor(Math.random() * 3)];
    }

    if (difficulty === "medium") {
      // 35% CPU counter, 65% random
      return roll < 0.35 ? counter(playerPick) : CHOICES[Math.floor(Math.random() * 3)];
    }

    if (difficulty === "hard") {
      // 75% CPU counter, 25% random
      return roll < 0.75 ? counter(playerPick) : CHOICES[Math.floor(Math.random() * 3)];
    }
  }

  function play(pick) {
    const cpu = getCpuMove(pick);

    setPlayerChoice(pick);
    setCpuChoice(cpu);

    if (pick === cpu) {
      setResult("Tie!");
    } else if (
      (pick === "Rock" && cpu === "Scissors") ||
      (pick === "Paper" && cpu === "Rock") ||
      (pick === "Scissors" && cpu === "Paper")
    ) {
      setPlayerScore((s) => s + 1);
      setResult(`${playerName || "You"} win this round!`);
    } else {
      setCpuScore((s) => s + 1);
      setResult("CPU wins this round!");
    }

    setRound((r) => r + 1);
  }

  function reset() {
    setPlayerScore(0);
    setCpuScore(0);
    setRound(1);
    setResult("");
    setPlayerChoice("");
    setCpuChoice("");
  }

  return (
    <div className="page-container">
      <div className="frosted-card" style={{ textAlign: "center" }}>
        <h1>Rock Paper Scissors</h1>

        <div style={{ marginTop: "14px" }}>
          <label style={{ marginRight: "6px" }}>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(148,163,184,0.7)"
            }}
          >
            <option value="easy">Easy (Random)</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <h3 style={{ marginTop: "16px" }}>Round {round}</h3>
        <h3>
          {playerName || "You"}: {playerScore} — CPU: {cpuScore}
        </h3>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "14px"
          }}
        >
          {CHOICES.map((c) => (
            <button key={c} onClick={() => play(c)}>
              {c}
            </button>
          ))}
        </div>

        <p style={{ marginTop: "18px" }}>
          You chose: <b>{playerChoice || "-"}</b>
        </p>
        <p>
          CPU chose: <b>{cpuChoice || "-"}</b>
        </p>

        <h3 style={{ marginTop: "12px", minHeight: "24px" }}>{result}</h3>

        <button onClick={reset} style={{ marginTop: "20px" }}>
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default RPS;
