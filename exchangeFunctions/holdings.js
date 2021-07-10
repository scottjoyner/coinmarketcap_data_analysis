
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const Bittrex = require('bittrex-wrapper');
require('dotenv').config();

const bittrex = new Bittrex(process.env.BITTREX_VIEW_KEY, process.env.BITTREX_SECRET);

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

const dirPath = './../cron/data/reddit/';
let x = getMostRecentFile(dirPath)


const coins = require(`./../cron/data/reddit/${x.file}`);
const bittrexMarkets = require(`./bittrexMarkets.json`);

for(x=0; x < bittrexMarkets.length - 1; x++) {
    console.log(bittrexMarkets[x].MarketCurrency, bittrexMarkets[x].MarketName, bittrexMarkets[x].MinTradeSize)
}