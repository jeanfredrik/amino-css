import HarpyCss from 'harpy-css';
import Color from 'color';
import {
  forEach,
  range,
  assignAll,
  fromPairs,
  flow,
  mapKeys,
  mapValues,
  flatMap,
  entries,
  pickBy,
} from 'lodash/fp';

const zipWithSelf = keys => fromPairs(keys.map(key => [key, key]));

const css = HarpyCss.create();
module.exports = css;

// breakpoints
const breakpoints = {
  '': null,
};

// states
const states = {
  '': '',
  'hover-': 'hover',
  'active-': 'active',
  'focus-': 'focus',
};

// colors
const colors = {
  transparent: 'transparent',
  black: 'black',
  white: 'white',
  silver: 'gainsboro',
  gray: 'gray',
  blue: 'dodgerblue',
  red: 'crimson',
  green: 'limegreen',
};

// transparentColors
const alphas = [90, 80, 50, 15];
const transparentColors = flow([
  flatMap(alpha => flow([
    pickBy(value => Color(value).alpha() === 1),
    mapKeys(key => `${key}-${alpha}`),
    mapValues(value => Color(value).alpha(alpha / 100).rgb().string()),
    entries,
  ])(colors)),
  fromPairs,
])(alphas);

// margins and paddings
const spaceBase = '1';
const paddings = {
  0: '0',
  '-half': `${spaceBase * 0.25}rem`,
  1: `${spaceBase * 0.5}rem`,
  2: `${spaceBase}rem`,
  3: `${spaceBase * 2}rem`,
  4: `${spaceBase * 4}rem`,
  5: `${spaceBase * 8}rem`,
};
const margins = {
  0: '0',
  '-half': `${spaceBase * 0.25}rem`,
  1: `${spaceBase * 0.5}rem`,
  2: `${spaceBase}rem`,
  3: `${spaceBase * 2}rem`,
  4: `${spaceBase * 4}rem`,
  5: `${spaceBase * 8}rem`,
  'n-half': `${-spaceBase * 0.25}rem`,
  n1: `${-spaceBase * 0.5}rem`,
  n2: `${-spaceBase}rem`,
  n3: `${-spaceBase * 2}rem`,
  n4: `${-spaceBase * 4}rem`,
  n5: `${-spaceBase * 8}rem`,
  '-auto': 'auto',
};

// widths
const columns = {};
forEach((i) => {
  columns[`col${i}`] = `${(i / 12) * 100}%`;
}, range(1, 13));


// RULES

// align-content
css.prepare({
  property: 'align-content',
})
.joinMap('media', breakpoints)
.join({
  name: 'content-',
})
.joinMap({
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
  between: 'space-between',
  around: 'space-around',
})
.add();

// align-items
css.prepare({
  property: 'align-items',
})
.joinMap('media', breakpoints)
.join({
  name: 'items-',
})
.joinMap({
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  baseline: 'baseline',
  stretch: 'stretch',
})
.add();

// align-self
css.prepare({
  property: 'align-self',
})
.joinMap('media', breakpoints)
.join({
  name: 'self-',
})
.joinMap({
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  baseline: 'baseline',
  stretch: 'stretch',
})
.add();

// background-color
css.prepare({
  name: 'bg-',
  property: 'background-color',
})
.joinMap(assignAll([colors, transparentColors]))
.add();

// border
css.prepare({
  name: 'border',
  property: 'border',
})
.joinMap('name', 'property', zipWithSelf([
  '-top',
  '-right',
  '-bottom',
  '-left',
]))
.joinMap('property', 'value', {
  '-style': 'solid',
  '-width': '1px',
  '-color': Color('black').alpha(0.15).rgb().string(),
})
.add();

css.prepare({
  property: 'border-color',
  name: 'border-',
})
.joinMap(colors)
.add();

// border-radius
css.prepare({
  property: 'border-radius',
})
.joinMap({
  circle: '9999px',
  rounded: '.25rem',
  'rounded-top': '.25rem .25rem 0 0',
  'rounded-right': '0 .25rem .25rem 0',
  'rounded-bottom': '0 0 .25rem .25rem',
  'rounded-left': '.25rem 0 0 .25rem',
  'not-rounded': '0',
})
.add();

