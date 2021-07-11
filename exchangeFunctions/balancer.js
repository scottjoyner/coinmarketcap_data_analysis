
const Bittrex = require('bittrex-wrapper');
require('dotenv').config();
let test = false;
const bittrex = new Bittrex(process.env.BITTREX_VIEW_KEY, process.env.BITTREX_SECRET);
const markets = require(`./bittrexMarkets.json`);

function getMarketPairs(ticker) {
    let pairs = [];
    for(x=0;x<markets.length - 1;x++) {
      if(markets[x].MarketCurrency == ticker) {
        pairs.push(markets[x]);
      }
    }
    return pairs;
  }


function sell(ticker, indicatorStrength, rate) {
    let mkts = getMarketPairs(ticker);
    console.log(mkts)
    let market = mkts[0].MarketName;
    let quantity = indicatorStrength * mkts[0].MinTradeSize;
    if(test == true) {
        console.log("Test", market, quantity, rate)
    }
    else {
        bittrex.marketSellLimit(market, quantity, rate).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }
}

function buy(ticker, indicatorStrength, rate) {
    let mkts = getMarketPairs(ticker);
    console.log(mkts)
    let market = mkts[0].MarketName;
    let quantity = indicatorStrength * mkts[0].MinTradeSize;
    if(test == true) {
        console.log("Test", market, quantity, rate)
    }
    else {
        bittrex.marketBuyLimit(market, quantity, rate).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }
}

//sell("BTC", 1, 33378.615790074844);
//buy("BTC", 1, 33280);
bittrex.marketGetOpenOrders('USDT-BTC').then((response) => {
    console.log(response);
}).catch((error) => {
    console.log(error);
});

//bittrex.marketSellLimit(market, quantity, rate)

// bittrex.accountGetBalances().then((response) => {
//     console.log(response);
//   }).catch((error) => {
//     console.log(error);
//   });


