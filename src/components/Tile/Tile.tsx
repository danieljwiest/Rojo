import { Dispatch, SetStateAction, useEffect, MutableRefObject } from "react";
import { isMobile } from "react-device-detect";
import {
  GameState as IGameState,
  Action as IAction,
} from "../../Types/AppTypes";
import "./Tile.styles.css";
import { TILE_COLORS } from "../../constants/constants";
// import { RenderCount } from "../../utils/renderCount";

const Tile = ({
  tileColor,
  setHoveredTileColor = () => {},
  isHovered = false,
  gameState,
  dispatch,
  numOfSelectedTiles,
  displayCode = "",
}: {
  tileColor: string;
  setHoveredTileColor?: Dispatch<SetStateAction<string>>;
  isHovered?: boolean;
  gameState?: IGameState;
  dispatch?: Dispatch<IAction>;
  numOfSelectedTiles?: MutableRefObject<number>;
  displayCode?: string;
}) => {
  const tileHover = isHovered ? "hover" : "";
  // const scoredTile = onWall ? "scoredTile" : ""; ////DELETE??? Dont think its used
  const selectedTileState = gameState
    ? gameState.selectedTileState
    : { selected: false }; //this can be removed if Gamestate is passed down through "tileBox"
  const tileHasBeenSelected = selectedTileState.selected;

  //Update the numberOfSelectedTiles to match the number of Hovered Tiles
  useEffect(() => {
    if (!numOfSelectedTiles) return;
    if (isHovered && !tileHasBeenSelected) {
      numOfSelectedTiles.current = numOfSelectedTiles.current + 1;
    }
    console.log(numOfSelectedTiles.current);
  });

  const tileAttributes = {
    className: `tile ${tileColor}`,
    //The "displayCode" condition in the following ternary expressions limits the mouse interaction to only tiles on displays and excludes tiles placed on player boards. )
    onMouseEnter:
      isMobile ||
      selectedTileState.selected ||
      displayCode === "" ||
      tileColor === TILE_COLORS[0]
        ? () => {}
        : () => {
            setHoveredTileColor(tileColor);
          },

    onClick:
      selectedTileState.selected ||
      displayCode === "" ||
      tileColor === TILE_COLORS[0]
        ? () => {}
        : () => {
            if (!numOfSelectedTiles)
              throw new Error("Error in calculating number of selected tiles"); //num of selected tiles should never be undefined as it gets set when mouse enters.
            console.log(
              "onClick, selectedTileNum: ",
              numOfSelectedTiles.current
            );

            //Guard against dispatch not being passed in. This shouldn't actually happen, but will catch problems if someone passes a displayCode to a tile componenent and does not include a dispatch.
            if (!dispatch) throw new Error("Dispatch was not passed to tile");
            dispatch({
              type: "SELECT_TILES",
              payload: {
                playerNumber: 66,
                lineId: "None",
                selectedTileDisplayCode: displayCode,
                selectedTileColor: tileColor,
                numOfSelectedTiles: numOfSelectedTiles.current,
              },
            });
          },
    onMouseOut:
      isMobile ||
      selectedTileState.selected ||
      displayCode === "" ||
      tileColor === TILE_COLORS[0]
        ? () => {}
        : () => {
            setTimeout(() => {
              //Timeout used to prevent bug where onMouseLeave will process before an onClick event. This will force the onLeave into the next render cycle.
              setHoveredTileColor("");
              if (numOfSelectedTiles) numOfSelectedTiles.current = 0; //If statement to guard against possible "undefined" reference value during initial render. Should never actual be undefined here as it gets set upon mouse enter. I guess if the mouse happens to "start" on the tile
              if (numOfSelectedTiles)
                console.log(
                  "on leave happened. Num of Selected tiles is: ",
                  numOfSelectedTiles.current
                );
            }, 0);
          },
  };

  return (
    <div className={`tileBase ${tileColor} ${tileHover} `}>
      <div {...tileAttributes}>{/* <RenderCount /> */}</div>
    </div>
  );
};

export default Tile;
