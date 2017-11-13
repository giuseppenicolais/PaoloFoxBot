import Sign from '../src/services/sign';

var assert = require('assert');
var path = require('path')

var date = new Date();
var info = {
    date: {
        year: date.getFullYear(),
        month: date.getMonth()
    },
    sign_name: 'cancro'
};

describe('Sign',function(){
	describe('getInfo',function(){
		it('should return information about the sign',function(){

			var sign = new Sign('cancro');
            var getInfo = sign.getInfo();

			assert.equal(getInfo.sign_name,info.sign_name);
			assert.equal(getInfo.url,`http://lattemiele.com/wp-content/uploads/${info.date.year}/${info.date.month}/${info.sign_name}.mp3`);
			assert.equal(getInfo.filepath,path.join('/tmp', info.sign_name + '.mp3'));

		})
	})
})


describe('Sign',function(){
	describe('getInfo',function(){
		it('should create a Sign object with the name \'cancro\'',function(){

			var sign = new Sign('cancro');
			assert.equal(sign.getName(),'cancro');

		})
	})
})