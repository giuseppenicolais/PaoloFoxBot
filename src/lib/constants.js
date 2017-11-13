import Utils from '../services/utils'

module.exports = {
    messages: {
        oroscopoInstruction: 'Digita /oroscopo seguito dal tuo segno per ascoltare l\' oroscopo del giorno',
        notZodiacSign: ' non è un segno zodiacale',
        userNotEnabled: ' utente non abilitato',
        welcome: function(username) {
            return `Benvenuto ${username}! `+ this.oroscopoInstruction
        },
        url: function(sign_name){ 
            var date = Utils.getDate();
            return (`http://lattemiele.com/wp-content/uploads/${date.year}/${date.month}/${sign_name}.mp3`)
        },
        genericErrorMessage: 'Errore: riprova più tardi',
        getCaption: function(info){
            var sign_name = info.sign_name.toUpperCase();
            return `Oroscopo ${sign_name} del ${info.date.day}/${info.date.month+1}/${info.date.year}`
        },
        performer : 'Paolo Fox',
        title: function(name){
          return 'Oroscopo ' + name.toUpperCase()  
        } 
    }

}