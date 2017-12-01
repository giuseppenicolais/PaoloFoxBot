require('dotenv').load();

var fileinfo,
    Utils = require('../src/services/utils'),
    mongoose = require('mongoose'),
    chai = require('chai'),
    assert = chai.assert,
    should = chai.should;
chai.use(require('chai-datetime'));

mongoose.connect(process.env.LOCAL_MONGODB_URI, { useMongoClient: true });

// mongoose.connection.once('open', function() {
//load models
fileinfo = require('../src/model/fileinfo');
mongoose.set('debug', true);
executeTests();
// });

function executeTests() {


    describe("FileInfo", function() {

        var currentFileinfo;
        var today = Utils.getDate();

        // beforeEach(function(done) {
        //     fileinfo.upsert({ sign_name: 'leone', insertion_date: today, file_id: 'abc123' }, function(doc) {
        //             currentFileinfo = doc;
        //             done();
        //         },
        //         function(err) {
        //             console.log('beforeEach upsert: ' + err);
        //             done();
        //         });
        // });

        // afterEach(function(done) {
        //     fileinfo.model.remove({}, function() {
        //         done()
        //     })
        // });

        after(function(done) {
            fileinfo.model.collection.dropIndexes(function(err, success) {
                mongoose.connection.close(function() {
                    console.log('Mongoose default connection disconnected');
                    done();
                })
            })
        })

        describe("#upsert", function() {
            it("should upsert a new fileinfo doc with id \'abcd1234\' and sign_name: \'leone\'", function(done) {

                fileinfo.upsert({ file_id: 'abcd1234', sign_name: 'leone' }, function(doc) {
                    
                    console.log('TEST FILEINFO - INSERTED')
                    console.log(doc)
                    
                    assert.equal(doc.sign_name, 'leone')
                    assert.equal(doc.file_id, 'abcd1234')

                    doc.insertion_date.should.equalDate(today)

                }, function(err) {
                    throw ("error while inserting a new fileInfo: " + err);
                });
                done()
            });
        })

        describe("#findBySignName", function() {
            it("should find the fileInfo doc by sign name", function(done) {
                fileinfo.findBySignName(currentFileinfo.sign_name, function(doc) {
                    assert.equal(doc.file_id, currentFileinfo.file_id)
                }, function() {
                    throw ("error while finding a fileInfo");
                })
                done();
            });
        })

        describe("#findAllEntriesOfToday", function() {
            it("should find 2 documents quering on the insertion_date", function(done) {

                fileinfo.upsert({ file_id: 'abcde12345', sign_name: 'leone', insertion_date: new Date(12, 11, 2017) }, function(doc) {
                    fileinfo.upsert({ file_id: 'abcdef123456', sign_name: 'cancro', insertion_date: today }, function(doc) {
                        fileinfo.findAllEntriesOfToday(function(results) {
                            assert.equal(results.length, 1)
                            done();
                        }, function(err) {
                            throw ('error during findAllEntriesOfToday: ' + err)
                        });
                    }, function(err) {
                        throw ('error during findAllByDate: ' + err)
                    });
                }, function(err) {
                    throw ('error during findAllByDate: ' + err)
                });
            });
        })

        describe("#_deleteAllOldRecords", function() {
            it("should remove 1 document", function(done) {

                fileinfo.deleteAllOldRecords(function(removed) {
                    console.log('removed')
                    console.log(removed)
                    assert.equal(removed.length, 1)
                }, function() {
                    throw ("error while finding a fileInfo");
                })
                done();
            });
        })


    });

}