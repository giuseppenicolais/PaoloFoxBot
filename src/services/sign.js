var Sign = function(){
    
'use strict'

const Utils = require ('../services/utils'),
     path = require('path'),
     fs = require('fs'),
     request = require('request'),
     users = require('../../model/users'),
     fileinfo = require('../../model/fileinfo'),
     config = require('../config/index'),
     messages = Utils.messages;

    var _getSignListKeyboardMarkup = function(isDaily) {

        var kb = [
            Utils.getZodiacSigns().slice(0, 3).map(sign => {
                return { text: sign, callback_data: JSON.stringify({ sign_name: sign, daily: isDaily }) }
            }),
            Utils.getZodiacSigns().slice(3, 6).map(sign => {
                return { text: sign, callback_data: JSON.stringify({ sign_name: sign, daily: isDaily }) }
            }),
            Utils.getZodiacSigns().slice(6, 9).map(sign => {
                return { text: sign, callback_data: JSON.stringify({ sign_name: sign, daily: isDaily }) }
            }),
            Utils.getZodiacSigns().slice(9, 12).map(sign => {
                return { text: sign, callback_data: JSON.stringify({ sign_name: sign, daily: isDaily }) }
            })
        ];

        return kb;
    }

    var _getTimeListKeyboardMarkup = function(sign) {

        return [
            Utils.getTriggerTimes().slice(0, 4).map(time => {
                return { text: time, callback_data: JSON.stringify({ trigger_start: Utils.getJSTime(time), sign_name: sign }) }
            }),
            Utils.getTriggerTimes().slice(4, 8).map(time => {
                return { text: time, callback_data: JSON.stringify({ trigger_start: Utils.getJSTime(time), sign_name: sign }) }
            }),
            Utils.getTriggerTimes().slice(8, 12).map(time => {
                return { text: time, callback_data: JSON.stringify({ trigger_start: Utils.getJSTime(time), sign_name: sign }) }
             })
            ,[{ text: messages.goBack, callback_data: 'goBack' },{ text: messages.cancel, callback_data: 'cancel' }]
        ]
    }

    var downloadAudio = function(callbackQuery,audioFileInfo, resolve, reject){

        const msg = callbackQuery.message;
        // bot.editMessageText('Invio dell\'oroscopo in corso...', { chat_id: msg.chat.id, message_id: msg.message_id})
        // .then(() => {
        //TODO before downloading, check that the file is on the Telegram server
        
        let url = Utils.getHoroscopeUrl(audioFileInfo.sign_name),
        statusCode,
        audioStream = fs.createWriteStream(audioFileInfo.filepath);

        audioStream.on('finish', function() {
            if (statusCode !== 200) {
                reject('Status code: ' + statusCode + ' - url: ' + url);
            } else {
                console.log('uploading ' + audioFileInfo.filepath + ' to telegram server');
                //update the db
                fileinfo.upsert(audioFileInfo,()=>{},()=>{})
                //return the file audio
                resolve(audioFileInfo);
            }
        })

        request
            .get(url, {headers: { 'user-agent': 'node.js' }})
            .on('response', function(response) {
                statusCode = response.statusCode;
                // console.log(response.headers['content-type']) // 'image/png'
            })
            .on('error', function(err) {
                console.error('Error while downloading the file from url: ' + url + ' - \n' + err)
                reject(messages.genericErrorMessage);
            })
            .pipe(audioStream);
        // })
    }

    var _retrieveAudio = function(callbackQuery) {
        //check the file has been already updated on telegram
        return new Promise(
            function(resolve, reject) {
                var audioFileInfo = {
                sign_name: getSignName(callbackQuery),
                sign_emoji: getSignEmoji(callbackQuery),
                filepath: path.join('/tmp', getSignName(callbackQuery) + '.mp3'),
                telegram_file_id: Utils.getTelegramFileId(getSignName(callbackQuery))
            };

            fileinfo.findById(audioFileInfo.telegram_file_id ,function(doc){
                    if(doc){
                        resolve(audioFileInfo);
                    }else{
                        //else downlaod the file
                        downloadAudio(callbackQuery, audioFileInfo, resolve, reject);
                    }
                },
                function(err){
                    console.error('Error during fileInfo.getFindById: ' + err)
                });  
            }
        )                 
    }

    var _unsubscribeUser = function(msg) {
        return new Promise(
            function(resolve, reject) {
                var user = {
                    chat_id: msg.chat.id,
                    username: msg.from.username
                };
                users.unsubscribe(user, resolve, reject);
            });
    }

    var _registerOrUpdateUser = function(callbackQuery) {

        return new Promise(
            function(resolve, reject) {

                // console.log('callbackquery:');
                // console.log(callbackQuery);
                let isActive = false;
                var trigger_start = (JSON.parse(callbackQuery.data).trigger_start !== undefined ? JSON.parse(callbackQuery.data).trigger_start : '');
                if (trigger_start) {
                    isActive = true;
                }
                var sign_name = getSignName(callbackQuery);
                var user = {
                    chat_id: callbackQuery.message.chat.id,
                    username: callbackQuery.from.username,
                    subscription: {
                        active: isActive, //activation is updated as soon as the user selects a trigger time
                        sign: sign_name,
                        trigger_start: trigger_start,
                        subcription_date: new Date()
                    }
                }

                return users.upsert(user, resolve, reject);
            })
    }

    var _isZodiacSign = function(signName) {
        return signName && Utils.getZodiacSigns().includes(signName.toLowerCase());
    }

    var getSignName = function(callbackQuery) {
        return JSON.parse(callbackQuery.data).sign_name.split(' ')[1].toLowerCase();
    }

    var getSignEmoji = function(callbackQuery) {
        return JSON.parse(callbackQuery.data).sign_name.split(' ')[0];
    }

    var _getSelectedTime = function(callbackQuery) {
        return JSON.parse(callbackQuery.data).trigger_start;
    }

    var _generateInlineKeyboard = function(inlineKBCommand, params) {
        let kb;
        switch (inlineKBCommand) {
            case 'horoscope':
                kb = 
                    // reply_to_message_id: options.message_id,
                    JSON.stringify({
                        inline_keyboard: _getSignListKeyboardMarkup(params.daily)
                    })
                
                break;
            case 'times':
                kb = {
                    // reply_to_message_id: options.message_id,
                        inline_keyboard: _getTimeListKeyboardMarkup(params.sign)
                    }
                
                break;
            default:
                {
                    console.error('keyboard command not implemented')
                    return;
                }
        }

        return kb;
    }

    return {
       generateInlineKeyboard: _generateInlineKeyboard,
       getSelectedTime: _getSelectedTime,
       isZodiacSign: _isZodiacSign,
       registerOrUpdateUser: _registerOrUpdateUser,
       unsubscribeUser: _unsubscribeUser,
       retrieveAudio: _retrieveAudio,
       getTimeListKeyboardMarkup: _getTimeListKeyboardMarkup,
       getSignListKeyboardMarkup: _getSignListKeyboardMarkup
    }
}();

module.exports = Sign;