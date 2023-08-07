export type ITemplate = string;

const NO_COLOR =
  '@spinner [@bar] | @percentage% - @completed/@total @elapsedms';

// Thx gianna :>
const HELLO_KITTY_GIANNA =
  '(#0b5a95)@spinner (#e8b4c3)[@bar] (#white)| (#0b5a95)@percentage% (#white)- (#e8b4c3)@completed(#white)/(#0b5a95)@total' as const;
const PURPLE_HEART_GIANNA =
  '[@bar] (#5c20f5)@spinner(#white) | (#5c20f5)@percentage%(#white)';
const PERSONAL =
  '@spinner (#a0a0a0)[(#7925c7)@bar(#a0a0a0)] | (#white)@percentage% (#a0a0a0)- (#yellow)@completed(#a0a0a0)/(#a0a0a0)@total (#a0a0a0)- (#9ffca5)@elapsed(#a0a0a0)ms(#white)';

export const TemplateStyles = {
  NO_COLOR,
  HELLO_KITTY_GIANNA,
  PURPLE_HEART_GIANNA,
  PERSONAL,
};
