
var config = require('../config/index');

module.exports =  {


    isUserEnabled: function (username) {
        if(config.filtering.enabled){
            console.log('user filtering enabled')
            switch (username) {
                case 'hardcorewithin':
                case 'ulapoppy':
                case 'carlo_colombo':
                    return true;
                default:
                    return false;
            }
        }else {
            console.log('user filtering disabled')
            return true;
        }
    },

    getDate: () => {
        const date = new Date();
        const date_info = {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
            hours: date.getHours(),
            minutes: date.getMinutes()
        }
        return date_info;
    },


    getZodiacSigns: function(){
        return  ['leone', 'bilancia', 'ariete', 'cancro', 'sagittario', 'gemelli', 'scorpione', 'pesci', 'vergine', 'acquario', 'toro', 'capricorno']
    },

    getOroscopoUrl: function(sign_name){ 
            var date = this.getDate();
            return (`http://lattemiele.com/wp-content/uploads/${date.year}/${date.month}/${sign_name}.mp3`)
    },

    getTelegramFileId: function(sign_name){
        var date = this.getDate(),
            month = date.month+1
        return 'paolofoxbot' + info.sign_name + date.day + month + date.year;
    },

    messages: {
        horoscopeInstruction: 'Usa il comando /oroscopo e seleziona un segno zodiacale',
        notZodiacSign: ' non è un segno zodiacale',
        userNotEnabled: ' utente non abilitato',
        welcome: function(username) {
            return `Benvenuto ${username}! `+ this.horoscopeInstruction
        },
        genericErrorMessage: 'Errore: riprova più tardi',
        caption: function(audioFileInfo){
            var sign_name = audioFileInfo.sign_name.toUpperCase(),
            day = audioFileInfo.date.day;

            if(audioFileInfo.date.hours < 7 && audioFileInfo.date.minutes < 10){
                day = audioFileInfo.date.day-1;
            }
            return `Oroscopo ${sign_name} del ${day}/${audioFileInfo.date.month+1}/${audioFileInfo.date.year}`
        },
        performer : 'Paolo Fox',
        title: function(name){
          return name.toUpperCase()  
        } ,
        keyboardTitle: 'Seleziona un segno zodiacale'
    }
}