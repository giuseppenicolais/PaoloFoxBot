import Utils from '../services/utils'
import Sign from '../services/sign'

const messages = Utils.messages;
export var answerCallbacks = {};

export class Command {

    constructor() {}

    sendHoroscopeKeyboard(msg, bot) {

        let zodiacKB = Sign.getSignListKeyboardMarkup();
        let options = {
            "reply_markup": {
                "keyboard": zodiacKB,
                "force_reply": true,
                "resize_keyboard" : true
          }
        };
        var chatId = msg.chat.id;
        bot.sendMessage(chatId, "Seleziona un segno zodiacale", options)
            .then( (msg) => {
                    answerCallbacks[chatId] = function(msg){
                    const sign_name = msg.text;
                    Sign.retrieveHoroscope(sign_name.toLowerCase())
                        .then(function(audioFileInfo) {
                            bot.sendAudio(
                                    chatId,
                                    audioFileInfo.filepath, {
                                        file_id: audioFileInfo.telegram_file_id,
                                        performer: messages.performer,
                                        title: messages.title(audioFileInfo.sign_name)
                                    })
                                .then(function() {
                                    bot.sendMessage(chatId,messages.caption(audioFileInfo),{"reply_markup": {"remove_keyboard" : true}});
                                })
                        })
                        .catch(function(reason) {
                            console.error('sendAudio failed:' + reason);
                        });
                }
            });
    }

    getStart(msg, bot) {
        if (!Utils.isUserEnabled(msg.from.username)) {
            bot.sendMessage(msg.chat.id, messages.userNotEnabled);
        } else {
            bot.sendMessage(msg.chat.id, messages.welcome(msg.from.first_name));
        }
    }

    getHelp(msg, bot) {
        bot.sendMessage(msg.chat.id, messages.horoscopeInstruction);
    }
}