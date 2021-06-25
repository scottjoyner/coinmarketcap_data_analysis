imort { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("./test.json");
console.log(data);

