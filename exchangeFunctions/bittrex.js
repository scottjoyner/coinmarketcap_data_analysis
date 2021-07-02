
const Bittrex = require('bittrex-wrapper');
require('dotenv').config();
console.log("BITTREX_VIEW_KEY: " + process.env.BITTREX_VIEW_KEY);

const bittrex = new Bittrex(process.env.BITTREX_VIEW_KEY, process.env.BITTREX_SECRET);



