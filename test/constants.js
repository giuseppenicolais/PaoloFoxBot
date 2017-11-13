var assert = require('assert');
import Constants from '../src/lib/constants.js'

var messages = Constants.messages;

describe('messages', function() {
    describe('#welcome()', function() {
        it('should return a welcome message with the replaced username \'giuseppe\'', function() {
            assert.equal('Benvenuto giuseppe! Digita /oroscopo seguito dal tuo segno per ascoltare l\' oroscopo del giorno', 
            	messages.welcome('giuseppe'))
        })
    })
})

describe('messages', function() {
    describe('#url()', function() {
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
            	messages.url(info.sign))
        })
    })
})

describe('messages', function() {
    describe('#getCaption()', function() {
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
                messages.getCaption(info))
        })
    })
})