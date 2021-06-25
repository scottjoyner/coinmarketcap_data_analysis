let eth = { id: 1027,
    name: 'Ethereum',
    symbol: 'ETH',
    slug: 'ethereum',
    num_market_pairs: 5984,
    date_added: '2015-08-07T00:00:00.000Z',
    tags:
     [ 'mineable',
       'pow',
       'smart-contracts',
       'ethereum',
       'coinbase-ventures-portfolio',
       'three-arrows-capital-portfolio',
       'polychain-capital-portfolio',
       'binance-labs-portfolio',
       'arrington-xrp-capital',
       'blockchain-capital-portfolio',
       'boostvc-portfolio',
       'cms-holdings-portfolio',
       'dcg-portfolio',
       'dragonfly-capital-portfolio',
       'electric-capital-portfolio',
       'fabric-ventures-portfolio',
       'framework-ventures',
       'hashkey-capital-portfolio',
       'kinetic-capital',
       'huobi-capital',
       'alameda-research-portfolio',
       'a16z-portfolio',
       '1confirmation-portfolio',
       'winklevoss-capital',
       'usv-portfolio',
       'placeholder-ventures-portfolio',
       'pantera-capital-portfolio',
       'multicoin-capital-portfolio',
       'paradigm-xzy-screener' ],
    max_supply: null,
    circulating_supply: 116436769.124,
    total_supply: 116436769.124,
    platform: null,
    cmc_rank: 2,
    last_updated: '2021-06-25T17:00:02.000Z',
    quote:
     { USD:
        { price: 1816.9109799132614,
          volume_24h: 21593502681.57271,
          percent_change_1h: -0.375623,
          percent_change_24h: -9.72772372,
          percent_change_7d: -18.87957688,
          percent_change_30d: -32.97215336,
          percent_change_60d: -26.87795221,
          percent_change_90d: 6.25708522,
          market_cap: 211555244287.02103,
          last_updated: '2021-06-25T17:00:02.000Z' } } };
console.log(eth.name, eth.symbol, eth.circulating_supply, eth.quote.USD.price)

function calculateTotalMarketSharePerUSD(data) {
    let USD_Share = 1.00 / data.quote.USD.price;
    let USD_AvailibleMarketShare = USD_Share / data.circulating_supply;
    let USD_MaxSupplyMarketShare = USD_Share / data.total_supply;
    console.log(USD_AvailibleMarketShare, USD_MaxSupplyMarketShare);
}
calculateTotalMarketSharePerUSD(eth);