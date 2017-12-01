require('dotenv').load();

var assert = require('chai').assert;
import Utils from '../src/services/utils.js'
var messages = Utils.messages;


describe('messages', function() {
    describe('#welcome()', function() {
        it('should return a welcome message with the replaced username \'giuseppe\'', function() {
            assert.equal('Benvenuto giuseppe! Usa il comando /oroscopo e seleziona un segno zodiacale', 
                messages.welcome('giuseppe'))
        })
    })
})

describe('Utils', function() {
    describe('#getHoroscopeUrl()', function() {
        it('should return a welcome message with the replaced <current year> , <current month> and sign \'cancro\'', function() {

            assert.equal(`http://lattemiele.com/wp-content/uploads/${new Date().getFullYear()}/10/cancro.mp3`, 
                Utils.getHoroscopeUrl('cancro'))
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