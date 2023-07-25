import { CSSProperties, Dispatch, useState, MutableRefObject } from "react";
import { TILES_PER_FD } from "../../../../constants/constants";
import {
  GameState as IGameState,
  Action as IAction,
} from "../../../../Types/AppTypes";
import "./FactoryDisplay.styles.css";
// import { RenderCount } from "../../../../utils/renderCount";
import Tile from "../../../Tile/Tile";

const FactoryDisplay = ({
  factoryDisplayNum,
  gameState,
  numOfSelectedTiles,
  dispatch,
}: {
  factoryDisplayNum: number;
  gameState: IGameState;
  numOfSelectedTiles: MutableRefObject<number>;
  dispatch: Dispatch<IAction>;
}) => {
  const [hoveredTileColor, setHoveredTileColor] = useState("");

  //array to hold the tiles located within this display
  const tiles: JSX.Element[] = [];

  //populate the tiles array using the provided tileProps.
  for (let i = 1; i <= TILES_PER_FD; i++) {
    const tileId = `FD${factoryDisplayNum}-T${i}`;
    const tileState = gameState.tiles[tileId];

    //Check if tiles have been placed and reset hoveredTileColor. Without this the hoveredTileColor will persist after a round is completed. The third condition is used so it only runs the state change once
    if (tileState.visible === false && hoveredTileColor !== "" && i === 1) {
      setHoveredTileColor("");
    }

    if (tileState === undefined) {
      //Do nothing and wait for initial tile state to be rendered
      //This is due to initial game state being set in the useEffect which runs after initial paint. If the game state is initialized outside of the useEffect teh tileBag resets with each re-render since the initGameState function is called each render. Could initialize the tileBag outside the component and refactor initGameState to take the const tileBag as an argument. Currently leaving this if statement.
    } else {
      tiles.push(
        <div
          key={tileId}
          className="displayTile"
          style={
            { "--tileNum": i } as CSSProperties
          } /* Used in transformations to place tile in correct location within the display */
        >
          {
            /* Add tile to array if visible otherwise insert null */
            tileState.visible === true ? (
              <Tile
                key={tileId}
                // className="displayTile"
                tileColor={tileState.color}
                setHoveredTileColor={setHoveredTileColor}
                isHovered={hoveredTileColor === tileState.color ? true : false}
                gameState={gameState}
                dispatch={dispatch}
                numOfSelectedTiles={numOfSelectedTiles}
                displayCode={`FD${factoryDisplayNum}`}
              />
            ) : null
          }
        </div>
      );
    }
  }

  return (
    <div
      className="factoryDisplay"
      style={
        { "--factoryDisplayNum": factoryDisplayNum } as CSSProperties
      } /* used in the CSS transformation to place display in correct location */
    >
      {/* <RenderCount /> */}
      {tiles}
    </div>
  );
};

export default FactoryDisplay;
