const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');


const getMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
    return files.length ? files[0] : undefined;
};

const getSecondMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
    return files.length ? files[1] : undefined;
};
const orderReccentFiles = (dir) => {
    return fs.readdirSync(dir)
        .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
        .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};

const dirPath = './../data/reddit/';
let x = getMostRecentFile(dirPath);
let y = getSecondMostRecentFile(dirPath);

const coins = require(`./../data/reddit/${x.file}`);
const prevCoins = require(`./../data/reddit/${x.file}`);
    for (let x=0; x < coins.totalcoins; x++) {
        let diff = coins.data[x].weights.buyRatings.hourlyBuyRating - prevCoins.data[x].weights.buyRatings.hourlyBuyRating;
        console.log(coins.data[x].weights.buyRatings.hourlyBuyRating)

    }
