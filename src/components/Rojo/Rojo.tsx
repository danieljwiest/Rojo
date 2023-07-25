import { useState } from "react";
import GameBoard from "../GameBoard/GameBoard";
const PLAYER_COUNTS = [2, 3, 4];

const Rojo = () => {
  const [submitted, setSubmitted] = useState(false);
  const [gameParams, setGameParams] = useState({
    colorPalette: "",
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
            colorPalette: formData.get("colorPalette")?.toString() ?? "",
            playerCount: formData.get("playerCount")?.toString() ?? "",
          };
          setGameParams(obj);
          setSubmitted(true);
        }}
      >
        <label htmlFor="gameParams">
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
        <label htmlFor="gameParams">
          PlayerBoard Theme?
          <select id="colorPalette" name="colorPallet">
            <option />
            <option key="synthwave" value="synthwave">
              Synthwave
            </option>
          </select>
        </label>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Rojo;
