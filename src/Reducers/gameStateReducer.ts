//TODO:
//update end of round logic to not look for player one tile in floor tiles. It is already stored in gameState. Just check that.
//Reset playerOneTileLocation gameState to be in center at end of round
//During initialize next Round update center tiles state for player one tile.
//BUG When round is re-initialized the factor display selected tile hover states have not been reset. Need to make sure those get set to not be hovered when tiles are placed.
//BUG PatternLine tiles are still set to being unselectable after tiles are placed. Need to have that reset.
//TODO: UPdate "Adopt ME" link at top of game
//BUG during round 2 placing a tile on a row that has had a previously scored tile does not utilize numOfSelected Tiles correctly
//BUG: hovered tile in center did not fully reset correctly
//BUG: factory displays need to reset their hovered tile color after placing tiles. ALSO in round two numOFSelectedTiles.current is not resetting after tiles are placed, only on re-hover
//BUG: fix score tiles to check for negative scores.
//*****NEXT TASK ******** ------> FIX end of game trigger. Maybe store a count in the pattern line state. maybe track pattern line columns as well?
//FIX: Fix dispatch payload so that I dont have to input dummy payloads everywhere.
//TODO: update reducer actions to be a "CONSTANT"
//TOD): refactor process end of round to get rid of RES1 and RES2 and use destructuring or something else.
//BUG hovering over number of players dropdown highlights like ot play as well?

import { Reducer } from "react";
import {
  GameState as IGameState,
  Action as IAction,
  TileState as ITileState,
  PlayerBoardState as IPlayerBoardState,
} from "../Types/AppTypes";
import {
  NUM_OF_FLOOR_TILES,
  NUM_OF_PATTERN_LINES,
  NUM_OF_WALL_TILES_PER_LINE,
  TILES_PER_FD,
  TILE_COLORS,
} from "../constants/constants";
import shuffle from "../utils/shuffle";
import ensure from "../utils/ensureType";

const gameStateReducer: Reducer<IGameState, IAction> = (state, action) => {
  switch (action.type) {
    case "SELECT_TILES": {
      console.log("select Tile action payloads:");
      console.log(
        "color: ",
        action.payload.selectedTileColor,
        "numOfSelectedTiles: ",
        action.payload.numOfSelectedTiles
      );
      return {
        ...state,
        selectedTileState: {
          selected: true,
          color: action.payload.selectedTileColor,
          qty: action.payload.numOfSelectedTiles,
          displayCode: action.payload.selectedTileDisplayCode,
        },
      };
    }
    case "placeSelectedTiles": {
      return placeSelectedTilesAction(state, action);
    }
    case "PROCESS_END_OF_ROUND": {
      return processEndOfRound(state);
    }
    case "INIT_NEXT_ROUND": {
      const { tileUpdates, tileBagUpdate, discardBagUpdate, tilesLeftToPick } =
        initStateForNewRound(
          state.tileBag,
          state.discardBag,
          state.playerCount
        );

      return {
        ...state,
        tiles: { ...state.tiles, ...tileUpdates },
        discardBag: [...discardBagUpdate],
        tileBag: [...tileBagUpdate],
        startOfRound: false,
        tilesLeftToPick: tilesLeftToPick,
        numOfTilesInCenter: 1,
        playerOneTileLoc: 0,
      };
    }
    case "PROCESS_END_OF_GAME": {
      //find number of completed columns
      //check for number of completed colors
      // update scores
      //determine winner
      //create YOU WIN pop up
      const playerBoardStateUpdates = { ...state.playerBoards };
      let highScore = 0;
      let winningPlayer = 0;

      for (const boardId in playerBoardStateUpdates) {
        console.log("end of game processing playerBoard: ", boardId);
        const playerNumber = boardId.slice(-1);

        //Determine end of bonus points for completed Rows/Columns/ColorSets.
        const numCompletedRows = playerBoardStateUpdates[boardId].completedRows;
        const numCompletedColumns = findCompletedColumns(state, playerNumber);
        const numCompletedColors = findCompletedColors(
          playerBoardStateUpdates[boardId].placedColorsLog
        );

        const finalScore =
          playerBoardStateUpdates[boardId].currentScore +
          sumBonusPoints(
            numCompletedRows,
            numCompletedColumns,
            numCompletedColors
          );

        //Set state updates
        playerBoardStateUpdates[boardId] = {
          ...playerBoardStateUpdates[boardId],
          completedColumns: numCompletedColumns,
          completedColors: numCompletedColors,
          currentScore: finalScore,
        };

        //Check if player is currently winning
        if (finalScore > highScore) {
          highScore = finalScore;
          winningPlayer = +playerNumber;
        }
      }

      console.log("playerBoard updates", playerBoardStateUpdates);

      return {
        ...state,
        playerBoards: {
          ...playerBoardStateUpdates,
        },
        startOfRound: false,
        gameCompleted: false,
        winner: winningPlayer,
      };
    }
    default:
      throw new Error("invalid action type");
  }
};

