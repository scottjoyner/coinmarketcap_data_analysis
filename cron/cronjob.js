const cron = require('node-cron');
const express = require('express');
const fs = require('fs'); // previous example
const shell = require('shelljs');



// Check current market conditions and prices
cron.schedule('* * * * *', function(){
    var shell = require('./child_helper');
    var commandList = [
        "node functions/logMarketConditions.js 10",
    ]
    shell.series(commandList , function(err){
        console.log('Market Conditions Checked and Logged'); 
    });
});

// Check Reddit community sizes and relevance
cron.schedule('*/2 * * * *', function(){
    var shell = require('./child_helper');
    var commandList = [
        "node functions/logRedditUserBase.js",
    ]
    shell.series(commandList , function(err){
        console.log('Reddit userbases profiled and Logged'); 
    });
});
