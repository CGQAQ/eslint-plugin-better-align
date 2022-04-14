# eslint-plugin-better-align

## eslint-plugin-better-align/import-align
Before
```js
import a from "a";
import bb from "b";
import ccc from "c";
```
After
```js
import a   from "a";
import bb  from "b";
import ccc from "c";
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