// box-shadow
css.prepare({
  property: 'box-shadow',
})
.joinMap('state', states)
.joinMap({
  lighten: `0 0 0 9999px ${Color('white').alpha(0.25).rgb().string()} inset`,
  darken: `0 0 0 9999px ${Color('black').alpha(0.125).rgb().string()} inset`,
  // 'outline': '0 0 0 2px ' + Color(colors.gray).alpha(0.5).rgb().string(),
})
.add();

css.prepare({
  property: 'box-shadow',
})
.joinMap('state', states)
.join({
  name: 'outline-',
})
.joinMap(mapValues(
  color => `0 0 0 2px ${Color(color).alpha(0.5).rgb().string()}`,
)(colors))
.add();

// box-sizing
css.prepare({
  property: 'box-sizing',
})
.joinMap(zipWithSelf([
  'border-box',
]))
.add();

// color
css.prepare({
  property: 'color',
})
.joinMap('state', states)
.joinMap(assignAll([{
  'color-inherit': 'inherit',
}, colors]))
.add();

// cursor
css.prepare({
  name: 'cursor-',
  property: 'cursor',
})
  .joinMap(zipWithSelf([
    'pointer',
    'default',
    'progress',
  ]))
  .add();

// display
css.prepare({
  property: 'display',
})
  .joinMap('media', breakpoints)
  .joinMap({
    table: 'table',
    block: 'block',
    'inline-block': 'inline-block',
    inline: 'inline',
    flex: 'flex',
    'inline-flex': 'inline-flex',
    hide: 'none',
  })
  .add();

// flex
css.prepare({
  property: 'flex',
})
  .joinMap('media', breakpoints)
  .join({
    name: 'flex-',
  })
  .joinMap({
    none: 'none',
  })
  .add();

css.prepare()
  .joinMap('media', breakpoints)
  .join({
    name: 'flex-auto',
    '#flex-grow': '1',
    '#flex-shrink': '1',
    '#flex-basis': 'auto',
    '#min-width': '0',
    '#min-height': '0',
  })
  .add();

css.prepare()
  .joinMap('media', breakpoints)
  .join({
    name: 'flex-fluid',
    '#flex-grow': '1',
    '#flex-shrink': '1',
    '#flex-basis': '0px',
    '#min-width': '0',
    '#min-height': '0',
  })
  .add();

css.prepare()
  .joinMap('media', breakpoints)
  .join({
    name: 'flex-shrink',
    '#flex-grow': '0',
    '#flex-shrink': '1',
    '#flex-basis': 'auto',
    '#min-width': '0',
    '#min-height': '0',
  })
  .add();

css.prepare()
  .joinMap('media', breakpoints)
  .join({
    name: 'flex-grow',
    '#flex-grow': '1',
    '#flex-shrink': '0',
  })
  .add();

// flex-direction
css.prepare({
  property: 'flex-direction',
})
.joinMap('media', breakpoints)
.join({
  name: 'flex-',
})
.joinMap({
  column: 'column',
})
.add();

// flex-wrap
css.prepare({
  property: 'flex-wrap',
})
.joinMap('media', breakpoints)
.join({
  name: 'flex-',
})
.joinMap({
  wrap: 'wrap',
})
.add();

// font-family
css.prepare({
  property: 'font-family',
})
.joinMap({
  monospace: 'OperatorMono, OperatorMono-Book, Consolas, monaco, monospace',
  'sans-serif': '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Helvetica, sans-serif',
})
.add();

// font-size
css.prepare({
  property: 'font-size',
})
.joinMap({
  h1: '2rem',
  h2: '1.5rem',
  h3: '1.25rem',
  h4: '1rem',
  h5: '.875rem',
  h6: '.75rem',
})
.add();

// font-style
css.prepare({
  property: 'font-style',
})
.joinMap({
  italic: 'italic',
})
.add();

// font-weight
css.prepare({
  property: 'font-weight',
})
.joinMap({
  regular: '400',
  bold: '700',
})
.add();

// height
css.prepare({
  property: 'height',
  name: 'height-',
})
.joinMap({
  100: '100%',
})
.add();

// justify-content
css.prepare({
  property: 'justify-content',
})
.joinMap('media', breakpoints)
.join({
  name: 'justify-',
})
.joinMap({
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
})
.add();

