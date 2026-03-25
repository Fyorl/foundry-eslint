# @bytestruct/foundry-eslint

ESLint rules for enforcing unofficial Foundry VTT-specific code style conventions.

## Installation

```sh
npm install --save-dev @bytestruct/foundry-eslint
```

In `eslint.config.mjs`:

```js
import foundry from "@bytestruct/foundry-eslint";

export default [
  ...foundry.configs.recommended
];
```

## Rules

### `foundry/jsdoc-no-spaces-around-optional-param-equals`

Disallows spaces around `=` in JSDoc optional parameter defaults.

```js
// Incorrect
/** @param {string} [foo = "bar"] */

// Correct
/** @param {string} [foo="bar"] */
```

---

### `foundry/no-spaces-around-default-param-equals`

Disallows spaces around `=` in function default parameters.

```js
// Incorrect
function foo(options = {}) {}

// Correct
function foo(options={}) {}
```

---

### `foundry/require-arrow-braces`

Requires block bodies for multi-line arrow functions.

```js
// Incorrect
const f = x =>
  x + 1;

// Correct
const f = x => {
  return x + 1;
};
```

---

### `foundry/require-method-separator`

Requires a separator comment before each class method and top-level function after the first.

```js
// Incorrect
class Foo {
  a() {}
  b() {}
}

// Correct
class Foo {
  a() {}

  /* -------------------------------------------- */

  b() {}
}
```

---

### `foundry/sort-object-keys`

Requires object properties to be ordered shorthand-first, then alphabetically within each group.
Skips objects containing spread elements or computed keys.

```js
// Incorrect
const x = { foo: 1, b, bar: 2, a };

// Correct
const x = { a, b, bar: 2, foo: 1 };
```

---

### `foundry/space-in-control-flow-parens`

Requires spaces inside the parentheses of control-flow statements
(`if`, `for`, `while`, `switch`, `do...while`, `catch`).

```js
// Incorrect
if (x) {}

// Correct
if ( x ) {}
```
