///BUG: floor lines are available on other players turns. FIX

import { Dispatch, MutableRefObject, useState } from "react";
import { isMobile } from "react-device-detect";
import {
  FLOOR_TILE_VALUES,
  NUM_OF_FLOOR_TILES,
} from "../../../../constants/constants";
import {
  GameState as IGameState,
  Action as IAction,
} from "../../../../Types/AppTypes";
import "./FloorLine.styles.css";
import TileBox from "../TileBox/TileBox";

const FloorLine = ({
  playerNumber,
  numOfSelectedTiles,
  gameState,
  dispatch,
}: {
  playerNumber: number;
  numOfSelectedTiles: MutableRefObject<number>;
  gameState: IGameState;
  dispatch: Dispatch<IAction>;
}) => {
  const selectedTileState = gameState.selectedTileState;
  const floorTiles = [];
  let lineAvailableClass = "";
  const lineId = `PB${playerNumber}-FT`;
  let lineAvailable = false;

  //State for tracking number of tiles on a floor line.
  const [floorLineState, setFloorLineState] = useState({ qty: 0, hover: "" });

  for (let i = 1; i <= NUM_OF_FLOOR_TILES; i++) {
    const tileId = `PB${playerNumber}-FT-T${i}`;
    const floorTileValue = FLOOR_TILE_VALUES[i - 1];

    floorTiles.push(
      <div key={`PB${playerNumber}-FT-BOX${i}`} className="brokenTileContainer">
        <div className="brokenTilePtValue">{floorTileValue}</div>
        <TileBox
          key={tileId}
          boxColor={"color-PlayerBoard"}
          tileColor={gameState.tiles[tileId].color}
          tileActive={gameState.tiles[tileId].visible}
        />
      </div>
    );
  }

  //Check if row should be highlighted. Occures after a player has selected tiles and is now deciding where to place them. NOTE: Floor line can be selected if it is full. Extra tiles are just discarded.
  if (selectedTileState.selected && playerNumber === gameState.activePlayer) {
    lineAvailable = true;
  }

  if (lineAvailable) {
    lineAvailableClass = "boxed1";
  }

  const floorLineAttributes = {
    key: `PB${playerNumber}-FT`,
    className: `floorLine ${lineAvailableClass} ${floorLineState.hover}`,
    onMouseEnter:
      isMobile || !selectedTileState.selected || !lineAvailable
        ? () => {}
        : () => {
            handleMouseHover("enter");
          },
    onMouseLeave:
      isMobile || !selectedTileState.selected || !lineAvailable
        ? () => {}
        : () => {
            handleMouseHover("leave");
          },
    onClick:
      !selectedTileState.selected || !lineAvailable
        ? () => {}
        : () => {
            handleSelectLine();
          },
  };

  //function to handle when a user hovers over the Floor Line when deciding where to place selected Tiles
  function handleMouseHover(action: string) {
    if (action === "enter") {
      //Update Line State to add  "hover" status. NOTE: the state update uses the "functional" form to prevent bug where hover will not be removed from a previous onMouseLeave event if user moves mouse too quickly
      return setFloorLineState((previousLineState) => {
        return {
          ...previousLineState,
          hover: "hover",
        };
      });
    }
    if (action === "leave") {
      //update line state to remove "hover" status
      return setFloorLineState({
        ...floorLineState,
        hover: "",
      });
    }
  }

  function handleSelectLine() {
    const newTileCount = floorLineState.qty + numOfSelectedTiles.current;

    setFloorLineState({
      ...floorLineState,
      qty: newTileCount,
      hover: "",
    });

    dispatch({
      type: "placeSelectedTiles", ///refactor to utilize a "constants" file with the action types.
      payload: {
        playerNumber: playerNumber,
        lineId: lineId,
        selectedTileColor: selectedTileState.color,
        selectedTileDisplayCode: selectedTileState.displayCode,
        numOfSelectedTiles: 91,
      },
    });

    //reset numOfSelected tiles Reference Object to 0. Dispatch action should throw error if all of the tiles were not processed.
    numOfSelectedTiles.current = 0;
  }

  return (
    <div className="floorLineContainer">
      <div {...floorLineAttributes}>{floorTiles}</div>
    </div>
  );
};

export default FloorLine;
