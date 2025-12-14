import { useContext } from "react";
import { Link } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext.jsx";

function Hub() {
  const { playerName, setPlayerName } = useContext(PlayerContext);

  return (
    <div className="page-container" style={{ paddingTop: "60px" }}>
      <div
        className="frosted-card"
        style={{
          width: "100%",
          maxWidth: "820px",
          textAlign: "center",
          padding: "52px 48px",
          borderRadius: "22px",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            fontWeight: 700,
            fontFamily: "Helvetica, Arial, sans-serif",
            marginBottom: "10px",
            fontSize: "2.1rem",
          }}
        >
          GameHub
        </h1>

        <p
          style={{
            opacity: 0.85,
            fontSize: "1rem",
            marginBottom: "36px",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          Welcome to a clean, minimal arcade built by{" "}
          <b style={{ fontWeight: 700 }}>Medhansh</b>.
        </p>

        {/* PLAYER NAME */}
        <div style={{ textAlign: "left", marginBottom: "32px" }}>
          <label
            style={{
              opacity: 0.85,
              fontSize: "0.95rem",
              fontWeight: 600,
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            Player Name
          </label>

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name..."
            style={{
              width: "100%",
              padding: "0.65rem 0.75rem",
              marginTop: "8px",
              fontSize: "1rem",
              borderRadius: "12px",
              border: "1px solid rgba(148,163,184,0.45)",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
            }}
          />
        </div>

        {/* SECTION TITLE */}
        <h2
          style={{
            textAlign: "left",
            fontSize: "1.2rem",
            fontWeight: 700,
            marginBottom: "22px",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          Select a Game
        </h2>

        {/* PERFECT 4-COLUMN CENTERED GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {/* CARD TEMPLATE */}
          {[
            {
              link: "/rps",
              title: "Rock Paper Scissors",
              desc: "CPU difficulty + scoring",
            },
            {
              link: "/tictactoe",
              title: "Tic Tac Toe",
              desc: "Classic 3×3 strategy",
            },
            { link: "/wordle", title: "Wordle", desc: "Guess the 5-letter word" },
            { link: "/memory", title: "Memory Cards", desc: "Match the pairs" },
          ].map((game) => (
            <Link
              key={game.link}
              to={game.link}
              className="game-card"
              style={{
                textDecoration: "none",
              }}
            >
              <div
                className="game-card-inner"
                style={{
                  padding: "18px 14px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 18px rgba(0,0,0,0.28)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3
                  style={{
                    marginBottom: "6px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    fontFamily: "Helvetica, Arial, sans-serif",
                  }}
                >
                  {game.title}
                </h3>
                <p
                  style={{
                    opacity: 0.75,
                    fontSize: "0.85rem",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    lineHeight: "1.3",
                  }}
                >
                  {game.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hub;
