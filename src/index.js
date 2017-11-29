import Messenger from './lib/messenger';
var db = require('../model/db')

const bot = new Messenger();

bot.listen().then(() => { console.log('Bot is listening'); });