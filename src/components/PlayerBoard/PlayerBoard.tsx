import { CSSProperties, Dispatch, MutableRefObject } from "react";
import FloorLine from "./components/FloorLine/FloorLine";
import PatternLines from "./components/PatterLines/PatternLines";
import ScoreTrack from "./components/ScoreTrack/ScoreTrack";
import TileWall from "./components/TileWall/TileWall";
import {
  GameState as IGameState,
  Action as IAction,
} from "../../Types/AppTypes";
import "./PlayerBoard.styles.css";
import { RenderCount } from "../../utils/renderCount";

const PlayerBoard = ({
  playerNumber,
  activePlayer,
  numOfSelectedTiles,
  gameState,
  dispatch,
}: {
  playerNumber: number;
  activePlayer: number;

  numOfSelectedTiles: MutableRefObject<number>;
  gameState: IGameState;
  dispatch: Dispatch<IAction>;
}) => {
  //check if current playerboard is active
  const isActive = activePlayer === playerNumber ? "active" : "";

  // const [playerScore, setPlayerScore] = useState(0);
  const playerBoardId = `PB${playerNumber}`;
  const playerScore = gameState.playerBoards[playerBoardId].currentScore;

  return (
    <div
      className={`playerBoard pBoard-${playerNumber} ${isActive}`}
      style={{ gridArea: `pBoard-${playerNumber}` } as CSSProperties}
    >
      {/* <RenderCount /> */}
      <ScoreTrack playerBoardNum={playerNumber} playerScore={playerScore} />
      <div className="tileSectionContainer">
        <PatternLines
          playerNumber={playerNumber}
          numOfSelectedTiles={numOfSelectedTiles}
          gameState={gameState}
          dispatch={dispatch}
        />
        <TileWall playerNumber={playerNumber} gameState={gameState} />
      </div>
      <FloorLine
        playerNumber={playerNumber}
        numOfSelectedTiles={numOfSelectedTiles}
        gameState={gameState}
        dispatch={dispatch}
      />
    </div>
  );
};

export default PlayerBoard;
