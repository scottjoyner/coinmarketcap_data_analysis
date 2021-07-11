// TRON JUSTLEND

const request = require('request')

const baseUri = "https://openapi.just.network/lend";

class JustLend {
    constructor(address) {
        this.defaultAddress = address;
    }
    marketInformation(callback) {
        this._sendRequest("jtoken", callback)
    }
    getAccountInfo(callback) {
        this._sendRequest(`account?address=${this.defaultAddress}`, callback);
    }

    _sendRequest(type, callback) {
        const url = `${baseUri}/${type}`;

        console.log(url)
        request(url, function(error, response, body) {
          if (!error & response.statusCode === 200) {
            callback(JSON.parse(body).results)
          }
        })
      }
}

const jlend = new JustLend('TGPdqJ1CqRS6xTfanWf1m8KXvVTv3sAPs2');
jlend.marketInformation(function(data) {
    console.log(data)
  })
jlend.getAccountInfo(function(data) {
    console.log(data)
  })