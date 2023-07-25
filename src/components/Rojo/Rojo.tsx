import { useNavigate } from "react-router-dom";
const PLAYER_COUNTS = [2, 3, 4];

const Rojo = () => {
  const navigate = useNavigate();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const style = formData.get("style")?.toString() ?? "";
          const playerCount = formData.get("playerCount")?.toString() ?? "";
          console.log(formData);
          console.log(`/game/${style}/${playerCount}`);
          navigate(`/game/${style}/${playerCount}`);
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
          <select id="style" name="style">
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
