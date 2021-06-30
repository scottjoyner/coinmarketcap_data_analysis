const rp = require('request-promise');
const fetch = require('node-fetch');
const fs = require('fs');
const coins = require('./currentMarketStats_1625062615758_Top10.json');
let coinlist = coins;






(async () => {
    for (x=0; x < 9; x++) {
        const res = await fetch(`https://www.reddit.com/r/${coins.data[x].name}/about.json`);
        const response = await res.json();
        let reddit_data = saveRelevantSubredditData(response);
        console.log(reddit_data)
        coinlist.data[x].reddit_data = reddit_data;
    }
    fs.writeFileSync(`./currentMarketStats_${Date.now()}_Top10.json`, JSON.stringify(coinlist, null, 2) , 'utf-8');

})();
console.log(coinlist.data[0])

function saveRelevantSubredditData(response) {
    if (response.error) {
        return "None"
    }
    let subreddit = response.data.url;
    let subscribers = response.data.subscribers;
    let active_users = response.data.active_user_count;
    let created_utc = response.data.created_utc;
    return {
        subreddit,
        subscribers,
        active_users,
        created_utc
    }
}


