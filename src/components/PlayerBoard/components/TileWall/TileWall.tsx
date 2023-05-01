import { GameState as IGameState } from "../../../../Types/AppTypes";
import {
  NUM_OF_PATTERN_LINES,
  NUM_OF_WALL_TILES_PER_LINE,
} from "../../../../constants/constants";
import "./TileWall.styles.css";
import TileBox from "../TileBox/TileBox";

const TileWall = ({
  playerNumber,
  gameState,
}: {
  playerNumber: number;
  gameState: IGameState;
}) => {
  const tileWall = [];

  for (let i = 1; i <= NUM_OF_PATTERN_LINES; i++) {
    const wallLineTiles = [];

    for (let j = 1; j <= NUM_OF_WALL_TILES_PER_LINE; j++) {
      const tileId = `PB${playerNumber}-WL${i}-T${j}`;

      wallLineTiles.push(
        <TileBox
          key={tileId}
          boxColor={gameState.tiles[tileId].color}
          tileColor={gameState.tiles[tileId].color}
          tileActive={gameState.tiles[tileId].visible}
        />
      );
    }

    tileWall.push(
      <div key={`PB#-WL${i}`} className="wallLine">
        {wallLineTiles}
      </div>
    );
  }

  return <div className="wall">{tileWall}</div>;
};

export default TileWall;
