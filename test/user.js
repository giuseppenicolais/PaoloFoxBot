"use strict";

const mongoose = require('mongoose'),
    user = require('../src/model/user'),
    chai = require('assert');
const assert = chai.assert;
const expect = chai.expect;



describe("DB Tests - user", function() {

    var currentUser;

    before(function(done) {

        mongoose.connect(process.env.LOCAL_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            console.log('connected to database test');
            mongoose.set('debug', true);
            done();
        });
    });

    describe("Users Schema tests", function() {

        it("#upsert()", function(done) {
            user.upsert({ chat_id: '123123', username: 'testusername', subscription: { sign: 'cancro', trigger_start: 8 } }, function(doc) {
                //console.log('upsert user: ' + doc)

                assert.equal(doc.chat_id, '123')
                assert.equal(doc.subscription.sign, 'cancro')
                assert.equal(doc.username, 'testusername')
                assert.equal(doc.subscription.trigger_start, 8)

                done();
            }, function() {
                throw ("error while registering a new user");
            })
        });

        it("#findByUsername()", function(done) {
            user.findByUsername(currentUser.username, function(doc) {

                assert.equal(doc.chat_id, '3333')
                assert.equal(doc.subscription.sign, 'leone')
                assert.equal(doc.username, 'testname')
                assert.equal(doc.subscription.trigger_start, 12)

                done();
            }, function() {
                throw ("error while finding an user");
            })
        });
    })

    //After all tests are finished drop database and close connection
    after(function(done) {
        mongoose.connection.db.dropDatabase(function() {
            mongoose.connection.close(done);
        });
    });

});