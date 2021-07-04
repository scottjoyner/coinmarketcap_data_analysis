const fs = require('fs');
const path = require('path');
const plotlib = require('nodeplotlib');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ObjectsToCsv = require('objects-to-csv');

const getHistorialDataByID = (id) => {
    let history = parseFileHistory('./../data/reddit/')
    let data = [];
    for(i=0; i < history.length - 1; i++) {
        if( id == history[i][0]) {
            data.push(history[i]);
        }
    }
    return data;
};

const getHistorialDataByTicker = (ticker) => {
    let history = parseFileHistory('./../data/reddit/')
    let data = [];
    for(i=0; i < history.length - 1; i++) {
        if( ticker == history[i][1]) {
            data.push(history[i]);
        }
    }
    return data;
};


const parseFileHistory = (dir) => {
    const files = orderReccentFiles(dir);
    let data = [];
    if(!(files.length === undefined)) {
        for(i=0; i < files.length - 1; i++) {
            let current = require(`./../data/reddit/${files[i].file}`);
            let time = files[i].file.substr(0, files[i].file.indexOf('_')); 
            for(j=0; j < current.total_coins - 1; j++) {
                let id = current.data[j].id;
                let price = current.data[j].quote.USD.price;
                let ticker = current.data[j].symbol;
                let w = current.data[j].weights;
                let r = current.data[j].reddit_data;
                data.push([id, ticker, price, time, w,r]);
            }
        }
    }
    return data;
};

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


const saveHistoricalDataByTicker = (ticker) => {
    let data = getHistorialDataByTicker(ticker);
    fs.writeFileSync(`./../data/history/${ticker}.json`, JSON.stringify(data, null, 2) , 'utf-8');
}

const calculateDeltasByTicker = (ticker) => {

    let data = getHistorialDataByTicker(ticker);
    let newData = [];
    for(x=0; x < data.length - 2; x++) {
        // Weights
        let deltaHourlyBuyRating = data[x][4].buyRatings.hourlyBuyRating - data[x + 1][4].buyRatings.hourlyBuyRating;
        let deltaDailyBuyRating = data[x][4].buyRatings.dailyBuyRating - data[x + 1][4].buyRatings.dailyBuyRating;
        let deltaWeeklyBuyRating = data[x][4].buyRatings.weeklyBuyRating - data[x + 1][4].buyRatings.weeklyBuyRating;
        let deltaMonthlyBuyRating = data[x][4].buyRatings.monthlyBuyRating - data[x + 1][4].buyRatings.monthlyBuyRating;
        let deltaQuarterlyBuyRating = data[x][4].buyRatings.quarterlyBuyRating - data[x + 1][4].buyRatings.quarterlyBuyRating;

        let deltaHourlySellRating = data[x][4].sellRatings.hourlySellRating - data[x + 1][4].sellRatings.hourlySellRating;
        let deltaDailySellRating = data[x][4].sellRatings.dailySellRating - data[x + 1][4].sellRatings.dailySellRating;
        let deltaWeeklySellRating = data[x][4].sellRatings.weeklySellRating - data[x + 1][4].sellRatings.weeklySellRating;
        let deltaMonthlySellRating = data[x][4].sellRatings.monthlySellRating - data[x + 1][4].sellRatings.monthlySellRating;
        let deltaQuarterlySellRating = data[x][4].sellRatings.quarterlySellRating - data[x + 1][4].sellRatings.quarterlySellRating;

        let deltaRedditSubscribers = data[x][5].subscribers - data[x + 1][5].subscribers;
        let deltaActiveUsers = data[x][5].active_users - data[x + 1][5].active_users;
        let subRedditAge = data[3] - data[x][5].created_utc;

        let deltas = {
        deltaHourlyBuyRating,
        deltaDailyBuyRating,
        deltaWeeklyBuyRating,
        deltaMonthlyBuyRating,
        deltaQuarterlyBuyRating,

        deltaHourlySellRating,
        deltaDailySellRating,
        deltaWeeklySellRating,
        deltaMonthlySellRating,
        deltaQuarterlySellRating,

        deltaRedditSubscribers,
        deltaActiveUsers,
        subRedditAge
        };
        let temp = data[x]
        temp.push(deltas);
        newData.push(temp);
    }

    return newData;
}


