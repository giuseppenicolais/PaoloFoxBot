require('dotenv').load();

var fileinfo,
    Utils = require('../src/services/utils'),
    mongoose = require('mongoose'),
    assert = require('assert');

mongoose.connect(process.env.LOCAL_MONGODB_URI, { useMongoClient: true });

mongoose.connection.once('open', function() {
    //load models
    fileinfo = require('../model/fileinfo');
    mongoose.set('debug', true);
    executeTests();
});

function executeTests() {


    describe("FileInfo", function() {

        var currentFileinfo;
        var date = Utils.getDate();
        var insertion_date = '' + date.day + (date.month + 1) + date.year;

        beforeEach(function(done) {
            fileinfo.upsert({ sign_name: 'leone', insertion_date: insertion_date, file_id: 'abc123' }, function(doc) {
                    currentFileinfo = doc;
                    done();
                },
                function(err) {
                    console.log('beforeEach upsert: ' + err);
                    done();
                });
        });

        afterEach(function(done) {
            fileinfo.model.remove({}, function() {
                fileinfo.model.collection.dropIndexes(function(err, success) {
                    done();
                })

            })
        });

        after(function(done) {
            mongoose.connection.close(function() {
                console.log('Mongoose default connection disconnected');
                done();
            })
        })

        it("should upsert a new fileinfo doc with id \'abcd1234\' and sign_name: \'leone\'", function(done) {
            fileinfo.upsert({ file_id: 'abcd1234', sign_name: 'leone', insertion_date: '03112017' }, function(doc) {

                assert.equal(doc.sign_name, 'leone')
                assert.equal(doc.file_id, 'abcd1234')
                assert.equal(doc.insertion_date, '03112017')

            }, function(err) {
                throw ("error while inserting a new fileInfo: " + err);
            });
            done()
        });

        it("should find the fileInfo doc by sign name", function(done) {
            fileinfo.findBySignName(currentFileinfo.sign_name, function(doc) {
                console.log('findBySignName doc found')
                console.log(doc)

                assert.equal(doc.file_id, currentFileinfo.file_id)
            }, function() {
                throw ("error while finding a fileInfo");
            })
            done();
        });

        it("should find 2 documents quering on the insertion_date", function(done) {

            fileinfo.upsert({ file_id: 'abcde12345', sign_name: 'leone', insertion_date: '12112017' }, function(doc) {
                fileinfo.upsert({ file_id: 'abcdef123456', sign_name: 'cancro' + insertion_date, insertion_date: insertion_date }, function(doc) {
                    fileinfo.findAllEntriesOfToday(function(results) {
                        assert.equal(results.length, 2)
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

        it("should remove 1 document", function(done) {

            fileinfo.delete({ file_id: currentFileinfo.file_id }, function(removed) {
                assert.equal(removed.sign_name, currentFileinfo.sign_name)
            }, function() {
                throw ("error while finding a fileInfo");
            })
            done();
        });

    });

}