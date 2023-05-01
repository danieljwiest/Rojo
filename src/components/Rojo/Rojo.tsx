import { useState } from "react";
import GameBoard from "../GameBoard/GameBoard";
const PLAYER_COUNTS = [2, 3, 4];

const Rojo = () => {
  const [submitted, setSubmitted] = useState(false);
  const [gameParams, setGameParams] = useState({
    playSelection: "",
    playerCount: "",
  });

  if (submitted) {
    return <GameBoard gameParams={gameParams} />;
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const obj = {
            playSelection: formData.get("playSelection")?.toString() ?? "",
            playerCount: formData.get("playerCount")?.toString() ?? "",
          };
          setGameParams(obj);
          setSubmitted(true);
        }}
      >
        <label htmlFor="playSelection">
          Would You Like to Play Rojo?
          <select id="playSelection" name="playSelection">
            <option />
            <option key="Yes" value="Yes">
              Yes
            </option>
            <option key="No" value="No">
              No
            </option>
          </select>
        </label>
        <label htmlFor="playSelection">
          Number of Players?
          <select id="playerCount" name="playerCount">
            <option />
            {PLAYER_COUNTS.map((playerCount) => (
              <option key={playerCount.toString()} value={playerCount}>
                {playerCount}
              </option>
            ))}
          </select>
        </label>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Rojo;
