import Utils from '../services/utils'

export default class InputParser{
	
	isCommandStart(text){
		const command = '/start';
		return text === command;
	}

	isCommandHoroscope(text){
		const command = '/oroscopo';
		return text === command;
	}

	isCommandDailyHoroscope(text){
		const command = '/oroscopo_giornaliero';
		return text === command;
	}

	isCommandStopDailyHoroscope(text){
		const command = '/stop_oroscopo_giornaliero';
		return text === command;
	}

	isCommandHelp(text){
		const command = '/help';
		return text === command;
	}

	isSendHoroscopeCallbackQuery(text){
		return Utils.messages.signsOptionsKBTitle.match(text)
	}

	isSendDailyHoroscopeCallbackQuery(text){
		return Utils.messages.timeOptionsKBTitle.match(text)
	}
	
}