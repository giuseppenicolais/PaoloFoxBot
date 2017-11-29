var config =  function(){

    require('dotenv').load();

    var _telegram = {
        token: process.env.TELEGRAM_TOKEN || 'TELEGRAM_TOKEN',
        externalUrl: process.env.CUSTOM_ENV_VARIABLE || '',
        port: process.env.PORT || 443,
        host: '0.0.0.0'
    }
    var _db = {
        prodConnectionURI: process.env.PROD_MONGOLAB_URI || 'PROD_MONGOLAB_URI',
        devConnectionURI: process.env.DEV_MONGOLAB_URI || 'DEV_MONGOLAB_URI',
        localDbConnectionURI: process.env.LOCAL_MONGODB_URI || 'LOCAL_MONGODB_URI',
        useLocalDb: process.env.USE_LOCAL_DB
    } 

    var _email = {
        address: process.env.GMAIL_ADDRESS,
        password: process.env.GMAIL_PASSWORD
    }

    var _log = {
        debugEnabled: (process.env.LOG_DEBUG_ENABLED === 'true' ? true : false)
    }

    return {
        telegram: _telegram,
        db: _db,
        email: _email,
        log: _log
    }
}()

module.exports = config;