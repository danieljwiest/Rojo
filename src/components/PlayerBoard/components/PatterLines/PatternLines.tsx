//Clean up this to remove everything that is not being used.
// Update reducer to allow for variable action types (i.e. add guard statements to cases)
//Update reducer to move the game to the next players turn during the dispatch action.
//Ad functionality for floor tiles (place tiles on floor and also overload tiles to floor.)
//Bugs....if line is full of tiles it stays highlighted in the "selected" style.

import { Dispatch, MutableRefObject, useState } from "react";
import { isMobile } from "react-device-detect";
import { NUM_OF_PATTERN_LINES } from "../../../../constants/constants";
import {
  GameState as IGameState,
  Action as IAction,
  PatternLineState as IPatternLineState,
} from "../../../../Types/AppTypes";
import "./PatternLines.styles.css";
import TileBox from "../TileBox/TileBox";

const PatternLines = ({
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
  const patternLineContainer = [];

  //Generate initial PatterLineState
  const initialPatternLineState: IPatternLineState = {};
  for (let i = 1; i <= NUM_OF_PATTERN_LINES; i++) {
    const lineId = `PB${playerNumber}-PL${i}`;
    initialPatternLineState[lineId] = {
      color: "",
      numOfTiles: 0,
      hover: "",
      completedColors: {},
    };
  } //FUTURE: refactor so that this does not run during each render.

  //Pattern Line State
  const [patternLineState, setPatternLineState] = useState(
    initialPatternLineState
  );

  //Populate the "Pattern Lines" section of playerboard
  for (let i = 1; i <= NUM_OF_PATTERN_LINES; i++) {
    const patternLine = [];
    const lineId = `PB${playerNumber}-PL${i}`;
    let lineAvailableClass = "";

    //Check if start of a new round and reset pattern line state for completed patternlines. Logic detects patter lines where the first tile has been reset to color = "" but the numOfTiles indicates line is "full"
    if (
      gameState.tiles[`${lineId}-T1`].color === "" &&
      patternLineState[lineId].numOfTiles >= i
    ) {
      console.log("patternline state should reset");
      //MAKE FOLLOWING FUNCTIONAL FORM...or make next patternline state update functional form so that it doesnt get skipped
      setPatternLineState({
        ...patternLineState,
        [lineId]: {
          ...patternLineState[lineId],
          color: "",
          numOfTiles: 0,
          hover: "",
          completedColors: {
            ...patternLineState[lineId].completedColors,
            [patternLineState[lineId].color]: 1,
          },
        },
      });
    }

    //Populate each Pattern Line with Tiles
    for (let j = 1; j <= i; j++) {
      const tileId = `PB${playerNumber}-PL${i}-T${j}`;

      patternLine.push(
        <TileBox
          key={tileId}
          boxColor={""}
          tileColor={gameState.tiles[tileId].color}
          tileActive={gameState.tiles[tileId].visible}
        />
      );
    }
    //Check if row should be highlighted. Occurs after a player has selected tiles and is now deciding where to place them.
    const lineAvailable = isLineAvailable(lineId);
    if (lineAvailable) {
      lineAvailableClass = "boxed";
    }

    const patterLineAttributes = {
      key: lineId,
      className: `patternLine ${lineAvailableClass} ${patternLineState[lineId].hover}`,
      onMouseEnter:
        isMobile || !selectedTileState.selected || !lineAvailable
          ? () => {}
          : () => {
              handleMouseHover("enter", lineId);
            },
      onMouseLeave:
        isMobile || !selectedTileState.selected || !lineAvailable
          ? () => {}
          : () => {
              handleMouseHover("leave", lineId);
            },
      onClick:
        !selectedTileState.selected || !lineAvailable
          ? () => {}
          : () => {
              handleSelectLine(lineId);
            },
    };

    patternLineContainer.push(
      <div {...patterLineAttributes}>{patternLine}</div>
    );
  }

  //Function to determine if a Pattern Line is available for the selected tiles to be placed.
  function isLineAvailable(lineId: string) {
    const lineColor = patternLineState[lineId].color;
    const tilesInLine = patternLineState[lineId].numOfTiles;
    const completedColors = patternLineState[lineId].completedColors;
    const rowNum = parseInt(lineId.slice(-1), 10);

    if (!selectedTileState.selected) return false;
    if (playerNumber !== gameState.activePlayer) return false;
    if (completedColors[selectedTileState.color]) return false;
    if (tilesInLine >= rowNum) return false;
    if (lineColor !== selectedTileState.color && lineColor !== "") return false;

    return true;
  }

  //function to handle when a user hovers over a PatternLine when deciding where to place selected Tiles
  function handleMouseHover(action: string, lineId: string) {
    if (action === "enter") {
      //Update Line State to add  "hover" status. NOTE: the state update uses the "functional" form to prevent bug where hover will not be removed from a previous onMouseLeave event if user moves mouse too quickly
      return setPatternLineState((previousLineState) => {
        return {
          ...previousLineState,
          [lineId]: { ...previousLineState[lineId], hover: "hover" },
        };
      });
    }
    if (action === "leave") {
      //update line state to remove "hover" status
      return setPatternLineState({
        ...patternLineState,
        [lineId]: { ...patternLineState[lineId], hover: "" },
      });
    }
  }

  function handleSelectLine(lineId: string) {
    const newTileCount =
      patternLineState[lineId].numOfTiles + numOfSelectedTiles.current;

    setPatternLineState({
      ...patternLineState,
      [lineId]: {
        ...patternLineState[lineId],
        color: selectedTileState.color,
        numOfTiles: newTileCount,
        hover: "",
      },
    });

    dispatch({
      type: "placeSelectedTiles", ///refactor to utilize a "constants" file with the action types.
      payload: {
        playerNumber: playerNumber,
        lineId: lineId,
        selectedTileColor: selectedTileState.color,
        selectedTileDisplayCode: selectedTileState.displayCode,
        numOfSelectedTiles: 99,
      },
    });

    //reset numOfSelected tiles Reference Object to 0. Dispatch action should throw error if all of the tiles were not processed.
    numOfSelectedTiles.current = 0;
  }

  return <div className="patternLinesContainer">{patternLineContainer}</div>;
};

export default PatternLines;
