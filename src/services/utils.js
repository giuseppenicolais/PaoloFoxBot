module.exports =  {

    isUserEnabled: function (username) {
        switch (username) {
            case 'hardcorewithin':
            case 'ulapoppy':
            case 'carlo_colombo':
                return true;
            default:
                return false;
        }
    },

    getDate: () => {
        const date = new Date();
        const date_info = {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear()
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

    messages: {
        horoscopeInstruction: 'Usa il comando /oroscopo e seleziona un segno zodiacale',
        notZodiacSign: ' non è un segno zodiacale',
        userNotEnabled: ' utente non abilitato',
        welcome: function(username) {
            return `Benvenuto ${username}! `+ this.horoscopeInstruction
        },
        genericErrorMessage: 'Errore: riprova più tardi',
        caption: function(info){
            var sign_name = info.sign_name.toUpperCase();
            return `Oroscopo ${sign_name} del ${info.date.day}/${info.date.month+1}/${info.date.year}`
        },
        performer : 'Paolo Fox',
        title: function(name){
          return name.toUpperCase()  
        } ,
        keyboardTitle: 'Seleziona un segno zodiacale'
    }
}