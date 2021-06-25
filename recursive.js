

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

console.table(purchasingPowerList)