

const rp = require('request-promise');
const fs = require('fs');
var total_coins = process.argv[2];

let purchasingPowerList = [];
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': `${total_coins}`,
    'convert': 'BTC'
  },
  headers: {
    'X-CMC_PRO_API_KEY': 'fc837f38-e565-47c1-877f-7a209edaec0c'
  },
  json: true,
  gzip: true
};

rp(requestOptions).then(response => {
    let coins = response;
    coins.total_coins = total_coins;
    for (x = 0; x < total_coins - 1; x++) {
        coins.data[x].weights = calculateRelativePriceChanges(response.data[x]);
        coins.data[x].weights.marketShare = calculateTotalMarketSharePerBTC(response.data[x]);
        // purchasingPowerList[x] = coins.data[x].weights;
    }
    
    //purchasingPowerList.sort(function(a, b) {return b.BTC_AvailibleMarketShare - a.BTC_AvailibleMarketShare});
    //fs.writeFileSync('./coins.json', JSON.stringify(response, null, 2) , 'utf-8');
    fs.writeFileSync(`./../data/BTC/${Date.now()}_Top${total_coins}.json`, JSON.stringify(coins, null, 2) , 'utf-8');
}).catch((err) => {
  console.log('API call error:', err.message);
});

/**
 * Calculates the relative market share that 1 BTC is able to purchase given the totla market cap and total supply
 * @param {crypto} data 
 */
function calculateTotalMarketSharePerBTC(data) {
    let ticker = data.symbol;
    let BTC_Share = 1.00 / data.quote.BTC.price;
    let BTC_AvailibleMarketShare = BTC_Share / data.circulating_supply;
    let BTC_MaxSupplyMarketShare = BTC_Share / data.total_supply;
    return {
            BTC_AvailibleMarketShare, 
            BTC_MaxSupplyMarketShare
    };
}

/**
 * Calculates the weights for the relative effective buy and sell metrics for assets
 * @param {crypto} data 
 * @returns 
 */
function calculateRelativePriceChanges(data) {
    // Total % return per hour 
    let hourlyBuyRating = -1 * 1 * data.quote.BTC.percent_change_1h;
    let dailyBuyRating = -1 * 24 * data.quote.BTC.percent_change_24h;
    let weeklyBuyRating = -1 * 168 * data.quote.BTC.percent_change_7d;
    let monthlyBuyRating = -1 * 720 * data.quote.BTC.percent_change_30d;
    let quarterlyBuyRating = -1 * 2160 * data.quote.BTC.percent_change_90d;
  
    let hourlySellRating = 1 * data.quote.BTC.percent_change_1h;
    let dailySellRating = 24 * data.quote.BTC.percent_change_24h;
    let weeklySellRating = 168 * data.quote.BTC.percent_change_7d;
    let monthlySellRating = 720 * data.quote.BTC.percent_change_30d;
    let quarterlySellRating = 2160 * data.quote.BTC.percent_change_90d;
  
    return {
      buyRatings: 
      {
        hourlyBuyRating, 
        dailyBuyRating, 
        weeklyBuyRating, 
        monthlyBuyRating, 
        quarterlyBuyRating
      },
      sellRatings:
      {
        hourlySellRating,
        dailySellRating,
        weeklySellRating,
        monthlySellRating,
        quarterlySellRating
      }
  }
}
