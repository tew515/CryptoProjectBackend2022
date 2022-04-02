const axios = require('axios').default;
const constants = require('./constants');
// d36fab29-2199-436c-83f9-2cd5f9734e94

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

const getBasicAssetList = ({limit, offset}) => {
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

// const getHistoricalAssetData = ({id, interval, start, end}) => { 
const getHistoricalAssetData = ({id, interval, start, end}) => {    
    try {
        let url = constants.coincap.urls.initialPath + 'assets/' + id + '/history?interval=' + interval;
    
        const config = {
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': `Bearer d36fab29-2199-436c-83f9-2cd5f9734e94`
            }
        };

        return axios.get(url, config).then(response => {
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

const getUsdRatesData = () => {
    try {
        const url = constants.coincap.urls.initialPath + 'rates';
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
    getBasicAssetData, // getBasicAssetData(2000, 0);
    getBasicAssetList,
    getHistoricalAssetData, // getHistoricalAssetData('bitcoin', 'h2'); getHistoricalAssetData('bitcoin', 'h2', 1641528000000, 1641535200000);
    getUsdRatesData, // getUsdRatesData();
}