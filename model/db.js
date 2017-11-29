const config = require('../src/config/index'),
	  mongoose = require('mongoose')

if (process.env.NODE_ENV === 'production') {
	mongoose.connect(config.db.prodConnectionURI, { useMongoClient: true })
}else if(config.db.useLocalDb === 'true'){
	mongoose.connect(config.db.localDbConnectionURI, { useMongoClient: true })
}else {
	mongoose.connect(config.db.devConnectionURI, { useMongoClient: true })
}

mongoose.connection.on('connected', function(){
	console.log('mongodb connection success')
})

mongoose.connection.on('error',function(){
	console.log('mongodb connection error')
})

mongoose.connection.on('disconnected',function(){
	console.log('mongodb connection')
})

process.on('SIGNINT',function(){
	mongoose.connection.close(function(){
   	 	console.log('Mongoose default connection disconnected through app termination'); 
		process.exit(0);
	})
})

//import schema
require('./users')