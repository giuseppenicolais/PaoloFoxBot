var fileinfo = require('../model/fileinfo'),
	Utils = require('../src/services/utils'),
    mongoose = require('mongoose'),
    assert = require('assert');

mongoose.connect('mongodb://localhost/db-test', { useMongoClient: true });
mongoose.set('debug', true);

describe("FileInfo", function() {

	var currentFileinfo;
	var date = Utils.getDate();
    var insertion_date = '' + date.day + (date.month+1) + date.year;

	beforeEach(function(done) {
        fileinfo.upsert({ telegram_file_id: 'paolofoxbotleone' + insertion_date, insertion_date: insertion_date}, function(doc) {
            currentFileinfo = doc;
            done();
        });
    });

    afterEach(function(done) {
        fileinfo.model.collection.dropIndexes(function (err, results) {
                fileinfo.model.remove({}, function() {
            })
        })
        done();
    });

    after(function(done) {
        mongoose.connection.close(function() {
            console.log('Mongoose default connection disconnected');
            done();
        })
    })

    it("should upsert a new fileinfo doc with id \'paolofoxdbcancro03112017\'", function(done) {
        fileinfo.upsert({ telegram_file_id: 'paolofoxbotleone03112017', insertion_date: '03112017'}, function(doc) {

            assert.equal(doc.telegram_file_id, 'paolofoxbotleone03112017')
            assert.equal(doc.insertion_date, '03112017')
        }, function() {
            throw ("error while registering a new fileInfo");
            
        });
        done()
    });

    it("should find the fileInfo doc by id", function(done) {
    	var telegram_file_id = 'paolofoxbotleone'+insertion_date;
        fileinfo.findById(telegram_file_id, function(doc) {
            if(doc){
                assert.equal(doc.telegram_file_id, currentFileinfo.telegram_file_id)
                assert.equal(doc.insertion_date, currentFileinfo.insertion_date)    
            }else{

            }
        }, function() {
            throw ("error while finding a fileInfo");
        })
        done();
    });

    it("should find 2 documents quering on the insertion_date", function(done) {

    	var insertion_date = '' + date.day + (date.month+1) + date.year;
        fileinfo.upsert({ telegram_file_id: 'paolofoxbotleone12112017', insertion_date: '12112017'}, function(doc) {
        	fileinfo.upsert({ telegram_file_id: 'paolofoxbotcancro' + insertion_date, insertion_date: insertion_date}, function(doc) {
                fileinfo.findAllEntriesOfToday(function(results) {
                    assert.equal(results.length, 2)
                    done();
                }, function(err) {
                    throw ('error during findAllByDate: ' + err)
                });
            }, function(err) {
                throw ('error during findAllByDate: ' + err)
            });
        }, function(err) {
            throw ('error during findAllByDate: ' + err)
        });
        done();
    });

});