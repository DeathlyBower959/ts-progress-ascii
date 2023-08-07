import { Progress, ProgressStyles } from '../index';

const progress = new Progress(20, ProgressStyles.SQUARE_HYPHEN);

progress.addListener(() => console.log(''));
const interval = setInterval(() => {
  if (progress.tick()) {
    clearInterval(interval);
  }

  progress.setValue(prev => prev + 1);
}, 90);
