# eslint-plugin-better-align

## eslint-plugin-better-align/import-align
Before
```js
import a from "a";
import bb from "b";
import ccc from "c";
import    "d";
import {
    xxx,
    yyy,
    zzz,
}    from "e";
```
After
```js
import a   from "a";
import bb  from "b";
import ccc from "c";
import "d"; // Redundent spacing in from side effect import statement are stripped for now.
import {
    xxx,
    yyy,
    zzz,
}    from "e";  // Multiline import statement are ignored for now.
```

### Usage:
1. Install the plugin
```bash
yarn add -D eslint-plugin-better-align
```
2. In your eslint config file, adding:
```js
...
"plugins": [
    "better-align",
],
"rules": {
    "better-align/import-align": [2, "always"],
},
...
```