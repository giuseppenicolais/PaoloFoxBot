import config from '../config';

var utils;
module.exports =  utils = {

    isUserEnabled: function (username) {
        if(config.beta){
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
        var offset = 1; //the app is hosted in a server with offset 0
        return new Date( new Date().getTime() + offset * 3600 * 1000);
    },

    getItalianLocaleDateString: () => {
        var d =  utils.getDate();
        return  d.getDate() + "/" + (d.getMonth() + 1) +  "/" +  d.getFullYear();
    },

    getZodiacSigns: function(){
        return  ['leone', 'bilancia', 'ariete', 'cancro', 'sagittario', 'gemelli', 'scorpione', 'pesci', 'vergine', 'acquario', 'toro', 'capricorno']
    },

    getHoroscopeUrl: function(sign_name){ 
            return ( `${process.env.LATTEMIELE_URL}/${new Date().getFullYear()}/${process.env.LATTEMIELE_URL_MONTH}/${sign_name.toLowerCase()}.mp3`)
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
            var sign_name = audioFileInfo.sign_name.toUpperCase();
            return `Oroscopo ${sign_name} del ${utils.getItalianLocaleDateString()}`
        },
        performer : 'Paolo Fox',
        title: function(name){
          return name.toUpperCase()  
        } ,
        keyboardTitle: 'Seleziona un segno zodiacale'
    }
}