export default gameStateReducer;

///JUST wrote find Completed Columns function. have not called it
///JUST added this placed Colors log.
//FIND BUG WHERE TILES GET SKIPPED WHEN PLACED

///QUESTIONS:  Why are pattern tiles not resetting? probably due to tile state being reset maybe?....Why is the tileID look up not working

//*********************************************************** */

//Function to calculate end of game bonus points for completed Rows/Columns/ColorSets
function sumBonusPoints(
  numRows: number,
  numColumns: number,
  numColorSets: number
) {
  const bonusPoints = 2 * numRows + 7 * numColumns + 10 * numColorSets;
  return bonusPoints;
}

//Function to check for completed colums
function findCompletedColors(placedColorLog: { [index: string]: number }) {
  let numOfCompletedColors = 0;

  //check each column
  for (const color in placedColorLog) {
    const numOfColorsPerSet = NUM_OF_WALL_TILES_PER_LINE;
    if (placedColorLog[color] === numOfColorsPerSet) numOfCompletedColors += 1;
  }

  return numOfCompletedColors;
}

//Function to check for completed colums
function findCompletedColumns(state: IGameState, playerNumber: string) {
  let numOfCompletedColumns = 0;

  //check each column
  for (let i = 1; i <= NUM_OF_WALL_TILES_PER_LINE; i++) {
    let columnCompleted = true;

    //Check each row
    for (let j = 1; j <= NUM_OF_PATTERN_LINES; j++) {
      const tileId = `PB${playerNumber}-WL${j}-T${i}`;
      //If we encounter an empty tile slot then turn columnCompleted to false
      if (!state.tiles[tileId].visible) columnCompleted = false;
    }

    if (columnCompleted) numOfCompletedColumns += 1;
  }

  return numOfCompletedColumns;
}

//Function to initialize state for a new game round
function initStateForNewRound(
  tileBag: string[],
  discardBag: string[],
  playerCount: number
) {
  const tileBagUpdate = [...tileBag];
  let discardBagUpdate = [...discardBag];
  const tileUpdates: { [index: string]: ITileState } = {};

  const numFactoryDisplays = 2 * playerCount + 1;
  const totalFactoryDisplayTiles = numFactoryDisplays * TILES_PER_FD;

  //Check if there are enough tiles to repopulate displays. If not, refill tileBag from discard bag.
  if (tileBag.length < totalFactoryDisplayTiles) {
    discardBagUpdate = shuffle(discardBagUpdate);
    const tilesNeeded = totalFactoryDisplayTiles - tileBag.length;
    const tilesToRemove =
      tilesNeeded < discardBagUpdate.length
        ? tilesNeeded
        : discardBagUpdate.length;

    tileBagUpdate.push(...discardBag.slice(0, tilesToRemove));
    discardBagUpdate = discardBagUpdate.slice(tilesToRemove);
  }

  //Initialize Display Tiles
  for (let i = 1; i <= numFactoryDisplays; i++) {
    for (let j = 1; j <= TILES_PER_FD; j++) {
      const tileId = `FD${i}-T${j}`;

      //Remove tile from starting array and assign to current Tile.
      const tileColor = ensure(tileBagUpdate.shift());

      //assign tile state
      tileUpdates[tileId] = {
        id: tileId,
        visible: true,
        color: tileColor,
      };
    }
  }

  //Place player One tile in center Display
  const tileId = `CD-PlayerOne_Tile`;
  tileUpdates[tileId] = {
    id: tileId,
    visible: true,
    color: TILE_COLORS[0],
  };

  //Reset number of tiles left to pick
  const tilesLeftToPick = totalFactoryDisplayTiles;

  return { tileUpdates, tileBagUpdate, discardBagUpdate, tilesLeftToPick };
}

