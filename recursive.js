

const rp = require('request-promise');
const fs = require('fs');
let purchasingPowerList = [];
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '1000',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': 'fc837f38-e565-47c1-877f-7a209edaec0c'
  },
  json: true,
  gzip: true
};

rp(requestOptions).then(response => {
    for (x = 0; x < 999; x++) {
        let result = calculateTotalMarketSharePerUSD(response.data[x]);
        purchasingPowerList[x] = result;
    }    
    purchasingPowerList.sort(function(a, b) {return b.USD_AvailibleMarketShare - a.USD_AvailibleMarketShare});
    
    fs.writeFileSync('./coins.json', JSON.stringify(response, null, 2) , 'utf-8');
    fs.writeFileSync('./sortedmarketshare_1000.json', JSON.stringify(purchasingPowerList, null, 2) , 'utf-8');

    console.log(purchasingPowerList)



}).catch((err) => {
  console.log('API call error:', err.message);
});



function cont(response) {

    // console.log('API call response:', response.data[1]);
    for (x = 0; x < response.status.total_count - 1; x++) {
        purchasingPowerList.push(calculateTotalMarketSharePerUSD(response.data[x]));
    }
    console.log(purchasingPowerList)
}
/**
 * CoinmarketCap API call return object for specified currency
 * @param {crypto} data 
 */
function calculateTotalMarketSharePerUSD(data) {
    let ticker = data.symbol;
    let USD_Share = 1.00 / data.quote.USD.price;
    let USD_AvailibleMarketShare = USD_Share / data.circulating_supply;
    let USD_MaxSupplyMarketShare = USD_Share / data.total_supply;
    return {ticker, USD_AvailibleMarketShare, USD_MaxSupplyMarketShare};
}

function calculateRelativePriceChanges(data) {
  // Total % return per hour 

  let hourlyBuyRating = -1 * 1 * data.quote.percent_change_1h;
  let dailyBuyRating = -1 * 24 * data.quote.percent_change_24h;
  let weeklyBuyRating = -1 * 168 * data.quote.percent_change_7d;
  let monthlyBuyRating = -1 * 720 * data.quote.percent_change_30d;
  let quarterlyBuyRating = -1 * 2160 * data.quote.percent_change_90d;

  let hourlySellRating = 1 * data.quote.percent_change_1h;
  let dailySellRating = 24 * data.quote.percent_change_24h;
  let weeklySellRating = 168 * data.quote.percent_change_7d;
  let monthlySellRating = 720 * data.quote.percent_change_30d;
  let quarterlySellRating = 2160 * data.quote.percent_change_90d;

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

console.table(purchasingPowerList)
