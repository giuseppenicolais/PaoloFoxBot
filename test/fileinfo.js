require('dotenv').config();

var fileinfo,
    Utils = require('../src/services/utils'),
    mongoose = require('mongoose'),
    chai = require('chai'),
    assert = chai.assert,
    should = chai.should;
chai.use(require('chai-datetime'));

mongoose.connect(process.env.LOCAL_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connection.once('open', function() {
//load models
fileinfo = require('../src/model/fileinfo');
mongoose.set('debug', true);
executeTests();
// });

function executeTests() {
        
    describe("FileInfo", function() {
        
        const noop = () => ({});
        const deleteAll = () => (fileinfo.model.collection.deleteMany({}));
        var today = Utils.getDate();

        beforeEach(function(done) {
            deleteAll();
            done();
        })

        afterEach(function(done) {
            deleteAll();
            done();
        })

        describe("#upsert", function() {
            it("should upsert a new fileinfo doc with id \'upsertDocId1\' and sign_name: \'cancro\'", function(done) {
                fileinfo.upsert({ file_id: 'upsertDocId1', sign_name: 'cancro' }, function(doc) {
                    assert.equal(doc.sign_name, 'cancro')
                    assert.equal(doc.file_id, 'upsertDocId1')
                    assert.equalDate(doc.insertion_date, today)
                }, function(err) {
                    throw ("error while inserting a new fileInfo: " + err);
                });
                done();
            });
        })

       describe("#findBySignName", function() {
            it("should find the fileInfo doc by sign name", function(done) {

                fileinfo.upsert({ file_id: 'upsertDocId2', sign_name: 'leone'}, 
                    function(doc) {
                        // console.log('findBySignName inserted: ' + doc);

                        fileinfo.findBySignName('leone', 
                            function(doc) {
                                assert.equal(doc.file_id, 'upsertDocId2')
                            }, 
                            function(err) {
                                throw ('findBySignName error: ' + err);
                            }
                        )
                    }, 
                    function(err) { 
                        console.log('findBySignName upsert error: ' + err) 
                    }
                );
                done();
            });
        })

        describe("#findAllEntriesOfToday", function() {
            it("should find 2 documents quering on the insertion_date", function(done) {

                fileinfo.upsert({ file_id: 'upsertDocId3', sign_name: 'sagittario', insertion_date: new Date(12, 11, 2017) }, 
                function(doc) { 
                    // console.log('findAllEntriesOfToday upsertDocId3 inserted: ' + doc); 

                    fileinfo.upsert({ file_id: 'upsertDocId4', sign_name: 'acquario' }, 
                        function(doc) { 
                            // console.log('findAllEntriesOfToday upsertDocId4 inserted: ' + doc); 

                            fileinfo.findAllEntriesOfToday(function(results) {
                                console.log('findAllEntriesOfToday results: ' + results); 
                                assert.equal(results.length, 1);
                            }, function(err) {
                                throw ('error during findAllEntriesOfToday: ' + err)
                            });

                        }, 
                        function(err) {throw ('error during findAllEntriesOfToday: ' + err)}
                    );
                }, 
                function(err) {throw ('error during findAllEntriesOfToday: ' + err)}
                );
                done();
            });
        })

        describe("#deleteAllOldRecords", function() {
            it("should remove 1 document", function(done) {

                fileinfo.upsert({ file_id: 'upsertDocId5', sign_name: 'sagittario', insertion_date: new Date(12, 11, 2017) }, 
                    function(doc) { 
                        // console.log('deleteAllOldRecords upsertDocId5 inserted: ' + doc); 

                        fileinfo.deleteAllOldRecords(function(removed) {
                            console.log('deleteAllOldRecords removed: ' + removed)
                            assert.equal(removed.deletedCount, 1)
                        }, function(err) {
                            throw ("error deleteAllOldRecords: " + err);
                        });
                    }, 
                    function(err) {throw ('error during deleteAllOldRecords: ' + err)}
                );

                done();
            });
        })
    });

}