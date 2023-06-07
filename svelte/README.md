- Run app
  `npm run dev -- --open`

```js
// store.js
// An extremely simple external store
import { writable } from "svelte/store";
export default writable(0);
```
