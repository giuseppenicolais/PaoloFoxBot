var assert = require('assert');
import Utils from '../src/services/utils.js'
var messages = Utils.messages;


describe('messages', function() {
    describe('#welcome()', function() {
        it('should return a welcome message with the replaced username \'giuseppe\'', function() {
            assert.equal(messages.welcome('giuseppe'),
                'Benvenuto giuseppe! Usa il comando /oroscopo e seleziona un segno zodiacale per ascoltare l\'oroscopo del giorno.\n'+
                               '\n'+
                              'Usa il comando /oroscopo_giornaliero e seleziona un segno zodiacale e l\'ora in cui vuoi ricevere l\'oroscopo giornaliero.\n'+
                              '\n'+
                              'Usa il comando /stop_oroscopo_giornaliero per fermare la ricezione dell\'oroscopo giornaliero.')
        })
    })
})

describe('Utils', function() {
    describe('#getHoroscopeUrl()', function() {
        it('should return a welcome message with the replaced <current year> , <current month> and sign \'cancro\'', function() {

            var date = new Date();
            var info = {
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth()
                },
                sign: 'cancro'
            }
            assert.equal(`http://lattemiele.com/wp-content/uploads/${info.date.year}/${info.date.month}/${info.sign}.mp3`, 
                Utils.getHoroscopeUrl(info.sign))
        })
    })
})

describe('messages', function() {
    describe('#caption()', function() {
        it('should return the caption with <current year> , <current month> and sign \'CANCRO\'', function() {

            var date = new Date();
            var info = {
                date: {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate()
                },
                sign_name: 'cancro'
            }
            assert.equal(`Oroscopo CANCRO del ${info.date.day}/${info.date.month+1}/${info.date.year}`, 
                messages.caption(info))
        })
    })
})


describe('Utils', function() {
    describe('#getJSTime()', function() {
        it('should return 7', function() {
            assert.equal('08:00', 
                Utils.getJSTime('🕗 08:00'))
        })
    })
})