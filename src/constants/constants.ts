export const TILES_PER_FD = 4;
export const NUM_OF_WALL_TILES_PER_LINE = 5;
export const NUM_OF_PATTERN_LINES = 5;
export const NUM_OF_SCORE_MARKER_ROWS = 5;
export const NUM_OF_SCORE_MARKERS_PER_ROW = 20;
export const NUM_OF_SCORE_MARKER_TILES = 101;
export const NUM_OF_FLOOR_TILES = 7;
export const NUM_OF_CENTER_TILES = 28;
export const FLOOR_TILE_VALUES = [-1, -1, -2, -2, -2, -3, -3];
export const TILE_COLORS = [
  "color-p1",
  "color1",
  "color2",
  "color3",
  "color4",
  "color5",
];

export const WALL_DEFAULT_PATTERN = [
  [
    TILE_COLORS[1],
    TILE_COLORS[2],
    TILE_COLORS[3],
    TILE_COLORS[4],
    TILE_COLORS[5],
  ],
  [
    TILE_COLORS[5],
    TILE_COLORS[1],
    TILE_COLORS[2],
    TILE_COLORS[3],
    TILE_COLORS[4],
  ],
  [
    TILE_COLORS[4],
    TILE_COLORS[5],
    TILE_COLORS[1],
    TILE_COLORS[2],
    TILE_COLORS[3],
  ],
  [
    TILE_COLORS[3],
    TILE_COLORS[4],
    TILE_COLORS[5],
    TILE_COLORS[1],
    TILE_COLORS[2],
  ],
  [
    TILE_COLORS[2],
    TILE_COLORS[3],
    TILE_COLORS[4],
    TILE_COLORS[5],
    TILE_COLORS[1],
  ],
];
