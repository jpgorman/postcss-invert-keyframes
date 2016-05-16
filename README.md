[![Build Status](https://travis-ci.org/jpgorman/postcss-invert-keyframes.svg?branch=master)](https://travis-ci.org/jpgorman/postcss-invert-keyframes)
[PostCSS] plugin that copies as set of keyframes, copies them and then adds an inverted version so that the animation can be reversed.

[PostCSS]: https://github.com/postcss/postcss

```css
/* Input example */
@-invert-keyframes test {
  0%, 10%{
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(190px, 0, 0);
  }
  100%{
    transform: translate3d(150px, 0, 0);
  }
}
```

```css
/* Output example */
@keyframes test {
  0%, 10%{
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(190px, 0, 0);
  }
  100%{
    transform: translate3d(150px, 0, 0);
  }
}

@keyframes test-inverted {
  0%{
    transform: translate3d(150px, 0, 0);
  }
  50% {
    transform: translate3d(190px, 0, 0);
  }
  100%, 90%{
    transform: translate3d(0, 0, 0);
  }
}
```

## Usage

```js
postcss([ require('postcss-invert-keyframes') ])
```

See [PostCSS] docs for examples for your environment.
