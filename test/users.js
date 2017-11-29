var user = require('../model/users'),
    mongoose = require('mongoose'),
    assert = require('assert');

mongoose.connect('mongodb://localhost/db-test', { useMongoClient: true });
mongoose.set('debug', true);

describe("Users", function() {

    var currentUser;

    beforeEach(function(done) {
        user.upsert(
        {
            chat_id: '3333',
            username: 'testname',
            subscription: {
                trigger_start: '12:00',
                sign: 'leone',
                active: false 
            } 
        },
        function(doc) {
            currentUser = doc;
        },
        function(err){
            throw ('Error in beforeEach - upsert: '+ err)
        })
        done();
    });

    afterEach(function(done) {
        user.model.collection.dropIndexes(function (err, results) {
                user.model.remove({}, function() {
            });
        })
        done();
    });

    after(function(done) {
        mongoose.connection.close(function() {
            console.log('Mongoose default connection disconnected');
            done();
        })
    })

    /*it("should upsert a new user username: testusername", function(done) {
        user.upsert({ chat_id: '123', username: 'testusername', subscription: { sign: 'cancro', trigger_start: '08:00' } }, function(doc) {
            //console.log('upsert user: ' + doc)

            assert.equal(doc.chat_id, '123')
            assert.equal(doc.subscription.sign, 'cancro')
            assert.equal(doc.username, 'testusername')
            assert.equal(doc.subscription.trigger_start, '08:00')
        }, function() {
            throw ("error while registering a new user");
        })
        done();
    });*/

    it("should find the user 'testname' by username", function(done) {
        user.findByUsername(currentUser.username, function(doc) {

            assert.equal(doc.chat_id, '3333')
            assert.equal(doc.subscription.sign, 'leone')
            assert.equal(doc.username, 'testname')
            assert.equal(doc.subscription.trigger_start, '12:00')
        }, function() {
            throw ("error while finding an user");
        })
        done();
    });

    /*it("should find 2 users quering on the trigger_start", function(done) {

        var currentdate = new Date();
        var hours = currentdate.getHours();

        user.upsert({ chat_id: '555', username: 'testname_5', subscription: { trigger_start: '12:00', sign: 'leone', active: true } }, function(doc) {
            // console.log('user: ' + doc.username + ' registered')
            user.upsert({ chat_id: '666', username: 'testname_6', subscription: { trigger_start: hours + ':00', sign: 'cancro', active: true } }, function(doc) {
                // console.log('user: ' + doc.username + ' registered')
                user.upsert({ chat_id: '777', username: 'testname_7', subscription: { trigger_start: hours + ':00', sign: 'scorpione', active: true } }, function(doc) {
                    // console.log('user: ' + doc.username + ' registered')
                    user.upsert({ chat_id: '888', username: 'testname_8', subscription: { trigger_start: hours + ':00', sign: 'vergine', active: false } }, function(doc) {
                        // console.log('user: ' + doc.username + ' registered')
                        user.findAllByTime(hours + ':00', function(users) {
                            assert.equal(users.length, 2)
                        }, function(err) {
                            throw ('error during findAllByTime: ' + err)
                        });
                    }, function(err) {
                        throw ('error during findAllByTime: ' + err)
                    });
                }, function(err) {
                    throw ('error during findAllByTime: ' + err)
                });
            }, function(err) {
                throw ('error during findAllByTime: ' + err)
            });
        }, function(err) {
            throw ('error during findAllByTime: ' + err)
        });
        done();
    });*/

});