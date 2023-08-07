import { IFrames, LoaderStyles } from './loaders';
import { IProgress, ProgressStyles } from './progress';
import { ITemplate, TemplateStyles } from './templates';

export interface IStylePack {
  progressChars: IProgress;
  frames: IFrames;
  template: ITemplate;
}

const DEFAULT: IStylePack = {
  template: TemplateStyles.NO_COLOR,
  progressChars: ProgressStyles.HASH__HYPHEN,
  frames: LoaderStyles.DOTS,
};

const PERSONAL: IStylePack = {
  template: TemplateStyles.PERSONAL,
  progressChars: ProgressStyles.SQUARE__HYPHEN,
  frames: LoaderStyles.DOTS,
};

/**
 * Thx gianna :>
 */
const HELLO_KITTY_GIANNA: IStylePack = {
  template: TemplateStyles.HELLO_KITTY_GIANNA,
  progressChars: ProgressStyles.SLANT__EMPTY_SLANT,
  frames: LoaderStyles.BLINK,
};
const PURPLE_HEART_GIANNA: IStylePack = {
  template: TemplateStyles.PURPLE_HEART_GIANNA,
  progressChars: ProgressStyles.PURPLE_HEART__BLACK_HEART,
  frames: LoaderStyles.ARROW,
};

export const StylePack = {
  DEFAULT,
  HELLO_KITTY_GIANNA,
  PURPLE_HEART_GIANNA,
  PERSONAL,
};
