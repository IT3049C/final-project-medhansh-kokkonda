import { useState, useEffect, useContext } from "react";
import { PlayerContext } from "../context/PlayerContext.jsx";

const API_URL = "https://game-room-api.fly.dev/api/rooms";

function TicTacToe() {
  const { playerName } = useContext(PlayerContext);

  const [roomId, setRoomId] = useState("");
  const [inputRoomId, setInputRoomId] = useState("");

  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [mySymbol, setMySymbol] = useState(null); // X or O
  const [winner, setWinner] = useState(null);

  const [isInRoom, setIsInRoom] = useState(false);

  // ───────────────────────────────────────────────
  // CREATE ROOM
  // ───────────────────────────────────────────────
  async function createRoom() {
    const initialState = {
      board: Array(9).fill(null),
      currentPlayer: "X",
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initialState }),
    });

    const data = await res.json();
    setRoomId(data.roomId);
    setMySymbol("X"); // creator is X
    setIsInRoom(true);
  }

  // ───────────────────────────────────────────────
  // JOIN ROOM
  // ───────────────────────────────────────────────
  async function joinRoom() {
    if (!inputRoomId) return;

    const res = await fetch(`${API_URL}/${inputRoomId}`);
    if (!res.ok) {
      alert("Room not found.");
      return;
    }

    const data = await res.json();

    setRoomId(inputRoomId);
    setBoard(data.gameState.board);
    setCurrentPlayer(data.gameState.currentPlayer);
    setMySymbol("O"); // joiner is O
    setIsInRoom(true);
  }

  // ───────────────────────────────────────────────
  // POLL ROOM STATE EVERY 1.2s
  // ───────────────────────────────────────────────
  useEffect(() => {
    if (!isInRoom || !roomId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`${API_URL}/${roomId}`);
      const data = await res.json();

      setBoard(data.gameState.board);
      setCurrentPlayer(data.gameState.currentPlayer);

      const w = checkWinner(data.gameState.board);
      setWinner(w);
    }, 1200);

    return () => clearInterval(interval);
  }, [isInRoom, roomId]);

  // ───────────────────────────────────────────────
  // CHECK WINNER
  // ───────────────────────────────────────────────
  function checkWinner(b) {
    const combos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b2, c] of combos) {
      if (b[a] && b[a] === b[b2] && b[b2] === b[c]) return b[a];
    }
    return null;
  }

  // ───────────────────────────────────────────────
  // HANDLE CELL CLICK (YOUR MOVE)
  // ───────────────────────────────────────────────
  async function clickCell(i) {
    if (!isInRoom) return;

    if (board[i] !== null) return;
    if (winner) return;

    // Not your turn
    if (currentPlayer !== mySymbol) return;

    const newBoard = [...board];
    newBoard[i] = mySymbol;

    const w = checkWinner(newBoard);

    const nextPlayer = mySymbol === "X" ? "O" : "X";

    // Update API
    await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameState: {
          board: newBoard,
          currentPlayer: w ? currentPlayer : nextPlayer,
        },
      }),
    });

    setWinner(w);
  }

  // ───────────────────────────────────────────────
  // RESET GAME
  // ───────────────────────────────────────────────
  async function resetGame() {
    if (!roomId) return;

    const empty = Array(9).fill(null);

    await fetch(`${API_URL}/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameState: {
          board: empty,
          currentPlayer: "X",
        },
      }),
    });

    setWinner(null);
    setBoard(empty);
    setCurrentPlayer("X");
  }

  // ───────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────
  if (!isInRoom) {
    return (
      <div className="page-container" style={{ textAlign: "center" }}>
        <div className="frosted-card" style={{ maxWidth: "420px", margin: "auto" }}>
          <h1>Multiplayer Tic Tac Toe</h1>
          <p>Player: <b>{playerName || "Guest"}</b></p>

          <button onClick={createRoom} style={{ marginTop: "20px" }}>
            Create Room
          </button>

          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Enter room code"
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
              style={{
                padding: "8px 12px",
                width: "70%",
                marginRight: "8px",
                borderRadius: "8px",
              }}
            />
            <button onClick={joinRoom}>Join</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center" }}>
      <div className="frosted-card" style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>
        <h1>Multiplayer Tic Tac Toe</h1>

        <p>
          Player: <b>{playerName || "Guest"}</b>  
        </p>
        <p>
          You are: <b>{mySymbol}</b>
        </p>
        <p>
          Room Code: <b>{roomId}</b>
        </p>

        {winner ? (
          <h2 style={{ marginTop: "15px" }}>Winner: {winner}</h2>
        ) : (
          <h3 style={{ marginTop: "15px" }}>
            Turn: <b>{currentPlayer}</b>
          </h3>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 100px)",
            gap: "12px",
            justifyContent: "center",
            marginTop: "24px",
          }}
        >
          {board.map((val, i) => (
            <button
              key={i}
              onClick={() => clickCell(i)}
              aria-label={`tic-tac-toe cell ${i}`}
              style={{
                width: "100px",
                height: "100px",
                fontSize: "2rem",
                borderRadius: "12px",
              }}
            >
              {val}
            </button>
          ))}
        </div>

        <button onClick={resetGame} style={{ marginTop: "24px" }}>
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default TicTacToe;
