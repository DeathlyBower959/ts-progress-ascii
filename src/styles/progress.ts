export type IProgress =
  | (typeof ProgressStyles)[keyof typeof ProgressStyles]
  | [string, string];

const HYPHEN_SPACE = ['-', ' '] as const;
const HASH_HYPHEN = ['#', '-'] as const;
const SQUARE_EMPTY = ['■', ' '] as const;
const SQUARE_HYPHEN = ['■', '-'] as const;
const SQUARE_EMPTYSQUARE = ['■', '□'] as const;
const SLANT_EMPTYSLANT = ['▰', '▱'] as const;
const RECT_DOTTEDRECT = ['█', '░'] as const;

export const ProgressStyles = {
  HYPHEN_SPACE,
  HASH_HYPHEN,
  SQUARE_EMPTY,
  SQUARE_HYPHEN,
  SQUARE_EMPTYSQUARE,
  SLANT_EMPTYSLANT,
  RECT_DOTTEDRECT,
};
