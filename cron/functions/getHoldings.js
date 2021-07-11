
const Bittrex = require('bittrex-wrapper');
require('dotenv').config();

const bittrex = new Bittrex(process.env.BITTREX_VIEW_KEY, process.env.BITTREX_SECRET);

bittrex.accountGetBalances().then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });
