import { CSSProperties, Dispatch, useState, MutableRefObject } from "react";
import { NUM_OF_CENTER_TILES } from "../../../../constants/constants";
import {
  GameState as IGameState,
  Action as IAction,
} from "../../../../Types/AppTypes";
import "./CenterDisplay.styles.css";
import { RenderCount } from "../../../../utils/renderCount";
import Tile from "../../../Tile/Tile";

const CenterDisplay = ({
  gameState,
  numOfSelectedTiles,
  dispatch,
}: {
  gameState: IGameState;
  numOfSelectedTiles: MutableRefObject<number>;
  dispatch: Dispatch<IAction>;
}) => {
  const [prevPlayer, setPreviousPlayer] = useState(1); //state to help catch when selected tiles have been placed.
  const [hoveredTileColor, setHoveredTileColor] = useState(""); //This state is also defined in factory displays. could be moved into factory container, but then would force re-renders on all display tiles when a tile is hovered.

  //array to hold the tiles located within this display
  const tiles: JSX.Element[] = [];

  //Check to see if tiles have been placed. If active player has just changed then the place tiles action has occured.
  if (gameState.activePlayer !== prevPlayer) {
    setHoveredTileColor("");
    setPreviousPlayer(gameState.activePlayer);
  }

  //populate the tiles array using the provided tileProps.
  for (let i = 0; i < NUM_OF_CENTER_TILES; i++) {
    const tileId = i === 0 ? "CD-PlayerOne_Tile" : `CD-T${i}`;
    const tileState = gameState.tiles[tileId];
    const ringNum = i < 1 ? 0 : i < 10 ? 1 : 2;
    const tilesPerRing = ringNum === 0 ? 1 : ringNum === 1 ? 9 : 18;

    if (tileState === undefined) {
      //Do nothing and wait for initial tile state to be rendered
      //This is due to initial game state being set in the useEffect which runs after initial paint. If the game state is initialized outside of the useEffect teh tileBag resets with each re-render since the initGameState function is called each render. Could initialize the tileBag outside the component and refactor initGameState to take the const tileBag as an argument. Currently leaving this if statement.
    } else {
      tiles.push(
        <div
          key={tileId}
          className="centerTile"
          style={
            {
              "--tileNum": i,
              "--ringNum": ringNum,
              "--tilesPerRing": tilesPerRing,
            } as CSSProperties
          } /* Used in transformations to place tile in correct location within the display */
        >
          {
            /* Add tile to array if visible otherwise insert null */
            tileState.visible === true ? (
              <Tile
                key={tileId}
                tileColor={tileState.color}
                setHoveredTileColor={setHoveredTileColor}
                isHovered={hoveredTileColor === tileState.color ? true : false}
                gameState={gameState}
                dispatch={dispatch}
                numOfSelectedTiles={numOfSelectedTiles}
                displayCode={`CD`}
              />
            ) : null
          }
        </div>
      );
    }
  }

  return (
    <div
      className="centerDisplay"
      style={
        { "--centerDisplayRingNum": 99 } as CSSProperties
      } /* used in the CSS transformation to place display in correct location */
    >
      {/* <RenderCount /> */}
      <div>...</div>
      {tiles}
    </div>
  );
};

export default CenterDisplay;
