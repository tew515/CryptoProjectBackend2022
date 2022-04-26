// npm packages for the server to run
const express = require('express');
const app = express ();
const server = require('http').createServer(app);
const port = 3001;
const serverName = 'http://localhost';

// constants/function imports
const coincapFunctions = require('./coincapFunctions');

// cache object
let cachedData = {
    basicAssetData: undefined,
    basicAssetList: undefined,
    historicalAssetData: {},
    usdRatesData: undefined,
};

// error object
let cachedErrors = [];

// generic function that caches data based on parameters
const setCacheUpdateInterval = (functionToCache=undefined, functionParams, dataRefreshMs, cacheLocation, dataProcessingFunction=undefined) => {
    // if function is defined run it once and assign daat to cache then run it every x milliseconds 
    if (functionToCache) {
        // assign data to cache location using function parameters and if a datam processing function is supplied pass the response into it, push potential errors to an array
        functionToCache(functionParams).then(response => {
            if (dataProcessingFunction) {
                cachedData[cacheLocation] = dataProcessingFunction(response);
            } else {
                cachedData[cacheLocation] = response;
            }
        }).catch(err => {
            if (err?.response?.data) {
                cachedErrors.push({ error: err.response.data, time: new Date() });
            }
        })

        setInterval(() => {
            // assign data to cache location using function parameters and if a datam processing function is supplied pass the response into it, push potential errors to an array
            functionToCache(functionParams).then(response => {
                if (dataProcessingFunction) {
                    cachedData[cacheLocation] = dataProcessingFunction(response);
                } else {
                    cachedData[cacheLocation] = response;
                }
            }).catch(err => {
                if (err?.response?.data) {
                    cachedErrors.push({ error: err.response.data, time: new Date() });
                }
            })
        }, dataRefreshMs)
    }
};

// run the following functions to continously update the data for the frontend
setCacheUpdateInterval(coincapFunctions.getBasicAssetData, {limit: 2000, offset: 0}, 300000, 'basicAssetData');
setCacheUpdateInterval(coincapFunctions.getBasicAssetList, {limit: 2000, offset: 0}, 60000*60*24, 'basicAssetList');
setCacheUpdateInterval(coincapFunctions.getUsdRatesData, {}, 300000, 'usdRatesData');

// set http headers
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,POST');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// url endpoints that return cached data
app.get('/api/get/basicAssetData', (req, res) => {
    res.send(JSON.stringify({
        data: cachedData.basicAssetData,
        err: cachedErrors
    }));
});
app.get('/api/get/basicAssetList', (req, res) => {
    res.send(JSON.stringify({
        data: cachedData.basicAssetList,
        err: cachedErrors
    }));
});
app.get('/api/get/usdRatesData', (req, res) => {
    res.send(JSON.stringify({
        data: cachedData.usdRatesData,
        err: cachedErrors
    }));
});
app.get('/api/get/historicalAssetData', (req, res) => {
    // get query params from request as a object
    const queryParams = Object.fromEntries(new URLSearchParams(req.query));

    // if the id has been run through the api before and it has been more than 5 mins since the last update then fetch the data again, reduces amount of api calls
    if (cachedData.historicalAssetData.hasOwnProperty(queryParams.id)) {
        if((new Date() - new Date(cachedData.historicalAssetData[queryParams.id].timestamp)) > 5*60*1000) {
            coincapFunctions.getHistoricalAssetData(queryParams).then(response => {
                cachedData.historicalAssetData[queryParams.id] = response;
            
                res.send(JSON.stringify({
                    data: cachedData.historicalAssetData[queryParams.id],
                    err: cachedErrors
                }));
            }).catch(err => {
                if (err?.response?.data) {
                    cachedErrors.push({ error: err.response.data, time: new Date() });
                }
            
                res.send(JSON.stringify({
                    data: cachedData.historicalAssetData[queryParams.id],
                    err: cachedErrors
                }));
            });
        } else {
            res.send(JSON.stringify({
                data: cachedData.historicalAssetData[queryParams.id],
                err: cachedErrors
            }));
        }
    } else {
        coincapFunctions.getHistoricalAssetData(queryParams).then(response => {
            cachedData.historicalAssetData[queryParams.id] = response;
            
            res.send(JSON.stringify({
                data: cachedData.historicalAssetData[queryParams.id],
                err: cachedErrors
            }));
        }).catch(err => {
            if (err?.response?.data) {
                cachedErrors.push({ error: err.response.data, time: new Date() });
            }
            
            res.send(JSON.stringify({
                data: cachedData.historicalAssetData[queryParams.id],
                err: cachedErrors
            }));
        });
    }
});

// start the server on the listed port
console.log(serverName + ':' + port);
server.listen(port);