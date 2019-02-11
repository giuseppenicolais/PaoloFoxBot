var UserDao = function() {

    var Utils = require('../services/utils'),
        mongoose = require('mongoose'),
        Schema = require('mongoose').Schema;

    var userSchema = new Schema({
        user_id: {
            type: String,
            required: [true, 'user_id required'],
            unique: true
        },
        username: {
            type: String,
            required: [true, 'username required'],
            trim: true,
            unique: true
        },
        chat_id: {
            type: String,
            required: [true, 'chat_id required']
        },
        message_id: {
            type: String,
            required: [true, 'message_id required'],
            unique: true
        },
        is_bot: {
            type: Boolean,
            required: false
        },
        subscription: {
            subscription_date: { type: Date },
            sign: {type: String, required: true, unique: false}
        }
    });

    var userModel = mongoose.model('User', userSchema,'User');

    var _upsert = (user, success, fail) => {

        if (typeof user === 'undefined') {
            return console.error('User information not valid');
        }

        var query = {user_id: user.from.id, username: user.from.username, chat_id: user.chat.id, message_id: user.message_id ,is_bot: user.from.is_bot, subscription: {subscription_date: Utils.getDate(), sign: user.sign}};

        userModel.findOneAndUpdate(query, user, { upsert: true , new: true}, (err,newDoc) => {
            if(err){
                console.error('error while creating user: ' + err)
                fail(err);
            }else{
                success(newDoc)
            }
        });
    }

    return {
        upsert: _upsert,
        model: userModel,
        schema: userSchema
    }
}()

module.exports = UserDao;