export type IProgress =
  | (typeof ProgressStyles)[keyof typeof ProgressStyles]
  | [string, string];

/**
 * Used for when emojis are used in the progressbar, and create character misalignments
 */
export const EMOJI_WIDTH = 'ㅤ';

const HYPHEN__SPACE = ['-', ' '] as const;
const HASH__HYPHEN = ['#', '-'] as const;
const SQUARE__EMPTY = ['■', ' '] as const;
const SQUARE__HYPHEN = ['■', '-'] as const;
const SQUARE__EMPTY_SQUARE = ['■', '□'] as const;
const SLANT__EMPTY_SLANT = ['▰', '▱'] as const;
const RECT__DOTTED_RECT = ['█', '░'] as const;
const PURPLE_HEART__BLACK_HEART = ['💜', '🖤'] as const; // Work on fix for 🤍
const BUGINESE_EOS__RUNIC_SINGLE_PUNC = ['᨟', '᛫'] as const;

export const ProgressStyles = {
  HYPHEN__SPACE,
  HASH__HYPHEN,
  SQUARE__EMPTY,
  SQUARE__HYPHEN,
  SQUARE__EMPTY_SQUARE,
  SLANT__EMPTY_SLANT,
  RECT__DOTTED_RECT,
  PURPLE_HEART__BLACK_HEART,
  BUGINESE_EOS__RUNIC_SINGLE_PUNC,
};
