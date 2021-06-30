const cron = require('node-cron');
const express = require('express');
const fs = require('fs'); // previous example
const shell = require('shelljs');



// Check current market conditions and prices
// Once every hour on the dot
cron.schedule('0 * * * *', function(){
    if (shell.exec('node logMarketConditions.js 10').code !== 0) {
        shell.echo('Error: CoinmarketCap Data logg failed')
        shell.exit(1)
    }
    else {
        console.log("Market Data Collected")
    }
});

// Check Reddit community sizes and relevance
// Once per day at midnight 
cron.schedule('* 0 * * *', function(){
    if (shell.exec('node logRedditUserBase.js').code !== 0) {
        shell.echo('Error: CoinmarketCap Data logg failed')
        shell.exit(1)
    }
    else {
        console.log("Reddit User Data Collected")
    }
});


