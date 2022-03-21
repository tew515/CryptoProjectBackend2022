// npm packages for the server to run
const express = require('express');
const app = express ();
const server = require('http').createServer(app);
const port = 3001;
const serverName = 'http://localhost';

// constants/function imports
const coincapFunctions = require('./coincapFunctions');
const coinbaseFunctions = require('./coinbaseFunctions');

// cache object
let cachedData = {
    basicAssetData: undefined,
    historicalAssetData: undefined,
    usdRatesData: undefined,
};

// generic function that caches data based on parameters
const setCacheUpdateInterval = (functionToCache=undefined, functionParams, dataRefreshMs, cacheLocation, dataProcessingFunction=undefined) => {

    // if function is defined run it once and assign daat to cache then run it every x milliseconds 
    if (functionToCache) {

        let currentDate = new Date();
        let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
        console.log('start - time:', time)
        functionToCache(functionParams).then(response => {
            if (dataProcessingFunction) {
                cachedData[cacheLocation] = dataProcessingFunction(response);
            } else {
                cachedData[cacheLocation] = response;
            }
            // console.log(cachedData.basicAssetData)
        });

        setInterval(() => {

            let currentDate = new Date();
            let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
            console.log('updated - time:', time)

            functionToCache(functionParams).then(response => {
                if (dataProcessingFunction) {
                    cachedData[cacheLocation] = dataProcessingFunction(response);
                } else {
                    cachedData[cacheLocation] = response;
                }
            });
        }, dataRefreshMs)
    }
};

setCacheUpdateInterval(coincapFunctions.getBasicAssetData, {limit: 2000, offset: 0}, 300000, 'basicAssetData');
setCacheUpdateInterval(coincapFunctions.getUsdRatesData, {}, 300000, 'usdRatesData');

/*

loop to cache data every 5 minutes

*/

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,POST');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// url endpoints that return cached data
app.get('/', (req, res) => {
    res.send(JSON.stringify({
        data: [0,1,2],
        err: []
    }));
});

app.get('/api/get/basicAssetData', (req, res) => {
    res.send(JSON.stringify({
        data: cachedData.basicAssetData,
        err: []
    }));
});

app.get('/api/get/usdRatesData', (req, res) => {
    res.send(JSON.stringify({
        data: cachedData.usdRatesData,
        err: []
    }));
});

// start the server on the listed port
console.log(serverName + ':' + port);
server.listen(port);