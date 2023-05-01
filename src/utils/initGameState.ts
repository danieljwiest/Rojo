import { GameState as IGameState } from "../Types/AppTypes";
import {
  TILES_PER_FD,
  NUM_OF_WALL_TILES_PER_LINE,
  NUM_OF_PATTERN_LINES,
  NUM_OF_FLOOR_TILES,
  NUM_OF_CENTER_TILES,
  WALL_DEFAULT_PATTERN,
  TILE_COLORS,
} from "../constants/constants";
import ensure from "./ensureType";

const initGameState = (
  playerCount: number,
  initTileBag: string[],
  variantRules = false
) => {
  const gameState: IGameState = {
    activePlayer: 1,
    playerCount: playerCount,
    roundNumber: 1,
    tiles: {},
    playerBoards: {},
    // scoreMarkers: {},
    tileBag: [],
    discardBag: [],
    playerOneTileLoc: 0,
    numOfTilesInCenter: 1,
    tilesLeftToPick: 0,
    endOfRound: false,
    startOfRound: false,
    gameCompleted: false,
    selectedTileState: {
      selected: false,
      color: "",
      qty: 0,
      displayCode: "",
    },
    winner: 0,
  };

  const numPlayerBoards = playerCount;
  const numFactoryDisplays = 2 * playerCount + 1;
  const totalFactoryDisplayTiles = numFactoryDisplays * TILES_PER_FD;
  gameState.tilesLeftToPick = totalFactoryDisplayTiles;

  //Init tileBag
  //Create an array of the starting Factory Display tiles and assign remaining tiles to gameState. This step was added due to problems with directly updating the tileBag state when the React v18 strict mode runs the function twice.
  const startingFactoryDisplayTiles = initTileBag.slice(
    0,
    totalFactoryDisplayTiles
  );
  gameState.tileBag = initTileBag.slice(totalFactoryDisplayTiles);

  //***NAMING SYSTEM FOR TILE IDs***
  //
  // PB#-SM#      <---> {PlayerBoard #}-{ScoreMaker #}
  // PB#-PL#-T#   <---> {PlayerBoard #}-{PatternLine#}-{Tile#}
  // PB#-WL#-T#   <---> {PlayerBoard #}-{WallLine#}-{Tile#}
  // PB#-FT-T#    <---> {PlayerBoard #}-{FloorTile}-{Tile#}
  // FD#-T#       <---> {FactoryDisplay#}-{Tile#}
  // CD-T#        <---> {FactoryCenter#}-{Tile#}
  //

  //Initialize each player board
  for (let i = 1; i <= numPlayerBoards; i++) {
    //Initialize Pattern & Wall Tiles
    for (let j = 1; j <= NUM_OF_PATTERN_LINES; j++) {
      //Initialize Pattern Tiles
      for (let k = 1; k <= j; k++) {
        const tileId = `PB${i}-PL${j}-T${k}`;
        gameState.tiles[tileId] = { id: tileId, visible: false, color: "" };
      }
      //Initialize Wall Tiles
      for (let k = 1; k <= NUM_OF_WALL_TILES_PER_LINE; k++) {
        const tileId = `PB${i}-WL${j}-T${k}`;
        let boxColor = "";
        if (!variantRules) {
          boxColor = WALL_DEFAULT_PATTERN[j - 1][k - 1];
        }
        gameState.tiles[tileId] = {
          id: tileId,
          visible: false,
          color: boxColor,
        };
      }
    }

    //Initialize Floor Line Tiles
    for (let j = 1; j <= NUM_OF_FLOOR_TILES; j++) {
      const tileId = `PB${i}-FT-T${j}`;
      gameState.tiles[tileId] = { id: tileId, visible: false, color: "" };
    }
  }

  //Initialize Display Tiles
  for (let i = 1; i <= numFactoryDisplays; i++) {
    for (let j = 1; j <= TILES_PER_FD; j++) {
      const tileId = `FD${i}-T${j}`;

      //Remove tile from starting array and assign to current Tile.
      const tileColor = ensure(startingFactoryDisplayTiles.shift());

      //assign tile state
      gameState.tiles[tileId] = {
        id: tileId,
        visible: true,
        color: tileColor,
      };
    }
  }

  //Initialize Center Tiles
  for (let i = 0; i < NUM_OF_CENTER_TILES; i++) {
    if (i === 0) {
      //Initialize first tile as the First Player Marker
      const tileId = `CD-PlayerOne_Tile`;
      gameState.tiles[tileId] = {
        id: tileId,
        visible: true,
        color: TILE_COLORS[0],
      };
    } else {
      //Initilize as a regular tile slot
      const tileId = `CD-T${i}`;
      gameState.tiles[tileId] = { id: tileId, visible: false, color: "" };
    }
  }

  //initialize player board state
  for (let i = 1; i <= playerCount; i++) {
    const boardId = `PB${i}`;
    const placedColorsLog: { [index: string]: number } = {};

    for (let j = 1; j < TILE_COLORS.length; j++) {
      //Note: loop purposely skips index 0.
      const color = TILE_COLORS[j];
      placedColorsLog[color] = 0;
    }

    gameState.playerBoards[boardId] = {
      id: boardId,
      currentScore: 0,
      patternLineFilledStatus: [false, false, false, false, false], //represents if patternlines are filled at end of round.
      completedRows: 0,
      completedColumns: 0,
      completedColors: 0,
      placedColorsLog: placedColorsLog,
    };
  }

  return gameState;
};

export default initGameState;
