var User = function() {

    var Utils = require('../services/utils'),
        mongoose = require('mongoose'),
        Schema = require('mongoose').Schema;

    var userSchema = new Schema({
        username: {
            type: String,
            required: [true, 'username required'],
            trim: true,
            unique: true
        },
        chat_id: {
            type: String,
            required: [true, 'chat_id required'],
            trim: true,
            unique: true
        },
        subscription: {
            sign: {
                type: String,
                trim: true,
                lowercase: true
            },
            active: Boolean,
            trigger_start: {
                type: Number,
                min: 0,
                max: 23
            },
            subcription_date: { type: Date, default: Date.now },
            unsubscription_date: { type: Date}
        }
    });
    
    var userModel = mongoose.model('User', userSchema,'User');

    var _upsert = (user, success, fail) => {

        if (!(user.chat_id && user.username)) {
            return console.error('User informations not valid');
        }

        var query = {username: user.username, chat_id: user.chat_id};

        userModel.findOneAndUpdate(query, user, { upsert: true , new: true}, (err,newDoc) => {
            if(err){
                console.error('error while creating user: ' + err)
                fail(err);
            }else{
                console.log( 'user registered: ' + newDoc)
                success(newDoc)
            }
        });

    }

    var _delete = (user, success, fail) => {

        if (!(user.chat_id && user.username)) {
            return console.error('User informations not valid');
        }

        var query = {username: user.username ,chat_id: user.chat_id};

        userModel.remove(query,(err, removed) => {
            if(err){
                console.error('error while unsubscribing user: ' + err)
                fail(err);
            }else{
                console.log( 'user removed: ' + removed);
                success(removed)
            }
        });
    }

    var _findByUsername = function(username, success, fail) {
        userModel.find({ username: username },(err, docs) => {
            if (err) {
                console.error('error while finding user: ' + err);
                fail(err)
            } else {
                success(docs)
            }
        });
    }

    var _findByChatId = function(chatId, success, fail) {
        userModel.findOne({ chat_id: chatId }, (err, doc) => {
            if (err) {
                console.error('error while finding user: ' + err);
                fail(err)
            } else {
                console.log( '_findByChatId : ' + doc);
                success(doc)
            }
        });
    }

    var _findAllActiveUsersByTriggerStart = function(trigger_start, success, fail) {
        userModel.find({'subscription.active':  true ,
                        'subscription.trigger_start': trigger_start}, (err, users) => {
            if (err) {
                console.error('error while finding user: ' + err);
                fail(err)
            } else {
                console.log('list of users', users);
                success(users)
            }
        });
    }

    return {
        findByUsername: _findByUsername,
        findByChatId: _findByChatId,
        findAllActiveUsersByTriggerStart: _findAllActiveUsersByTriggerStart,
        upsert: _upsert,
        delete: _delete,
        model: userModel,
        schema: userSchema
    }
}()

module.exports = User;