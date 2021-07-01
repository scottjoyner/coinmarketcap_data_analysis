const fs = require('fs');
const path = require('path');
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
                let w = current.data[j].weights;
                let r = current.data[j].reddit_data;
                data.push([id, price, time, w,r]);
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

console.log(getHistorialDataByID('1'));





// for (x = 0; x < coins.total_coins; x++) {

// }
// (async () => {
//     const csv = new ObjectsToCsv(coins.data);
   
//     // Save to file:
//     await csv.toDisk('./test.csv');
   
//     // Return the CSV file as string:
//     console.log(await csv.toString());
//   })();