//Function to perform "end of round" calculations and state updates.
function processEndOfRound(state: IGameState) {
  console.log("Process end of Round dispatch happened");
  const playerBoardState = state.playerBoards; ///this is later mutated prior to return. Check to see if this sort of manipulation is kosher.

  //Objects to stage state updates
  let tileUpdates: { [index: string]: ITileState } = {};
  const discardBagUpdates: string[] = [];
  let nextFirstPlayer = 0;
  const newRoundNumber = state.roundNumber + 1;
  let gameCompletedUpdate = false;

  //Go through each playerBoard and score completed Pattern Lines and process floor tiles.
  for (const boardId in playerBoardState) {
    console.log("processing playerBoard: ", boardId);
    const playerNumber = boardId.slice(-1);
    const patternLineFilledStatus =
      playerBoardState[boardId].patternLineFilledStatus;
    let rowCompleted = false; //boolean to track if a row has been completed.

    //cycle through the pattern line rows and update state for completed lines.
    for (let i = 1; i <= patternLineFilledStatus.length; i++) {
      console.log("processing row: ", i);
      //If pattern Line was completed this round
      if (patternLineFilledStatus[i - 1] === true) {
        //generate scored tile state and calculate placement points
        const res1 = placeTileAndCalculatePoints(
          playerNumber,
          i,
          state,
          tileUpdates
        );

        //Check if a row has been completed
        if (res1.rowCompleted) {
          rowCompleted = true;
          playerBoardState[boardId].completedRows += 1;
        }

        //Generate updated PatternLines State and dicardBag Updates
        const res2 = processCompletedPatternLines(playerNumber, i, state);

        //DELETE FOLLOWING COMMENTED OUT CODE??????
        // //add scoreTileState to tileUpdates object.
        // tileUpdates[res1.scoredTileState.id] = res1.scoredTileState;
        //Add udpated state to tileUpdates object
        tileUpdates = {
          ...tileUpdates,
          ...res1.scoredTileState,
          ...res2.patternTileStateUpdates,
        };

        discardBagUpdates.push(...res2.discardedTiles);
        console.log("discard Bag updates is: ", discardBagUpdates);

        //Update PlayerBoard state for scored tile
        playerBoardState[boardId].currentScore += res1.points; ///REFACTOR to not mutate playerboardstate here. Store in an object and upack at end.

        //Update placedColorsLog for tracking completed color sets at end of game
        playerBoardState[boardId].placedColorsLog[res1.scoredTileColor] += 1;
      }
    }

    //Process floor line
    const floorLineResults = processFloorLine(playerNumber, state);

    //Add floorline updates to tileUpdates
    tileUpdates = { ...tileUpdates, ...floorLineResults.tileStateUpdates };

    //check for nextPlayer updates.
    if (floorLineResults.hadFirstPlayerTile) {
      nextFirstPlayer = +playerNumber;
    }

    //Adjust scores for broken tiles.
    //update score in playerboard state
    playerBoardState[boardId].currentScore += floorLineResults.brokenTilePoints;

    //Reset pattern line completed status
    playerBoardState[boardId].patternLineFilledStatus = [
      false,
      false,
      false,
      false,
      false,
    ];

    //Check if any rows were completed. If so then set gameCompleted state to true
    if (rowCompleted) gameCompletedUpdate = true;
  }
  return {
    ...state,
    tiles: { ...state.tiles, ...tileUpdates },
    endOfRound: false,
    playerBoards: { ...playerBoardState },
    roundNumber: newRoundNumber,
    discardBag: [...state.discardBag, ...discardBagUpdates],
    activePlayer: nextFirstPlayer,
    gameCompleted: gameCompletedUpdate,
    startOfRound: true,
  };
}

//Function to reset floor line to default values, update first player state, reset player 1 tile, and calculate negative points.
function processFloorLine(playerNumber: string, state: IGameState) {
  const tileStateUpdates: { [index: string]: ITileState } = {};
  let hadFirstPlayerTile = false;
  let brokenTilePoints = 0;

  for (let i = 1; i <= NUM_OF_FLOOR_TILES; i++) {
    const tileId = `PB${playerNumber}-FT-T${i}`;

    //early return if empty floor tile is found
    if (!state.tiles[tileId].visible) break;

    //reset tile state
    tileStateUpdates[tileId] = {
      id: tileId,
      visible: false,
      color: "",
    };

    //Check if player had the playerOne tile
    if (state.tiles[tileId].color === TILE_COLORS[0]) {
      hadFirstPlayerTile = true;
    }

    //determine negative point
    if (state.tiles[tileId].visible === true) {
      switch (i) {
        case 1:
          brokenTilePoints = -1;
          break;
        case 2:
          brokenTilePoints = -2;
          break;
        case 3:
          brokenTilePoints = -4;
          break;
        case 4:
          brokenTilePoints = -6;
          break;
        case 5:
          brokenTilePoints = -8;
          break;
        case 6:
          brokenTilePoints = -11;
          break;
        case 7:
          brokenTilePoints = -14;
          break;
        default:
          throw new Error(
            "Loop calculating broken tile scores ran too many times"
          );
      }
    }
  }
  return {
    tileStateUpdates: tileStateUpdates,
    hadFirstPlayerTile,
    brokenTilePoints,
  };
}

