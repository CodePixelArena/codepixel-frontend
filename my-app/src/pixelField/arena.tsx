import { useMemo, useState } from "react";
import styles from "./style/arena.module.css";

type Player = "red" | "blue";

type CellState = {
  owner: Player | null;
  strength: number;
};

const ARENA_SIZE = parseInt(import.meta.env.VITE_ARENA_WIDTH as string, 10) || 12;

const buildCells = (): CellState[] =>
  Array.from({ length: ARENA_SIZE * ARENA_SIZE }, () => ({ owner: null, strength: 0 }));

const getNeighborIndexes = (index: number): number[] => {
  const row = Math.floor(index / ARENA_SIZE);
  const col = index % ARENA_SIZE;
  const neighbors: number[] = [];

  for (let dRow = -1; dRow <= 1; dRow += 1) {
    for (let dCol = -1; dCol <= 1; dCol += 1) {
      if (dRow === 0 && dCol === 0) continue;
      const nextRow = row + dRow;
      const nextCol = col + dCol;
      if (nextRow >= 0 && nextRow < ARENA_SIZE && nextCol >= 0 && nextCol < ARENA_SIZE) {
        neighbors.push(nextRow * ARENA_SIZE + nextCol);
      }
    }
  }

  return neighbors;
};

const playerNames: Record<Player, string> = {
  red: "Red Team",
  blue: "Blue Team",
};

const getOtherPlayer = (player: Player): Player => (player === "red" ? "blue" : "red");

const countOwned = (cells: CellState[], player: Player) =>
  cells.filter((cell) => cell.owner === player).length;

export default function Arena() {
  const [cells, setCells] = useState<CellState[]>(() => buildCells());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("red");
  const [message, setMessage] = useState("Click a pixel to start the battle.");

  const scores = useMemo(
    () => ({ red: countOwned(cells, "red"), blue: countOwned(cells, "blue") }),
    [cells],
  );

  const winner = useMemo(() => {
    if (cells.every((cell) => cell.owner !== null)) {
      if (scores.red > scores.blue) return "red";
      if (scores.blue > scores.red) return "blue";
      return "draw";
    }
    return null;
  }, [cells, scores.blue, scores.red]);

  const resetArena = () => {
    setCells(buildCells());
    setCurrentPlayer("red");
    setMessage("Click a pixel to start the battle.");
  };

  const handleCellClick = (index: number) => {
    if (winner) {
      setMessage("The battle is over. Reset to start again.");
      return;
    }

    setCells((prevCells) => {
      const nextCells = prevCells.map((cell) => ({ ...cell }));
      const current = nextCells[index];
      const opponent = getOtherPlayer(currentPlayer);
      const adjacent = getNeighborIndexes(index);

      const buildStrength = (player: Player) =>
        1 + adjacent.reduce((total, cellIndex) => total + (prevCells[cellIndex].owner === player ? 1 : 0), 0);

      const attackerPower = buildStrength(currentPlayer);
      const defenderPower = current.owner ? buildStrength(current.owner) : 0;

      if (current.owner === currentPlayer) {
        setMessage(`${playerNames[currentPlayer]} already holds this pixel.`);
        return prevCells;
      }

      if (current.owner === null || attackerPower >= defenderPower) {
        nextCells[index].owner = currentPlayer;
        nextCells[index].strength = attackerPower;
        setMessage(
          current.owner === null
            ? `${playerNames[currentPlayer]} claimed a pixel.`
            : `${playerNames[currentPlayer]} captured a pixel from ${playerNames[opponent]}.`,
        );
      } else {
        setMessage(`${playerNames[opponent]} defended the pixel successfully.`);
      }

      return nextCells;
    });

    setCurrentPlayer(getOtherPlayer(currentPlayer));
  };

  const quickFill = () => {
    setCells((prevCells) => {
      const nextCells = prevCells.map((cell) => ({ ...cell }));
      nextCells.forEach((cell, index) => {
        if (cell.owner === null) {
          const player: Player = index % 2 === 0 ? "red" : "blue";
          nextCells[index].owner = player;
          nextCells[index].strength = 1;
        }
      });
      return nextCells;
    });
    setMessage("Arena filled for a quick demo. Reset to restart.");
  };

  return (
    <section className={styles["arena-page"]}>
      <div className={styles["arena-header"]}>
        <div>
          <p className={styles["arena-label"]}>Pixel Battle Arena</p>
          <h1>Claim squares, capture opponents, and control the grid.</h1>
        </div>
        <div className={styles["arena-status"]}>
          <span className={styles["arena-turn"]}>Current turn: <strong>{playerNames[currentPlayer]}</strong></span>
          <span className={styles["arena-message"]}>{message}</span>
        </div>
      </div>

      <div className={styles["arena-summary"]}>
        <div className={`${styles["arena-score"]} ${styles["arena-score--red"]}`}>
          <span className={styles["arena-score__label"]}>Red Team</span>
          <strong>{scores.red}</strong>
        </div>
        <div className={`${styles["arena-score"]} ${styles["arena-score--blue"]}`}>
          <span className={styles["arena-score__label"]}>Blue Team</span>
          <strong>{scores.blue}</strong>
        </div>
        <div className={styles["arena-actions"]}>
          <button type="button" onClick={resetArena}>Reset Arena</button>
          <button type="button" onClick={quickFill}>Quick Demo</button>
        </div>
      </div>

      <div
        className={styles["arena-grid"]}
        style={{ gridTemplateColumns: `repeat(${ARENA_SIZE}, minmax(0, 1fr))` }}
      >
        {cells.map((cell, index) => {
          const ownerClass = cell.owner ? styles[`pixel-${cell.owner}`] : styles["pixel-empty"];
          return (
            <button
              key={index}
              type="button"
              className={`${styles["pixel-cell"]} ${ownerClass}`}
              onClick={() => handleCellClick(index)}
            >
              {cell.owner && <span className={styles["pixel-label"]}>{cell.strength}</span>}
            </button>
          );
        })}
      </div>

      {winner && (
        <div className={styles["arena-result"]}>
          {winner === "draw"
            ? "Battle ends in a draw."
            : `${playerNames[winner]} wins the arena!`}
        </div>
      )}
    </section>
  );
}