const getMostRecentFile = (ticker) => {

    let data = calculateDeltasByTicker(ticker);

    let buyIndicatorSet = [];
    let currentTime = parseInt(Date.now());
    console.log(currentTime);
    for(x=0; x < data.length - 1; x++) {
        if(currentTime - parseInt(data[x][3]) <= 86400000) {
            buyIndicatorSet.push([parseInt(data[x][3]), data[x][2], data[x][4].buyRatings.hourlyBuyRating, data[x][6].deltaHourlyBuyRating]);
        }
    }

    let sumAvgSell = 0;
    let sumAvgBuy = 0;
    let buyCount = 0;
    let sellCount = 0;
    let maxBuy = 0;
    let maxSell = 0;
    for(x=0; x < buyIndicatorSet.length - 1; x++) {
        if(buyIndicatorSet[x][2] < 0) {
            sumAvgSell += buyIndicatorSet[x][2];
            sellCount += 1;
            if(buyIndicatorSet[x][2] < maxSell) {
                maxSell = buyIndicatorSet[x][2];
            }
        }
        if(buyIndicatorSet[x][2] > 0) {
            sumAvgBuy += buyIndicatorSet[x][2];
            buyCount += 1;
            if(buyIndicatorSet[x][2] > maxBuy) {
                maxBuy = buyIndicatorSet[x][2];
            }
        }
    }

    let avgSell = sumAvgSell / sellCount;
    let avgBuy = sumAvgBuy / buyCount;

    let buyTrend = 0;
    let sellTrend = 0;
    let betaBuyTrend = 0;
    let betaSellTrend = 0;
    let trendTable = [];
    for(x=0; x < buyIndicatorSet.length - 1; x++) {
        if(buyIndicatorSet[x][2] > avgBuy) {
            // buyTrend += 1;
            betaBuyTrend = maxBuy - buyIndicatorSet[x][2];
            if(betaBuyTrend > 0) {
                buyTrend += 5 * (betaBuyTrend / maxBuy);
            }
            if(betaBuyTrend < 0) {
                buyTrend += 5 * (buyIndicatorSet[x][2] / maxBuy);
            }
            //betaBuyTrend += 1 * buyIndicatorSet[x][3];
        }
        if(buyIndicatorSet[x][2] < avgSell) {
            // sellTrend += 1;
            betaSellTrend = maxSell - buyIndicatorSet[x][2];
            if(betaSellTrend > 0) {
                sellTrend += 5 * (buyIndicatorSet[x][2] / maxSell);
            }
            if(betaSellTrend < 0) {
                sellTrend += 5 * (betaSellTrend / maxSell);
            }
            //betaSellTrend += 1 * buyIndicatorSet[x][3];
        }

        trendTable.push([buyIndicatorSet[x][0], buyIndicatorSet[x][1], buyIndicatorSet[x][2], buyIndicatorSet[x][3], buyTrend, sellTrend]);
        buyTrend = 0;
        sellTrend = 0;
    }


    // console.table(trendTable[0]);
    if(trendTable[0][5] > 0) {
        console.log("Buy", trendTable[0][4], "Price: ", trendTable[0][1]);
        let set = ["Sell", trendTable[0][5], "Price: ", trendTable[0][1]];
        return set;
    }
    else if(trendTable[0][4] > 0 ) {
        console.log("Buy", trendTable[0][4], "Price: ", trendTable[0][1]);
        let set = ["Buy", trendTable[0][4], "Price: ", trendTable[0][1]];
        return set;
    }
    else {
        console.log("Hold", "Price: ", trendTable[0][1]);
        return ["Hold", 0, "Price: ", trendTable[0][1]];
    }


    






let x_data = [];
let price = [];
let sellIndicator = [];
let buyIndicator = [];

for(x=0; x < buyIndicatorSet.length - 1; x++) {
    x_data.push(parseInt(buyIndicatorSet[x][0]));
    price.push(parseInt(buyIndicatorSet[x][1]));
    sellIndicator.push(parseInt(buyIndicatorSet[x][5]));
    buyIndicator.push(parseInt(buyIndicatorSet[x][4]));
}


// const g_price = [{x: x_data , y: price, type: 'line', name: 'Price'}];
// const g_sell = [{x: x_data , y: sellIndicator, type: 'bar', name: 'Price'}];
// const g_buy = [{x: x_data , y: buyIndicator, type: 'bar', name: 'Price'}];

// plotlib.stack(g_price);
// plotlib.stack(g_sell);
// plotlib.stack(g_buy);

// plotlib.plot();
