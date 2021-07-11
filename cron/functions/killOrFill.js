const Bittrex = require('bittrex-wrapper');
require('dotenv').config();
let market = 'BTC-VTC';
const bittrex = new Bittrex(process.env.BITTREX_VIEW_KEY, process.env.BITTREX_SECRET);

bittrex.marketGetOpenOrders().then((response) => {
    if(response.result.length > 0) {
        for(x=0; x < response.result.length - 1; x++) {
            bittrex.marketCancel(response.result[x].OrderUuid).then((response) => {
                console.log(response);
                }).catch((error) => {
                console.log(error);
                });
            console.log(`|--Killed UUID: ${response.result[x].OrderUuid}--|`)          
        }
        console.log("|------------------------------|");
    }
  }).catch((error) => {
    console.log(error);
  });
