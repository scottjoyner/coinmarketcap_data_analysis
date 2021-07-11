const Bittrex = require('bittrex-wrapper');
require('dotenv').config();
let market = 'BTC-VTC';
const bittrex = new Bittrex(process.env.BITTREX_VIEW_KEY, process.env.BITTREX_SECRET);

bittrex.publicGetMarketSummary(market).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });
bittrex.publicGetTicker(market).then((response) => {
console.log(response);
}).catch((error) => {
console.log(error);
});
