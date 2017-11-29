import TelegramBot from 'node-telegram-bot-api';
import InputParser from './inputParser';
import { Command, answerCallbacks } from '../handlers/command';
import Utils from '../services/utils'

var config = require('../config/index');
var nodemailer = require('nodemailer')
var request = require('request')
var mailer = require('../services/mailer')

const inputParser = new InputParser();
const command = new Command();

export default class Messenger {

    constructor() {
        if (process.env.NODE_ENV === 'production') {
            this.bot = new TelegramBot(config.telegram.token, {
                webHook: {
                    port: config.telegram.port,
                    host: config.telegram.host
                }
            });
            this.bot.setWebHook(config.telegram.externalUrl + ':443/bot' + config.telegram.token)
        } else {
            this.bot = new TelegramBot(config.telegram.token, { polling: true });
        }
    }

    listen() {
        this.bot.on('text', this.handleText.bind(this));
        this.bot.on('callback_query', this.handleCallbackQuery.bind(this));

        return Promise.resolve();
    }

    handleCallbackQuery(callbackQuery) {

        const msg = callbackQuery.message;
        var chatId = callbackQuery.message.chat.id;
        var message_id = callbackQuery.message.message_id;

        //answerCallbackQueryId
       /* form = {
            callback_query_id: arguments[0],
            text: arguments[1],
            show_alert: arguments[2],
          }*/
        if (inputParser.isSendHoroscopeCallbackQuery(msg.text)) {
            return command.handleSendHoroscopeCallbackQuery(callbackQuery, this.bot);
        } else if (inputParser.isSendDailyHoroscopeCallbackQuery(msg.text)) {
            return command.handleSendDailyHoroscopeCallbackQuery(callbackQuery, this.bot);
        }
    }

    handleText(msg) {
        const text = msg.text;

        //is the command /oroscopo
        if (inputParser.isCommandHoroscope(text)) {
            return command.sendHoroscopeKeyboard(msg, this.bot, {daily: false});
        }

        //is the command /oroscopo_giornaliero
        if (inputParser.isCommandDailyHoroscope(text)) {
            return command.sendHoroscopeKeyboard(msg, this.bot, {daily: true});
        }

        //is the command /stop_oroscopo_giornaliero
        if (inputParser.isCommandStopDailyHoroscope(text)) {
            return command.unsubscribeFromDailyHoroscope(msg, this.bot);
        }

        //is the command /start
        if (inputParser.isCommandStart(text)) {
            return command.sendStart(msg, this.bot);
        }

        //is the command /help
        if (inputParser.isCommandHelp(text)) {
            return command.sendHelp(msg, this.bot);
        }

        return;
    }
}