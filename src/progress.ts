import ansi, { Cursor } from 'ansi';
import getCursorPosition from 'get-cursor-position';
import { stdout } from 'process';

import { LoaderStyles, ProgressStyles, TemplateStyles } from './';
import { IFrames } from './styles/loaders';
import { IProgress } from './styles/progress';

// TODO: Work on this later with customizable
// function test(str: `${'%foo%' | '%bar%'}${string}`) {}
// test('');

type IWidth = number | 'auto';
export class Progress {
  // Properties
  public completed = 0;
  public total: number;
  public get isComplete() {
    return this.completed === this.total;
  }

  cursor: Cursor;

  _width: IWidth;
  get width() {
    // stdout.columns doesnt get "live" width, so look into a solution for that
    return this._width === 'auto'
      ? Math.min(Math.max(stdout.columns - 30, 25), 70)
      : this._width;
  }

  progress_chars: IProgress;
  spinner_frames: IFrames;
  frames_idx = 0;

  template: string;

  callbacks: (() => void)[] = [];

  original_position: { row: number; col: number };

  // Constructor
  /**
   * @param progressChars ProgressStyles.HASH_HYPHEN
   * @param frames LoaderStyles.DOTS
   */
  constructor(
    total: number,
    progressChars: IProgress = ProgressStyles.SLANT_EMPTYSLANT,
    frames: IFrames = LoaderStyles.BLINK,
    template: string = TemplateStyles.HELLO_KITTY_GIANNA,
    width: IWidth = 'auto'
  ) {
    this.total = Math.max(total, 0);
    this.progress_chars = progressChars;
    this.spinner_frames = frames;
    this.template = template;
    this._width = width === 'auto' ? width : Math.round(width);

    this.cursor = ansi(stdout).hide();
    this.original_position = getCursorPosition.sync();
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

    const PERCENTAGE = `${Math.round(
      (this.total <= 0 ? 1 : this.completed / this.total) * 100
    )}`;

    let progress = this.template;

    const obj_template: Record<string, string> = {
      '@spinner': SPINNER || '',
      '@bar': BAR,
      '@percentage': PERCENTAGE,
      '@completed': this.completed.toString(),
      '@total': this.total.toString(),
    };
    type IProgressKeys = keyof typeof obj_template;

    this.cursor.horizontalAbsolute();

    const chars = this.template.split('');

    for (let idx = 0; idx < chars.length; idx++) {
      if (chars[idx] === '@') {
        const data = chars
          .join('')
          .substring(idx)
          .match(/(@[A-Za-z]+#[A-z,0-9]{6})|(@[A-Za-z]+)/);
        if (!data) continue;

        idx += data[0].length - 1;

        const split = data[0].split('#');
        const key = split[0];
        const hex = split[1];

        if (hex) {
          this.cursor.hex(hex).write(obj_template[key as IProgressKeys] ?? '');
        } else {
          this.cursor.write(obj_template[key as IProgressKeys] ?? '');
        }
      } else if (chars[idx] === '(') {
        const data = chars
          .join('')
          .substring(idx)
          .match(/\(#[A-z,0-9]{6}\)/);
        if (!data) continue;

        idx += data[0].length;

        // write colored char
        this.cursor
          .hex(data[0].substring(1, data[0].length - 1))
          .write(chars[idx] || '');
      } else {
        // write normal char
        this.cursor.write(chars[idx] || '');
      }
    }

    if (this.completed >= this.total) {
      this.cursor.show();
      this.callbacks.forEach(x => x());
      return true;
    }

    return false;
  }

  // Private
}

export class MultiProgress {
  public bars: Progress[] = [];

  add(bar: Progress) {
    this.bars.push(bar);
  }
}