// line-height
css.prepare({
  name: 'lh-',
  property: 'line-height',
})
.joinMap({
  copy: '1.5',
  heading: '1.25',
  solid: '1',
})
.add();

// margin
css.prepare({
  property: 'margin',
})
.joinMap('media', breakpoints)
.join({
  name: 'm',
})
.join([
  { name: '', property: '-top' },
  { name: '', property: '-right' },
  { name: '', property: '-bottom' },
  { name: '', property: '-left' },
  { name: 'y', property: '-top' },
  { name: 'y', property: '-bottom' },
  { name: 'x', property: '-right' },
  { name: 'x', property: '-left' },
  { name: 't', property: '-top' },
  { name: 'r', property: '-right' },
  { name: 'b', property: '-bottom' },
  { name: 'l', property: '-left' },
])
.joinMap(margins)
.add();

// max-width
css.prepare({
  property: 'max-width',
})
.joinMap('media', breakpoints)
.joinMap(assignAll([{
  'maxw-100': '100%',
}, columns]))
.add();

// opacity
css.prepare({
  property: 'opacity',
})
.joinMap('state', states)
.join({
  name: 'opacity-',
})
.joinMap({
  100: 1,
  90: 0.90,
  80: 0.80,
  50: 0.50,
})
.add();

// order
css.prepare({
  property: 'order',
})
.joinMap('media', breakpoints)
.join({
  name: 'order-',
})
.joinMap({
  first: '-99999',
  0: '0',
  1: '1',
  2: '2',
  3: '3',
  last: '99999',
})
.add();

// overflow
css.prepare({
  property: 'overflow',
})
.joinMap('media', breakpoints)
.joinMap('property', {
  'overflow-': '',
  'overflow-x-': '-x',
  'overflow-y-': '-y',
})
.joinMap({
  auto: 'auto',
  hidden: 'hidden',
  scroll: 'scroll',
})
.add();

// padding
css.prepare({
  property: 'padding',
})
.joinMap('media', breakpoints)
.join({
  name: 'p',
})
.join([
  { name: '', property: '-top' },
  { name: '', property: '-right' },
  { name: '', property: '-bottom' },
  { name: '', property: '-left' },
  { name: 'y', property: '-top' },
  { name: 'y', property: '-bottom' },
  { name: 'x', property: '-right' },
  { name: 'x', property: '-left' },
  { name: 't', property: '-top' },
  { name: 'r', property: '-right' },
  { name: 'b', property: '-bottom' },
  { name: 'l', property: '-left' },
])
.joinMap(paddings)
.add();

// position
css.prepare({
  property: 'position',
})
.joinMap({
  absolute: 'absolute',
  relative: 'relative',
  fixed: 'fixed',
})
.add();

// table-layout
css.prepare({
  name: 'table-',
  property: 'table-layout',
})
.joinMap({
  fixed: 'fixed',
})
.add();

// text-align
css.prepare({
  property: 'text-align',
})
  .joinMap('media', breakpoints)
  .joinMap(zipWithSelf([
    'left',
    'center',
    'right',
  ]))
  .add();

// text-decoration
css.prepare({
  property: 'text-decoration',
})
  .joinMap({
    underline: 'underline',
    'no-underline': 'none',
  })
  .add();

// text-transform
css.prepare({
  property: 'text-transform',
})
  .joinMap(zipWithSelf([
    'uppercase',
  ]))
  .add();

// top, right, bottom, left
css.prepare()
.joinMap('property', zipWithSelf([
  'top', 'right', 'bottom', 'left',
]))
.joinMap({
  '-0': 0,
})
.add();

css.prepare({
  name: 'trbl',
  value: 0,
})
.join([
  { property: 'top' },
  { property: 'right' },
  { property: 'bottom' },
  { property: 'left' },
])
.add();

// width
css.prepare({
  property: 'width',
})
.joinMap('media', breakpoints)
.joinMap(assignAll([{
  'width-100vw': '100vw',
  'width-auto': 'auto',
}, columns]))
.add();

// z-index
css.prepare({
  name: 'z',
  property: 'z-index',
})
.joinMap(zipWithSelf([
  '1',
  '2',
  '3',
  '4',
]))
.add();
