
const Bittrex = require('bittrex-wrapper');
require('dotenv').config();

const bittrex = new Bittrex(process.env.BITTREX_VIEW_KEY, process.env.BITTREX_SECRET);

// bittrex.publicGetTicker('USD-BTC').then((response) => {
//     console.log(response);
//   }).catch((error) => {
//     console.log(error);
//   });


bittrex.accountGetBalances().then((response) => {
    // console.log(response);
    let results = [];
    for(x=0; x < response.result.length - 1; x++) {
        
        results.push([response.result[x].Currency,response.result[x].Balance, response.result[x].CryptoAddress]);
      }
    console.table(results)
  }).catch((error) => {
    console.log(error);
  });

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


bittrex.publicGetTicker('USD-VTC').then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  });