//Function reset completed pattern lines to default values and discard extra tiles.
function processCompletedPatternLines(
  playerNumber: string,
  rowNum: number,
  state: IGameState
) {
  const patternLineStateUpdates: { [index: string]: ITileState } = {};
  const discardedTiles = [];

  for (let j = 1; j <= rowNum; j++) {
    const patternTileId = `PB${playerNumber}-PL${rowNum}-T${j}`;

    //generate update for patternline state. Reset to default values.
    patternLineStateUpdates[patternTileId] = {
      id: patternTileId,
      visible: false,
      color: "",
    };

    //Add extra tiles to discarded tiles array
    if (j != 1) discardedTiles.push(state.tiles[patternTileId].color);
  }

  return {
    patternTileStateUpdates: patternLineStateUpdates,
    discardedTiles: discardedTiles,
  };
}

//Function to generate new wallTile state for scored tiles and then calculate the tile placement points. Returns an object with the tileState and points.
function placeTileAndCalculatePoints(
  playerNumber: string,
  i: number,
  state: IGameState,
  tileUpdates: { [index: string]: ITileState }
) {
  //Values to be updated and returned
  let tilePlacementPoints = 0;
  let wallTileId = "";
  const scoredTileState: { [index: string]: ITileState } = {};
  let rowCompleted = true;
  const patternTileId = `PB${playerNumber}-PL${i}-T${1}`;
  const patternTileColor = state.tiles[patternTileId].color;

  console.log("pattern line complete");
  //Search wall line for correct location.
  for (let j = 1; j <= NUM_OF_WALL_TILES_PER_LINE; j++) {
    console.log("checking column: ", j);
    wallTileId = `PB${playerNumber}-WL${i}-T${j}`;
    const wallTileColor = state.tiles[wallTileId].color;

    //Generate new tilestate to be returned.
    if (wallTileColor === patternTileColor) {
      console.log("placing wall tile color: ", wallTileColor);
      scoredTileState[wallTileId] = {
        id: wallTileId,
        visible: true,
        color: patternTileColor,
      };

      //Calculate placement Points: Determine number of adjacent tiles and then sum points per game rules.

      //Recursive function to calculate the number of adjacent tiles in a row or column.
      const sumAdjacentTiles = (
        //   matrix: { horz: number; vert: number }[][],
        playerNumber: string,
        hIndex: number,
        vIndex: number,
        lineType: string, //"horz" to search rows. "vert" to search columns
        increment: number //Argument used to indicate direction to look. UP || LEFLT = -1, DOWN || RIGHT = 1.
      ) => {
        const wallTileId = `PB${playerNumber}-WL${vIndex}-T${hIndex}`;
        let numAdjacentTiles = 0;

        console.log("in recurssion Loop wallTileId: ", wallTileId);

        //Recursion Base case for edges of tile Wall
        if (
          vIndex < 1 ||
          vIndex > NUM_OF_PATTERN_LINES ||
          hIndex < 1 ||
          hIndex > NUM_OF_WALL_TILES_PER_LINE
        )
          return 0;
        //Recursion base case for empty tiles.
        if (
          !state.tiles[wallTileId].visible &&
          !tileUpdates[wallTileId]?.visible
        )
          return 0;

        //Validate parameters
        //confirm valid lineType was entered
        if (lineType !== "horz" && lineType !== "vert")
          throw new Error(
            "Invalid LineType was entered. LineType must be 'horz' or 'vert'"
          );
        //confirm valid direction was entered
        if (increment !== -1 && increment !== 1) {
          throw new Error(
            "Invalid increment was entered. Increment value must be 1 or -1."
          );
        }

        //confirm valid index value was entered
        if (0 >= vIndex && vIndex > NUM_OF_PATTERN_LINES) {
          throw new Error("Invalid vIndex was entered. ");
        }
        if (0 >= hIndex && hIndex > NUM_OF_WALL_TILES_PER_LINE) {
          throw new Error("Invalid vIndex was entered. ");
        }

        if (lineType === "horz") hIndex = hIndex + increment;
        if (lineType === "vert") vIndex = vIndex + increment;

        numAdjacentTiles +=
          1 +
          sumAdjacentTiles(playerNumber, hIndex, vIndex, lineType, increment);

        return numAdjacentTiles;
      };

      const horzTiles =
        sumAdjacentTiles(playerNumber, j - 1, i, "horz", -1) +
        sumAdjacentTiles(playerNumber, j + 1, i, "horz", 1);
      const vertTiles =
        sumAdjacentTiles(playerNumber, j, i - 1, "vert", -1) +
        sumAdjacentTiles(playerNumber, j, i + 1, "vert", 1);
      const horzPoints = horzTiles > 0 ? 1 + horzTiles : 0;
      const vertPoints = vertTiles > 0 ? 1 + vertTiles : 0;
      tilePlacementPoints =
        horzPoints + vertPoints > 0 ? horzPoints + vertPoints : 1;

      console.log(
        "after recursion, current score: ",
        //   playerBoardState[boardId].currentScore,
        "  tile points ",
        tilePlacementPoints,
        "vert tiles: ",
        vertPoints,
        "horz Tiles:  ",
        horzPoints
      );
    }

    //Check if any Wall Tile Locations are still unfilled  and set rowCompleted to false.
    if (!state.tiles[wallTileId].visible && !scoredTileState[wallTileId]) {
      rowCompleted = false;
    }
  }
  return {
    points: tilePlacementPoints,
    scoredTileColor: patternTileColor,
    scoredTileState: scoredTileState,
    rowCompleted: rowCompleted,
  };
}

