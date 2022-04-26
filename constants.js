// common strings used in the project
module.exports = {
    coinbase: {
        secret : 'dc935ff04840f5a72a7c31ca78c0d59fbb7c82c4bcce3800949bb477950df8d9',
        key : '3a6f6ba62f060040ff5fa5d77ac6fd15cb3b0b351e67c6cb3ae8434387ad1fca',
        urls : {
            symbols: 'https://api.exchange.coinbase.com/currencies',
            currencies: 'https://api.coinbase.com/v2/currencies',
            exchangeRates: 'https://api.coinbase.com/v2/exchange-rates',
            pricesInitialPath: 'https://api.coinbase.com/v2/prices/', // https://api.coinbase.com/v2/prices/:currency_pair/buy -> :currency_pair = BTC-USD etc.s
            pricesBuyPath: '/buy',
            pricesSellPath: '/sell',
        }
    },
    coincap: {
        urls : {
            initialPath: 'https://api.coincap.io/v2/',
        }
    }
};