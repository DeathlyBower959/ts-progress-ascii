import ansi, { Cursor } from 'ansi';
import getCursorPosition from 'get-cursor-position';
import { stdout } from 'process';

import { Styles } from './';
import { IFrames } from './styles/loaders';
import { IStylePack } from './styles/pack';
import { IProgress } from './styles/progress';

// TODO: Work on this later with customizable
// function test(str: `${'%foo%' | '%bar%'}${string}`) {}
// test('');

type IWidth = number | 'auto' | 'autoemoji';

export class Progress {
  static instances: Progress[] = [];
  static renderLoop: NodeJS.Timer;

  public static terminateAll() {
    this.instances.map(x => x.terminate());
    this.instances = [];
    clearInterval(this.renderLoop);
  }

  // Properties
  public completed = 0;
  public total: number;
  public get isComplete() {
    return this.completed === this.total;
  }

  _width: IWidth;
  get width() {
    // stdout.columns doesnt get "live" width, so look into a solution for that

    return this._width === 'auto'
      ? Math.min(Math.max(stdout.columns - 30, 25), 70)
      : this._width === 'autoemoji'
      ? Math.min(Math.max(stdout.columns - 30, 25), 70) / 2
      : this._width;
  }

  progress_chars: IProgress;
  spinner_frames: IFrames;
  frames_idx = 0;

  template: string;

  callbacks: (() => void)[] = [];

  original_position: { row: number; col: number };
  cursor: Cursor;

  start_time = new Date();

  // Constructor
  /**
   * @param style `Styles.Pack`, or a custom object
   */

  constructor(
    total: number,
    style: IStylePack = Styles.Pack.DEFAULT,
    width: IWidth = 'auto'
  ) {
    this.total = Math.max(total, 0);
    this.progress_chars = style.progressChars;
    this.spinner_frames = style.frames;
    this.template = style.template;

    if (width === 'auto') {
      const regex = /\p{Emoji}/gu;
      if (
        regex.test(style.progressChars[0]) ||
        regex.test(style.progressChars[1])
      ) {
        width = 'autoemoji';
      }
    }

    this._width =
      width === 'auto' || width === 'autoemoji' ? width : Math.round(width);

    this.cursor = ansi(stdout).hide();
    this.original_position = getCursorPosition.sync();

    if (Progress.instances.length === 0) {
      Progress.renderLoop = this.createRenderLoop();
    }
    Progress.instances.push(this);
  }

  // Public
  public addListener(callback: () => void) {
    this.callbacks.push(callback);
  }

  public setValue(value: (prev: number) => number): void;
  public setValue(value: number): void;
  public setValue(value: number | ((prev: number) => number)) {
    if (typeof value === 'number') {
      this.completed = Math.min(Math.max(value, 0), this.total);
    } else {
      this.completed = Math.min(Math.max(value(this.completed), 0), this.total);
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

    const obj_template: Record<string, string> = {
      '@spinner': SPINNER || '',
      '@bar': BAR,
      '@percentage': PERCENTAGE,
      '@completed': this.completed.toString(),
      '@total': this.total.toString(),
      '@elapsed': (new Date().getTime() - this.start_time.getTime()).toString(),
    };
    type IProgressKeys = keyof typeof obj_template;

    this.cursor.goto(this.original_position.col, this.original_position.row);

    const chars = this.template.split('');

    for (let idx = 0; idx < chars.length; idx++) {
      if (chars[idx] === '@') {
        const data = chars
          .join('')
          .substring(idx)
          .match(/@(spinner|bar|percentage|completed|total|elapsed)/);
        if (data) {
          const value = obj_template[data[0] as IProgressKeys];
          if (value) {
            idx += data[0].length - 1;

            this.cursor.write(value ?? '');
            continue;
          }
        }
        // Continues to last case
      } else if (chars[idx] === '(') {
        const data = chars
          .join('')
          .substring(idx)
          .match(/\(#[0-9A-Za-z]+\)/);
        if (data) {
          idx += data[0].length - 1;

          const hex = this.parseColor(data[0].substring(1, data[0].length - 1));

          // write colored char
          this.cursor.hex(hex.substring(1));
          continue;
        }
        // Continues to last case
      }
      // write normal char
      this.cursor.write(chars[idx] || '');
    }

    if (this.completed >= this.total) {
      this.terminate();
      return true;
    }

    return false;
  }

  public terminate() {
    this.cursor.write('\n');
    this.cursor.show();
    Progress.instances.splice(Progress.instances.indexOf(this), 1);
    if (Progress.instances.length === 0) {
      clearInterval(Progress.renderLoop);
    }
    this.callbacks.forEach(x => x());
  }

  // Private
  parseColor(color: string) {
    const codes: Record<string, `#${string}`> = {
      red: '#ff0000',
      green: '#00ff00',
      blue: '#0000ff',
      yellow: '#ffff00',
      purple: '#ff00ff',
      cyan: '#00ffff',
      gray: '#888888',
      white: '#ffffff',
      black: '#000000',
    };
    const colorMatch = color.match(
      /(red|green|blue|yellow|purple|cyan|gray|white|black)$/
    )?.[0];

    return codes[colorMatch || ''] || color;
  }

  createRenderLoop() {
    return setInterval(() => {
      this.tick();
    }, 90);
  }
}
