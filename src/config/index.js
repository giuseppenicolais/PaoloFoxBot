require('dotenv').config();

export default {
  telegram: {
    token: process.env.TELEGRAM_TOKEN || 'TELEGRAM_TOKEN',
    externalUrl: process.env.CUSTOM_ENV_VARIABLE || '',
    port: process.env.PORT || 443,
    host: '0.0.0.0'
  },
  latte_miele : {
    url: (process.env.LATTEMIELE_URL ? process.env.LATTEMIELE_URL : 'http://lattemiele.com/wp-content/oroscopo'),
    month: process.env.LATTEMIELE_URL_MONTH || '',
    year: process.env.LATTEMIELE_URL_YEAR || ''
  },
  db: (process.env.NODE_ENV === 'production' ? process.env.PROD_MONGOLAB_URI : 
        process.env.USE_LOCAL_DB === 'true' ? process.env.LOCAL_MONGODB_URI :
        process.env.DEV_MONGOLAB_URI),
  beta: (process.env.BETA === 'true' ? true : false)
};