import Tile from "../../../Tile/Tile";
import "./TileBox.styles.css";

const TileBox = ({
  boxColor,
  tileColor,
  tileActive,
}: {
  boxColor: string;
  tileColor: string;
  tileActive: boolean;
}) => {
  let boxShadow = "boxShadow";

  //remove background color and box shadow from tiles scored on a tileWall
  // if (tileActive && boxColor !== "") boxShadow = ""; REMOVED FOR NOW. Allows boxshadow for default walltiles
  if (boxColor !== "") boxShadow = "";

  if (tileActive) boxColor = "";

  return (
    <div className={`tileBox ${boxColor} ${boxShadow} `}>
      {tileActive ? <Tile tileColor={tileColor} /> : <div></div>}
    </div>
  );
};

export default TileBox;

//FOR REFERENCE ON HOW TO DO ONCLICK WITH "ROLES"
// return (
//   <div
//     className="tileBox"
//     onClick={() => {
//       setTilePlaced(true);
//     }}
//     onKeyDown={() => {
//       setTilePlaced(true);
//     }}
//     role="button"
//     tabIndex={0}
//   >
//     {tilePlaced ? <Tile tileColor={tileColor} /> : <div></div>}
//   </div>
// );
