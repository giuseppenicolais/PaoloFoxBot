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
                    // console.log(JSON.stringify(msg))
                    const sign_name = msg.text;
                    Sign.getHoroscope(sign_name)
                        .then(function(info) {
                            // console.log('Sending audio file..')
                            bot.sendAudio(
                                    chatId,
                                    info.filepath, {
                                        file_id: info.sign_name + info.date.date + info.date.month + info.date.year,
                                        // caption: messages.caption(info),
                                        performer: messages.performer,
                                        title: messages.title(info.sign_name)
                                    })
                                .then(function() {
                                    // console.log('removing keyboard')
                                    bot.sendMessage(chatId,messages.caption(info),{"reply_markup": {"remove_keyboard" : true}});
                                })
                        })
                        .catch(function(reason) {
                            console.error('sendAudio failed:' + reason);
                        });
                }
            });
    }

    /*
    from: msg.from.id,
    text: msg.text,
    chat_id: msg.chat.id,
    user: {
        username: msg.from.username,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name
        }
    */
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