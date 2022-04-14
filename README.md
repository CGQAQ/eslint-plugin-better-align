# eslint-plugin-better-align

## eslint-plugin-better-align/import-align
> 
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
> run
```bash
yarn add -D eslint-plugin-better-align
```
and in your eslint config file
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