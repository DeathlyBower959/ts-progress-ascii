import { Progress, Styles } from '../index';

const progress = new Progress(100, Styles.Pack.PERSONAL);

const interval = setInterval(() => {
  progress.setValue(prev => prev + 1);
  // progress2.setValue(prev => prev + 2);
}, 90);
progress.addListener(() => clearInterval(interval));
