import TelegramBot from 'node-telegram-bot-api';
import InputParser from './inputParser';
import {Command,answerCallbacks} from '../handlers/command';
import config from '../config';

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

        return Promise.resolve();
    }

    handleText(msg) {
        const text = msg.text;

        //reply to the user's choice
        if (answerCallbacks[msg.chat.id]) {
            var callback = answerCallbacks[msg.chat.id]
            if (callback) {
                delete answerCallbacks[msg.chat.id];
                callback(msg);
            }
        }

        //is the command /oroscopo
        if (inputParser.isCommandHoroscope(text)) {
      		return command.sendHoroscope(msg, this.bot);
    	}

        //is the command /start
        if (inputParser.isCommandStart(text)) {
            return command.getStart(msg, this.bot);
    	}

        //is the command /help
        if (inputParser.isCommandHelp(text)) {
            return command.getHelp(msg, this.bot);
        }

   	    return ;
    }
}