const getCurrencies = () => {
    try {
        const url = constants.coinbase.urls.currencies;
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

const getCoinSymbols = () => {
    try {
        const url = constants.coinbase.urls.symbols;
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

const getCoinPrice = ({currencyPair, Method}) => {
    try {
        const url = constants.coinbase.urls.pricesInitialPath + currencyPair + Method;
        const config = {
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                // 'currency': 'BTC'
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

const getCoinExchangeRates = ({currencyName}) => {
    try {
        const url = constants.coinbase.urls.exchangeRates + '?currency=' + currencyName;
        const config = {
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                // 'currency': 'BTC'
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
    getCurrencies,
    getCoinSymbols, // getBasicAssetData(2000, 0);
    getCoinPrice, // getHistoricalAssetData('bitcoin', 'h2'); getHistoricalAssetData('bitcoin', 'h2', 1641528000000, 1641535200000);
    getCoinExchangeRates, // getUsdRatesData();
}