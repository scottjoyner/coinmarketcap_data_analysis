
const request = require('request');
const { mkdir } = require('shelljs');

const getMarkets = () => {
  request('https://api.bittrex.com/api/v1.1/public/getmarkets', function (error, response, body) {
  let res = JSON.parse(body);
  mkts = res.result;
  console.log(JSON.stringify(res.result));
  return res.result;
  });
};
let mkts = getMarkets();

// for(x=0; x < mktData.length - 1; x++) {
//   console.log(mktData[x]);
// };
