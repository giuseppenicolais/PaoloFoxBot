import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import config from '../config';
import InputParser from './inputParser';
import Command from '../handlers/command';

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
        const message = new Message(Message.mapMessage(msg));
        const text = message.text;

        //is the command /oroscopo
        if (inputParser.isCommandOroscopo(text)) {
      		return command.sendOroscopo(message, this.bot);
    	}

        //is the command /start
        if (inputParser.isCommandStart(text)) {
      		return command.getStart(message, this.bot);
    	}

        //is the command /help
        if (inputParser.isCommandHelp(text)) {
            return command.getHelp(message, this.bot);
        }

   	    return ;
    }
}