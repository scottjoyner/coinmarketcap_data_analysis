
const Bittrex = require('bittrex-wrapper');
require('dotenv').config();

const bittrex = new Bittrex(process.env.BITTREX_VIEW_KEY, process.env.BITTREX_SECRET);

bittrex.publicGetTicker('USD-BTC').then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });

bittrex.accountGetBalances().then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });

bittrex.accountGetDepositAddress('VTC').then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });

bittrex.accountGetOrderHistory(market)