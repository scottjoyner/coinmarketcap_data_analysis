import crypto from 'crypto';
import querystring from 'querystring';
import request from '../helpers/request';

class JustLend {
  /**
   * API Reference
   * Our APIs are broken into three distinct groups
   *  * Public - Public information available without an API key
   *  * Account - For managing your account
   *  * Market - For programatic trading of crypto currencies
   * $apikey='xxx';
   * $apisecret='xxx';
   * $nonce=time();
   * $uri='https://JustLend.com/api/v1.1/market/getopenorders?apikey='.$apikey.'&nonce='.$nonce;
   * $sign=hash_hmac('sha512',$uri,$apisecret);
   * $ch = curl_init($uri);
   * curl_setopt($ch, CURLOPT_HTTPHEADER, array('apisign:'.$sign));
   * $execResult = curl_exec($ch);
   * $obj = json_decode($execResult);
   */

  /**
   * JustLend class constructor
   *
   * @param {any} apiKey - API key given by JustLend
   * @param {any} apiSecret - API secret given by JustLend
   * @param {string} [apiProtocol='https'] - Server protocol
   * @param {string} [apiHost='JustLend.com'] - Server hostname
   * @param {string} [apiVersion='v1.1'] - JustLend API version
   *
   * @memberof JustLend
   */
  constructor(
    apiKey = null,
    apiSecret = null,
    apiProtocol = 'https',
    apiHost = 'openapi.just.network',
    apiVersion = 'v1.1'
  ) {
    this.__lastNonce = null;
    this.__apiProtocol = apiProtocol;
    this.__apiHost = apiHost;
    this.__apiVersion = apiVersion;
    this.__apiKey = apiKey;
    this.__apiSecret = apiSecret;
    // Public API endpoints
    this.PUBLIC_GET_MARKETS = '/lend/jtoken';
    // Account API
    this.ACCOUNT_GET_BALANCES = '/lend/account';
  }

  /**
   * Gets api sign
   *
   * @param {string} uri - uri to request
   * @returns {string} signature for headers
   *
   * @memberof JustLend
   */
  getApiSign(uri) {
    const hmac = crypto.createHmac('sha512', this.__apiSecret);
    const signed = hmac.update(new Buffer(uri, 'utf-8')).digest('hex');
    return signed;
  }

  getNonce() {
    this.__lastNonce = Math.floor(new Date().getTime() / 1000);
    return this.__lastNonce;
  }

  /**
   * Makes direct http request to API
   *
   * @param {String} path - Main path for request
   * @param {Object} data - Data to send in the request
   * @returns {promise} server response
   *
   * @memberof JustLend
   */
  doRequest(path, data) {
    return new Promise((resolve, reject) => {
      const _data = Object.assign(
        data || {},
        this.__apiKey && this.__apiSecret
          ? {
            nonce: this.getNonce(),
            apikey: this.__apiKey
          }
          : {}
      );
      const _url = `${this.__apiProtocol}://${this.__apiHost}/api/${
        this.__apiVersion
      }${path}?${querystring.stringify(_data)}`;
      const apisign = this.__apiKey && this.__apiSecret ? this.getApiSign(_url) : null;
      request(
        {
          method: 'GET',
          host: this.__apiHost,
          path: `/api/${this.__apiVersion}${path}`,
          headers: apisign
            ? {
              apisign,
              'Content-Type': 'application/json'
            }
            : { 'Content-Type': 'application/json' }
        },
        _data
      )
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  /**
   * Public API
   */

  /**
   * Used to get the open and available trading markets at JustLend along with other meta data
   *
   * @returns Promise
   * @memberof JustLend
   */
  publicGetMarkets() {
    return this.doRequest(this.PUBLIC_GET_MARKETS);
  }

  /**
   * Account API
   */

  /**
   * Used to retrieve all balances from your account
   *
   * @returns Promise
   * @memberof JustLend
   */
  accountGetBalances(address =  '') {
    return this.doRequest(this.ACCOUNT_GET_BALANCES, {address});
  }
}

module.exports = JustLend;