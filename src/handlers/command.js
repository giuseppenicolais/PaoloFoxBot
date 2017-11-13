import Utils from '../services/utils'
import Sign from '../services/sign'
import Constants from '../lib/constants'

const messages = Constants.messages;

export default class Command {

    constructor() {}

    sendOroscopo(message, bot) {

        const sign_name = message.text.split(' ')[1];
        
        if (sign_name && !Utils.isZodiacSign(sign_name)) {
            bot.sendMessage(message.chat_id, message.text + messages.notZodiacSign)
        } else if (!sign_name) {
            bot.getHelp(message, bot)
        } else {
            const sign = new Sign(sign_name);
            sign.getOroscopo()
            .then(function(info){
                console.log('Sending audio file..')
                var objReturn = bot.sendAudio(
                    message.chat_id,
                    info.filepath, {
                        file_id: sign.getName()+info.date.date+info.date.month+info.date.year,
                        caption: messages.getCaption(info),
                        performer: messages.performer,
                        title: messages.title(sign.getName())
                })

                console.log('File audio sent: ', objReturn)
            })
            .catch(function(reason){
                console.error('sendAudio failed:' + reason);
            });
        }
    }

    getStart(message, bot) {
        if (!Utils.isUserEnabled(message.username)) {
            bot.sendMessage(message.chat_id, messages.userNotEnabled);
        } else {
            bot.sendMessage(message.chat_id, messages.welcome(message.user.firstName));
        }
    }

    getHelp(message, bot) {
        bot.sendMessage(message.chat_id, messages.oroscopoInstruction);
    }

    sendMessage(message, bot) {
        bot.sendMessage(message.chat_id, message);
    }
}