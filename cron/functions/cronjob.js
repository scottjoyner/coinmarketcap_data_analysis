const cron = require('node-cron');
const express = require('express');
const fs = require('fs'); // previous example
const shell = require('shelljs');



// Check current market conditions and prices
// Once every hour on the dot
cron.schedule('*/5 * * * *', function(){
    console.log("|------------------------------------|");
    console.log("|--------Collecting USD Data---------|");
    console.log("|------------------------------------|");
    if (shell.exec('node logMarketConditions.js 300').code !== 0) {
        shell.echo('Error: CoinmarketCap Data logg failed')
        shell.exit(1)
    }
    else {
        console.log("|------USD Market Data Collected-----|")
    }
    console.log("|------------------------------------|");
    console.log("|-------Killing Previous Orders------|");
    console.log("|------------------------------------|");
    if (shell.exec('node killOrFill.js').code !== 0) {
        shell.echo('Error: Killing orders Failed.')
        shell.exit(1)
    }
    console.log("|------------------------------------|");
    console.log("|-----Calculating USD Pair Trades----|");
    console.log("|------------------------------------|");
    if (shell.exec('node determineHourlyBuySellTriggers.js').code !== 0) {
        shell.echo('Error: Buy Sell Failed.')
        shell.exit(1)
    }
    console.log("|------------------------------------|");
    console.log("|--------Collecting BTC Data---------|");
    console.log("|------------------------------------|");
    if (shell.exec('node logMarketConditionsBTC.js 10').code !== 0) {
        shell.echo('Error: CoinmarketCap Data logg failed')
        shell.exit(1)
    }
    else {
        console.log("|-----BTC Market Data Collected------|")
        console.log("|------------------------------------|");
    }
    console.log("|------------------------------------|");
    console.log("|-------Collecting Reddit Data-------|");
    console.log("|------------------------------------|");
    if (shell.exec('node logRedditUserBase.js').code !== 0) {
        shell.echo('Error: CoinmarketCap Data logg failed')
        shell.exit(1)
    }
    else {
        console.log("|-----Reddit User Data Collected-----|");
        console.log("|------------------------------------|");
    }

});

// // Check Reddit community sizes and relevance
// // Once per day at midnight 
// cron.schedule('*/2 * * * *', function(){
//     if (shell.exec('node logRedditUserBase.js').code !== 0) {
//         shell.echo('Error: CoinmarketCap Data logg failed')
//         shell.exit(1)
//     }
//     else {
//         console.log("Reddit User Data Collected")
//     }
// });


