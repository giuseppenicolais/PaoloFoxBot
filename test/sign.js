var assert = require('assert');
const Sign = require('../src/services/sign')

describe('Sign', function() {
    describe('#getTimeListKeyboardMarkup()', function() {
        it('should return an array of arrays containing objects like { text: \'<time>\', callback_data: \'{trigger_start: <trigger_start>. sign_name: <sign_name>\' }', function() {
               var sign = 'cancro',
                expected = [
                    [
                        { text: '🕖 07:00',   callback_data: JSON.stringify({trigger_start: '07:00', sign_name: sign} )},
                        { text: '🕗 08:00',   callback_data: JSON.stringify({trigger_start: '08:00', sign_name: sign} )},
                        { text: '🕘 09:00',   callback_data: JSON.stringify({trigger_start: '09:00', sign_name: sign} )},
                        { text: '🕚 11:00',   callback_data: JSON.stringify({trigger_start: '11:00', sign_name: sign} )},
                    ],
                    [
                        { text: '🕛 12:00',  callback_data:  JSON.stringify({trigger_start: '12:00', sign_name: sign} )},
                        { text: '🕐 13:00',  callback_data:  JSON.stringify({trigger_start: '13:00', sign_name: sign} )},
                        { text: '🕑 14:00',  callback_data:  JSON.stringify({trigger_start: '14:00', sign_name: sign} )},
                        { text: '🕒 15:00',  callback_data:  JSON.stringify({trigger_start: '15:00', sign_name: sign} )},
                    ],
                    [
                        { text: '🕓 16:00',  callback_data:  JSON.stringify({trigger_start: '16:00', sign_name: sign} )},
                        { text: '🕕 18:00',  callback_data:  JSON.stringify({trigger_start: '18:00', sign_name: sign} )},
                        { text: '🕗 20:00',  callback_data:  JSON.stringify({trigger_start: '20:00', sign_name: sign} )},
                        { text: '🕘 21:00',  callback_data:  JSON.stringify({trigger_start: '21:00', sign_name: sign} )}
                    ],
                    [
                        {text: 'Annulla', callback_data: 'cancel'}
                    ]
                ];
            assert.deepEqual(Sign.getTimeListKeyboardMarkup(sign),expected);
        })
    })
})

describe('Sign', function() {
    describe('#getSignListKeyboardMarkup()', function() {
        it('should return an array of arrays containing objects like { text: \'<zodiac sign>\', callback_data: \'<zodiac sign>\' }', function() {

            var expected = [
                    [
                        { text: '♈ Ariete', callback_data: JSON.stringify({sign_name: '♈ Ariete' , daily: true})},
                        { text: '♉ Toro', callback_data: JSON.stringify({sign_name: '♉ Toro' , daily: true})},
                        { text: '♊ Gemelli', callback_data: JSON.stringify({sign_name: '♊ Gemelli' , daily: true})}
                    ],
                    [
                        { text: '♋ Cancro', callback_data: JSON.stringify({sign_name: '♋ Cancro' , daily: true})},
                        { text: '♌ Leone', callback_data: JSON.stringify({sign_name: '♌ Leone' , daily: true})},
                        { text: '♍ Vergine', callback_data: JSON.stringify({sign_name: '♍ Vergine' , daily: true})}
                    ],
                    [
                        { text: '♎ Bilancia', callback_data: JSON.stringify({sign_name: '♎ Bilancia' , daily: true})},
                        { text: '♏ Scorpione', callback_data: JSON.stringify({sign_name: '♏ Scorpione' , daily: true})},
                        { text: '♐ Sagittario', callback_data: JSON.stringify({sign_name: '♐ Sagittario' , daily: true})}
                    ],
                    [
                        { text: '♑ Capricorno', callback_data: JSON.stringify({sign_name: '♑ Capricorno' , daily: true})},
                        { text: '♒ Acquario', callback_data: JSON.stringify({sign_name: '♒ Acquario' , daily: true})},
                        { text: '♓ Pesci', callback_data: JSON.stringify({sign_name: '♓ Pesci' , daily: true})}
                    ],
                    [
                        {text: 'Annulla', callback_data: 'cancel'}
                    ]
                ];

            assert.deepEqual(Sign.getSignListKeyboardMarkup(true) , expected);
        })
    })
})