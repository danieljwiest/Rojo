import { useNavigate } from "react-router-dom";
const PLAYER_COUNTS = [2, 3, 4];

const Rojo = () => {
  const navigate = useNavigate();

  return (
    <div className="fullwidth is-flex is-flex-direction-column is-justify-content-center">
      <div className="hero"></div>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const style = formData.get("style")?.toString() ?? "";
          const playerCount = formData.get("playerCount")?.toString() ?? "";

          if (style === "" || playerCount === "") {
            alert("Please select game settings");
          } else {
            navigate(`/game/${style}/${playerCount}`);
          }
        }}
      >
        <div className="formTitle">Game Settings</div>
        <div className="formItem">
          <label htmlFor="gameParams"> Number of Players?</label>

          <select id="playerCount" name="playerCount">
            <option />
            {PLAYER_COUNTS.map((playerCount) => (
              <option key={playerCount.toString()} value={playerCount}>
                {playerCount}
              </option>
            ))}
          </select>
        </div>

        <div className="formItem">
          <label htmlFor="gameParams"> Player Board Theme? </label>
          <select id="style" name="style">
            <option />
            <option key="synthwave" value="synthwave">
              Synthwave
            </option>
          </select>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Rojo;
