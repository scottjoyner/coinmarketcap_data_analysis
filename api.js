const rp = require('request-promise');
const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '10',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': 'fc837f38-e565-47c1-877f-7a209edaec0c'
  },
  json: true,
  gzip: true
};

rp(requestOptions).then(response => {
  console.log('API call response:', response.data);

}).catch((err) => {
  console.log('API call error:', err.message);
});

