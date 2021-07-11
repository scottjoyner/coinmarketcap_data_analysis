
const Bittrex = require('bittrex-wrapper');
require('dotenv').config();

const bittrex = new Bittrex(process.env.BITTREX_VIEW_KEY, process.env.BITTREX_SECRET);

// bittrex.publicGetTicker('USD-BTC').then((response) => {
//     console.log(response);
//   }).catch((error) => {
//     console.log(error);
//   });

function getMarketPairs(ticker) {
  const bittrexMarkets = require(`./bittrexMarkets.json`);
  let pairs = [];
  for(x=0;x<bittrexMarkets.length - 1;x++) {
    if(bittrexMarkets[x].MarketCurrency == ticker) {
      pairs.push(bittrexMarkets[x].MarketName);
    }
  }
  return pairs;
}



// bittrex.accountGetDepositAddress('VTC').then((response) => {
//     console.log(response);
//   }).catch((error) => {
//     console.log(error);
//   });

// bittrex.accountGetOrderHistory("BTC-VTC").then((response) => {
//         console.log(response);
//       }).catch((error) => {
//         console.log(error);
//       });


bittrex.publicGetTicker('BTC-VTC').then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });

