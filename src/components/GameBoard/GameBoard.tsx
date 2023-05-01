import { CSSProperties, useReducer, useRef } from "react";
import { GameParams as IGameParams } from "../../Types/AppTypes";
import "./GameBoard.styles.css";
import PlayerBoard from "../PlayerBoard/PlayerBoard";
import useViewport from "../../Hooks/useViewport";
import FactoryContainer from "../FactoryContainer/FactoryContainer";
import initGameState from "../../utils/initGameState";
import TILEBAG from "../../utils/tileBag";
import shuffle from "../../utils/shuffle";
import { RenderCount } from "../../utils/renderCount";
import gameStateReducer from "../../Reducers/gameStateReducer";

const initTileBag = shuffle(TILEBAG);

const GameBoard = ({ gameParams }: { gameParams: IGameParams }) => {
  const playerCount = +gameParams.playerCount;
  const playerBoards = [];
  const viewport = useViewport();
  const screenWidth = viewport.width;
  const screenHeight = viewport.height;
  //set playerboard size such that entire game area remains on screen.
  let playerBoardWidth = screenWidth > screenHeight ? "25vh" : "25vw";

  //Reset PlayerBoardWidth for mobile configuration.
  if (screenWidth <= 480) {
    playerBoardWidth = "50vw";
  }

  //Create a "twoPlayerGame" CSS class to update PlayerBoard positions for a 2-player game. Will change the postion of PlayerBoard 2 to be below the market.
  let optionalTwoPlayerGameCssClass = "";
  if (playerCount === 2) {
    optionalTwoPlayerGameCssClass = "twoPlayerGame";
  }

  ///STATE
  const numOfSelectedTiles = useRef(0); //Reference to track the QTY of tiles selected by the player from a factory display

  //Create Initial Game State
  const initialGameState = initGameState(playerCount, initTileBag);

  const [gameState, dispatch] = useReducer(gameStateReducer, initialGameState);
  ///END STATE

  //initizize the playerboard array
  for (let i = 1; i <= playerCount; i++) {
    playerBoards.push(
      <PlayerBoard
        key={`PB${i}`}
        playerNumber={i}
        activePlayer={gameState.activePlayer}
        numOfSelectedTiles={numOfSelectedTiles}
        gameState={gameState}
        dispatch={dispatch}
      />
    );
  }

  //Game Progression triggers.
  if (gameState.endOfRound) {
    console.log("****ROUND ENDED*****");
    dispatch({
      type: "PROCESS_END_OF_ROUND",
      payload: {
        playerNumber: 99,
        lineId: "ROUND END DISPATCH",
        selectedTileColor: gameState.selectedTileState.color,
        selectedTileDisplayCode: gameState.selectedTileState.displayCode,
        numOfSelectedTiles: 80,
      },
    });
  }

  if (gameState.gameCompleted) {
    console.log("******  GAME OVER *****");
    dispatch({
      type: "PROCESS_END_OF_GAME",
      payload: {
        playerNumber: 70,
        lineId: "END OF GAME DISPATCH",
        selectedTileColor: gameState.selectedTileState.color,
        selectedTileDisplayCode: gameState.selectedTileState.displayCode,
        numOfSelectedTiles: 70,
      },
    });
  }

  if (gameState.startOfRound && !gameState.gameCompleted) {
    console.log("**** START OF ROUND ****");
    dispatch({
      type: "INIT_NEXT_ROUND",
      payload: {
        playerNumber: 88,
        lineId: "NEW ROUND DISPATCH",
        selectedTileColor: gameState.selectedTileState.color,
        selectedTileDisplayCode: gameState.selectedTileState.displayCode,
        numOfSelectedTiles: 70,
      },
    });
  }

  if (gameState.winner !== 0) {
    alert(`Player ${gameState.winner} won!!!!!!`);
  }

  console.log("gamestate:  ", gameState);

  return (
    <div
      className={`gameBoard ${optionalTwoPlayerGameCssClass}`}
      style={{ "--playerBoardWidth": playerBoardWidth } as CSSProperties}
    >
      {/* <div> {`Screen Width = ${screenWidth}`}</div> */}
      {/* <RenderCount /> */}
      <FactoryContainer
        playerCount={playerCount}
        gameState={gameState}
        numOfSelectedTiles={numOfSelectedTiles}
        dispatch={dispatch}
      />
      {playerBoards}
    </div>
  );
};

export default GameBoard;
