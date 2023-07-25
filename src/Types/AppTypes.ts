export interface GameParams {
  playSelection: string;
  playerCount: string;
}

export interface TileState {
  id: string;
  visible: boolean;
  color: string;
}

export interface PlayerBoardState {
  id: string;
  // visible: boolean;
  // active: boolean;
  currentScore: number;
  patternLineFilledStatus: boolean[];
  completedRows: number;
  completedColumns: number;
  completedColors: number;
  placedColorsLog: { [index: string]: number };
}

export interface PatternLineState {
  [index: string]: {
    color: string;
    numOfTiles: number;
    hover: string;
    completedColors: { [index: string]: number };
  };
}
export interface SelectedTileState {
  selected: boolean;
  color: string;
  qty: number;
  displayCode: string;
}

//DELETE IF WE DONT USE A REDUCER FOR HOVERED TILES

// export interface HoveredTileState {
//   tileColor: string;
//   qty: number;
// }

// export interface HoveredTileAction {
//   type: string;
//   payload?: { tileColor: string };
// }

///DELETE ABOVE IF REQUIRED

// export type GameState = string;
export interface GameState {
  activePlayer: number;
  playerCount: number;
  roundNumber: number;
  tiles: { [index: string]: TileState };
  playerBoards: { [index: string]: PlayerBoardState };
  // scoreMarkers: { [index: string]: ScoreMarkerState };
  tileBag: string[];
  discardBag: string[];
  playerOneTileLoc: number; // 0 = CD, 1 = Player 1, 2 = Player 2, etc
  numOfTilesInCenter: number;
  tilesLeftToPick: number;
  endOfRound: boolean;
  startOfRound: boolean;
  gameCompleted: boolean;
  selectedTileState: SelectedTileState;
  winner: number;
}

export interface Action {
  type: string;
  // tileId: string;
  // tileVisible: boolean;
  // tileColor: string;
  // payload: TileState | number;

  payload: {
    playerNumber: number;
    lineId: string;
    selectedTileColor: string;
    selectedTileDisplayCode: string;
    numOfSelectedTiles: number;
    // numOfTilesInCenter: MutableRefObject<number>;
  };
}

//FOLLOWING TYPES ARE NOT BEING USED. REINSTATE IF tileBagReducer is being used.
// export type TileBag = string[];
// export interface Action {
//   type: string;
// }
