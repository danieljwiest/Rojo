import { TILE_COLORS } from "../constants/constants";

const tileBag: string[] = [];

for (let i = 0; i < 100; i++) {
  switch (true) {
    case i < 20:
      tileBag.push(TILE_COLORS[1]);
      break;
    case i < 40:
      tileBag.push(TILE_COLORS[2]);
      break;
    case i < 60:
      tileBag.push(TILE_COLORS[3]);
      break;
    case i < 80:
      tileBag.push(TILE_COLORS[4]);
      break;
    case i < 100:
      tileBag.push(TILE_COLORS[5]);
      break;
  }
}

export default tileBag;
