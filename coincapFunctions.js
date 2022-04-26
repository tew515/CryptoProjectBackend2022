// npm packages to make http requests
const axios = require('axios').default;
// import constant strings
const constants = require('./constants');

// return response for the coincap asset data 
const getBasicAssetData = ({limit, offset}) => {
    try {
        // define the url
        const url = constants.coincap.urls.initialPath + 'assets?limit=' + limit + "&offset=" + offset;

        // define the http config
        const config = {
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': `Bearer d36fab29-2199-436c-83f9-2cd5f9734e94`
            }
        }

        return axios.get(url, config).then(response => {
            return response.data
        })       
    }
    catch (err) {
        console.log(err)
    }
}

// return response for the coincap asset list
const getBasicAssetList = ({limit, offset}) => {
    try {
        // define the url
        const url = constants.coincap.urls.initialPath + 'assets?limit=' + limit + "&offset=" + offset;
        
        // define the http config
        const config = {
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': `Bearer d36fab29-2199-436c-83f9-2cd5f9734e94`
            }
        }

        return axios.get(url, config).then(response => {
            const assetList = response.data.data.map((ele) => {
                return {
                    value: ele.id,
                    label: ele.name
                }
            })
            return assetList
        })       
    }
    catch (err) {
        console.log(err)
    }
}

// return response for the coincap historical data
const getHistoricalAssetData = ({id, interval, start, end}) => {    
    try {
        // define the url
        let url = constants.coincap.urls.initialPath + 'assets/' + id + '/history?interval=' + interval;
    
        // define the http config
        const config = {
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': `Bearer d36fab29-2199-436c-83f9-2cd5f9734e94`
            }
        };

        return axios.get(url, config).then(response => {
            // filter data based on start and end time parameters
            if (start && end) {
                if (start.toString().length === 10) {
                    start *= 1000;
                    end *= 1000;
                }

                const filteredResponse = response?.data?.data?.filter((ele) => {
                    let elementTime = new Date(ele.time);
                    start = new Date(start);
                    end = new Date(end);
                    return elementTime >= start && elementTime <= end;
                })

                return { data: filteredResponse, timestamp: response.data.timestamp };
            }
            return response.data;
        });   
    }
    catch (err) {
        console.log(err);
    }
}

// return response for the coincap exchange rate data
const getUsdRatesData = () => {
    try {
        // define the url
        const url = constants.coincap.urls.initialPath + 'rates';

        // define the http config
        const config = {
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': `Bearer d36fab29-2199-436c-83f9-2cd5f9734e94`
            }
        };

        return axios.get(url, config).then(response => {
            return response.data;
        });     
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    getBasicAssetData,
    getBasicAssetList,
    getHistoricalAssetData,
    getUsdRatesData,
}