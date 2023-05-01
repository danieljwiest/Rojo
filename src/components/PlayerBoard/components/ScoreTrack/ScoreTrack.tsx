import {
  NUM_OF_SCORE_MARKERS_PER_ROW,
  NUM_OF_SCORE_MARKER_ROWS,
} from "../../../../constants/constants";
import "./ScoreTrack.styles.css";
import ScoreMarker from "../ScoreMarker/ScoreMarker";

const ScoreTrack = ({
  playerBoardNum,
  playerScore,
}: {
  playerBoardNum: number;
  playerScore: number;
}) => {
  const scoreTrack = [];

  //populate score track
  for (let i = 0; i < NUM_OF_SCORE_MARKER_ROWS; i++) {
    const scoreTrackRow = [];

    //populate each row of score track
    for (let j = 1; j <= NUM_OF_SCORE_MARKERS_PER_ROW; j++) {
      const markerNum = i * NUM_OF_SCORE_MARKERS_PER_ROW + j;
      const scoreMarkerId = `PB${playerBoardNum}-SM${markerNum}`;

      //populate scoreMarker Boxes & place a ScoreMarker component in the box corresponding to the current player score
      const scoreMarkerBox = (
        <div key={scoreMarkerId} className="scoreMarkerBox">
          {markerNum === playerScore ? <ScoreMarker /> : null}
          {markerNum % 5 === 0 ? <p>{markerNum} </p> : null}
        </div>
      );
      scoreTrackRow.push(scoreMarkerBox);
    }
    scoreTrack.push(
      <div key={`PB${playerBoardNum}-ST-R${i}`} className="scoreTrackRow">
        {scoreTrackRow}
      </div>
    );
  }

  return (
    <div className="scoreTrackContainer">
      <div className="scoreTrackFirstRow">
        <div className="scoreMarkerBox zeroPtMarker">
          {playerScore === 0 ? <ScoreMarker /> : null}
        </div>
      </div>
      <div className="mainScoreTrack"> {scoreTrack}</div>
    </div>
  );
};

export default ScoreTrack;
