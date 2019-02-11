import Utils from '../services/utils'

const messages = Utils.messages,
    Sign = require('../services/sign'),
    UserService = require('../services/user');

export var answerCallbacks = {};

export class Command {

    constructor() {}

    sendHoroscope(msg, bot) {

        let zodiacKB = Sign.getSignListKeyboardMarkup();
        let options = {
            "reply_markup": {
                "keyboard": zodiacKB,
                "force_reply": true,
                "resize_keyboard": true
            }
        };

        bot.sendMessage(msg.chat.id, "Seleziona un segno zodiacale", options)
            .then((msg) => {
                answerCallbacks[msg.chat.id] = function(msg) {
                    var user = msg;
                    Sign.retrieveAudio(msg)
                        .then(function(audioFileInfo) {

                            //insert user info
                            user['sign'] = audioFileInfo.sign_name;
                            UserService.insertUser(user);

                            bot.sendAudio(
                                    msg.chat.id,
                                    (audioFileInfo.file_id ? audioFileInfo.file_id : audioFileInfo.filepath), {
                                        //caption: messages.caption(audioFileInfo),
                                        performer: messages.performer,
                                        title: messages.title(audioFileInfo.sign_name)
                                    })
                                .then(function(fileSent) {
                                    try {
                                        if (!audioFileInfo.file_id && audioFileInfo.file_id !== '') {
                                            audioFileInfo.file_id = fileSent.audio.file_id;
                                            Sign.insertFileInfo(audioFileInfo);
                                        }
                                    } catch (e) {
                                        console.error('Error while inserting file info: ' + e);
                                    } finally {
                                        bot.sendMessage(msg.chat.id, messages.caption(audioFileInfo), { "reply_markup": { "remove_keyboard": true } });
                                    }
                                })
                        })
                        .catch(function(reason) {
                            console.error(reason);
                        });
                }
            });
    }

    getStart(msg, bot) {
        bot.sendMessage(msg.chat.id, messages.welcome(msg.from.first_name));
    }

    getHelp(msg, bot) {
        bot.sendMessage(msg.chat.id, messages.horoscopeInstruction);
    }
}