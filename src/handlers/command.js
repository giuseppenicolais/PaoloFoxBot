const Utils = require ('../services/utils'),
      Sign = require ('../services/sign'),
      messages = Utils.messages;

export class Command {

    constructor() {}

    sendHoroscopeKeyboard(msg, bot, params) {
        var _options = {
            reply_markup: Sign.generateInlineKeyboard('horoscope', {daily: params.daily})
        }
        if(params.goBack){
            _options.chat_id = msg.chat.id;
            _options.message_id = msg.message_id;
            return bot.editMessageText(messages.signsOptionsKBTitle, _options);
        }else{
            return bot.sendMessage(msg.chat.id, messages.signsOptionsKBTitle, _options);
        }
    }

    sendTriggerTimesKeyboard(callbackQuery, bot) {
        var _options = {
            message_id: callbackQuery.message.message_id,
            reply_markup: Sign.generateInlineKeyboard('times', { daily: JSON.parse(callbackQuery.data).daily, sign: JSON.parse(callbackQuery.data).sign_name}),
            chat_id: callbackQuery.message.chat.id
        }
        return bot.editMessageText(messages.timeOptionsKBTitle, _options);
    }

    sendAudio(msg, audioFileInfo, bot) {
        let date = Utils.getDate();

        return bot.sendAudio(
                msg.chat.id,
                audioFileInfo.filepath, {
                    file_id: audioFileInfo.telegram_file_id,
                    //caption: messages.caption(audioFileInfo),
                    performer: messages.title(audioFileInfo.sign_name), //messages.performer,
                    title: audioFileInfo.sign_emoji //messages.title(audioFileInfo.sign_name)
                })
    }

    sendHoroscope(callbackQuery, bot){
         Sign.retrieveAudio(callbackQuery)
        .then((audioFileInfo) => {
            this.sendAudio(callbackQuery.message, audioFileInfo, bot)
            .catch((err) => {
                options.func_name = 'sendHoroscope';
                this.sendErrorMessage(bot, err, options)
            })
        })
        .catch((err) => {
            options.func_name = 'downloadHoroscope';
            this.sendErrorMessage(bot, err, options)
        })
    }

    handleSendHoroscopeCallbackQuery(callbackQuery, bot){

        //TODO - sendErrorMessage
        /*
            {
                func_name: 'downloadHoroscope',
                chatId: chatId,
                reply_to_message_id: message_id
            }
        */
        //{callback_query_id: callbackQuery.id, text: 'signsOptionsKBTitle', show_alert: false})
        bot.answerCallbackQuery(callbackQuery.id, {})
            .then(() => {
                if (JSON.parse(callbackQuery.data).daily === false) {
                    this.sendHoroscope()
                } else {
                    //register the user and then send the times kb
                    Sign.registerOrUpdateUser(callbackQuery)
                    .then(() => {
                        this.sendTriggerTimesKeyboard(callbackQuery, bot)
                        .catch((err) => {
                            options.func_name = 'sendTriggerTimesKeyboard';
                            this.sendErrorMessage(bot, err, options)
                        })
                    })
                    .catch((err) => {
                        options.func_name = 'registerOrUpdateUser';
                        this.sendErrorMessage(bot, err, options)
                    })
                }
            })
            .catch((err)=>{
                console.error('Error handleSendHoroscopeCallbackQuery: ' + err)
            })
    }

    handleSendDailyHoroscopeCallbackQuery(callbackQuery, bot){
        //{callback_query_id: callbackQuery.id, text: 'timeOptionsKBTitle', show_alert: false})
        bot.answerCallbackQuery(callbackQuery.id, {})
            .then(() => {
                var _options = {};
                        _options.chat_id = callbackQuery.message.chat.id;
                        _options.message_id = callbackQuery.message.message_id;

                if (callbackQuery.data === 'cancel'){                    
                    bot.editMessageText(messages.horoscopeInstruction, _options);
                } else if(callbackQuery.data === 'goBack'){
                    this.sendHoroscopeKeyboard(callbackQuery.message, bot, {daily: true, goBack: true})
                }else {
                    Sign.registerOrUpdateUser(callbackQuery)
                    .then((user) => {
                        var text;
                        if(user.isNew){
                            text = messages.newUserSubscribed(JSON.parse(callbackQuery.data).trigger_start);
                        } else{
                            text = messages.existingUserUpdated(JSON.parse(callbackQuery.data).trigger_start)
                        }
                        bot.editMessageText(text, _options);
                    })
                    .catch((err) => {
                        options.func_name = 'setDailyHoroscope';
                        this.sendErrorMessage(bot, err, options)
                    }) 
                }
            })
            .catch((err)=>{
                console.error('Error handleSendDailyHoroscopeCallbackQuery: ' + err)
            })
    }

    unsubscribeFromDailyHoroscope(msg, bot){
        Sign.unsubscribeUser(msg)
        .then(() => {
            return bot.sendMessage(msg.chat.id, messages.successfullyUnsubscribed)
        })
        .catch((err) => {
            options.func_name = 'unsubscribeUser';
            this.sendErrorMessage(bot, err, options)
        })
    }

    sendErrorMessage(bot, err, options) {
        var log = `Error during ${options.func_name}: \n ${err}`;
        console.error(log);
        // bot.sendMessage(callbackQuery.message.chat.id, messages.caption('Ops! C\'è stato un errore, per favore riprova'));
        var _options = { chat_id: options.chatId, reply_to_message_id: options.message_id };
        bot.editMessageText(messages.genericErrorMessage, _options)
        .then((errorMessage)=> {
            mailer.sendEmail({errorMessage: log, opts: _options});
        })
        .catch((err)=>{
            console.error('Error sendErrorMessage: %s', err)
        })
    }

    sendStart(msg, bot) {
        if (!Utils.isUserEnabled(msg.from.username)) {
            bot.sendMessage(msg.chat.id, messages.userNotEnabled);
        } else {
            bot.sendMessage(msg.chat.id, messages.welcome(msg.from.first_name));
        }
    }

    sendHelp(msg, bot) {
        bot.sendMessage(msg.chat.id, messages.horoscopeInstruction);
    }
}