const axios = require('axios').default;
const constants = require('./constants');

const getBasicAssetData = ({limit, offset}) => {
    // const url = constants.coincap.initialPath + 'assets?limit=' + limit + "&offset=" + offset;

    // axios.get(url).then((response) => {
    //     console.log(response.data.data);
    // }).catch((error) => {
    //     console.log(error);
    // });
    
    try {
    const url = constants.coincap.urls.initialPath + 'assets?limit=' + limit + "&offset=" + offset;
        const config = {
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json'
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

const getHistoricalAssetData = ({id, interval, start, end}) => {    
    try {
        let url = constants.coincap.urls.initialPath + 'assets/' + id + '/history?interval=' + interval; // m1, m5, m15, m30, h1, h2, h6, h12, d1
        // end = new Date().valueOf();
        // Get a date object for the current time
        // var start = new Date();
    
        // // Set it to one month ago
        // start.setDay(start.getDay() - 1);
    
        // // Zero the time component
        // start.setHours(0, 0, 0, 0);
    
        if (start && end) {
            url += '&start=' + start + "&end=" + end;
        }
    
        console.log(url);
    
        const config = {
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json'
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

const getUsdRatesData = () => {
    try {
        const url = constants.coincap.urls.initialPath + 'rates';
        const config = {
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        };

        return axios.get(url, config).then(response => {
            return response.datal
        });     
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    getBasicAssetData, // getBasicAssetData(2000, 0);
    getHistoricalAssetData, // getHistoricalAssetData('bitcoin', 'h2'); getHistoricalAssetData('bitcoin', 'h2', 1641528000000, 1641535200000);
    getUsdRatesData, // getUsdRatesData();
}