function placeSelectedTilesAction(state: IGameState, action: IAction) {
  let numOfSelectedTiles = state.selectedTileState.qty;
  let numOfTilesInCenter = state.numOfTilesInCenter;
  const newTilesLeftToPick = state.tilesLeftToPick - numOfSelectedTiles;
  let newEndOfRound = false;

  //THIS ACTION PEFORMS THE FOLLOWING:
  //   Places selected tiles on the selected line
  //   Places the unselected tiles from the selected tile's  display in the Center Display.
  //   Removes tiles from the selected tile's display
  //   Resets selectedTileState
  //   Updates Active Player state

  let lineId = action.payload.lineId;
  const boardId = lineId.slice(0, 3);
  const selectedTileColor = action.payload.selectedTileColor; //refactor to grab from state and not pass in as a payload property
  const displayCode = action.payload.selectedTileDisplayCode; //refactor to grab from state and not pass in as a payload property.
  const playerNumber = action.payload.playerNumber;
  let lineType = lineId.slice(-2) === "FT" ? "FloorLine" : "PatternLine";
  let newPlayerOneTileLoc = state.playerOneTileLoc;

  //Object to stage tile state updates.
  const tileUpdates: { [index: string]: ITileState } = {};

  //Object to store playerBoard state updates
  const playerBoardUpdates: { [index: string]: IPlayerBoardState } = {
    ...state.playerBoards,
  };

  //check if playerOne tile was taken and update tile state accordingly
  if (displayCode == "CD" && state.playerOneTileLoc === 0) {
    let i = 1;
    while (i <= NUM_OF_FLOOR_TILES && newPlayerOneTileLoc === 0) {
      const tileId = `PB${playerNumber}-FT-T${i}`;
      //If the current tile slot is empty update current tile slot.
      if (!state.tiles[tileId].visible && newPlayerOneTileLoc === 0) {
        tileUpdates[tileId] = {
          id: tileId,
          visible: true,
          color: TILE_COLORS[0],
        };
        newPlayerOneTileLoc = playerNumber;
        tileUpdates[`CD-PlayerOne_Tile`] = {
          id: `CD-PlayerOne_Tile`,
          visible: false,
          color: TILE_COLORS[0],
        };
      }
      i++;
    }
  }

  //Set the tile updates for the tiles placed on selected pattern line or floor line.
  if (lineType === "PatternLine") {
    const numOfTilesInLine = parseInt(lineId.slice(-1), 10); //Grab the line number. Number of tiles is equal to the line number.

    for (let i = 1; i <= numOfTilesInLine; i++) {
      const tileId = `${lineId}-T${i}`;
      //If thee current tile slot is empty and there are still tiles left to be placed. Update current tile slot.
      if (!state.tiles[tileId].visible && numOfSelectedTiles > 0) {
        tileUpdates[tileId] = {
          id: tileId,
          visible: true,
          color: selectedTileColor,
        };
        numOfSelectedTiles -= 1;
        //If last tile in current Line is filled update playerBoard state.
        if (i === numOfTilesInLine) {
          playerBoardUpdates[boardId].patternLineFilledStatus[i - 1] = true;
        }
      }
    }
  }

  //If there are extra tiles after filling the PatternLine move to the floor line.
  if (numOfSelectedTiles > 0) {
    lineType = "FloorLine";
    lineId = boardId + "-FT"; //grabs PlayerBoard number and adds FT suffix.
  }

  //Set the tile updates for the tiles placed on the selected floor line.
  if (lineType === "FloorLine") {
    const numOfTilesInLine = NUM_OF_FLOOR_TILES;

    for (let i = 1; i <= numOfTilesInLine; i++) {
      const tileId = `${lineId}-T${i}`;
      //If the current tile slot is empty and there are still tiles left to be placed, then update current tile slot. Note: the !TileUpdates[tileId] condition checks to see if the player 1 tile was placed during earlier in this dispatch action; the state.tiles will not have that update yet.
      if (
        !state.tiles[tileId].visible &&
        numOfSelectedTiles > 0 &&
        !tileUpdates[tileId]
      ) {
        tileUpdates[tileId] = {
          id: tileId,
          visible: true,
          color: selectedTileColor,
        };
        numOfSelectedTiles -= 1;
      }
    }
  }

  //If the floor line is full and there are still extra tiles. Place them in the discard bag
  const discardBagUpdates: string[] = [];
  while (numOfSelectedTiles > 0) {
    discardBagUpdates.push(selectedTileColor);
    numOfSelectedTiles -= 1;
  }

  //Set tile updates for the selected Display Tiles
  if (displayCode === "CD") {
    //Update state for the removed center display tiles
    for (let i = 1; i <= numOfTilesInCenter; i++) {
      const tileId = `${displayCode}-T${i}`;
      const tileState = state.tiles[tileId];

      if (tileState.color === selectedTileColor) {
        tileUpdates[tileId] = { id: tileId, visible: false, color: "" };
      }
    }
  } else {
    //Update State for the factory display tiles and push unselected tiles to center display.
    for (let i = 1; i <= TILES_PER_FD; i++) {
      const tileId = `${displayCode}-T${i}`;
      const tileState = state.tiles[tileId];

      //Set visibility for factory display tiles to false
      tileUpdates[tileId] = { ...tileState, visible: false };

      //Assign the unselected factory display tiles to the Center Display
      if (tileState.color !== selectedTileColor) {
        const nextOpenTileInCenter = numOfTilesInCenter;
        const centerTileId = `CD-T${nextOpenTileInCenter}`;
        numOfTilesInCenter += 1;

        tileUpdates[centerTileId] = {
          id: centerTileId,
          visible: true,
          color: tileState.color,
        };
      }
    }
  }

  //Values to reset selectedTileState
  const defaultSelectedTileState = {
    selected: false,
    color: "",
    qty: 0,
    displayCode: "",
  };

  //Set value for next player
  const nextPlayer =
    state.activePlayer === state.playerCount ? 1 : state.activePlayer + 1;
  // const nextPlayer = 1;

  //Check if all tiles were processed.
  if (numOfSelectedTiles > 0)
    throw new Error("Tile placement did not process all tiles.");

  //Check if round is over
  if (newTilesLeftToPick === 0) {
    newEndOfRound = true;
  }

  return {
    ...state,
    tiles: { ...state.tiles, ...tileUpdates },
    selectedTileState: defaultSelectedTileState,
    activePlayer: nextPlayer,
    numOfTilesInCenter: numOfTilesInCenter,
    discardBag: [...state.discardBag, ...discardBagUpdates],
    tilesLeftToPick: newTilesLeftToPick,
    endOfRound: newEndOfRound,
    playerOneTileLoc: newPlayerOneTileLoc,
    playerBoards: { ...state.playerBoards, ...playerBoardUpdates },
  };
}
