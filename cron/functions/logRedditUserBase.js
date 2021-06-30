const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');


const getMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
    return files.length ? files[0] : undefined;
};

const orderReccentFiles = (dir) => {
    return fs.readdirSync(dir)
        .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
        .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};

const dirPath = './../data/coinmarketcap/';
let x = getMostRecentFile(dirPath)


const coins = require(`./../data/coinmarketcap/${x.file}`);


(async () => {
    for (x=0; x < coins.totalcoins; x++) {
        const res = await fetch(`https://www.reddit.com/r/${coins.data[x].name}/about.json`);
        const response = await res.json();
        let reddit_data = saveRelevantSubredditData(response);
        coins.data[x].reddit_data = reddit_data;
    }
    for (x=0; x < 9; x++) {
        const res = await fetch(`https://www.reddit.com/r/${coins.data[x].symbol}/about.json`);
        const response = await res.json();
        let reddit_data = saveRelevantSubredditData(response);
        coins.data[x].reddit_data = reddit_data;
    }
    fs.writeFileSync(`./../data/reddit/${Date.now()}_Top${coins.total_coins}.json`, JSON.stringify(coins, null, 2) , 'utf-8');

})();

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
};

