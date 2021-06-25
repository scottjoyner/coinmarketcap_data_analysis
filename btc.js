let btc = { id: 1,
       name: 'Bitcoin',
       symbol: 'BTC',
       slug: 'bitcoin',
       num_market_pairs: 9193,
       date_added: '2013-04-28T00:00:00.000Z',
       tags: [Array],
       max_supply: 21000000,
       circulating_supply: 18742518,
       total_supply: 18742518,
       platform: null,
       cmc_rank: 1,
       last_updated: '2021-06-25T16:41:02.000Z',
       quote: [Object] };


function print(data) {
    console.table(data);
}

print(btc);