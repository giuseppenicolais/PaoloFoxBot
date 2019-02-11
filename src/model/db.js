import config from '../config';
var mongoose = require('mongoose');

if(process.env.NODE_ENV !== 'production'){
	console.log('db uri: ' + config.db);	
}

mongoose.connect(config.db, { useMongoClient: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('connected', function(){
	console.log('mongodb connection success')
})

db.once('open', function () {
	//load models
	require('./fileinfo')
	require('./user')
});

db.on('error',function(err){
	console.log('mongodb connection error: ' + err)
})

db.on('disconnected',function(){
	console.log('mongodb connection')
})

process.on('SIGNINT',function(){
	mongoose.connection.close(function(){
   	 	console.log('Mongoose default connection disconnected through app termination'); 
		process.exit(0);
	})
})


