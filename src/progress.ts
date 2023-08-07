import ansi, { Cursor } from 'ansi';
import { stdout } from 'process';

import { LoaderStyles, ProgressStyles } from './';
import { IFrames } from './styles/loaders';
import { IProgress } from './styles/progress';

type IWidth = number | 'auto';
export class Progress {
  // Properties
  public completed = 0;
  public total: number;
  public get isComplete() {
    return this.completed === this.total;
  }

  private cursor: Cursor;

  private _width: IWidth;
  private get width() {
    // stdout.columns doesnt get "live" width, so look into a solution for that
    return this._width === 'auto'
      ? Math.min(Math.max(stdout.columns - 30, 25), 70)
      : this._width;
  }

  private progress_chars: IProgress;
  private spinner_frames: IFrames;
  private frames_idx = 0;

  private callbacks: (() => void)[] = [];

  // Constructor
  /**
   * @param progressChars ProgressStyles.HASH_HYPHEN
   * @param frames LoaderStyles.DOTS
   */
  constructor(
    total: number,
    progressChars: IProgress = ProgressStyles.HASH_HYPHEN,
    frames: IFrames = LoaderStyles.DOTS,
    template: '',
    width: IWidth = 'auto'
  ) {
    this.total = Math.max(total, 0);
    this.progress_chars = progressChars;
    this.spinner_frames = frames;
    this._width = width === 'auto' ? width : Math.round(width);

    this.cursor = ansi(stdout).hide();
  }

  // Public
  public addListener(callback: () => void) {
    this.callbacks.push(callback);
  }

  public setValue(value: (prev: number) => number): void;
  public setValue(value: number): void;
  public setValue(value: number | ((prev: number) => number)) {
    if (typeof value === 'number') {
      this.completed = Math.max(value, 0);
    } else {
      this.completed = Math.max(value(this.completed), 0);
    }
  }
  public setTotal(value: (prev: number) => number): void;
  public setTotal(value: number): void;
  public setTotal(value: number | ((prev: number) => number)) {
    if (typeof value === 'number') {
      this.total = Math.max(value, 0);
    } else {
      this.total = Math.max(value(this.total), 0);
    }
  }

  // Private
  public tick(): boolean {
    const SPINNER = this.spinner_frames[this.frames_idx];
    this.frames_idx = (this.frames_idx + 1) % this.spinner_frames.length;

    const left = Math.round(
      (this.total <= 0 ? 1 : this.completed / this.total) * this.width
    );
    const leftChars = this.progress_chars[0].repeat(left);
    const rightChars = this.progress_chars[1].repeat(
      Math.max(this.width - left, 0)
    );
    const BAR = `${leftChars}${rightChars}`;

    const DATA = `${Math.round(
      (this.total <= 0 ? 1 : this.completed / this.total) * 100
    )}% - ${this.completed}/${this.total}`;

    const progress = `${SPINNER} [${BAR}] | ${DATA}`;

    // if (typeof stdout.clearLine !== 'function') {
    // console.log(progress); // Same line will not be printed
    // } else {
    this.cursor.horizontalAbsolute().write(`\r${progress}`);
    // }

    if (this.completed >= this.total) {
      this.cursor.show();
      this.callbacks.forEach(x => x());
      return true;
    }

    return false;
  }
}

export class MultiProgress {
  public bars: Progress[] = [];

  add(bar: Progress) {
    this.bars.push(bar);
  }
}
