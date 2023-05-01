import { CSSProperties, Dispatch, MutableRefObject } from "react";
import {
  GameState as IGameState,
  Action as IAction,
} from "../../Types/AppTypes";
import "./FactoryContainer.styles.css";
import { RenderCount } from "../../utils/renderCount";
import CenterDisplay from "./components/CenterDisplay/CenterDisplay";
import FactoryDisplay from "./components/FactoryDisplay/FactoryDisplay";

const FactoryContainer = ({
  playerCount = 1,
  gameState,
  numOfSelectedTiles,
  dispatch,
}: {
  playerCount: number;
  gameState: IGameState;
  numOfSelectedTiles: MutableRefObject<number>;
  dispatch: Dispatch<IAction>;
}) => {
  const factoryDisplays = [];
  const numOfDisplays = 2 * playerCount + 1;

  for (let i = 1; i <= numOfDisplays; i++) {
    factoryDisplays.push(
      <FactoryDisplay
        key={`FD${i}`}
        factoryDisplayNum={i}
        gameState={gameState}
        dispatch={dispatch}
        numOfSelectedTiles={numOfSelectedTiles}
      />
    );
  }

  return (
    <div
      className="factoryContainer"
      style={
        { "--numOfDisplays": numOfDisplays } as CSSProperties
      } /*Used in CSS transformations. Allows for variable number of Factory Displays*/
    >
      {/* <RenderCount /> */}
      {factoryDisplays}
      <CenterDisplay
        gameState={gameState}
        numOfSelectedTiles={numOfSelectedTiles}
        dispatch={dispatch}
      />
    </div>
  );
};
export default FactoryContainer;
