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

    let data = getHistorialDataByTicker(ticker)
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
        
        // let deltaRedditSubscribers = data[x][5].subscribers - data[x + 1][5].subscribers;
        // let deltaActiveUsers = data[x][5].active_users - data[x + 1][5].active_users;
        // let subRedditAge = data[3] - data[x][5].created_utc;

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
        deltaQuarterlySellRating

        // deltaRedditSubscribers,
        // deltaActiveUsers,
        // subRedditAge
        };
        let temp = data[x]
        temp.push(deltas);
        newData.push(temp);
    }

    return newData;
}



let data = calculateDeltasByTicker("BTC");

let x_data = [];
let price = [];
let hourlyBuyRating = [];
let dailyBuyRating = [];
let weeklyBuyRating = [];
let monthlyBuyRating = [];
let quarterlyBuyRating = [];
let subscriberGrowth = [];
let activeRedditUsers = [];
let deltaHourlyBuyRating = [];
for(x=0; x < data.length - 1; x++) {
    x_data.push(parseInt(data[x][3]));
    price.push(data[x][2]);
    hourlyBuyRating.push(data[x][4].buyRatings.hourlyBuyRating);
    dailyBuyRating.push(data[x][4].buyRatings.dailyBuyRating);
    weeklyBuyRating.push(data[x][4].buyRatings.weeklyBuyRating);
    monthlyBuyRating.push(data[x][4].buyRatings.monthlyBuyRating);
    quarterlyBuyRating.push(data[x][4].buyRatings.quarterlyBuyRating);    
    // subscriberGrowth.push(data[x][6].deltaRedditSubscribers);
    // activeRedditUsers.push(data[x][5].active_users);
    deltaHourlyBuyRating.push(data[x][6].deltaHourlyBuyRating);
}


const g_price = [{x: x_data , y: price, type: 'line', name: 'Price'}];
const g_hourlyBuyRating = [{x: x_data , y: hourlyBuyRating, type: 'line', name: 'Hourly'}];
const g_DeltaHourlyBuyRating = [{x: x_data , y: deltaHourlyBuyRating, type: 'line', name: 'Hourly'}];
const g_dailyBuyRating = [{x: x_data , y: dailyBuyRating, type: 'line', name: 'Daily'}];
const g_weeklyBuyRating = [{x: x_data , y: weeklyBuyRating, type: 'line', name: 'Weekly'}];
const g_monthlyBuyRating = [{x: x_data , y: monthlyBuyRating, type: 'line', name: 'Monthly'}];
const g_quarterlyBuyRating = [{x: x_data , y: quarterlyBuyRating, type: 'line', name: 'Quarterly'}];
// const g_subscriberGrowth = [{x: x_data , y: subscriberGrowth, type: 'line', name: 'Subscriber Growth'}];
// const g_activeRedditUsers = [{x: x_data , y: activeRedditUsers, type: 'line', name: 'Active Users'}];
// var set = [g_price, g_hourlyBuyRating, g_dailyBuyRating, g_weeklyBuyRating, g_monthlyBuyRating, g_quarterlyBuyRating, g_subscriberGrowth, g_activeRedditUsers]
plotlib.stack(g_price);
plotlib.stack(g_hourlyBuyRating);
plotlib.stack(g_DeltaHourlyBuyRating);
// plotlib.stack(g_dailyBuyRating);
// plotlib.stack(g_weeklyBuyRating);
// plotlib.stack(g_monthlyBuyRating);
// plotlib.stack(g_quarterlyBuyRating);
// plotlib.stack(g_subscriberGrowth);
// plotlib.stack(g_activeRedditUsers);

plotlib.plot();
