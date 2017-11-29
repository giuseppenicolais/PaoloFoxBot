var User = function() {

    const mongoose = require('mongoose'),
        Schema = require('mongoose').Schema,
        config = require('../src/config/index');

    //chat_id + username + sign should guarantee the uniqueness
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
                required: [true, 'sign required'],
                trim: true,
                lowercase: true
            },
            active: Boolean,
            trigger_start: String,
            subcription_date: { type: Date, default: Date.now },
            unsubscription_date: Date
        }
    });
    
    var userModel = mongoose.model('User', userSchema);

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
                console.log( newDoc + ' user registered')
                success(newDoc)
            }
        });

    }

    var _unsubscribe = (user, success, fail) => {

        if (!(user.chat_id && user.username)) {
            return console.error('User informations not valid');
        }

        var query = {username: user.username ,chat_id: user.chat_id};

        userModel.remove(query,(err, removed) => {
            if(err){
                console.error('error while unsubscribing user: ' + err)
                fail(err);
            }else{
                console.log(config.log.debugEnabled, 'user removed: ' + removed);
                success(removed)
            }
        });
    }

    var _findByUsername = function(username, success, fail) {
        userModel.findOne({ username: username }, (err, doc) => {
            if (err) {
                console.error('error while finding user: ' + err);
                fail(err)
            } else {
                success(doc)
            }
        });
    }

    var _findByChatId = function(chatId, success, fail) {
        userModel.findOne({ chat_id: chatId }, (err, doc) => {
            if (err) {
                console.error('error while finding user: ' + err);
                fail(err)
            } else {
                console.log(config.log.debugEnabled,'%s service is %s for sign: %s at %s', doc.username, doc.active, doc.sign, doc.trigger_start);
                success(doc)
            }
        });
    }

    var _findAllByTime = function(trigger_start, success, fail) {
        userModel.find({'subscription.active':  true , 'subscription.trigger_start': trigger_start }, (err, users) => {
            if (err) {
                console.error('error while finding user: ' + err);
                fail(err)
            } else {
                console.log(config.log.debugEnabled,'list of users', users);
                success(users)
            }
        });
    }

    return {
        findByUsername: _findByUsername,
        findByChatId: _findByChatId,
        findAllByTime: _findAllByTime,
        upsert: _upsert,
        unsubscribe: _unsubscribe,
        model: userModel,
        schema: userSchema
    }
}()

module.exports = User;