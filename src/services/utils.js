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
            year: date.getFullYear(),
            hours: date.getHours(),
            minutes: date.getMinutes()
        }
        return date_info;
    },
    
    getJSTime: function(time){
        //var hours = time.split(' ')[1];.split(':');
        //time = parseInt(hours[0],10)-1
        return time.split(' ')[1];
    },

    getTriggerTimes: function(){
        return  ['🕖 07:00', '🕗 08:00', '🕘 09:00', '🕚 11:00', '🕛 12:00', '🕐 13:00', '🕑 14:00', '🕒 15:00', '🕓 16:00', '🕕 18:00', '🕗 20:00', '🕘 21:00']
    },

    getZodiacSigns: function(){
        return  ['♈ Ariete', '♉ Toro', '♊ Gemelli', '♋ Cancro', '♌ Leone', '♍ Vergine', '♎ Bilancia', '♏ Scorpione', '♐ Sagittario','♑ Capricorno', '♒ Acquario', '♓ Pesci']
    },

    getHoroscopeUrl: function(sign_name){ 
            var date = this.getDate();
            return (`http://lattemiele.com/wp-content/uploads/${date.year}/${date.month}/${sign_name}.mp3`)
    },
    getTelegramFileId: function(sign_name){
        var date = this.getDate();
        return  'paolofoxbot' + sign_name + date.day + (date.month+1) + date.year
    },
    
    messages: {
        horoscopeInstruction: 'Usa il comando /oroscopo e seleziona un segno zodiacale per ascoltare l\'oroscopo del giorno.\n'+
                               '\n'+
                              'Usa il comando /oroscopo_giornaliero e seleziona un segno zodiacale e l\'ora in cui vuoi ricevere l\'oroscopo giornaliero.\n'+
                              '\n'+
                              'Usa il comando /stop_oroscopo_giornaliero per fermare la ricezione dell\'oroscopo giornaliero.',
        notZodiacSign: ' non è un segno zodiacale',
        userNotEnabled: ' utente non abilitato',
        welcome: function(username) {
            return `Benvenuto ${username}! `+ this.horoscopeInstruction
        },
        genericErrorMessage: 'C\'è stato un errore 😱 per favore riprova ',
        successfullyUnsubscribed: 'Il servizio è stato rimosso.\n' +
                                'Puoi iscriverti nuovamente tramite il comando /oroscopo_giornaliero',
        newUserSubscribed: function(trigger_start){
            return 'Registrazione effettuata con successo!🎉🎉🎉\n' +
            `Riceverai l\'oroscopo selezionato ogni giorno alle ${trigger_start}`
        },
        existingUserUpdated: function(trigger_start){
            return 'Aggiornamento effettuato con successo!🎉🎉🎉\n' +
            `Riceverai l\'oroscopo selezionato ogni giorno alle ${trigger_start}`
        },
        caption: function(info){
            var sign_name = info.sign_name.toUpperCase(),
            day = info.date.day;

            if(info.date.hours < 7 && info.date.minutes < 10){
                day = info.date.day-1;
            }
            return `Oroscopo ${sign_name} del ${day}/${info.date.month+1}/${info.date.year}`
        },
        performer : 'Paolo Fox',
        title: function(name){
          return name.toUpperCase()  
        },
        signsOptionsKBTitle: 'Seleziona un segno zodiacale',
        timeOptionsKBTitle: 'A che ora vuoi ricevere l\'oroscopo?',
        goBack: '🔙 vai indietro',
        cancel: '❌ Annulla'
    }
}