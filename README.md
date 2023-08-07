# ascii-progress-ts

## Presets

`import { Styles } from 'ts-progress-ascii` for implemented presets

## Template String

### Variables

Keywords starting with `@` will look for available keywords. If not valid, the character will just be printed out

```ts
// Available keywords
@spinner
@bar
@percentage
@completed
@total
```

### Colors

Hex or color names can be used in the template string

```ts
(#blue)@spinner
(#6f3ddb)@spinner
```

```ts
// Color names
(#red)
(#green)
(#blue)
(#yellow)
(#purple)
(#cyan)
(#gray)
(#white)
(#black)

// Hex Codes
(#6f3ddb)
(#e8b4c3)
(#0b5a95)
```

## Styles

### Loader

The spinners are an array of strings, each item being a frame to the animation. They are cycled through every time `.tick()` is run

```ts
['◢', '◣', '◤', '◥'] Triangle
['◰', '◳', '◲', '◱'] Corner Squares

Many of the default animations are too long to display here
```

### Bar

A tuple of two items is used, the first being the `filled` character, and the second the `empty` character

```ts
["█" , "░"] Rect_DottedRect
["-", " "] Hyphen_Space
["#" , "-"] Hash_Hyphen
["■" , " "] Square_Empty
["■" , "-"] Square_Hyphen
["■" , "□"] Square_EmptySquare
["▰" , "▱"] Slant_EmptySlant
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
